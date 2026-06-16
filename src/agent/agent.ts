// src/agent/agent.ts
import type { Message } from "ollama";
import { ollama, MODEL } from "@/lib/ollama";
import { toolDefinitions } from "./toolDefinitions";
import { executeTool } from "./executeTool";
import { parseFallbackToolCall } from "./parseFallbackToolCall";

const MAX_ITERATIONS = 5;
const SYSTEM_INSTRUCTION = `You are a task management assistant with access to tools. You MUST use tools to take any action — you cannot directly create, view, update, complete, or delete tasks yourself, only the tools can do that.

RULES:
1. If the user wants to add/create a task → call createTask. Do NOT just say you added it, actually call the tool.
2. If the user asks what tasks they have, or mentions a task by name/title without an id → call getTasks first.
3. If the user wants to mark something done/finished/complete → call completeTask (you need the id — call getTasks first if you don't have it).
4. If the user wants to change a task's details → call updateTask.
5. If the user wants to remove/delete a task → call deleteTask (you need the id — call getTasks first if you don't have it).
6. You may need to call multiple tools, one after another, to fully complete a request (e.g. look up an id with getTasks, then act on it).
7. Only respond with plain text and no tool call once you have completed everything needed, or if the user is NOT asking you to do anything with tasks (e.g. greetings).

CRITICAL — matching tasks by name:
When the user refers to a task by title (not by id), you must only act on it if you find a CLEAR, CONFIDENT match in the getTasks results — meaning the title is the same or a very close paraphrase of what the user said.
- If NO task title reasonably matches what the user described, do NOT guess, do NOT pick the closest-sounding one, and do NOT call completeTask/updateTask/deleteTask at all for that item.
- Instead, stop and tell the user in plain text that you couldn't find a task matching that description, and list the actual task titles that do exist so they can clarify.
- It is always better to say "I couldn't find that task" than to act on the wrong one. Acting on the wrong task is a serious mistake.

Examples:
User: "Add buy milk"
You: [call createTask with title "Buy milk"]

User: "What do I have to do?"
You: [call getTasks]

User: "I finished the groceries task"
You: [call getTasks to find the id, then call completeTask with that id, ONLY if a task with a groceries-related title actually exists]

User: "Delete Task B" (and getTasks shows no task titled "Task B" or similar)
You: [call getTasks, see no match, then respond in plain text: "I couldn't find a task called 'Task B'. Your current tasks are: ..."]

Never describe an action in words without actually calling the corresponding tool when a real match exists. After your tools have run, summarize what you did in plain, friendly language — do not show raw JSON.`;
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