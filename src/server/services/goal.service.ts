// src/server/services/goal.service.ts
import { db } from "@/db";
import { goals, milestones, tasks, type NewGoal, type NewMilestone } from "@/db/schema";
import { eq, asc } from "drizzle-orm";

// ---- Goals ----

export async function createGoal(input: {
  title: string;
  description?: string | null;
  targetDate?: string | Date | null;
}) {
  const values: NewGoal = {
    title: input.title,
    description: input.description ?? null,
    targetDate: input.targetDate ? new Date(input.targetDate) : null,
    status:"active"
  };

  const [newGoal] = await db.insert(goals).values(values).returning();
  return newGoal;
}

export async function getGoals() {
  return db.select().from(goals).orderBy(asc(goals.createdAt));
}

export async function getGoalById(id: number) {
  const [goal] = await db.select().from(goals).where(eq(goals.id, id));
  return goal ?? null;
}

// ---- Milestones ----

export async function createMilestone(input: {
  goalId: number;
  title: string;
  description?: string | null;
  orderIndex: number;
}) {
  const values: NewMilestone = {
    goalId: input.goalId,
    title: input.title,
    description: input.description ?? null,
    orderIndex: input.orderIndex,
    status:"pending"
  };

  const [newMilestone] = await db.insert(milestones).values(values).returning();
  return newMilestone;
}

export async function getMilestonesByGoal(goalId: number) {
  return db
    .select()
    .from(milestones)
    .where(eq(milestones.goalId, goalId))
    .orderBy(asc(milestones.orderIndex));
}

// ---- Combined view (goal + milestones + their tasks) ----

export async function getGoalWithDetails(goalId: number) {
  const goal = await getGoalById(goalId);
  if (!goal) return null;

  const goalMilestones = await getMilestonesByGoal(goalId);

  const milestonesWithTasks = await Promise.all(
    goalMilestones.map(async (milestone) => {
      const milestoneTasks = await db
        .select()
        .from(tasks)
        .where(eq(tasks.milestoneId, milestone.id));
      return { ...milestone, tasks: milestoneTasks };
    })
  );

  return { ...goal, milestones: milestonesWithTasks };
}