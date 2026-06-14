# Learning Log

## Day 1

Completed:
- Created Next.js project
- Initialized GitHub repository

Learned:
- App Router setup
- Git workflow

Next:
- Tailwind verification
- Shadcn setup

## Task 1.2

Completed:
- Verified Tailwind CSS setup

Learned:
- Tailwind is already configured by create-next-app
- Utility classes are working correctly

## Task 1.3

Completed:
- Installed Shadcn UI

Learned:
- Shadcn generates components into the project
- Components remain fully customizable
- Uses Tailwind under the hood

## Task 1.4 Setup Neon Postgres
## Task 1.5

Completed:
- Installed Drizzle ORM
- Connected Drizzle to Neon Postgres

Learned:
- Drizzle acts as a type-safe ORM
- Drizzle Kit handles migrations
- Database access is centralized in src/db

## Task 1.6

Completed:
- Created tasks table schema

Learned:
- Drizzle schemas define database structure in TypeScript
- Tables become the source of truth for migrations
- Task design impacts future AI agent capabilities

## Task 1.7

Completed:
- Generated Drizzle migration
- Applied migration to Neon Postgres
- Verified tasks table exists

Learned:
- Schema changes become SQL migrations
- Migrations keep database in sync with code
- Drizzle Studio can inspect tables visually

## Task 1.8

Completed:
- Built GET endpoint
- Built POST endpoint
- Built PATCH endpoint
- Built DELETE endpoint

Learned:
- Next.js Route Handlers
- REST API design
- Drizzle CRUD operations

## Task 1.9 Build Todo UI

## Phase 1 Complete

Built:
- Next.js App
- Tailwind
- Shadcn UI
- Neon Postgres
- Drizzle ORM
- Tasks Schema
- Migrations
- CRUD API
- Todo UI

Learned:
- Next.js Route Handlers
- Drizzle ORM
- Database Migrations
- CRUD Architecture
- Frontend ↔ Backend Integration

## Task 2.1

Completed:
- Created task service

Learned:
- Service layer contains business logic
- Database access should not live directly in API routes

## Task 2.2 - Add Update and Delete Methods
Completed
Added updateTask()
Added deleteTask()
Learned
CRUD operations can be grouped into a single service.
Reusable service functions reduce code duplication.
Future consumers (API routes, AI agents, background jobs) can share the same logic.

## Task 2.3 - Add Complete Task Helper
Completed
Added completeTask()
Learned
Business-specific operations deserve dedicated functions.
completeTask() is more expressive than calling updateTask() with a status object everywhere.
Services can expose domain-specific actions.

## Task 2.4 - Refactor API Routes
Completed
Refactored GET routes to use service functions.
Refactored POST routes to use service functions.
Refactored PATCH routes to use service functions.
Refactored DELETE routes to use service functions.
Learned
Route handlers should be thin wrappers around business logic.
API routes are responsible for HTTP concerns.
Services are responsible for application logic.
Architecture Change

Before:

API Route
→ Database

After:

API Route
→ Service Layer
→ Database

## Task 2.5 - Frontend Discussion
Learned
Frontend components should generally call API routes, not database services directly.
Service functions are server-side concerns.
Keeping the API boundary makes the application easier to scale and secure.

Recommended Flow:

Frontend
→ API Route
→ Service Layer
→ Database

## Task 2.6 - End-to-End Testing
Tested
Create Task
Fetch Tasks
Update Task
Complete Task
Delete Task
Result

All functionality works correctly after introducing the service layer.

Key Takeaways
Separation of Concerns
Reusable Business Logic
Cleaner API Routes
Better Scalability
Architecture Ready for AI Agent Integration
Why This Matters for Phase 3+

The AI agent will eventually call:

createTask()
getTasks()
updateTask()
completeTask()

Instead of talking directly to the database.

Architecture:

AI Agent
→ Tool
→ Service Layer
→ Database

This makes the service layer the foundation for future tool-calling agents.

## Task 3.1

Completed:
- Created OpenAI API key
- Added environment variables

Learned:
- Secrets should never be committed
- Environment variables provide runtime configuration

## Task 3.2

Completed:
- Installed OpenAI SDK
- Created shared OpenAI client

Learned:
- SDK clients should be centralized
- Shared clients avoid duplicated configuration

## Task 3.3

Completed:
- Built task extraction prompt

Learned:
- Prompt engineering for structured output
- JSON extraction workflows

### Task 3.4 - Create Extraction API Route

### Completed

* Created `POST /api/ai/extract-task`.
* Connected the API route to the `extractTask()` function.
* Returned structured task data as JSON.
* Added error handling for invalid AI responses.

### Learned

* API routes act as the bridge between the frontend and AI services.
* AI logic should be isolated from UI components.
* Keeping extraction logic in a separate module improves maintainability and testing.
* Server-side AI processing protects API keys and sensitive configuration.

### Request Flow

User Input

↓

Frontend

↓

POST /api/ai/extract-task

↓

Gemini

↓

Structured JSON

↓

Frontend Response

### Example Request

```json
{
  "text": "Finish AI Todo Agent by Friday"
}
```

### Example Response

```json
{
  "title": "Finish AI Todo Agent",
  "description": null,
  "priority": "medium",
  "dueDate": "2026-06-19"
}
```

### Key Takeaway

The application can now understand natural language and convert it into structured task information, forming the foundation for future AI-powered task creation.

#### Task 3.5 - Smart Add UI

### Completed

