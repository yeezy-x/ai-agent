// src/app/page.tsx
import { TaskList } from "@/components/task-list";
import { TaskForm } from "@/components/task-form";

export default function HomePage() {
  return (
    <main className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">AI Todo Agent</h1>
      <TaskForm />
      <TaskList />
    </main>
  );
}