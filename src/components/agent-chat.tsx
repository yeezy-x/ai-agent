// src/components/agent-chat.tsx
"use client";

import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ChatMessage {
  role: "user" | "agent";
  content: string;
  toolCall?: {
    name: string;
    args: unknown;
    result: unknown;
  } | null;
}

export function AgentChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSend(
    e: React.FormEvent
  ) {
    e.preventDefault();

    const text = input.trim();

    if (!text || loading) return;

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: text,
      },
    ]);

    setInput("");
    setLoading(true);

    try {
      const res = await fetch(
        "/api/agent/chat",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            message: text,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        console.error(
          "Agent Error:",
          data
        );

        setMessages((prev) => [
          ...prev,
          {
            role: "agent",
            content:
              data.error ??
              "Sorry, something went wrong.",
          },
        ]);

        return;
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "agent",
          content: data.reply,
          toolCall:
            data.toolCall,
        },
      ]);
    } catch (error) {
      console.error(error);

      setMessages((prev) => [
        ...prev,
        {
          role: "agent",
          content:
            "Network error. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="p-4">
      <div className="mb-4 max-h-96 space-y-3 overflow-y-auto">
        {messages.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Try:
            {" "}
            &quot;Add buy groceries with
            high priority&quot;
            {" "}
            or
            {" "}
            &quot;What tasks do I have?&quot;
          </p>
        )}

        {messages.map(
          (msg, index) => (
            <div
              key={index}
              className={
                msg.role === "user"
                  ? "text-right"
                  : "text-left"
              }
            >
              <div
                className={
                  "inline-block max-w-[85%] rounded-lg px-3 py-2 " +
                  (msg.role ===
                  "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted")
                }
              >
                <p className="whitespace-pre-wrap text-sm">
                  {msg.content}
                </p>
              </div>

              {msg.toolCall && (
                <p className="mt-1 text-xs text-muted-foreground">
                  🔧 called{" "}
                  <code>
                    {
                      msg.toolCall
                        .name
                    }
                  </code>
                </p>
              )}
            </div>
          )
        )}

        {loading && (
          <div className="text-left">
            <div className="inline-block rounded-lg bg-muted px-3 py-2">
              <p className="text-sm text-muted-foreground">
                Thinking...
              </p>
            </div>
          </div>
        )}
      </div>

      <form
        onSubmit={handleSend}
        className="flex gap-2"
      >
        <Input
          value={input}
          onChange={(e) =>
            setInput(
              e.target.value
            )
          }
          placeholder="Ask the agent to manage your tasks..."
          disabled={loading}
        />

        <Button
          type="submit"
          disabled={loading}
        >
          Send
        </Button>
      </form>
    </Card>
  );
}