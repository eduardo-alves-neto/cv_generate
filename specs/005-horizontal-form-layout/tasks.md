# Tasks: Horizontal Form Layout

**Input**: Design documents from `/specs/005-horizontal-form-layout/`  
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, quickstart.md ✅

**Tests**: No new unit tests required — this is a pure layout/structural change with no new logic. Existing unit tests continue to cover validation and form behaviour. Manual viewport checks listed in Phase 3 (Polish).

**Organization**: Single user story (P1) — all implementation tasks belong to it.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1)
- Exact file paths are included in each description

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm the baseline and review every file that will be touched before making any change.

- [x] T001 Read and understand current `frontend/src/pages/HomePage.tsx` — note the hero `<header>`, `<HowItWorks />` usage, container `max-w-2xl`, and `ProgressSteps` placement
- [x] T002 Read and understand current `frontend/src/components/ConvertForm.tsx` — note the `flex flex-col gap-5` form structure and the order of the two field blocks (DropZone first, textarea second)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: No shared infrastructure to build. Proceed directly to Phase 3.

---

## Phase 3: User Story 1 — Two-Column Side-by-Side Form (Priority: P1) 🎯 MVP

**Goal**: Remove the hero header and "How it works" explainer from the page; restructure the form fields into a two-column side-by-side layout (job description on the left, PDF drop zone on the right) at viewports ≥ 640 px; stack vertically on mobile.

**Independent Test**: Open `http://localhost:5173` at 1280 px wide — the form is the first thing visible, job description textarea is on the left, PDF drop zone is on the right. At 375 px, they stack. No hero or explainer present.

### Implementation for User Story 1

- [x] T003 [US1] Update `frontend/src/pages/HomePage.tsx` — (a) remove the `<header>` block (the `<h1>` and tagline `<p>`); (b) remove the `<div className="mb-10"><HowItWorks /></div>` block; (c) remove the `import { HowItWorks }` line; (d) change the container class from `max-w-2xl` to `max-w-4xl`
- [x] T004 [US1] Update `frontend/src/components/ConvertForm.tsx` — restructure the form's internal layout: (a) wrap the Job Description `<div>` and the PDF Resume `<div>` in a new `<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">` container; (b) reorder so Job Description column comes first (left) and PDF Resume column comes second (right); (c) move the error alert, submit button, and privacy disclosure `<p>` outside the grid wrapper (they remain direct children of the `<form>` and span full width naturally); (d) remove the outer `gap-5` from the `<form>` itself and keep the remaining structure intact
- [x] T005 [P] [US1] Delete `frontend/src/components/HowItWorks.tsx` — verify no other file imports it before deleting (grep for `HowItWorks` in `frontend/src/`)

**Checkpoint**: User Story 1 is fully functional. No hero. No explainer. Two-column form visible at desktop. Stacked on mobile. All validation and conversion flow unaffected.

---

## Phase 4: Polish & Cross-Cutting Concerns

**Purpose**: Type safety verification, regression tests, and manual viewport validation.

- [x] T006 Run `cd frontend && pnpm typecheck` — confirm zero TypeScript errors after the changes
- [x] T007 [P] Run `pnpm test` — confirm all existing unit tests (29 frontend + 24 backend) continue to pass
- [ ] T008 [P] Manual viewport check — open `http://localhost:5173` (requires `pnpm dev`) and verify at 320 px, 640 px, 768 px, and 1280 px: no horizontal overflow, fields side by side at ≥ 640 px, stacked below 640 px, no hero or explainer present, submit works end-to-end

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 2 (Foundational)**: Empty
- **Phase 3 (US1)**: Depends on Phase 1 — T003 and T004 can run in parallel (different files); T005 must follow T003 (HomePage no longer imports HowItWorks)
- **Phase 4 (Polish)**: Depends on Phase 3 completion

### Within User Story 1

- T003 (HomePage.tsx) and T004 (ConvertForm.tsx) touch different files → **can run in parallel**
- T005 (delete HowItWorks.tsx) must follow T003 (verify no remaining import)
- T006 + T007 + T008 can all run in parallel after T003–T005

### Parallel Opportunities

```bash
# T003 and T004 are independent files — run together:
Task T003: Update frontend/src/pages/HomePage.tsx
Task T004: Update frontend/src/components/ConvertForm.tsx

# After T003+T004 complete:
Task T005: Delete frontend/src/components/HowItWorks.tsx

# After T005, all polish tasks run in parallel:
Task T006: pnpm typecheck
Task T007: pnpm test
Task T008: Manual browser check
```

---

## Implementation Strategy

### MVP First (complete feature = 3 implementation tasks)

1. Phase 1: T001, T002 (read existing files)
2. Phase 3: T003 + T004 in parallel, then T005
3. **STOP and VALIDATE**: open browser, confirm two-column layout visible, conversion works
4. Phase 4: T006 + T007 + T008

This feature has a single user story — there is no partial delivery. All three implementation tasks (T003, T004, T005) must complete together for the feature to be testable.

---

## Notes

- [P] tasks = different files or independent verification steps, safe to run concurrently
- T004 note: the `<form>` currently uses `flex flex-col gap-5` — after adding the grid wrapper for the two field columns, the form's own `gap-5` still provides spacing between the grid row and the rows below (error, submit, privacy). Keep `gap-5` on the form element.
- T005 note: after removing `HowItWorks` from `HomePage.tsx` in T003, confirm `grep -r "HowItWorks" frontend/src/` returns only the file itself before deleting.
- Commit after T005 (all implementation done), then after T006+T007 confirm clean.
