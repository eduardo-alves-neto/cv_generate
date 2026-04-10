<!--
SYNC IMPACT REPORT
==================
Version change: 1.0.0 → 2.0.0  (MAJOR amendment)
Modified principles: I (Privacy First), II (Zero Cost)

Reason for amendment:
  Ollama local inference proved impractical on commodity CPU-only hardware
  (generation times > 90 s even on the 1b model). After evaluation, a
  cloud-hosted free-tier AI API (Google Gemini Flash) was adopted as the AI
  layer. This necessitates relaxing the "local-only" privacy constraint and
  the "no API keys" zero-cost constraint.

Modified sections:
  - Principle I: "Privacy First" — reframed from "local-only" to
    "data minimisation + HTTPS-only"; user data MAY be sent to the configured
    AI provider but MUST NOT be stored, logged, or forwarded by the backend.
  - Principle II: "Zero Cost" — allows free-tier cloud AI APIs (Gemini free
    tier, OpenAI free credits); paid tiers remain prohibited without explicit
    opt-in by the operator.
  - Technology Stack › Backend: replaced "Ollama HTTP API (local)" with
    "Google Gemini API via @google/generative-ai SDK".

Templates requiring updates:
  ✅ plan.md Constitution Check gates updated to reflect amended principles
  ✅ spec.md FR-009 updated
  ✅ quickstart.md Ollama steps replaced with Gemini API key setup

Follow-up TODOs:
  - Add a privacy notice to the UI informing users that CV content is sent
    to Google Gemini for processing (future enhancement).
-->

# CV to ATS Converter Constitution

## Core Principles

### I. Privacy & Data Minimisation

User data MUST be handled with minimum exposure and maximum transparency.

- The backend MUST transmit CV text and job description exclusively to the
  configured AI provider API over HTTPS. No other third party MAY receive
  this data.
- The backend MUST NOT persist, log, or cache raw resume text or AI
  responses beyond the lifetime of a single request.
- The frontend MUST NOT make direct calls to external AI or analytics
  services; all AI calls are proxied through the backend.
- Operators MUST disclose in the UI that content is processed by the
  configured AI provider (e.g., Google Gemini).

**Rationale**: Users share sensitive career data. Although processing is no
longer exclusively local, data minimisation and transparency preserve user
trust. Only the designated AI provider receives content; no analytics,
tracking, or storage services may.

### II. Zero Cost (default deployment)

The default configuration MUST be runnable at zero financial cost.

- The default AI model MUST use the AI provider's **free tier**
  (e.g., Gemini 1.5 Flash — 15 RPM / 1 M tokens per day free).
- All runtime dependencies MUST be available under OSI-approved licenses.
- No SaaS subscriptions or pay-per-use services beyond the free tier are
  permitted in the default configuration.
- Operators MAY upgrade to a paid tier by changing environment variables;
  this is an explicit opt-in and does not violate the constitution.

**Rationale**: The zero-cost guarantee for default use remains a first-class
feature. The free Gemini tier comfortably handles the single-user local-tool
use case without charges.

### III. Simplicity (YAGNI)

The codebase MUST favour the simplest solution that satisfies a stated requirement.

- Abstractions, utilities, and helpers MUST NOT be introduced for hypothetical
  future needs; they MUST solve a present problem.
- Three similar inline lines are preferred over a premature shared abstraction.
- New packages MUST be justified against an existing alternative already in
  the dependency tree.
- Feature flags and backwards-compatibility shims MUST NOT be added when a
  direct code change suffices.

**Rationale**: A small, focused tool grows complicated fast. Simplicity keeps
maintenance cost low and onboarding fast for a single-developer project.

### IV. Type Safety

TypeScript MUST be used end-to-end — frontend and backend — with strict mode enabled.

- `any` types are PROHIBITED except in auto-generated code or explicit
  third-party boundary adaptors, and MUST be documented with a comment
  explaining why.
- All external data boundaries (API request/response bodies, AI provider
  responses, file uploads) MUST be validated with Zod schemas before use.
- Shared types/interfaces that cross the frontend–backend boundary MUST live
  in a shared package or clearly documented shared module.

**Rationale**: Resume generation involves structured data transformations;
type errors at runtime produce broken PDFs. Types are the first line of
correctness.

### V. User Experience & Performance

The product MUST deliver a polished, responsive experience within defined time budgets.

- Resume generation (upload → ATS PDF download) MUST complete within
  **30 seconds** on a standard internet connection using the default AI model.
- The UI MUST be fully functional on desktop and mobile viewports (≥ 320 px).
- Loading states, progress indicators, and error messages MUST be present for
  every async operation visible to the user.
- The entire local development environment MUST be startable with a
  **single command** (after API key is configured).

**Rationale**: Cloud AI inference is significantly faster than local CPU
inference — the time budget is therefore tightened to 30 s. UX parity with
commercial tools, at zero cost, is the product's differentiator.

## Technology Stack

### Frontend

- **Framework**: React 18
- **UI Components**: shadcn/ui + Tailwind CSS
- **Data Fetching**: TanStack React Query
- **Routing**: React Router
- **HTTP Client**: Axios
- **Build Tool**: Vite
- **Package Manager**: pnpm

### Backend

- **Runtime**: Node.js with TypeScript (tsx for dev, compiled for prod)
- **Framework**: Express.js
- **Validation**: Zod
- **File Handling**: Multer (memory storage)
- **AI Integration**: Google Gemini API via `@google/generative-ai` SDK;
  default model `gemini-2.5-flash`
- **PDF Generation**: PDFKit

### Testing

- **Unit Tests**: Vitest (frontend + backend)
- **E2E Tests**: Playwright
- Coverage thresholds MUST be defined per feature in the corresponding
  tasks file.

## Development Workflow & Quality Gates

### Quality Gates (per PR)

- [ ] TypeScript strict compilation passes (`tsc --noEmit`)
- [ ] All unit tests pass (`pnpm test`)
- [ ] Affected E2E tests pass (`pnpm test:e2e`)
- [ ] No `any` types introduced without documented justification
- [ ] No external data processed without Zod validation
- [ ] No paid-tier service dependencies introduced without explicit opt-in
- [ ] Mobile viewport tested for UI changes

### Constitution Check (for plan.md)

Before starting any implementation plan, verify:

1. **Privacy**: Is user data sent only to the designated AI provider over HTTPS,
   with no persistence beyond the request lifetime?
2. **Zero Cost**: Do all new dependencies run within the provider's free tier
   by default?
3. **Simplicity**: Is the proposed abstraction layer necessary right now?
4. **Type Safety**: Are Zod schemas defined for all new data boundaries?
5. **UX/Performance**: Does the feature complete within the 30-second budget?

## Governance

This constitution supersedes all other practices, conventions, and prior instructions.

- **Amendments** require: (a) a written proposal describing the change and
  motivation, (b) version bump per semantic versioning below, (c) updating all
  affected templates and plan Constitution Check sections.
- **Versioning**:
  - MAJOR — principle removal, redefinition, or backward-incompatible change.
  - MINOR — new principle or section added, or materially expanded guidance.
  - PATCH — clarification, wording fix, or non-semantic refinement.

**Version**: 2.0.0 | **Ratified**: 2026-04-10 | **Last Amended**: 2026-04-10
