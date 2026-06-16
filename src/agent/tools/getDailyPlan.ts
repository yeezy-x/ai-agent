import { getDailyPlan as getDailyPlanService } from "@/server/services/planning.service";
import type { Tool } from "./types";

type GetDailyPlanArgs = Record<string, never>;

export const getDailyPlanTool: Tool<GetDailyPlanArgs> = {
  name: "getDailyPlan",
  description:
    "Get a prioritized list of pending tasks for today's work plan. Use when the user asks what they should do today, what to focus on, or requests a daily plan.",
  parameters: {
    type: "object",
    properties: {},
    required: [],
  },
  execute: async () => {
    const tasks = await getDailyPlanService();
    return {
      success: true,
      tasks,
    };
  },
};


