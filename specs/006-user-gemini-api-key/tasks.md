# Tasks: User-Provided Gemini API Key

**Input**: Design documents from `/specs/006-user-gemini-api-key/`  
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅, quickstart.md ✅

**Tests**: No test tasks generated — the specification does not request TDD or explicit test authoring.

**Organization**: Tasks grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)

---

## Phase 1: Setup

**Purpose**: Mark the GEMINI_API_KEY environment variable as deprecated so the project documents the transition before any code changes.

- [x] T001 Mark `GEMINI_API_KEY` as deprecated in `backend/.env.example` with a comment explaining it is no longer required and that users now supply their own key through the UI

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared schema update + backend wiring so that the API key travels per-request. ALL user story phases depend on this.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T002 Add `geminiApiKey: z.string().min(1, 'API key is required')` to `ConvertRequestBodySchema` in `packages/shared/src/schemas.ts`
- [x] T003 [P] Refactor `generateATSContent` in `backend/src/services/geminiClient.ts` to accept an `apiKey: string` parameter; remove the `process.env.GEMINI_API_KEY` call from `getClient()`; update internal error messages to say "A chave da API Gemini está inválida. Insira sua chave na interface." instead of referencing `.env`
- [x] T004 Update `backend/src/routes/convert.ts` to destructure `geminiApiKey` from `parsed.data` and pass it as the third argument to `generateATSContent(cvText, jobDescription, geminiApiKey)` (depends on T002, T003)

**Checkpoint**: Backend compiles and accepts `geminiApiKey` in the multipart body. Requests without it receive `AI_UNAVAILABLE`.

---

## Phase 3: User Story 1 — Key Input Gate (Priority: P1) 🎯 MVP

**Goal**: Block the conversion form until the user provides an API key; accept the key and immediately allow conversion.

**Independent Test**: Open the app without a stored key → conversion button is disabled and `ApiKeySetup` is visible → enter a valid key → click "Salvar chave" → conversion form becomes available → complete a conversion successfully.

- [x] T005 [P] [US1] Create `frontend/src/hooks/useApiKey.ts` — export `useApiKey()` hook that holds the key in React state (`useState<string | null>(null)`), exposing `{ apiKey, setApiKey, clearApiKey }`
- [x] T006 [P] [US1] Create `frontend/src/components/ApiKeySetup.tsx` — renders a labelled text input for the Gemini API key, a "Salvar chave" button (calls `setApiKey` with trimmed value), and a "Remover chave" link (calls `clearApiKey`); displays a validation error if the user clicks save with an empty field; tutorial section left as an empty `<div id="tutorial-placeholder" />` for US2
- [x] T007 [US1] Update `frontend/src/hooks/useConvert.ts` — append `geminiApiKey` from the hook to the `FormData` sent to `POST /api/convert` (depends on T005)
- [x] T008 [US1] Update `frontend/src/components/ConvertForm.tsx` — instantiate `useApiKey()`; if `apiKey` is `null`, render `<ApiKeySetup>` in place of the form fields and disable the submit button; update the `AI_UNAVAILABLE` entry in `ERROR_MESSAGES` to `'Chave da API Gemini inválida ou com quota esgotada. Verifique sua chave na seção acima.'` (depends on T005, T006, T007)

**Checkpoint**: US1 is fully functional — the app gates on the key and conversion works end-to-end.

---

## Phase 4: User Story 2 — In-App Tutorial (Priority: P2)

**Goal**: Provide an in-app, pt-BR tutorial with step-by-step instructions for obtaining a Gemini API key from Google AI Studio.

**Independent Test**: Open the app without a stored key → click "Como obter minha chave?" → tutorial expands showing all 6 steps → each step is accurate and the external link opens Google AI Studio in a new tab.

- [x] T009 [P] [US2] Replace the `<div id="tutorial-placeholder" />` in `frontend/src/components/ApiKeySetup.tsx` with a collapsible tutorial section: a "Como obter minha chave?" toggle button (managed by a `useState<boolean>` for open/closed); when open, render the 6 pt-BR steps from `research.md` Decision 6 as an ordered list; include a `<a href="https://aistudio.google.com" target="_blank" rel="noopener noreferrer">` link in step 1
- [x] T010 [P] [US2] Ensure the tutorial toggle is closed by default (`useState(false)`) and that its open/closed state is independent of the key input state so the form can be saved without closing the tutorial

