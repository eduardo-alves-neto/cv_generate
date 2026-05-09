# Implementation Plan: Prioritize Job Description Requirements in CV Conversion

**Branch**: `007-job-desc-priority` | **Date**: 2026-04-17 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/007-job-desc-priority/spec.md`

## Summary

When converting a CV, the AI must detect gaps and contradictions between the CV's content and the job description's requirements, then suppress contradicting statements, bridge skill gaps using the job's terminology, and surface relevant experience that aligns with the job's work mode and context — all without fabricating any qualifications. The change is confined to rewriting the `PROMPT_TEMPLATE` constant in `backend/src/services/geminiClient.ts`.

## Technical Context

**Language/Version**: TypeScript 5.x strict — Node.js 20+  
**Primary Dependencies**: `@google/genai` (already installed), Express v4, Zod  
**Storage**: In-memory only — no change  
**Testing**: Vitest (backend unit tests)  
**Target Platform**: Node.js server  
**Project Type**: Web service (full-stack, monorepo)  
**Performance Goals**: CV conversion must complete within 30 seconds (constitution V)  
**Constraints**: No new npm packages; no `any` types; no fabrication of candidate data  
**Scale/Scope**: Single-user local tool; single POST `/api/convert` endpoint

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Privacy & Data Minimisation | ✅ PASS | No new external services; CV + job desc still sent only to Gemini over HTTPS, not persisted |
| II. Zero Cost | ✅ PASS | No new dependencies or API calls; prompt-only change; free tier unaffected |
| III. Simplicity (YAGNI) | ✅ PASS | Change is limited to `PROMPT_TEMPLATE` string in one file; no new abstraction layers |
| IV. Type Safety | ✅ PASS | No new data boundaries introduced; no new Zod schemas required |
| V. UX/Performance (30 s) | ✅ PASS | Longer prompt adds ~200 tokens — negligible latency impact on Gemini Flash |

All gates pass. No violations to justify.

## Project Structure

### Documentation (this feature)

```text
specs/007-job-desc-priority/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output (no changes — confirms N/A)
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks command — NOT created here)
```

### Source Code (repository root)

```text
backend/
├── src/
│   └── services/
│       └── geminiClient.ts   ← sole change: PROMPT_TEMPLATE rewrite
└── tests/
    └── services/
        └── geminiClient.test.ts   ← unit tests updated/added

frontend/   (no changes)
packages/   (no changes)
```

**Structure Decision**: Web application (Option 2). Only `backend/src/services/geminiClient.ts` changes. No frontend, shared schema, or route changes are required.