* Added Smart Add input field.
* Connected UI to the extraction API.
* Displayed extracted task data to the user.
* Added loading and error states.

### Learned

* AI features should be exposed through intuitive user interfaces.
* Frontend applications can leverage AI without exposing API keys.
* User review before task creation improves reliability.
* AI-assisted workflows often involve a preview and confirmation step.

### User Flow

Natural Language Input

↓

Smart Add UI

↓

Extraction API

↓

Gemini

↓

Structured Task Preview

↓

User Confirmation

### Example

Input:

Learn Drizzle tomorrow, high priority

Preview:

Title: Learn Drizzle

Priority: High

Due Date: Tomorrow

### Key Takeaway

AI should assist users by reducing manual input while still allowing user control.

#### Task 3.6 - End-to-End Test

### Completed

* Tested natural language task extraction.
* Verified Gemini integration.
* Verified extraction API functionality.
* Verified Smart Add UI workflow.
* Verified structured task generation.

### Test Cases

Input:
Learn Drizzle tomorrow

Result:
Correct title and due date extracted.

Input:
Finish AI Todo Agent by Friday

Result:
Correct title and due date extracted.

Input:
Study Postgres this weekend

Result:
Correct task structure generated.

### Learned

* End-to-end testing validates the entire workflow rather than individual components.
* AI responses should be tested with multiple prompt variations.
* Structured extraction provides predictable application behavior.
* Logging AI responses is useful during development.

### Architecture

User

↓

Frontend

↓

AI API Route

↓

Gemini

↓

Structured JSON

↓

Task Preview

### Key Takeaway

The application can now understand natural language and convert it into structured task data, creating the first genuinely AI-powered feature of the project.

## Task 4.1

Completed:
- Created Tool interface

Learned:
- Tools need metadata for LLMs
- Tools need executable logic
- Tool definitions should be standardized
# Phase 4 - Agent Tools

## Goal

Transform application functionality into reusable AI tools that can later be invoked by an LLM.

Architecture:

Service Layer
↓
Agent Tools
↓
Tool Registry

Future:

LLM
↓
Tool Selection
↓
Tool Execution
↓
Result

---

## Task 4.1 - Create Tool Interface

### Completed

* Created a shared Tool interface.
* Standardized tool structure across the application.
* Added metadata fields required by LLMs.

### Learned

* Every tool consists of:

  * Name
  * Description
  * Parameter Schema
  * Execute Function
* Tool metadata helps an LLM understand when and how to use a tool.
* Strong typing improves tool safety and maintainability.

### Key Takeaway

A tool is simply a function wrapped with metadata that an LLM can understand.

---

## Task 4.2 - Create Task Tool

### Completed

* Created createTask tool.
* Connected tool execution to the service layer.

### Learned

* Tools should delegate work to services.
* Business logic should not be duplicated inside tools.
* Tools act as adapters between AI and application logic.

### Flow

Tool
↓
Service
↓
Database

---

## Task 4.3 - Get Tasks Tool

### Completed

* Created getTasks tool.

### Learned

* Read operations can also be exposed as tools.
* Tools are not limited to database mutations.

### Example

User:
What tasks do I have?

Future Agent:

getTasks()
↓
Returns task list

---

## Task 4.4 - Update and Complete Task Tools

### Completed

* Created updateTask tool.
* Created completeTask tool.

### Learned

* Domain-specific actions are often better than generic updates.
* completeTask() provides clearer intent than updateTask(status="completed").

### Example

Instead of:

updateTask({
status: "completed"
})

Use:

completeTask()

---

## Task 4.5 - Delete Task Tool

### Completed

* Created deleteTask tool.

### Learned

* CRUD operations map naturally to tool abstractions.
* Consistent tool design simplifies future agent development.

---

## Task 4.6 - Tool Registry

### Completed

* Created centralized tool registry.

### Learned

* A registry provides a single source of truth for available tools.
* Tools can be discovered dynamically.
* Agents should not manually import every tool.

### Architecture

Agent
↓
Tool Registry
↓
Tool
↓
Service

---

## Task 4.7 - Direct Tool Testing

### Completed

* Tested tools without involving an LLM.
* Verified tool execution and service integration.

### Learned

* Tools should be tested independently.
* Separating tool logic from LLM logic makes debugging easier.
* Most agent bugs are actually tool bugs.

### Example

createTaskTool.execute({
title: "Learn AI Agents"
})

↓

Task Created

---

## Key Concepts Learned

### Tool Metadata

Tools require metadata so that an LLM can understand:

* What the tool does
* When it should be used
* What arguments it expects

### JSON Schema

Tools describe inputs using JSON Schema.

Example:

{
"title": {
"type": "string"
}
}

### Separation of Concerns

UI
↓
API
↓
Service
↓
Database

Agent
↓
Tool
↓
Service
↓
Database

Both systems reuse the same business logic.

### Tool Registry Pattern

Instead of:

if (toolName === "createTask")

Use:

registry.find(tool => tool.name === toolName)

This scales much better as more tools are added.

---

## Why Phase 4 Matters

This phase created the bridge between traditional software and AI agents.

Before:

User
↓
API
↓
Service

After:

Agent
↓
Tool
↓
Service

The application is now prepared for tool-calling agents.

---

## Ready for Phase 5

Phase 5 will introduce:

LLM
↓
Tool Selection
↓
Tool Execution
↓
Tool Result
↓
Final Response

This is the first true AI Agent phase of the project.
