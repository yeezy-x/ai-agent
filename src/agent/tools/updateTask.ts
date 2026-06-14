// src/agent/tools/updateTask.ts
import { updateTask as updateTaskService } from "@/server/services/task.service";
import type { Tool } from "./types";

interface UpdateTaskArgs {
  id: number;
  title?: string;
  description?: string | null;
  status?: "pending" | "in_progress" | "completed";
  priority?: "low" | "medium" | "high";
  dueDate?: string | null;
}

export const updateTaskTool: Tool<UpdateTaskArgs> = {
  name: "updateTask",
  description:
    "Update one or more fields of an existing task by its id. Use this to change a task's title, description, status, priority, or due date. You must know the task's id first (use getTasks if you don't).",
  parameters: {
    type: "object",
    properties: {
      id: {
        type: "number",
        description: "The id of the task to update",
      },
      title: { type: "string", description: "New title for the task" },
      description: { type: "string", description: "New description for the task" },
      status: {
        type: "string",
        enum: ["pending", "in_progress", "completed"],
        description: "New status for the task",
      },
      priority: {
        type: "string",
        enum: ["low", "medium", "high"],
        description: "New priority for the task",
      },
      dueDate: {
        type: "string",
        description: "New due date in ISO format (YYYY-MM-DD)",
      },
    },
    required: ["id"],
  },
  execute: async (args) => {
    const { id, ...updates } = args;
    const updated = await updateTaskService(id, updates);

    if (!updated) {
      return { success: false, error: `No task found with id ${id}` };
    }

    return { success: true, task: updated };
  },
};