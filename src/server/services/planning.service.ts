import { db } from "@/db";
import { tasks } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getDailyPlan() {
  const allTasks = await db
    .select()
    .from(tasks)
    .where(eq(tasks.status, "pending"));

  const today = new Date();

  const scored = allTasks.map((task) => {
    let score = 0;

    // Priority weighting
    if (task.priority === "high") score += 100;
    else if (task.priority === "medium") score += 50;
    else score += 10;

    // Due date weighting
    if (task.dueDate) {
      const due = new Date(task.dueDate);

      const days =
        Math.floor(
          (due.getTime() - today.getTime()) /
          (1000 * 60 * 60 * 24)
        );

      if (days < 0) score += 200; // overdue
      else if (days === 0) score += 150; // today
      else if (days <= 3) score += 75; // soon
    }

    return {
      ...task,
      score,
    };
  });

  scored.sort((a, b) => b.score - a.score);

  return scored;
}

