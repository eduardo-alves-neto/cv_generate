# Tasks: CV to ATS Converter

**Input**: Design documents from `/specs/002-cv-ats-converter/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, quickstart.md ✅

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Monorepo scaffolding and project initialization — no user story work can begin until dependencies are installable.

- [X] T001 Create root package.json with pnpm workspace scripts (dev, test, test:e2e, build) and pnpm-workspace.yaml declaring `frontend`, `backend`, `packages/shared`, and `e2e` in package.json and pnpm-workspace.yaml
- [X] T002 [P] Scaffold `packages/shared` with package.json (name `@cv-ats/shared`, zod dependency), tsconfig.json, and empty placeholder files `packages/shared/src/schemas.ts` and `packages/shared/src/index.ts`
- [X] T003 [P] Scaffold `backend` with package.json (express, multer, pdf-parse, pdfkit, zod, uuid, axios as deps; tsx, vitest, @types/* as devDeps), tsconfig.json with strict mode, and src/ directory structure per plan.md
- [X] T004 [P] Scaffold `frontend` with Vite + React + TypeScript template, install shadcn/ui, Tailwind CSS, TanStack React Query, React Router, and Axios in `frontend/`; configure vite.config.ts with proxy to `http://localhost:3001`
- [X] T005 [P] Scaffold `e2e` with package.json (playwright/test), playwright.config.ts with baseURL `http://localhost:5173` and webServer commands for frontend + backend in `e2e/`
- [X] T006 [P] Create `backend/.env.example` (PORT, OLLAMA_BASE_URL, OLLAMA_MODEL, OLLAMA_TIMEOUT_MS, MAX_FILE_SIZE_BYTES) and `frontend/.env.example` (VITE_API_BASE_URL) with documented defaults from quickstart.md

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T007 Define Zod schemas `ConvertRequestBodySchema` (jobDescription: string min 1 max 10 000) and `ApiErrorSchema` (error: string, code: enum of INVALID_FILE | FILE_TOO_LARGE | INVALID_JOB_DESCRIPTION | UNREADABLE_PDF | AI_UNAVAILABLE | AI_TIMEOUT | INTERNAL_ERROR) with exported `ApiError` and `ConvertRequestBody` types in `packages/shared/src/schemas.ts`
- [X] T008 Re-export all schemas and inferred types from `packages/shared/src/index.ts`
- [X] T009 [P] Set up Express app with JSON body parser, CORS, and stub route registration for `/api/health` and `/api/convert`; export the app instance from `backend/src/app.ts`
- [X] T010 [P] Implement centralised error handler Express middleware that maps `ApiError` codes to HTTP status codes (INVALID_FILE→415, FILE_TOO_LARGE→413, UNREADABLE_PDF→422, AI_UNAVAILABLE→503, AI_TIMEOUT→504, INTERNAL_ERROR→500) and returns `ApiErrorSchema`-shaped JSON in `backend/src/middleware/errorHandler.ts`
- [X] T011 [P] Implement Multer memory-storage upload middleware rejecting files over 10 MB (FILE_TOO_LARGE) and non-`application/pdf` MIME type (INVALID_FILE) before route handlers run in `backend/src/middleware/upload.ts`
- [X] T012 [P] Implement GET `/api/health` route returning `{ status: "ok" }` (200) for liveness checks in `backend/src/routes/health.ts`
- [X] T013 [P] Set up configured Axios instance with `baseURL` from `VITE_API_BASE_URL`, default timeout 120 000 ms, and helper to call the convert endpoint with `responseType: "blob"` in `frontend/src/lib/axios.ts`
- [X] T014 Create backend server entry point that reads `PORT` from env (default 3001), mounts the app, and starts listening in `backend/src/server.ts`

**Checkpoint**: Foundation ready — user story implementation can now begin.

---

## Phase 3: User Story 1 — Upload and Convert CV (Priority: P1) 🎯 MVP

