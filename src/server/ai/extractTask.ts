// src/server/ai/extractTask.ts
import { openai } from "@/lib/openai";

export interface ExtractedTask {
  title: string;
  description: string | null;
  priority: "low" | "medium" | "high";
  dueDate: string | null; // ISO date string, e.g. "2026-06-15"
}

export async function extractTask(input: string): Promise<ExtractedTask> {
  const today = new Date().toISOString().split("T")[0]; // e.g. "2026-06-14"

  const response = await openai.chat.completions.create({
    model: "openai/gpt-4o",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `You extract structured task data from natural language.
Today's date is ${today}.

Return ONLY a JSON object with these fields:
- title: string (required, short and clear)
- description: string or null (extra detail if mentioned, otherwise null)
- priority: "low" | "medium" | "high" (default "medium" if not specified)
- dueDate: string or null (ISO date "YYYY-MM-DD" if a date/relative date like "tomorrow" is mentioned, otherwise null)

Resolve relative dates ("tomorrow", "next Monday") into actual dates based on today's date.`,
      },
      {
        role: "user",
        content: input,
      },
    ],
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("No response from OpenAI");
  }

  const parsed = JSON.parse(content);

  return {
    title: parsed.title,
    description: parsed.description ?? null,
    priority: parsed.priority ?? "medium",
    dueDate: parsed.dueDate ?? null,
  };
}