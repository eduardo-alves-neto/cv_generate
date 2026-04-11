# Tasks: Frontend UI Redesign

**Input**: Design documents from `/specs/004-frontend-ui-redesign/`  
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, quickstart.md ✅

**Tests**: Unit tests included for DropZone and ProgressSteps, as specified in plan.md `src/__tests__/`.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1–US4)
- Exact file paths are included in each description

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm the development environment and baseline before touching any source file.

- [x] T001 Verify `pnpm dev` starts cleanly (frontend :5173 + backend :3001) and the existing convert flow works end-to-end
- [x] T002 Read and understand the props/state of all files that will change: `frontend/src/pages/HomePage.tsx`, `frontend/src/components/ConvertForm.tsx`, `frontend/src/components/ResultCard.tsx`, `frontend/src/components/ProgressSpinner.tsx`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: There is no shared infrastructure to build — all user stories operate on independent files. This phase is therefore empty. Proceed directly to Phase 3.

**Checkpoint**: Foundation ready — all four user stories can be worked on sequentially or in parallel.

---

## Phase 3: User Story 1 — Drag-and-Drop File Upload (Priority: P1) 🎯 MVP

**Goal**: Replace the native `<input type="file">` with a visual drop zone that supports drag-and-drop and click-to-browse, provides clear visual feedback, and validates the file before selecting it.

**Independent Test**: Open the app, drag a PDF onto the drop zone → file name and size appear. Drag a non-PDF → inline error. Click the zone → native picker opens. Submit the form → conversion works as before.

### Implementation for User Story 1

- [x] T003 [US1] Create `frontend/src/components/DropZone.tsx` — implement the full component with `idle`, `drag-over`, `selected`, and `error` visual states, using native `onDragEnter/onDragOver/onDragLeave/onDrop` events and a hidden `<input type="file">` triggered on click (props: `onFileSelect`, `onFileError`, `selectedFile`, `disabled?` — see quickstart.md for exact interface)
- [x] T004 [US1] Update `frontend/src/components/ConvertForm.tsx` — remove the `<input type="file">` block and the `fileInputRef`, replace with `<DropZone selectedFile={selectedFile} onFileSelect={setSelectedFile} onFileError={setClientError} disabled={isPending} />`, and keep all existing validation logic intact
- [x] T005 [P] [US1] Write unit tests in `frontend/tests/components/DropZone.test.tsx` — cover: idle render, dragover highlight, valid PDF drop calls `onFileSelect`, non-PDF drop calls `onFileError`, file exceeding 10 MB calls `onFileError`, disabled state blocks interaction, click triggers file input

**Checkpoint**: User Story 1 is fully functional. The drop zone renders, drag-and-drop works, click-to-browse works, validation rejects non-PDF and oversized files, and form submission still calls the backend correctly.

---

## Phase 4: User Story 2 — Animated Progress Feedback (Priority: P2)

**Goal**: Replace the generic spinner with a 3-step named progress indicator that advances on a time-based schedule and resolves to a success or error state when the API responds.

**Independent Test**: Submit the form with a valid file + job description → 3 labelled stages appear and light up in sequence. When the API responds, all stages show ✓ (success) or the active stage shows ✗ (error).

### Implementation for User Story 2

