// src/agent/parseFallbackToolCall.ts

interface ParsedToolCall {
  name: string;
  arguments: Record<string, unknown>;
}

/**
 * Some local models (e.g. qwen2.5 family) sometimes emit a tool call as
 * plain text JSON inside `content` instead of populating the structured
 * `tool_calls` field. This attempts to detect and parse that case as a
 * fallback so the agent doesn't silently fail to act.
 */
export function parseFallbackToolCall(content: string | undefined): ParsedToolCall | null {
  if (!content) return null;

  const trimmed = content.trim();

  // Strip <tool_call> XML-style wrapper if present (seen in some Qwen templates)
  const xmlMatch = trimmed.match(/<tool_call>([\s\S]*?)<\/tool_call>/);
  const candidate = xmlMatch ? xmlMatch[1].trim() : trimmed;

  // Must look like a JSON object to bother trying
  if (!candidate.startsWith("{")) return null;

  try {
    const parsed = JSON.parse(candidate);
    if (typeof parsed.name === "string" && parsed.arguments && typeof parsed.arguments === "object") {
      return { name: parsed.name, arguments: parsed.arguments };
    }
  } catch {
    // Not valid JSON, or not in the shape we expect — not a tool call
  }

  return null;
}