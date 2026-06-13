import { db } from "@/db";
import { tasks } from "@/db/schema";
import { desc } from "drizzle-orm";
import { TaskItem } from "@/components/task-item";

export async function TaskList() {
  const allTasks = await db.select().from(tasks).orderBy(desc(tasks.createdAt));

  if (allTasks.length === 0) {
    return <p className="text-muted-foreground">No tasks yet. Add one above.</p>;
  }

  return (
    <ul className="space-y-2">
      {allTasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </ul>
  );
}