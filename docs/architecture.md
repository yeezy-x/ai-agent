# Agent Architecture

## Tool Responsibilities

Tools are responsible for:

- Database access
- Business logic
- Validation
- Sorting
- Filtering

Tools return structured JSON only.

Tools should never generate user-facing prose.

---

## LLM Responsibilities

The LLM is responsible for:

- Choosing tools
- Reasoning
- Combining observations
- Producing natural language responses

The LLM should not perform business logic that can be implemented deterministically in code.

Examples:

- Task prioritization → Service
- Title matching → Service
- Goal lookup → Service

Not the LLM.