import { NextRequest, NextResponse } from "next/server";
import { extractTask } from "@/server/ai/extractTask";
import { createTask } from "@/server/services/task.service";

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!body.text || typeof body.text !== "string") {
    return NextResponse.json({ error: "Text is required" }, { status: 400 });
  }

  try {
    const extracted = await extractTask(body.text);

    const newTask = await createTask({
      title: extracted.title,
      description: extracted.description,
      priority: extracted.priority,
      dueDate: extracted.dueDate,
    });

    return NextResponse.json(newTask, { status: 201 });
  } catch (err) {
    console.error("extract-task error:", err);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}