import { db } from "@/db";
import { memories } from "@/db/schema";
import { eq } from "drizzle-orm";

interface CreateMemoryInput {
  content: string;
  category: string;
}

export async function createMemory(
  input: CreateMemoryInput
) {
  const [memory] = await db
    .insert(memories)
    .values({
      content: input.content,
      category: input.category,
    })
    .returning();

  return memory;
}

export async function getMemories() {
  return await db
    .select()
    .from(memories);
}

export async function getMemoriesByCategory(
  category: string
) {
  return await db
    .select()
    .from(memories)
    .where(eq(memories.category, category));
}