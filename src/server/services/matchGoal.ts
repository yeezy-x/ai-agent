import { getGoals } from "./goal.service";

export async function matchGoalByTitle(
  title: string
) {
  const goals = await getGoals();

  const normalizedSearch =
    title.trim().toLowerCase();

  const matches = goals.filter(
    (goal) =>
      goal.title
        .trim()
        .toLowerCase() ===
      normalizedSearch
  );

  if (matches.length === 1) {
    return {
      success: true,
      goal: matches[0],
    };
  }

  if (matches.length === 0) {
    return {
      success: false,
      error:
        `No goal found with title "${title}"`,
    };
  }

  return {
    success: false,
    error:
      `Multiple goals matched "${title}"`,
    matches,
  };
}