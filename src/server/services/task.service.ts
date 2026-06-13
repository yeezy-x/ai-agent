// src/server/services/task.service.ts
import { db } from "@/db";
import { tasks, type NewTask } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function getTasks() {
  return db.select().from(tasks).orderBy(desc(tasks.createdAt));
}

export async function createTask(input: {
  title: string;
  description?: string | null;
  priority?: string;
  dueDate?: string | Date | null;
}) {
  const values: NewTask = {
    title: input.title,
    description: input.description ?? null,
    priority: input.priority ?? "medium",
    dueDate: input.dueDate ? new Date(input.dueDate) : null,
  };

  const [newTask] = await db.insert(tasks).values(values).returning();
  return newTask;
}