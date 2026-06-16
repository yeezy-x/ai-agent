import { getTasks as getTasksService } from "@/server/services/task.service";
import type { Tool } from "./types";

type GetTasksArgs = Record<string, never>; // no arguments needed

export const getTasksTool: Tool<GetTasksArgs> = {
  name: "getTasks",
  description:
    "Get the list of all tasks, including their id, title, status, priority, and due date. Use this whenever you need to know what tasks currently exist before answering, updating, or deleting. When matching a user's description against these results, only proceed if there's a clear, confident match — if nothing matches, report that no matching task was found instead of guessing.",
  parameters: {
    type: "object",
    properties: {},
    required: [],
  },
  execute: async () => {
    const tasks = await getTasksService();

    return {
      success: true,
      tasks,
    };
  },
};