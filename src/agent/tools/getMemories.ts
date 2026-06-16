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
  description:"Retrieve stored memories about the user. ALWAYS use when answering questions about user preferences, habits, personal facts, or previously remembered information.",
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
  if (
    !args.category ||
    args.category === "general"
  ) {
    return {
      success: true,
      memories: await getMemories(),
    };
  }

  return {
    success: true,
    memories: await getMemoriesByCategory(
      args.category
    ),
  };
}
};

