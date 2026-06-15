// src/agent/toolDefinitions.ts
import type { FunctionDeclaration } from "@google/genai";
import { tools } from "./tools";

export const toolDefinitions: FunctionDeclaration[] = tools.map((tool) => ({
  name: tool.name,
  description: tool.description,
  parametersJsonSchema: tool.parameters,
}));