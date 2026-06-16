import {
  getMemories,
  getMemoriesByCategory,
} from "@/server/services/memory.service";
import type { Tool } from "./types";

interface GetMemoriesArgs {
  category?: string;
}

export const getMemoriesTool: Tool<GetMemoriesArgs> = {
  name: "getMemories",

  description:
    "Retrieve stored memories about the user. Use when answering questions about user preferences, habits, personal facts, or previously remembered information.",

  parameters: {
    type: "object",
    properties: {
      category: {
        type: "string",
        description:
          "Optional category filter such as preference, habit, goal-context, or general.",
      },
    },
    required: [],
  },

  execute: async (args) => {
    const memories = args.category
      ? await getMemoriesByCategory(args.category)
      : await getMemories();

    return {
      success: true,
      memories,
    };
  },
};

