// src/agent/tools/findTaskByTitle.ts

import { getTasks } from "@/server/services/task.service";
import type { Tool } from "./types";

interface FindTaskArgs {
  title: string;
}

export const findTaskByTitleTool: Tool<FindTaskArgs> = {
  name: "findTaskByTitle",
  description:
    "Find a task by its exact title. Use before deleting, updating, or completing a task when the user references a task by name.",

  parameters: {
    type: "object",
    properties: {
      title: {
        type: "string",
      },
    },
    required: ["title"],
  },

  execute: async ({ title }) => {
    const tasks = await getTasks();

    const task = tasks.find(
      (t) =>
        t.title.trim().toLowerCase() ===
        title.trim().toLowerCase()
    );

    if (!task) {
      return {
        success: false,
        found: false,
      };
    }

    return {
      success: true,
      found: true,
      task,
    };
  },
};