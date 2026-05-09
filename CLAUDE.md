# cv_generate Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-05-09

## Active Technologies
- TypeScript 5.x (strict mode) — Node.js 20+ (backend only) + `@google/genai` (prompt change), `pdfkit` (layout improvements), Zod (no schema change needed — `ATSContent` is internal) (003-pdf-format-pt)
- In-memory only — no change (003-pdf-format-pt)
- TypeScript 5.3 strict — React 18.2 (browser) + Tailwind CSS 3.4, shadcn/ui primitives (hand-rolled via clsx + tailwind-merge), lucide-react 0.309, TanStack React Query 5, Axios (004-frontend-ui-redesign)
- N/A — in-memory React state only; no persistence (004-frontend-ui-redesign)
- TypeScript 5.3 strict — React 18.2 (browser) + Tailwind CSS 3.4 (CSS Grid utilities), existing lucide-react + clsx (005-horizontal-form-layout)
- N/A — no data changes (005-horizontal-form-layout)
- TypeScript 5.x strict — Node.js 20+ (backend), browser (frontend) + React 18 + Vite + TanStack React Query + Axios (frontend); Express v4 + Multer + Zod + `@google/genai` (backend); Zod shared schemas in `packages/shared` (006-user-gemini-api-key)
- `localStorage` (browser only) — no server-side persistence (006-user-gemini-api-key)
- TypeScript 5.x strict — Node.js 20+ + `@google/genai` (already installed), Express v4, Zod (007-job-desc-priority)
- TypeScript 5.x strict mode (React 18 + Express v4) + React 18, Tailwind CSS 3.4, shadcn/ui, Vite (frontend); Express v4, Zod (backend) (008-apply-design-system)
- N/A — styling only, no data persistence changes (008-apply-design-system)

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

- All AI processing via Google Gemini API (`@google/genai` SDK) — users supply their own Gemini API key via the UI; no operator key required
- Default model: `gemini-2.5-flash` (free tier — no credit card required)
- Conversion is a single synchronous POST `/api/convert` (multipart) → returns PDF binary
- In-memory job store only; no database; no persistence across restarts
- pnpm workspaces monorepo: frontend, backend, packages/shared, e2e

## Recent Changes
- 008-apply-design-system: Added TypeScript 5.x strict mode (React 18 + Express v4) + React 18, Tailwind CSS 3.4, shadcn/ui, Vite (frontend); Express v4, Zod (backend)
- 007-job-desc-priority: Added TypeScript 5.x strict — Node.js 20+ + `@google/genai` (already installed), Express v4, Zod
- 006-user-gemini-api-key: Added TypeScript 5.x strict — Node.js 20+ (backend), browser (frontend) + React 18 + Vite + TanStack React Query + Axios (frontend); Express v4 + Multer + Zod + `@google/genai` (backend); Zod shared schemas in `packages/shared`

  — Ollama was impractical on CPU-only hardware (> 60 s per request)
  — Gemini 1.5 Flash averages 3–8 s; free tier sufficient for single-user use