- [x] T006 [US2] Create `frontend/src/components/ProgressSteps.tsx` — implement 3 static stages ("Lendo seu currículo…", "Optimizando para ATS…", "Gerando PDF…") with `pending`, `active`, and `completed` visual states driven by `setTimeout` (0 ms → 3 000 ms → 8 000 ms); accept props `isActive: boolean` and `hasError: boolean`; use `lucide-react` `Loader2` (spinning, active), `CheckCircle2` (completed), `Circle` (pending), `XCircle` (error) icons
- [x] T007 [US2] Update `frontend/src/pages/HomePage.tsx` — replace `<ProgressSpinner isPending={stage === 'pending'} />` with `<ProgressSteps isActive={stage === 'pending'} hasError={stage === 'error'} />`; render the steps outside the form card so they are visible above the fold on mobile
- [x] T008 [US2] Delete `frontend/src/components/ProgressSpinner.tsx` — component is fully superseded by ProgressSteps; ensure no other file imports it before deleting
- [x] T009 [P] [US2] Write unit tests in `frontend/tests/components/ProgressSteps.test.tsx` — cover: all 3 steps render in pending state when `isActive=false`; step 1 becomes active immediately when `isActive` flips to true; step 2 activates after 3 s (use fake timers); step 3 activates after 8 s; `hasError=true` shows error icon on the active step; `isActive` returning to false with no error marks all steps completed

**Checkpoint**: User Story 2 is fully functional. The spinner is gone. The 3-step indicator animates during conversion and resolves cleanly on success and error.

---

## Phase 5: User Story 3 — Polished Hero Header and Branding (Priority: P3)

**Goal**: Add a visually prominent branded header with tagline and a 3-step "How it works" explainer visible on every page load, above the form.

**Independent Test**: Load the page at desktop (1280 px) and mobile (375 px) widths. The product name, tagline, and 3 how-it-works steps with icons are all visible without scrolling at desktop; they stack vertically without overflow at mobile.

### Implementation for User Story 3

- [x] T010 [P] [US3] Create `frontend/src/components/HowItWorks.tsx` — render 3 static steps: (1) "Upload" with `Upload` icon, (2) "Gemini AI rewrites it for ATS" with `Sparkles` icon, (3) "Download your PDF" with `FileDown` icon; use a horizontal flex layout at `sm:` breakpoint, stacked column on mobile; all icons from `lucide-react`
- [x] T011 [US3] Update `frontend/src/pages/HomePage.tsx` — expand the `<header>` section: increase heading size to `text-4xl sm:text-5xl`, add a subtitle paragraph, apply a subtle background gradient (`bg-gradient-to-b from-primary/5 to-background`), and render `<HowItWorks />` between the header and the form card; adjust container max-width from `max-w-xl` to `max-w-2xl` to accommodate the wider how-it-works layout

**Checkpoint**: User Story 3 is fully functional. The branded header and 3-step explainer appear on every load, are legible at 320 px, and do not obscure the form.

---

## Phase 6: User Story 4 — Success Screen Redesign (Priority: P4)

**Goal**: Replace the minimal success card with a polished layout featuring a prominent download CTA, a success icon, improved copy, and a clearly visible "Convert another CV" action.

**Independent Test**: Complete a full conversion and verify the success screen shows a `CheckCircle2` icon, the download button is prominent and functional, and "Convert another CV" fully resets the interface.

### Implementation for User Story 4

- [x] T012 [US4] Update `frontend/src/components/ResultCard.tsx` — add a `CheckCircle2` icon (green, 48 px) above the headline; change headline to "Currículo ATS pronto!"; replace the two download anchor tags with a single primary download button and remove the duplicate "Download Again" anchor (one download link is sufficient per Constitution Principle III — Simplicity); make "Convert another CV" a more prominent text button with underline on hover; add a short bullet list of what was improved (3 static tips, e.g. "Palavras-chave alinhadas com a vaga", "Formatação compatível com scanners ATS", "Seções padronizadas para recrutadores")

**Checkpoint**: User Story 4 is fully functional. The success screen is polished, the download works, and the reset flow is clean.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Constitution compliance, mobile validation, and regression verification across all stories.

