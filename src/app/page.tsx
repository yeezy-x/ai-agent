import { TaskList } from "@/components/task-list";
import { TaskForm } from "@/components/task-form";
import { SmartTaskForm } from "@/components/smart-task-form";
import { AgentChat } from "@/components/agent-chat";

export default function HomePage() {
  return (
    <main className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">AI Todo Agent</h1>

      <div className="mb-6">
        <h2 className="text-sm font-medium text-muted-foreground mb-2">
          Agent Chat
        </h2>
        <AgentChat />
      </div>

      <div className="mb-6">
        <h2 className="text-sm font-medium text-muted-foreground mb-2">
          Smart Add (natural language)
        </h2>
        <SmartTaskForm />
      </div>

      <div className="mb-6">
        <h2 className="text-sm font-medium text-muted-foreground mb-2">
          Manual Add
        </h2>
        <TaskForm />
      </div>

      <TaskList />
    </main>
  );
}

