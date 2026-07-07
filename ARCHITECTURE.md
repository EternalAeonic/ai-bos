# AI-BOS Architecture Reference

This document serves as the permanent source of truth for the AI-BOS architecture. Every new feature, module, or code change must align with these principles.

## 1. Vision & Core Principles
- **AI as a First-Class Citizen:** AI doesn't just bolt on; it sits at the core of the business logic, orchestrating modules and observing actions.
- **No Direct DB Modification by AI:** AI prepares actions. It never executes them blindly on the database.
- **Human in the Loop:** Medium and high-risk actions require human approval via the Verification engine.
- **Strict Modularity:** Modules do not bleed into each other. They communicate via well-defined interfaces or services.
- **Security & Explainability First:** Everything is audited. AI reasoning is logged.
- **Production-Quality Code:** TypeScript, SOLID principles, no duplicated code.

## 2. Directory Structure

We use a modular App Router pattern.

```text
src/
├── app/                  // Next.js App Router (Presentation & API)
├── components/           // Reusable React Components (shadcn/ui)
├── lib/                  // Next.js specific bindings (Prisma, Auth, env)
├── shared/               // Cross-cutting frontend utilities and reusable domain-agnostic logic
├── modules/              // Clean Architecture Business Logic
│   ├── auth/             // Authentication & User Identity (Better Auth)
│   ├── core/             // Shared services (Logging, Config, Errors, Permissions)
│   ├── ai/               // First-class AI Architecture
│   │   ├── orchestrator/ // Directs the flow between components
│   │   ├── providers/    // LLM API connections (Anthropic, OpenAI)
│   │   ├── tools/        // Actions the AI can take
│   │   ├── memory/       // Long/short-term context storage
│   │   ├── planning/     // Step-by-step task generation
│   │   ├── reasoning/    // AI logic evaluation
│   │   ├── context/      // Business state ingestion
│   │   ├── prompts/      // Core prompt definitions
│   │   └── models/       // Data models for AI objects
│   ├── verification/     // Rule Engine, Policy Engine, Risk Engine, Approval Engine
│   ├── audit/            // Centralized audit logging
│   ├── notification/     // Email, SMS, in-app notifications
│   ├── documents/        // Document generation (PDFs, templates)
│   ├── integrations/     // External systems
│   │   ├── email/        // SMTP/API
│   │   ├── messaging/    // SMS, WhatsApp, Slack
│   │   ├── banking/      // Bank feeds (Plaid, etc.)
│   │   ├── pos/          // Point of Sale systems
│   │   ├── payments/     // Stripe, PayPal
│   │   └── government/   // Government portals/tax endpoints
│   └── business/         // Business profile management
```

## 3. Layer Responsibilities

### Presentation Layer (`src/app/` & `src/components/`)
- Pure React/Next.js components.
- Handles user interactions, displaying state, and form submissions.
- **Rule:** UI components NEVER contain raw database queries or complex domain logic. They call Server Actions or APIs.

### Service Layer (`src/modules/[module]/services/`)
- Contains the business logic.
- Orchestrates multiple repositories if needed.
- **Rule:** Services should be pure TypeScript classes or functions. They should not rely on Next.js specific constructs (like `headers()` or `cookies()`) unless strictly necessary, pushing that to the boundary.

### Data Access Layer (`src/modules/[module]/repositories/`)
- Wraps Prisma queries.
- **Rule:** Never leak Prisma types directly to the UI layer. Use DTOs or mapped types.

## 4. Development Rules
1. **Never build multiple modules together.** Focus on one module, complete it, and test it before moving on.
2. **Every execution is logged.** Actions that modify state must write to the `audit` module.
3. **Configuration Validation:** Use `Zod` in `src/lib/env.ts` to validate environment variables on startup.
4. **Error Handling:** Use custom error classes from the `core` module rather than throwing generic errors.
5. **Reusable Components:** Leverage `shadcn/ui` and build reusable layout components. Avoid inline styling where standard Tailwind classes suffice.
