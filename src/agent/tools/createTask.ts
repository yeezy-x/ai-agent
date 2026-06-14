// src/agent/tools/createTask.ts
import { createTask as createTaskService } from "@/server/services/task.service";
import type { Tool } from "./types";

interface CreateTaskArgs {
  title: string;
  description?: string | null;
  priority?: "low" | "medium" | "high";
  dueDate?: string | null;
}

export const createTaskTool: Tool<CreateTaskArgs> = {
  name: "createTask",
  description:
    "Create a new task with a title, and optionally a description, priority, and due date. Use this when the user wants to add something to their todo list.",
  parameters: {
    type: "object",
    properties: {
      title: {
        type: "string",
        description: "Short, clear title for the task",
      },
      description: {
        type: "string",
        description: "Optional additional detail about the task",
      },
      priority: {
        type: "string",
        enum: ["low", "medium", "high"],
        description: "Priority level. Defaults to 'medium' if not specified.",
      },
      dueDate: {
        type: "string",
        description:
          "Due date in ISO format (YYYY-MM-DD), if mentioned or implied. Omit if no date is mentioned.",
      },
    },
    required: ["title"],
  },
  execute: async (args) => {
    const task = await createTaskService({
      title: args.title,
      description: args.description ?? null,
      priority: args.priority ?? "medium",
      dueDate: args.dueDate ?? null,
    });

    return {
      success: true,
      task,
    };
  },
};