**Goal**: A user uploads a PDF resume and pastes a job description; within 90 s they download an ATS-optimised PDF.

**Independent Test**: Upload `tests/fixtures/sample-cv.pdf` + paste any job description text → click "Convert to ATS" → verify a non-empty PDF file is downloaded that contains the candidate's name.

### Implementation for User Story 1

- [X] T015 [P] [US1] Define TypeScript interfaces `ConversionJob`, `ATSResult`, `ATSContent`, `ContactInfo`, `ExperienceEntry`, `EducationEntry`, and `ConversionStatus` type matching data-model.md in `backend/src/types.ts`
- [X] T016 [P] [US1] Implement `extractTextFromPdf(buffer: Buffer): Promise<string>` wrapping `pdf-parse`; return trimmed text string in `backend/src/services/pdfExtract.ts`
- [X] T017 [P] [US1] Implement `generateATSContent(cvText: string, jobDescription: string): Promise<string>` sending a structured prompt to Ollama HTTP API (`POST /api/generate`) with model from env, timeout from env, and returning raw response text in `backend/src/services/ollamaClient.ts`
- [X] T018 [P] [US1] Implement `parseATSContent(rawText: string): ATSContent` parsing Ollama plain-text output delimited by section headers (`## CONTACT`, `## SUMMARY`, `## EXPERIENCE`, `## EDUCATION`, `## SKILLS`) into an `ATSContent` object in `backend/src/services/contentParser.ts`
- [X] T019 [US1] Implement `generatePDF(content: ATSContent): Promise<Buffer>` using PDFKit to render a single-column, ATS-friendly layout (no tables, no graphics) with sections for contact info, summary, experience, education, and skills in `backend/src/services/pdfGenerator.ts`
- [X] T020 [US1] Implement POST `/api/convert` route handler orchestrating: validate `jobDescription` via Zod → extract PDF text via `pdfExtract` → call `ollamaClient` → parse via `contentParser` → render via `pdfGenerator` → respond with `Content-Type: application/pdf` binary in `backend/src/routes/convert.ts`
- [X] T021 [P] [US1] Implement `useConvert` React Query mutation hook that sends `FormData` (file + jobDescription) to POST `/api/convert`, receives a PDF blob, creates an object URL, and exposes `{ mutate, isPending, blobUrl, error }` in `frontend/src/hooks/useConvert.ts`
- [X] T022 [P] [US1] Implement `useHealth` React Query query hook polling GET `/api/health` every 30 s and exposing `{ isHealthy, isLoading }` in `frontend/src/hooks/useHealth.ts`
- [X] T023 [P] [US1] Implement `ConvertForm` component with a PDF file picker (accept=".pdf", max 10 MB enforced client-side), a job description `<textarea>` (maxLength 10 000), and a "Convert to ATS" submit button that calls `useConvert` in `frontend/src/components/ConvertForm.tsx`
- [X] T024 [P] [US1] Implement `ProgressSpinner` component that starts a client-side elapsed-time counter (seconds) when `isPending` is true and hides when conversion completes in `frontend/src/components/ProgressSpinner.tsx`
- [X] T025 [US1] Implement `ResultCard` component that renders a "Download ATS CV" `<a>` element pointing to the blob URL when conversion succeeds in `frontend/src/components/ResultCard.tsx`
- [X] T026 [US1] Implement `HomePage` composing `ConvertForm`, `ProgressSpinner`, and `ResultCard` with state-driven visibility (idle → pending → success/error) in `frontend/src/pages/HomePage.tsx`
- [X] T027 [US1] Wire `React Router` with a single `/` route rendering `HomePage` in `frontend/src/App.tsx` and bootstrap `ReactDOM.createRoot` with `QueryClientProvider` in `frontend/src/main.tsx`
- [X] T028 [P] [US1] Write Vitest unit tests for `pdfExtract` (returns text, handles empty buffer), `ollamaClient` (mocks fetch, returns raw text), `contentParser` (parses all sections, handles missing optional sections), and `pdfGenerator` (returns non-empty Buffer) in `backend/tests/services/pdfExtract.test.ts`, `ollamaClient.test.ts`, `contentParser.test.ts`, `pdfGenerator.test.ts`
- [X] T029 [P] [US1] Write Vitest unit test for `useConvert` hook using React Query test utils: assert mutation fires correct FormData POST and exposes blobUrl on success in `frontend/tests/hooks/useConvert.test.ts`
- [X] T030 [US1] Write Playwright E2E happy-path test: navigate to `/`, upload `e2e/fixtures/sample-cv.pdf`, paste job description, click "Convert to ATS", assert spinner appears, assert download link appears and href starts with `blob:` in `e2e/tests/convert.spec.ts`

