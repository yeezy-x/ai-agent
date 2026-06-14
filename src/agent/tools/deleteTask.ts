// src/agent/tools/deleteTask.ts
import { deleteTask as deleteTaskService } from "@/server/services/task.service";
import type { Tool } from "./types";

interface DeleteTaskArgs {
  id: number;
}

export const deleteTaskTool: Tool<DeleteTaskArgs> = {
  name: "deleteTask",
  description:
    "Permanently delete a task by its id. Use this when the user explicitly asks to remove, delete, or get rid of a task. You must know the task's id first (use getTasks if you don't). This action cannot be undone.",
  parameters: {
    type: "object",
    properties: {
      id: {
        type: "number",
        description: "The id of the task to delete",
      },
    },
    required: ["id"],
  },
  execute: async (args) => {
    const deleted = await deleteTaskService(args.id);

    if (!deleted) {
      return { success: false, error: `No task found with id ${args.id}` };
    }

    return { success: true, task: deleted };
  },
};