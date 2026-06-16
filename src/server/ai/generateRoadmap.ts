import { MODEL } from "@/lib/ollama";
import ollama from "ollama"

export interface Roadmap{
    milestones:{
        title:string,
        description:string,
        tasks:{
            title:string,
            description:string
        }[];
    }[];
}

const roadmapSchema = {
  type: "object",
  properties: {
    milestones: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          description: { type: "string" },
          tasks: {
            type: "array",
            items: {
              type: "object",
              properties: {
                title: { type: "string" },
                description: { type: "string" },
              },
              required: ["title"],
            },
          },
        },
        required: ["title", "tasks"],
      },
    },
  },
  required: ["milestones"],
};

export async function generateRoadmap(
    goalTitle:string,
    description?:string,
    targetDate?:string | Date | null
):Promise<Roadmap>{
    const response=await ollama.chat({
        model:MODEL,
        think:false,
        format:roadmapSchema,
        options:{
            temperature:0
        },
        messages:[
            {
                role:"system",
                content:`You are an expert goal planner. Break goals into milestones. Break milestones into actionable tasks.Return ONLY valid JSON.`,
            },
            {
                role: "user",
                content: `Goal: ${goalTitle}
                Description:${description ?? "None"}
                Target Date:${targetDate ?? "None"}`
            }
        ]        
    })
    try{
        return JSON.parse(response.message.content)
    }catch(error){
        console.error("Roadmap parse failed:", error);
        throw new Error(
        "Failed to generate roadmap"
        );
    }
}