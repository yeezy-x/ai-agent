// src/agent/toolDefinitions.ts
//import type { FunctionDeclaration } from "@google/genai";

// {export const toolDefinitions: FunctionDeclaration[] = tools.map((tool) => ({
//   name: tool.name,
//   description: tool.description,
//   parametersJsonSchema: tool.parameters,
// }));}

// toolDefinitions.ts

// src/agent/toolDefinitions.ts

import type { Tool as OllamaTool } from "ollama";
import { tools } from "./tools";

export const toolDefinitions =
  tools.map((tool) => ({
    type: "function",
    function: {
      name: tool.name,
      description: tool.description,
      parameters: tool.parameters,
    },
  })) as OllamaTool[];