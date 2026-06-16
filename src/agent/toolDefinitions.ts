// src/agent/toolDefinitions.ts
//import type { FunctionDeclaration } from "@google/genai";

// {export const toolDefinitions: FunctionDeclaration[] = tools.map((tool) => ({
//   name: tool.name,
//   description: tool.description,
//   parametersJsonSchema: tool.parameters,
// }));}

// toolDefinitions.ts

// src/agent/toolDefinitions.ts

import { tools } from "./tools";
import type { Tool as OllamaTool } from "ollama";

export const toolDefinitions: OllamaTool[] = tools.map((tool) => ({
  type: "function",
  function: {
    name: tool.name,
    description: tool.description,
    parameters: tool.parameters ,
  },
}));