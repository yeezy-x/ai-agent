"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function SmartTaskForm() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/ai/extract-task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) {
        throw new Error("Failed to create task");
      }
      setText("");
      window.location.reload();
    } catch (err) {
      console.log(err)
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex gap-2">
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder='Try: "Learn Drizzle tomorrow, high priority"'
          disabled={loading}
        />
        <Button type="submit" disabled={loading}>
          {loading ? "Thinking..." : "Smart Add"}
        </Button>
      </div>
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </form>
  );
}