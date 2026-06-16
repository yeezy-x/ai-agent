// src/components/agent-chat.tsx
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ToolCallLogEntry {
  name: string;
  args: unknown;
  result: unknown;
}

interface ChatMessage {
  role: "user" | "agent";
  content: string;
  toolCalls?: ToolCallLogEntry[];
}

export function AgentChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/agent/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessages((prev) => [
          ...prev,
          { role: "agent", content: "Sorry, something went wrong." },
        ]);
        return;
      }

      setMessages((prev) => [
        ...prev,
        { role: "agent", content: data.reply, toolCalls: data.toolCalls },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="p-4">
      <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
        {messages.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Try: &quot;Show my tasks and mark the first one as complete&quot;
          </p>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={msg.role === "user" ? "text-right" : "text-left"}>
            <div
              className={
                "inline-block px-3 py-2 rounded-lg max-w-[85%] " +
                (msg.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted")
              }
            >
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
            </div>

            {msg.toolCalls && msg.toolCalls.length > 0 && (
              <div className="text-xs text-muted-foreground mt-1 space-y-0.5">
                {msg.toolCalls.map((tc, j) => (
                  <p key={j}>
                    🔧 step {j + 1}: <code>{tc.name}</code>
                    {tc.args as Record<string,unknown> && Object.keys(tc.args as Record<string,unknown> ).length > 0 && (
                      <span> ({JSON.stringify(tc.args)})</span>
                    )}
                  </p>
                ))}
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="text-left">
            <div className="inline-block px-3 py-2 rounded-lg bg-muted">
              <p className="text-sm text-muted-foreground">Thinking...</p>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask the agent to manage your tasks..."
          disabled={loading}
        />
        <Button type="submit" disabled={loading}>
          Send
        </Button>
      </form>
    </Card>
  );
}