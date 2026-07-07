# AI-BOS Architecture: Frozen
*Version 1.0 - Hardened*

## Core Rules

The AI architecture is now strictly frozen. All future modules MUST follow these non-negotiable rules.

### 1. Zero Direct Database Access for AI
The AI, the LLM, and the Decision Engine **NEVER** access Prisma directly and **NEVER** perform database writes.

### 2. Execution Orchestration
All mutations are routed through the `Tool Registry`, built as multi-step workflows, and executed by the `ExecutionEngine`. The `ExecutionEngine` does not run logic itself; it strictly coordinates Domain Services.

### 3. Verification & Deterministic Risk
Verification must ALWAYS happen before execution.
The LLM may provide a subjective `llmRisk`, but the `RiskEngine` calculates a deterministic `calculatedRisk` based on monetary impact, inventory impact, reversibility, and configured `AISettings`. The `RiskEngine` ALWAYS overrides the LLM to produce the `finalRisk`.

### 4. Immutable Workflow History
Every workflow execution must receive a globally unique `executionId`.
This ID must propagate into the `AIRecommendation`, the `AuditLog`, and the `WorkflowExecution` table. Every workflow execution must be replayable for debugging and auditing.

### 5. Domain Guardrails
Domain Services are the absolute source of truth for business rules.
Every Domain Service MUST validate inputs independently of the AI and throw typed Domain Exceptions (e.g., `InvalidQuantityException`, `AccessDeniedException`) if business rules are violated. The AI cannot bypass these.

### 6. Tenant Isolated Memory
The `MemoryStore` strictly filters all history, context, and past decisions by `businessId`. There is zero cross-tenant history leaking.

### 7. Absolute Traceability
Every AI mutation must generate an `AuditLog` attributing the action to `actorType = "AI"`, capturing the `executionId`, `workflowName`, and `recommendationId`.
