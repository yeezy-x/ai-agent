"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import type { Task } from "@/db/schema";

export function TaskItem({ task }: { task: Task }) {
  async function toggleComplete() {
    await fetch(`/api/tasks/${task.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: task.status === "completed" ? "pending" : "completed",
      }),
    });
    window.location.reload();
  }

  async function handleDelete() {
    await fetch(`/api/tasks/${task.id}`, { method: "DELETE" });
    window.location.reload();
  }

  return (
    <li className="flex items-center justify-between p-3 border rounded-md">
      <div className="flex items-center gap-3">
        <Checkbox
          checked={task.status === "completed"}
          onCheckedChange={toggleComplete}
        />
        <span
          className={
            task.status === "completed"
              ? "line-through text-muted-foreground"
              : ""
          }
        >
          {task.title}
        </span>
      </div>
      <Button variant="ghost" size="sm" onClick={handleDelete}>
        Delete
      </Button>
    </li>
  );
}