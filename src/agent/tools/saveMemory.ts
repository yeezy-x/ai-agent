import { createMemory } from "@/server/services/memory.service";
import type { Tool } from "./types";

interface SaveMemoryArgs {
  content: string;
  category?: string;
}

export const saveMemoryTool: Tool<SaveMemoryArgs> = {
  name: "saveMemory",

  description:"Save a long-term memory about the user. ALWAYS use when the user states a preference, recurring habit, personal fact, or standing context that may be useful later.",
  parameters: {
    type: "object",
    properties: {
      content: {
        type: "string",
        description:
          "The fact or preference to remember.",
      },

      category: {
        type: "string",
        description:
          "Memory category such as preference, habit, goal-context, or general.",
      },
    },
    required: ["content"],
  },

  execute: async (args) => {
    const memory = await createMemory({
      content: args.content,
      category: args.category ?? "general",
    });

    return {
      success: true,
      memory,
    };
  },
};