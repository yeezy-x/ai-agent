import { getDailyPlan as getDailyPlanService } from "@/server/services/planning.service";
import type { Tool } from "./types";

type GetDailyPlanArgs = Record<string, never>;

export const getDailyPlanTool: Tool<GetDailyPlanArgs> = {
  name: "getDailyPlan",
  description:
    "Get a prioritized plan for today's work. ALWAYS use when the user asks what they should do today, what to focus on, or how to prioritize tasks.",
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


