import type { Tool } from "./types";
import {
  createGoal as createGoalService,
  createMilestone,
} from "@/server/services/goal.service";
import { createTask } from "@/server/services/task.service";
import { generateRoadmap } from "@/server/ai/generateRoadmap";

interface CreateGoalArgs {
  title: string;
  description?: string;
  targetDate?: string;
}
export const createGoalTool: Tool<CreateGoalArgs> = {
  name: "createGoal",

  description:
    "Create a long-term goal and automatically generate a roadmap of milestones and tasks. Use this for ambitions, projects, learning plans, or outcomes that require multiple steps over time. Do not use for simple one-off todos.",

  parameters: {
    type: "object",

    properties: {
      title: {
        type: "string",
        description:
          "Goal title",
      },

      description: {
        type: "string",
        description:
          "Optional goal description",
      },

      targetDate: {
        type: "string",
        description:
          "Optional target completion date",
      },
    },

    required: ["title"],
  },
  execute:async(args)=>{
    const goal=await createGoalService({
        title:args.title,
        description:args.description ?? null,
        targetDate:args.targetDate?? null
    })
    const roadmap=await generateRoadmap(goal.title,goal.description??undefined,goal.targetDate ?? undefined);
    let milestoneCount=0,taskCount=0;
    for(let i=0;i<roadmap.milestones.length;i++){
        const roadmapMilestone=roadmap.milestones[i];
        const milestone=await createMilestone({
            goalId:goal.id,
            title:roadmapMilestone.title,
            description:roadmapMilestone.description??null,
            orderIndex:i+1
        })
        milestoneCount++;
        for (const roadmapTask of roadmapMilestone.tasks) {
        await createTask({
          title:roadmapTask.title,
          description:roadmapTask.description ??null,
          milestoneId:milestone.id,
        });
        taskCount++;
      }
    }
    return{
        success:true,
        goal,
        milestoneCount,
        taskCount
    }
}
}
