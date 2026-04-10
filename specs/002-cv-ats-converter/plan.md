# Implementation Plan: CV to ATS Converter

**Branch**: `002-cv-ats-converter` | **Date**: 2026-04-10 | **Spec**: [spec.md](spec.md)
**Amended**: 2026-04-10 — AI provider migrated from Ollama to Google Gemini API

## Summary

Build a web application that accepts a user's PDF resume and a pasted job
description, processes both through the Google Gemini API, and returns an
ATS-optimised PDF for download. Processing completes in under 30 seconds.
The stack is React 18 + Vite (frontend) and Express + TypeScript (backend),
sharing Zod schemas via a pnpm workspace package.

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode) — Node.js 20+ (backend), browser
(frontend)
**Primary Dependencies**:
- Frontend: React 18, Vite, shadcn/ui, Tailwind CSS, TanStack React Query, React Router,
  Axios
- Backend: Express v4, Multer, pdf-parse, PDFKit, Zod, `@google/generative-ai`, tsx (dev)
- Shared: Zod (schemas + type inference)
- AI: Google Gemini API (`@google/generative-ai` SDK), default model `gemini-2.5-flash`

**Storage**: In-memory only (`Map<string, ConversionJob>`); no database; session-scoped

**Testing**: Vitest (unit — frontend + backend), Playwright (E2E)

**Target Platform**: Local machine (Linux/macOS/Windows) with internet access;
modern desktop + mobile browsers

**Project Type**: Full-stack web application (monorepo, pnpm workspaces)

**Performance Goals**: Full conversion (upload → PDF download) ≤ 30 s on a standard
internet connection with `gemini-2.5-flash`

**Constraints**: CV data sent only to Gemini API over HTTPS; single-command dev start;
all dependencies OSI-licensed; default config stays within Gemini free tier

**Scale/Scope**: Single-user local tool; no concurrency requirements; no persistence

## Constitution Check

*GATE: Re-checked post amendment v2.0.0. ✅ All gates pass.*

| Principle | Gate Question | Status |
|-----------|--------------|--------|
| I. Privacy & Data Minimisation | Is CV data sent only to the designated AI provider (Gemini) over HTTPS, with no persistence? | ✅ PASS — backend calls only `generativelanguage.googleapis.com`; no logging of content; no analytics |
| II. Zero Cost | Does the default config stay within Gemini free tier? | ✅ PASS — `gemini-2.5-flash` free tier: 15 RPM / 1 M tokens/day; well within single-user budget |
| III. Simplicity | Is the proposed abstraction layer necessary right now? | ✅ PASS — single HTTP POST; in-memory store; minimal shared package |
| IV. Type Safety | Are Zod schemas defined for all new data boundaries? | ✅ PASS — `ApiErrorSchema`, `ConvertRequestBodySchema` in shared package; Gemini response validated before parsing |
| V. UX/Performance | Does the feature complete within 30 s? | ✅ PASS — `gemini-2.5-flash` averages 3–8 s on standard hardware; 30 s budget provides ample margin |

## Project Structure

### Documentation (this feature)

```text
specs/002-cv-ats-converter/
├── plan.md              # This file
├── research.md          # Phase 0 — technology decisions
├── data-model.md        # Phase 1 — entities and Zod schemas
├── quickstart.md        # Phase 1 — developer setup guide
├── contracts/
│   └── api.md           # Phase 1 — REST + Gemini API contracts
└── tasks.md             # Phase 2 — implementation tasks
```

### Source Code (repository root)

```text
cv_generate/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/              # shadcn/ui generated components
│   │   │   ├── ConvertForm.tsx  # upload + jobDescription form
│   │   │   ├── ProgressSpinner.tsx
│   │   │   └── ResultCard.tsx   # download button + re-download
│   │   ├── hooks/
│   │   │   ├── useConvert.ts    # React Query mutation (POST /api/convert)
│   │   │   └── useHealth.ts     # React Query query (GET /api/health)
│   │   ├── pages/
│   │   │   └── HomePage.tsx
│   │   ├── lib/
│   │   │   └── axios.ts         # configured Axios instance
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── ...
│
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── convert.ts       # POST /api/convert handler
│   │   │   └── health.ts        # GET /api/health handler
│   │   ├── services/
│   │   │   ├── pdfExtract.ts    # pdf-parse wrapper
│   │   │   ├── geminiClient.ts  # Google Gemini API wrapper
│   │   │   ├── contentParser.ts # parse Gemini structured output
│   │   │   └── pdfGenerator.ts  # PDFKit — ATSContent → Buffer
│   │   ├── middleware/
│   │   │   ├── upload.ts        # Multer memoryStorage + validation
│   │   │   └── errorHandler.ts  # Express error handler
│   │   ├── store/
│   │   │   └── jobs.ts          # in-memory Map (re-download support)
│   │   └── app.ts               # Express app setup
│   ├── tests/
│   │   ├── services/
│   │   │   ├── pdfExtract.test.ts
│   │   │   ├── geminiClient.test.ts
│   │   │   ├── contentParser.test.ts
│   │   │   └── pdfGenerator.test.ts
│   │   └── routes/
│   │       ├── convert.test.ts
│   │       └── health.test.ts
│   ├── .env.example
│   └── package.json
│
├── packages/
│   └── shared/
│       └── src/
│           ├── schemas.ts       # Zod schemas
│           └── index.ts
│
└── e2e/
    └── tests/
        ├── convert.spec.ts      # P1 happy path E2E
        └── errors.spec.ts       # P2 error handling E2E
```

## Complexity Tracking

> No constitution violations. Amendment v2.0.0 applied — AI provider changed from Ollama to Gemini.
