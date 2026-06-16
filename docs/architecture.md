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

Phase 1 — Foundation
Phase 2 — Service Layer
Phase 3 — AI Extraction
Phase 4 — Agent Tools
Phase 5 — Tool Calling Agent
Phase 6 — ReAct Loop
Phase 7 — Goal Planner Agent
Phase 8 — Daily Planning Agent
Phase 9 — Long-Term Memory

Reasoning
✓ ReAct Loop

Tools
✓ Tasks
✓ Goals
✓ Daily Planning
✓ Memory

Persistence
✓ Postgres
✓ Drizzle

Memory
✓ Cross-session recall

Planning
✓ Goal → Milestones → Tasks