import { TaskItem } from "@/components/task-item";
import { getTasks } from "@/server/services/task.service";

export async function TaskList() {
  const allTasks = await getTasks()

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