- [x] T013 Add the privacy disclosure line to `frontend/src/components/ConvertForm.tsx` — insert `<p className="text-xs text-muted-foreground text-center">Seu currículo e a vaga são processados pelo Google Gemini AI. Nenhum dado é armazenado.</p>` below the submit button (required by Constitution Principle I)
- [ ] T014 [P] Manual responsive check — pending manual browser validation — open `http://localhost:5173` and test at 320 px, 375 px, 768 px, and 1280 px viewports: no horizontal overflow, all text legible, drop zone usable, progress steps visible, how-it-works steps stack correctly
- [x] T015 [P] Run `pnpm test` (Vitest) and confirm all new and existing unit tests pass; run `cd frontend && pnpm typecheck` and confirm zero TypeScript errors
- [ ] T016 Run `pnpm test:e2e` (Playwright) against the running dev server and confirm all existing E2E scenarios still pass (regression check)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 2 (Foundational)**: Empty — no blocking work
- **Phase 3 (US1)**: Depends on Phase 1 only — can start right after setup
- **Phase 4 (US2)**: Depends on Phase 1; can start in parallel with US1 since it touches different files
- **Phase 5 (US3)**: Depends on Phase 1; touches `HomePage.tsx` — sequence **after Phase 4** to avoid merge conflicts on the same file
- **Phase 6 (US4)**: Depends on Phase 1 only — `ResultCard.tsx` is independent; can run in parallel with US1/US2
- **Phase 7 (Polish)**: Depends on all user story phases completing

### User Story Dependencies

- **US1 (P1)**: No dependency on other stories — `DropZone.tsx` and `ConvertForm.tsx` are independent
- **US2 (P2)**: No dependency on US1 technically, but `HomePage.tsx` is shared with US3 — sequence US2 before US3
- **US3 (P3)**: **Must follow US2** to avoid conflicts on `HomePage.tsx`; `HowItWorks.tsx` itself can be created in parallel
- **US4 (P4)**: No dependency on any other story — `ResultCard.tsx` is untouched by other phases

### Within Each User Story

- New component file → integration into parent component
- Unit tests can be written in parallel with the component they test (different files)

### Parallel Opportunities

- T003 + T006 + T010 + T012: All create new files in `frontend/src/components/` — fully parallelisable
- T005 + T009: Unit test files for DropZone and ProgressSteps — can be written in parallel
- T014 + T015: Manual viewport check and automated tests — independent; run together after all implementation completes

---

## Parallel Example: User Story 1

```bash
# Two tasks that can start at the same time:
Task T003: Create DropZone.tsx (new file)
Task T005: Write DropZone.test.tsx (new file, different path)

# T004 waits for T003:
Task T004: Update ConvertForm.tsx to use <DropZone>
```

## Parallel Example: Multi-story

```bash
# All three can start in parallel after T001+T002:
Task T003: DropZone.tsx          (US1 — new file)
Task T006: ProgressSteps.tsx     (US2 — new file)
Task T012: ResultCard.tsx update (US4 — independent file)

# T010 also parallelisable:
Task T010: HowItWorks.tsx        (US3 — new file, created independently)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001–T002)
2. Complete Phase 3: US1 (T003–T005)
3. **STOP and VALIDATE**: drag-and-drop works, click-to-browse works, form submits, conversion returns PDF
4. Ship US1 if deadline requires it — the app is already meaningfully better

### Incremental Delivery

1. Setup (T001–T002) → baseline confirmed
2. US1 (T003–T005) → drag-and-drop live ✅
3. US2 (T006–T009) → progress steps live ✅
4. US3 (T010–T011) → branded header live ✅
5. US4 (T012) → polished success screen live ✅
6. Polish (T013–T016) → compliance + regression clean ✅

---

## Notes

- [P] tasks = different files, no shared state dependencies — safe to run concurrently
- Commit after each phase checkpoint (or after each task if preferred)
- `ProgressSpinner.tsx` deletion (T008) must happen **after** T007 confirms `HomePage.tsx` no longer imports it
- `HomePage.tsx` is modified in both Phase 4 (T007) and Phase 5 (T011) — complete Phase 4 fully before starting Phase 5 to avoid conflicts
- Privacy disclosure (T013) is a Constitution requirement — do not skip it
- Run `pnpm typecheck` before marking any phase complete