**Checkpoint**: US1 + US2 both work independently — new users can read the tutorial and returning users never see it expanded.

---

## Phase 5: User Story 3 — Session Persistence (Priority: P3)

**Goal**: Pre-populate the API key field from `localStorage` so returning users reach the conversion form immediately without re-entering their key.

**Independent Test**: Enter a valid key → refresh the page → the conversion form is available immediately (no `ApiKeySetup` visible) → clear the key → refresh → `ApiKeySetup` appears again.

- [x] T011 [US3] Update `frontend/src/hooks/useApiKey.ts` — initialize `useState` from `localStorage.getItem('cv_ats_gemini_api_key') ?? null`; call `localStorage.setItem(...)` inside `setApiKey`; call `localStorage.removeItem(...)` inside `clearApiKey` (depends on T005)

**Checkpoint**: All three user stories work independently and together.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final verification, documentation alignment, and TypeScript compilation check.

- [x] T012 [P] Run `pnpm build` from the monorepo root and fix any TypeScript strict-mode errors introduced by the schema and signature changes across `packages/shared`, `backend`, and `frontend`
- [x] T013 [P] Update the "Key Architecture Decisions" section in `CLAUDE.md` to replace `requires GEMINI_API_KEY in backend/.env` with `users supply their own Gemini API key via the UI; no operator key required`
- [ ] T014 Perform a manual golden-path test per `specs/006-user-gemini-api-key/quickstart.md`: open the app without a stored key → view setup screen → expand tutorial → follow steps → paste a real key → save → convert a PDF → verify the ATS PDF downloads correctly

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 — **BLOCKS all user story phases**
- **US1 (Phase 3)**: Depends on Foundational phase completion
- **US2 (Phase 4)**: Depends on Phase 3 (T006 must exist for tutorial to be added into it)
- **US3 (Phase 5)**: Depends on Phase 3 (T005 must exist to be updated)
- **Polish (Phase 6)**: Depends on all user story phases being complete

### User Story Dependencies

- **US1 (P1)**: Must be complete first — gates the entire UI
- **US2 (P2)**: Extends `ApiKeySetup.tsx` created in US1; independent of US3
- **US3 (P3)**: Updates `useApiKey.ts` created in US1; independent of US2
- **US2 and US3 can proceed in parallel** once US1 is done

### Within Each Phase

- T003 and T005/T006 are parallelizable (different files)
- T002 must complete before T004 (schema must exist before route reads from it)
- T005 and T006 must complete before T007, T008 (hook and component exist before wiring)

---

## Parallel Execution Examples

### Foundational Phase (Phase 2)

```
Parallel: T003 (geminiClient.ts refactor)
Then:     T002 (shared schema — needed before T004)
Then:     T004 (route wiring — needs T002 + T003)
```

### User Story 1 (Phase 3)

```
Parallel: T005 (useApiKey hook)  +  T006 (ApiKeySetup component)
Then:     T007 (useConvert — needs T005)
Then:     T008 (ConvertForm wiring — needs T005, T006, T007)
```

### User Story 2 + 3 (Phases 4–5, after US1)

```
Parallel: T009 (tutorial content in ApiKeySetup)
          T010 (tutorial toggle state)
          T011 (localStorage persistence in useApiKey)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001)
2. Complete Phase 2: Foundational (T002–T004)
3. Complete Phase 3: User Story 1 (T005–T008)
4. **STOP and VALIDATE**: Test that entering a key enables conversion end-to-end
5. Demo or continue to US2/US3

### Incremental Delivery

1. Phase 1–3 → MVP: key-gated conversion works (no persistence, no tutorial)
2. Add Phase 4 → Users can follow the in-app tutorial
3. Add Phase 5 → Returning users skip setup on reload
4. Phase 6 → Final verification and cleanup

---

## Notes

- [P] tasks operate on different files with no dependency on incomplete tasks in the same phase
- [Story] label maps each task to the user story it fulfills for traceability
- Each user story is independently completable and testable as described in its checkpoint
- `localStorage` key name: `cv_ats_gemini_api_key` (defined in data-model.md)
- Commit after each checkpoint to keep history clean
- The backend never logs the `geminiApiKey` value — enforce this in T003 code review