**Checkpoint**: User Story 1 is fully functional — upload a PDF and get a downloaded ATS CV.

---

## Phase 4: User Story 2 — Invalid/Unsupported File Handling (Priority: P2)

**Goal**: Non-PDF files, unreadable PDFs, and Ollama being offline each produce a distinct, human-readable error message without crashing the app.

**Independent Test**: (a) Upload a `.docx` file → see INVALID_FILE error within 2 s. (b) Upload a text-only PDF with no content → see UNREADABLE_PDF error. (c) Stop Ollama and submit a valid CV → see AI_UNAVAILABLE error.

### Implementation for User Story 2

- [X] T031 [P] [US2] Extend upload middleware to pass `INVALID_FILE` and `FILE_TOO_LARGE` errors through Express `next(err)` so `errorHandler` returns correct codes and messages in `backend/src/middleware/upload.ts`
- [X] T032 [P] [US2] Extend `pdfExtract` service: after extraction, check `text.trim() === ''` and throw an `UNREADABLE_PDF` error (422) so empty/image-only PDFs are caught before Ollama is called in `backend/src/services/pdfExtract.ts`
- [X] T033 [P] [US2] Extend `ollamaClient` to catch `ECONNREFUSED` / fetch network errors and throw `AI_UNAVAILABLE` (503), and to throw `AI_TIMEOUT` (504) when the request exceeds `OLLAMA_TIMEOUT_MS` in `backend/src/services/ollamaClient.ts`
- [X] T034 [US2] Display human-readable inline error messages for all `ApiError` codes (INVALID_FILE, FILE_TOO_LARGE, INVALID_JOB_DESCRIPTION, UNREADABLE_PDF, AI_UNAVAILABLE, AI_TIMEOUT, INTERNAL_ERROR) in `ConvertForm` error state; include a hint for AI_UNAVAILABLE ("Run `ollama serve` to start the local AI") in `frontend/src/components/ConvertForm.tsx`
- [X] T035 [P] [US2] Write Vitest unit tests for `POST /api/convert` route covering: missing file (400), non-PDF file (415), file too large (413), empty PDF text (422), Ollama unavailable (503) in `backend/tests/routes/convert.test.ts`; write health route test for 200 response in `backend/tests/routes/health.test.ts`
- [X] T036 [P] [US2] Write Vitest unit test for `ConvertForm` component asserting that each `ApiError` code renders the correct user-facing message in `frontend/tests/components/ConvertForm.test.tsx`
- [X] T037 [US2] Write Playwright E2E error tests: upload non-PDF → assert error banner, upload image-only PDF → assert UNREADABLE_PDF message, submit with empty job description → assert validation message in `e2e/tests/errors.spec.ts`

**Checkpoint**: User Stories 1 and 2 both work — core conversion plus full error handling.

---

## Phase 5: User Story 3 — Re-download Result (Priority: P3)

**Goal**: After a successful conversion, the user can click "Download Again" to re-download the same PDF without re-running the AI.

**Independent Test**: Complete a conversion, then click "Download Again" — the same PDF starts downloading immediately with no new network request to `/api/convert`.

### Implementation for User Story 3

