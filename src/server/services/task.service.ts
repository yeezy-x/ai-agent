// src/server/services/task.service.ts
import { db } from "@/db";
import { tasks, type NewTask } from "@/db/schema";
import { desc } from "drizzle-orm";
import {eq} from "drizzle-orm"

export async function getTasks() {
  return db.select().from(tasks).orderBy(desc(tasks.createdAt));
}

export async function createTask(input: {
  title: string;
  description?: string | null;
  priority?: string;
  dueDate?: string | Date | null;
  milestoneId?:number | null
}) {
  const values: NewTask = {
    title: input.title,
    description: input.description ?? null,
    priority: input.priority ?? "medium",
    dueDate: input.dueDate ? new Date(input.dueDate) : null,
    milestoneId:input.milestoneId ?? null,
  };

  const [newTask] = await db.insert(tasks).values(values).returning();
  return newTask;
}

export async function updateTask(
  id: number,
  input: {
    title?: string;
    description?: string | null;
    status?: string;
    priority?: string;
    dueDate?: string | Date | null;
  }
) {
  const updateData: Record<string, unknown> = { updatedAt: new Date() };

  if (input.title !== undefined) updateData.title = input.title;
  if (input.description !== undefined) updateData.description = input.description;
  if (input.status !== undefined) updateData.status = input.status;
  if (input.priority !== undefined) updateData.priority = input.priority;
  if (input.dueDate !== undefined) {
    updateData.dueDate = input.dueDate ? new Date(input.dueDate) : null;
  }

  const [updated] = await db.update(tasks).set(updateData).where(eq(tasks.id, id)).returning();

  return updated ?? null;
}

export async function deleteTask(id: number) {
  const [deleted] = await db.delete(tasks).where(eq(tasks.id, id)).returning();
  return deleted ?? null;
}

export async function completeTask(id: number) {
  return updateTask(id, { status: "completed" });
}