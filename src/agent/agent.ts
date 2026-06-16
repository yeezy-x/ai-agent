// src/agent/agent.ts
import type { Message } from "ollama";
import { ollama, MODEL } from "@/lib/ollama";
import { toolDefinitions } from "./toolDefinitions";
import { executeTool } from "./executeTool";
import { parseFallbackToolCall } from "./parseFallbackToolCall";

const MAX_ITERATIONS = 5;
const SYSTEM_INSTRUCTION = `
You are a helpful personal productivity assistant.
RULES
1. Use tools whenever the user wants to create, update, complete, delete, inspect, or plan work.
2. Use createTask for simple standalone todos.
Examples:
- "Buy groceries"
- "Remind me to call mom"
- "Finish homework tomorrow"
3. Use createGoal for long-term objectives that require multiple steps or milestones.
Examples:
- "I want to become a backend engineer"
- "I want to learn AI agents"
- "I want to launch a SaaS"
- "Help me prepare for a job switch"
4. Use getTasks when the user asks about tasks.
Examples:
- "What tasks do I have?"
- "Show my todos"
5. Use getGoals when the user asks about goals, roadmaps, milestones, or progress.
Examples:
- "What goals do I have?"
- "Show my roadmap"
- "Show progress on my AI goal"
6. Never invent ids.
7. DAILY PLANNING
If the user asks:
- What should I do today?
- What's my plan today?
- What should I focus on?
- Help me prioritize my tasks
- What should I work on first?
Call:getDailyPlan()
Do not call getTasks first.
Use getDailyPlan because it already returns prioritized tasks.
8. If a tool reports an error, explain the error to the user.
9. After tools finish, summarize results in friendly language.
User: What should I do today?
Assistant: [call getDailyPlan]

User: What's my plan for today?
Assistant: [call getDailyPlan]

User: What should I focus on?
Assistant: [call getDailyPlan]

User: Help me prioritize my tasks
Assistant: [call getDailyPlan]
`;
export interface ToolCallLogEntry {
  name: string;
  args: unknown;
  result: unknown;
}

interface ExtractedCall {
  name: string;
  args: Record<string, unknown>;
}

function extractToolCalls(message: Message): ExtractedCall[] {
  if (message.tool_calls && message.tool_calls.length > 0) {
    return message.tool_calls.map((tc) => ({
      name: tc.function.name,
      args: tc.function.arguments as Record<string, unknown>,
    }));
  }

  const fallback = parseFallbackToolCall(message.content);
  if (fallback) {
    console.warn(`Used fallback parser for tool call: ${fallback.name}`);
    return [{ name: fallback.name, args: fallback.arguments }];
  }

  return [];
}

export async function runAgent(userMessage: string) {
  const messages: Message[] = [
    { role: "system", content: SYSTEM_INSTRUCTION },
    { role: "user", content: userMessage },
  ];
  const toolCallLog: ToolCallLogEntry[] = [];

  for (let i = 0; i < MAX_ITERATIONS; i++) {
    const response = await ollama.chat({
      model: MODEL,
      messages,
      tools: toolDefinitions,
      think: false,
    });

    const calls = extractToolCalls(response.message);

    // No tool calls this turn -> model is done, return its text
    if (calls.length === 0) {
      return { reply: response.message.content ?? "", toolCalls: toolCallLog };
    }

    // The assistant's turn (including all tool calls it made) goes into history once
    messages.push(response.message);

    // Execute each tool call in order, push one "tool" result message per call
    for (const call of calls) {
      const result = await executeTool(call.name, call.args);
      toolCallLog.push({ name: call.name, args: call.args, result });

      messages.push({
        role: "tool",
        tool_name: call.name,
        content: JSON.stringify(result),
      } as Message);
    }
  }

  // Hit the iteration limit. Force a final, tool-free response.
  console.warn(`Agent hit MAX_ITERATIONS (${MAX_ITERATIONS}) for message: "${userMessage}"`);

  messages.push({
    role: "user",
    content:
      "You've reached the maximum number of steps. Do not call any more tools. Summarize what you've done so far and respond to the user now.",
  });

  const finalResponse = await ollama.chat({
    model: MODEL,
    messages,
    think: false,
  });

  return {
    reply:
      finalResponse.message.content ??
      "I made some progress but couldn't fully complete that request.",
    toolCalls: toolCallLog,
  };
}