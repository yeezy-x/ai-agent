// import { ai } from "@/lib/geminiai";
// import { toolDefinitions } from "./toolDefinitions";
// import { Content, Part } from "@google/genai";
// import { executeTool } from "./executeTool";

// const SYSTEM_PROMPT=`You are a helpful personal task management assistant.
// You can view, create, update, complete, and delete the user's tasks using the tools provided.
// Always use a tool when the user asks you to do something with their tasks.
// After a tool runs, summarize the result for the user in plain, friendly language.
// Before deleting, completing, or updating a task referenced by title,
// first find the task.
// If no exact task exists, do not perform the action.
// Instead tell the user the task was not found.
// If no tool is needed (e.g. the user just says hello or asks a general question), respond directly.`

// const MAX_ITERATIONS=5
// const MODEL_NAME="gemini-2.5-flash-native-audio-preview-12-2025"
// export interface ToolCallLogEntry{
//     name:string,
//     args:unknown,
//     result:unknown
// }

// export async function runAgent(userMessage:string){
//     const contents:Content[]=[{role:"user",parts:[{text:userMessage}]}]
//     const toolCallLog:ToolCallLogEntry[]=[];
//     for(let i=0;i<MAX_ITERATIONS;i++){
//         const response=await ai.models.generateContent({
//             model:MODEL_NAME,
//             contents,
//             config:{
//                 systemInstruction:SYSTEM_PROMPT,
//                 tools:[{functionDeclarations:toolDefinitions}]
//             }
//         })
//         const functionCalls=response.functionCalls;
//         if(!functionCalls || functionCalls.length===0){
//             return { reply: response.text ?? "", toolCall: null };
//         }
//         const modelParts:Part[]=[]
//         const responseParts:Part[]=[]
//         for(const call of functionCalls){
//             const result=await executeTool(call.name!, call.args ?? {})
//             toolCallLog.push({name:call.name!, args:call.args as Record<string,unknown>, result})
//             modelParts.push({functionCall:call})
//             responseParts.push({
//                 functionResponse:{name:call.name!, response:result as Record<string,unknown>}
//             })
//         }
//         contents.push({role:"model",parts:modelParts})
//         contents.push({ role: "user", parts: responseParts })
//     }
//     console.warn(`Agent hit MAX_ITERATIONS (${MAX_ITERATIONS}) for message: "${userMessage}"`);
//     contents.push({
//         role: "user",
//         parts: [
//             {
//                 text: "You've reached the maximum number of steps. Do not call any more tools. Summarize what you've done so far and respond to the user now.",
//             },
//         ],
//     });
//     const finalResponse=await ai.models.generateContent({
//         model: MODEL_NAME,
//         contents,
//         config: { systemInstruction: SYSTEM_PROMPT }, // no tools passed
//     });
//     return {
//         reply: finalResponse.text ?? "I wasn't able to finish that within the allowed steps.",
//         toolCalls: toolCallLog,
//     }
// }
// src/agent/agent.ts

import ollama from "ollama";
import { executeTool } from "./executeTool";
import { toolDefinitions } from "./toolDefinitions";

const MODEL_NAME = "qwen2.5-coder:7b";

const SYSTEM_PROMPT = `You are a helpful personal task management assistant.
You can view, create, update, complete, and delete the user's tasks using the tools provided.
Always use a tool when the user asks you to do something with their tasks.
After a tool runs, summarize the result for the user in plain, friendly language.
Before deleting, completing, or updating a task referenced by title,
first find the task.
If no exact task exists, do not perform the action.
Instead tell the user the task was not found.
If no tool is needed (e.g. the user just says hello or asks a general question),
respond directly.
And also dont take way too much time in giving the answer.`;

const MAX_ITERATIONS = 5;

export interface ToolCallLogEntry {
  name: string;
  args: unknown;
  result: unknown;
}

type Message = {
  role: "system" | "user" | "assistant" | "tool";
  content: string;
};

export async function runAgent(userMessage: string) {
  const toolCalls: ToolCallLogEntry[] = [];

  const messages: Message[] = [
    {
      role: "system",
      content: SYSTEM_PROMPT,
    },
    {
      role: "user",
      content: userMessage,
    },
  ];

  for (let i = 0; i < MAX_ITERATIONS; i++) {
    const response = await ollama.chat({
      model: MODEL_NAME,
      messages,
      tools: toolDefinitions,
    });

    const calls = response.message.tool_calls;
    // Model produced final answer
    if (!calls || calls.length === 0) {
      return {
        reply: response.message.content,
        toolCalls,
      };
    }

    // Save assistant message
    messages.push({
      role: "assistant",
      content: response.message.content ?? "",
    });

    // Execute tool calls
    for (const call of calls) {
      const result = await executeTool(
        call.function.name,
        (call.function.arguments ??
          {}) as Record<string, unknown>
      );

      toolCalls.push({
        name: call.function.name,
        args: call.function.arguments,
        result,
      });

      messages.push({
        role: "tool",
        content: JSON.stringify(result),
      });
    }
  }

  console.warn(
    `Agent hit MAX_ITERATIONS (${MAX_ITERATIONS})`
  );

  return {
    reply:
      "I wasn't able to finish that within the allowed steps.",
    toolCalls,
  };
}