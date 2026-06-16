// src/agent/tools/deleteTask.ts
import { deleteTask as deleteTaskService } from "@/server/services/task.service";
import { matchTaskByTitle } from "@/server/services/matchTask";
import type { Tool } from "./types";

interface DeleteTaskArgs {
  id?: number;
  title?: string;
}

export const deleteTaskTool: Tool<DeleteTaskArgs> = {
  name: "deleteTask",
  description:
    "Permanently delete a task. Provide either the task's id (if known) or its exact title. If you only have a description and aren't sure of the exact title, call getTasks first and use the precise title from there. This action cannot be undone.",
  parameters: {
    type: "object",
    properties: {
      id: { type: "number", description: "The id of the task, if known" },
      title: { type: "string", description: "The exact title of the task, if id is not known" },
    },
    required: [],
  },
  execute: async (args) => {
    let id = args.id;

    if (!id && args.title) {
      const match = await matchTaskByTitle(args.title);
      if (!match.found) {
        return {
          success: false,
          error: `No task found matching "${args.title}". Existing tasks: ${match.candidates
            .map((t) => `"${t.title}" (id: ${t.id})`)
            .join(", ") || "none"}`,
        };
      }
      id = match.task.id;
    }

    if (!id) {
      return { success: false, error: "Must provide either id or title" };
    }

    const deleted = await deleteTaskService(id);
    if (!deleted) {
      return { success: false, error: `No task found with id ${id}` };
    }

    return { success: true, task: deleted };
  },
};