- [X] T038 [US3] Retain the PDF blob URL in `useConvert` hook state after a successful mutation (do not revoke the object URL) so the URL survives re-renders in `frontend/src/hooks/useConvert.ts`
- [X] T039 [US3] Add a "Download Again" anchor button to `ResultCard` that reuses the stored `blobUrl` from `useConvert` state; assert in a test that no additional fetch is fired on click in `frontend/src/components/ResultCard.tsx`

**Checkpoint**: All three user stories are independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Responsive layout, quickstart validation, and coverage confirmation across all stories.

- [X] T040 [P] Apply Tailwind responsive classes (mobile-first, min-width 320 px) to `ConvertForm`, `ProgressSpinner`, and `ResultCard` so the UI is fully usable on a 375 px viewport in `frontend/src/components/`
- [X] T041 [P] Add a `tailwind.config.ts` content glob covering all `frontend/src/**/*.{ts,tsx}` files and configure shadcn/ui CSS variables in `frontend/tailwind.config.ts` and `frontend/src/index.css`
- [X] T042 Run `pnpm test` and confirm backend service coverage ≥ 80% and frontend hook/utils coverage ≥ 70%; run `pnpm test:e2e` and confirm all Playwright tests pass

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately; T002–T006 are parallelisable after T001
- **Foundational (Phase 2)**: Depends on Phase 1 completion; T007 must complete before T008; T009–T013 parallelisable after T007–T008; T014 depends on T009
- **User Stories (Phase 3–5)**: All depend on Phase 2 completion
  - US2 tasks extend files created in US1 — start US2 after US1 checkpoint
  - US3 tasks are small additions to US1 files — can begin after US1 checkpoint
- **Polish (Phase 6)**: Depends on all user story phases completing

### User Story Dependencies

- **US1 (P1)**: Can start after Phase 2 — no dependency on US2 or US3
- **US2 (P2)**: Extends US1 services and components — start after US1 checkpoint
- **US3 (P3)**: Extends US1 hook and component — start after US1 checkpoint; can run in parallel with US2

### Within Each User Story

- Types/schemas before services
- Services before route handlers
- Route handlers before hooks
- Hooks before UI components
- UI components before E2E tests

---

## Parallel Opportunities

### Phase 1

```
T001 (root) → T002 [P], T003 [P], T004 [P], T005 [P], T006 [P]  (all in parallel)
```

### Phase 2

```
T007 → T008 → T009 [P], T010 [P], T011 [P], T012 [P], T013 [P] (all in parallel) → T014
```

### Phase 3 (US1) — after Phase 2

```
T015 [P], T016 [P], T017 [P], T018 [P]  (all in parallel)
    ↓
T019 (pdfGenerator, depends on T015)
T020 (convert route, depends on T016–T019)
T021 [P], T022 [P]  (hooks, in parallel)
    ↓
T023 [P], T024 [P]  (UI components, in parallel)
    ↓
T025 (ResultCard, depends on T021)
    ↓
T026 (HomePage, composes all components)
    ↓
T027 (App + main, depends on T026)
T028 [P], T029 [P]  (unit tests, in parallel with implementation)
    ↓
T030 (E2E, requires all US1 complete)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (**CRITICAL** — blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Upload a PDF, convert, download — end-to-end working
5. Demo / share

### Incremental Delivery

1. Setup + Foundational → monorepo installs and both servers start
2. US1 → full conversion works → **MVP**
3. US2 → errors handled gracefully
4. US3 → re-download convenience
5. Polish → mobile layout + coverage gate

---

## Notes

- `[P]` tasks target different files and have no shared write dependencies — safe to parallelise
- `[US*]` label maps each task to its user story for traceability
- Unit tests in `backend/tests/` and `frontend/tests/` should be committed alongside implementation
- E2E tests require both `pnpm dev` servers running before executing `pnpm test:e2e`
- Ollama must be running (`ollama serve`) for E2E tests and manual testing
- Commit after each phase checkpoint to keep diffs reviewable
