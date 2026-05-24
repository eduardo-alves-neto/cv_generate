# Implementation Plan: Horizontal Form Layout

**Branch**: `005-horizontal-form-layout` | **Date**: 2026-04-11 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/005-horizontal-form-layout/spec.md`

## Summary

Remove the hero header and "How it works" sections from the page. Restructure the form so the job description textarea occupies the left column and the PDF drop zone occupies the right column on viewports ≥ 768 px, stacking vertically on mobile. The submit button, error display, progress indicator, and privacy disclosure remain full-width below the columns. Two files are modified; one component is deleted.

## Technical Context

**Language/Version**: TypeScript 5.3 strict — React 18.2 (browser)  
**Primary Dependencies**: Tailwind CSS 3.4 (CSS Grid utilities), existing lucide-react + clsx  
**Storage**: N/A — no data changes  
**Testing**: Vitest 1.3 (unit) + Playwright (E2E, existing suite)  
**Target Platform**: Browser — desktop (≥ 768 px) and mobile (≥ 320 px)  
**Project Type**: Web application — frontend layout change only  
**Performance Goals**: N/A — pure CSS layout; no new async operations  
**Constraints**: No new runtime dependencies; no changes to form logic, validation, or API calls  
**Scale/Scope**: Single-page layout refactor; 2 modified files, 1 deleted file

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| # | Principle | Status | Notes |
|---|-----------|--------|-------|
| 1 | **Privacy & Data Minimisation** | ✅ PASS | Pure layout change — no new data flows or external calls. |
| 2 | **Zero Cost** | ✅ PASS | Tailwind CSS Grid utilities are already in the dependency tree. No new packages. |
| 3 | **Simplicity (YAGNI)** | ✅ PASS | CSS Grid with `sm:grid-cols-2` is the minimal correct tool. `HowItWorks.tsx` is deleted rather than left as dead code. |
| 4 | **Type Safety** | ✅ PASS | No new external data boundaries. All changes are JSX structure and className strings. |
| 5 | **UX/Performance** | ✅ PASS | Removes vertical scroll before the form (immediate value). No new async operations. |

**Post-Phase 1 re-check**: All gates still pass — no data model, no contracts.

## Project Structure

### Documentation (this feature)

```text
specs/005-horizontal-form-layout/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks — NOT created here)
```

### Source Code (repository root)

```text
frontend/
└── src/
    ├── components/
    │   ├── ConvertForm.tsx      # MODIFIED — two-column grid layout (fields side by side)
    │   └── HowItWorks.tsx       # DELETED — removed from page; component has no other uses
    └── pages/
        └── HomePage.tsx         # MODIFIED — remove hero header + HowItWorks; widen container
```

**Structure Decision**: Web application (Option 2). All changes confined to `frontend/src/`. No backend files change. No new top-level directories.

## Complexity Tracking

No constitution violations — section left intentionally blank.
