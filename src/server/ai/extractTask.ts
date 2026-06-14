// src/server/ai/extractTask.ts
import { ai } from "@/lib/geminiai";

export interface ExtractedTask {
  title: string;
  description: string | null;
  priority: "low" | "medium" | "high";
  dueDate: string | null; // ISO date string, e.g. "2026-06-15"
}

export async function extractTask(input: string): Promise<ExtractedTask> {
  const today = new Date().toISOString().split("T")[0]; // e.g. "2026-06-14"

  const response =
    await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: `
        You are a task extraction system.

        Today's date is ${today}.

        Return ONLY valid JSON.

        Schema:
        {
        "title": string,
        "description": string | null,
        "priority": "low" | "medium" | "high",
        "dueDate": string | null
        }
        Rules:
        - title is required
        - description is optional
        - priority defaults to "medium"
        - dueDate must be in YYYY-MM-DD format or null
        - Resolve relative dates like "tomorrow", "next Monday", etc.
        - Return ONLY JSON and nothing else
        `,
        responseMimeType:'application/json',
      },
      contents: input,
    });


  const content = response.text;
  if (!content) {
    throw new Error("No response from Gemini");
  }
  //const cleaned = content.replace(/```json/g, "").replace(/```/g, "").trim();
  const parsed = JSON.parse(content);
  return {
    title: parsed.title,
    description: parsed.description ?? null,
    priority: parsed.priority ?? "medium",
    dueDate: parsed.dueDate ?? null,
  };
}