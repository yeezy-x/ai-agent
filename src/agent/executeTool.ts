import { toolsByName } from "./tools";

export async function executeTool(name: string, args: Record<string, unknown>) {
  const tool = toolsByName[name];

  if (!tool) {
    return { success: false, error: `Unknown tool: ${name}` };
  }

  try {
    return await tool.execute(args);
  } catch (err) {
    console.error(`Tool execution error (${name}):`, err);
    return {
      success: false,
      error: `Tool ${name} failed: ${err instanceof Error ? err.message : "unknown error"}`,
    };
  }
}