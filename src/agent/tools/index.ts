// src/agent/tools/index.ts
import { createTaskTool } from "./createTask";
import { getTasksTool } from "./getTasks";
import { updateTaskTool } from "./updateTask";
import { completeTaskTool } from "./completeTask";
import { deleteTaskTool } from "./deleteTask";
import type { Tool } from "./types";
import { findTaskByTitleTool } from "./findTasksByTitle";
import { createGoalTool } from "./createGoal";
import { getGoalsTool } from "./getGoals";
import { getDailyPlanTool } from "./getDailyPlan";
import { saveMemoryTool } from "./saveMemory";
import { getMemoriesTool } from "./getMemories";

export const tools: Tool[] = [
  createTaskTool,
  getTasksTool,
  updateTaskTool,
  completeTaskTool,
  deleteTaskTool,
  findTaskByTitleTool,
  createGoalTool,
  getGoalsTool,
  getDailyPlanTool,
  saveMemoryTool,
  getMemoriesTool
];

// Lookup map for quick access by name (used when executing a tool call)
export const toolsByName: Record<string, Tool> = Object.fromEntries(
  tools.map((tool) => [tool.name, tool])
);

export * from "./types";