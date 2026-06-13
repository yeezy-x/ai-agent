// src/app/api/tasks/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { tasks } from "@/db/schema";
import { eq } from "drizzle-orm";

// PATCH /api/tasks/:id - update a task
export async function PATCH(
  req: NextRequest,
  { params }: { params:Promise< { id: string } >}
) {
  const {id} = await params;
  const body = await req.json();

  const updateData: Record<string, unknown> = { updatedAt: new Date() };
  if (body.title !== undefined) updateData.title = body.title;
  if (body.description !== undefined) updateData.description = body.description;
  if (body.status !== undefined) updateData.status = body.status;
  if (body.priority !== undefined) updateData.priority = body.priority;
  if (body.dueDate !== undefined) {
    updateData.dueDate = body.dueDate ? new Date(body.dueDate) : null;
  }

  const [updated] = await db
    .update(tasks)
    .set(updateData)
    .where(eq(tasks.id, Number(id)))
    .returning();

  if (!updated) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  return NextResponse.json(updated);
}

// DELETE /api/tasks/:id - delete a task
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }>}
) {
  const {id} = await params;

  const [deleted] = await db.delete(tasks).where(eq(tasks.id, Number(id))).returning();

  if (!deleted) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}