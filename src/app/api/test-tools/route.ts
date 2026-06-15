// src/app/api/test-tools/route.ts
// TEMPORARY - for testing tools directly. We'll remove this in Phase 5.
import { NextResponse } from "next/server";
import { toolsByName } from "@/agent/tools";

export async function GET() {
  const results: Record<string, unknown> = {};

  // 1. Create a task
  const createResult= await toolsByName.createTask.execute({
    title: "Test tool task",
    priority: "high",
  }) as {
    success:boolean;
    task:{
        id:number
    }
  };

  results.create = createResult;
  const taskId = createResult.task.id

  // 2. Get all tasks
  results.getAll = await toolsByName.getTasks.execute({});

  // 3. Update the task
  results.update = await toolsByName.updateTask.execute({
    id: Number(taskId),
    title: "Test tool task (updated)",
    priority: "low",
  });

  // 4. Complete the task
  results.complete = await toolsByName.completeTask.execute({ id: Number(taskId) });

  // 5. Delete the task
  results.delete = await toolsByName.deleteTask.execute({ id: Number(taskId) });

  // 6. Try operating on a non-existent id (should return success: false)
  results.updateNonExistent = await toolsByName.updateTask.execute({
    id: 999999,
    title: "Should not exist",
  });

  return NextResponse.json(results, { status: 200 });
}