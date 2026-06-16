import type { Tool } from "./types";

import {
  getGoals,
  getGoalWithDetails,
} from "@/server/services/goal.service";

import { matchGoalByTitle }
from "@/server/services/matchGoal";

interface GetGoalsArgs {
  title?: string;
}

export const getGoalsTool:
Tool<GetGoalsArgs> = {
  name: "getGoals",

  description:
    "View goals, roadmaps, milestones, and progress. Use without arguments to list all goals. Use title when the user asks about a specific goal.",

  parameters: {
    type: "object",

    properties: {
      title: {
        type: "string",
        description:
          "Optional goal title",
      },
    },

    required: [],
  },
  execute: async (args) => {

  if (!args.title) {
    const goals =
      await getGoals();

    return {
      success: true,
      goals,
    };
  }
    const match =
    await matchGoalByTitle(
      args.title
    );

  if (!match.success) {
    return match;
  }
    const details =
    await getGoalWithDetails(
      match.goal!.id
    );

  return {
    success: true,
    goal: details,
  };
},
};