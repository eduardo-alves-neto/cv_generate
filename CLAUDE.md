# cv_generate Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-04-10

## Active Technologies

- TypeScript 5.x (strict mode) — Node.js 20+ (backend), browser (002-cv-ats-converter)

## Project Structure

```text
frontend/     # React 18 + Vite + shadcn/ui + Tailwind CSS + TanStack React Query + React Router + Axios
backend/      # Express v4 + TypeScript + Multer + pdf-parse + PDFKit + Zod + @google/genai
packages/
  shared/     # Zod schemas + TypeScript types shared between frontend and backend
e2e/          # Playwright E2E tests
```

## Commands

```bash
pnpm install          # install all workspace dependencies
pnpm dev              # start frontend (port 5173) + backend (port 3001) concurrently
pnpm test             # Vitest unit tests (frontend + backend)
pnpm test:e2e         # Playwright E2E tests (requires pnpm dev running)
pnpm build            # production build
```

## Code Style

- TypeScript strict mode throughout — `any` is PROHIBITED without documented justification
- Zod schemas MUST validate all external data boundaries (API bodies, Gemini responses, file uploads)
- Shared types live in `packages/shared/src/schemas.ts`; import from `@cv-ats/shared`
- Backend uses Express v4 with Multer for file uploads
- Frontend uses TanStack React Query for async state; Axios for HTTP

## Key Architecture Decisions

- All AI processing via Google Gemini API (`@google/genai` SDK) — requires `GEMINI_API_KEY` in `backend/.env`
- Default model: `gemini-2.5-flash` (free tier — no credit card required)
- Conversion is a single synchronous POST `/api/convert` (multipart) → returns PDF binary
- In-memory job store only; no database; no persistence across restarts
- pnpm workspaces monorepo: frontend, backend, packages/shared, e2e

## Recent Changes

- 002-cv-ats-converter: Migrated AI provider from Ollama (local) to Google Gemini API
  — Ollama was impractical on CPU-only hardware (> 60 s per request)
  — Gemini 1.5 Flash averages 3–8 s; free tier sufficient for single-user use
