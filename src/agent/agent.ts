import { ai } from "@/lib/geminiai";
import { toolDefinitions } from "./toolDefinitions";
import { Content } from "@google/genai";
import { executeTool } from "./executeTool";

const SYSTEM_PROMPT=`You are a helpful personal task management assistant.
You can view, create, update, complete, and delete the user's tasks using the tools provided.
Always use a tool when the user asks you to do something with their tasks.
After a tool runs, summarize the result for the user in plain, friendly language.
If no tool is needed (e.g. the user just says hello or asks a general question), respond directly.`

export async function runAgent(userMessage:string){
    const contents:Content[]=[{role:"user",parts:[{text:userMessage}]}]
    const response=await ai.models.generateContent({
        model:"gemini-3.5-flash",
        contents,
        config:{
            systemInstruction:SYSTEM_PROMPT,
            tools:[{functionDeclarations:toolDefinitions}]
        }
    })
    const functionCalls=response.functionCalls;
    if(!functionCalls || functionCalls.length===0){
        return { reply: response.text ?? "", toolCall: null };
    }
    const call=functionCalls[0];
    const result=await executeTool(call.name!,call.args ?? {})
    console.log("Tool Result:",JSON.stringify(result, null, 2)
);

    contents.push({role:"model",parts:[{functionCall:call}]})
    contents.push({
        role: "user",
        parts: [{ functionResponse: { name: call.name!, response: result as Record<string, unknown>  } }],
    });
    try {
        const finalResponse=await ai.models.generateContent({
                model: "gemini-2.0-flash",
                contents,
                config: {
                systemInstruction:
                    SYSTEM_PROMPT,
                tools: [
                    {
                    functionDeclarations:
                        toolDefinitions,
                    },
                ],
                },
            });
        return {
            reply:finalResponse.text ?? "",
            toolCall: {
                name: call.name,
                args: call.args,
                result,
            },
        };
    } catch (error) {
        console.error("SECOND GEMINI CALL FAILED:");
        console.error(error);
        throw error;
    }
}