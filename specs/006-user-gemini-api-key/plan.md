# Implementation Plan: User-Provided Gemini API Key

**Branch**: `006-user-gemini-api-key` | **Date**: 2026-04-14 | **Spec**: [spec.md](spec.md)  
**Input**: Feature specification from `/specs/006-user-gemini-api-key/spec.md`

## Summary

Replace the operator-managed `GEMINI_API_KEY` environment variable with a per-user key supplied by the browser. The frontend stores the key in `localStorage`, injects it into every `/api/convert` request as a form field, and displays an in-app tutorial (pt-BR) explaining how to obtain a free key from Google AI Studio. The backend reads the key from the request body per-call instead of from the environment, so no server-side secret management is required.

## Technical Context

**Language/Version**: TypeScript 5.x strict — Node.js 20+ (backend), browser (frontend)  
**Primary Dependencies**: React 18 + Vite + TanStack React Query + Axios (frontend); Express v4 + Multer + Zod + `@google/genai` (backend); Zod shared schemas in `packages/shared`  
**Storage**: `localStorage` (browser only) — no server-side persistence  
**Testing**: Vitest (unit, frontend + backend); Playwright (E2E)  
**Target Platform**: Desktop + mobile browsers (≥ 320 px); Node.js 20+ server  
**Project Type**: Web application (frontend + backend monorepo)  
**Performance Goals**: Conversion end-to-end ≤ 30 s (unchanged)  
**Constraints**: Key never logged or persisted server-side; HTTPS only in production  
**Scale/Scope**: Single-user per browser session; no multi-key management

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| # | Gate | Status | Notes |
|---|------|--------|-------|
| 1 | **Privacy** — user data sent only to the designated AI provider over HTTPS; nothing persisted beyond request lifetime | ✅ PASS | Key forwarded per-request; backend must not log it. Backend already does not persist CV text. |
| 2 | **Zero Cost** — all new dependencies on free tier | ✅ PASS | User provides their own free-tier key. No operator key required. Zero new paid services. |
| 3 | **Simplicity** — abstraction justified by present need | ✅ PASS | Changes are minimal: one new shared schema field, one new frontend component (API key input + tutorial), one hook change, one service function signature change. |
| 4 | **Type Safety** — Zod schemas for all new data boundaries | ✅ PASS | `geminiApiKey` added to `ConvertRequestBodySchema`; validated at backend boundary before use. |
| 5 | **UX/Performance** — feature completes within 30 s; loading states present | ✅ PASS | Key input is a pre-conversion gate; no async call until key is set and form submitted. |

## Project Structure

### Documentation (this feature)

```text
specs/006-user-gemini-api-key/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── api-convert.md
└── tasks.md             # Phase 2 output (/speckit.tasks — not created here)
```

### Source Code (affected paths)

```text
packages/shared/src/
└── schemas.ts               # Add geminiApiKey field to ConvertRequestBodySchema

backend/src/
├── routes/convert.ts        # Read geminiApiKey from req.body; pass to generateATSContent
├── services/geminiClient.ts # Accept apiKey parameter; remove process.env dependency
└── .env.example             # Mark GEMINI_API_KEY as optional / deprecated

frontend/src/
├── hooks/
│   ├── useApiKey.ts         # NEW — get/set/clear key in localStorage
│   └── useConvert.ts        # Pass geminiApiKey in FormData
├── components/
│   ├── ApiKeySetup.tsx      # NEW — key input field + inline tutorial
│   └── ConvertForm.tsx      # Gate: render ApiKeySetup when key absent
└── lib/
    └── axios.ts             # No change needed (key goes in FormData)
```

## Complexity Tracking

> No constitution violations — table omitted.
