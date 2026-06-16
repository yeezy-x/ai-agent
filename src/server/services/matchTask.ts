// src/server/services/matchTask.ts
import { getTasks } from "./task.service";

/**
 * Deterministically resolve a task by title. Only matches if:
 * - There's an exact case-insensitive match, OR
 * - There's exactly ONE task whose title contains the given string (or vice versa)
 * Returns null if no confident match is found - callers must NOT guess further.
 */
export async function matchTaskByTitle(titleQuery: string): Promise<
  | { found: true; task: Awaited<ReturnType<typeof getTasks>>[number] }
  | { found: false; candidates: Awaited<ReturnType<typeof getTasks>> }>
    {
  const allTasks = await getTasks();
  const query = titleQuery.trim().toLowerCase();

  const exactMatch = allTasks.find((t) => t.title.trim().toLowerCase() === query);
  if (exactMatch) return { found: true, task: exactMatch };

  const partialMatches = allTasks.filter(
    (t) =>
      t.title.toLowerCase().includes(query) || query.includes(t.title.toLowerCase())
  )

  if (partialMatches.length === 1) {
    return { found: true, task: partialMatches[0] };
  }

  // Zero matches, or multiple ambiguous matches - either way, do not guess
  return { found: false, candidates: allTasks };
}