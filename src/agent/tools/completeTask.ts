// src/agent/tools/completeTask.ts
import { completeTask as completeTaskService } from "@/server/services/task.service";
import type { Tool } from "./types";

interface CompleteTaskArgs {
  id: number;
}

export const completeTaskTool: Tool<CompleteTaskArgs> = {
  name: "completeTask",
  description:
    "Mark a task as completed by its id. Use this when the user says they finished, completed, or are done with a specific task. You must know the task's id first (use getTasks if you don't).",
  parameters: {
    type: "object",
    properties: {
      id: {
        type: "number",
        description: "The id of the task to mark as completed",
      },
    },
    required: ["id"],
  },
  execute: async (args) => {
    const updated = await completeTaskService(args.id);

    if (!updated) {
      return { success: false, error: `No task found with id ${args.id}` };
    }

    return { success: true, task: updated };
  },
};