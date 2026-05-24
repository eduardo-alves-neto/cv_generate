# Implementation Plan: Frontend UI Redesign

**Branch**: `004-frontend-ui-redesign` | **Date**: 2026-04-10 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/004-frontend-ui-redesign/spec.md`

## Summary

Replace the minimal single-card interface with a polished, multi-component layout featuring a drag-and-drop upload zone, a named step-by-step progress indicator, a branded hero header with a "How it works" explainer, and a redesigned success screen. All existing backend integration and validation logic is preserved without modification; only the frontend view layer changes.

## Technical Context

**Language/Version**: TypeScript 5.3 strict — React 18.2 (browser)  
**Primary Dependencies**: Tailwind CSS 3.4, shadcn/ui primitives (hand-rolled via clsx + tailwind-merge), lucide-react 0.309, TanStack React Query 5, Axios  
**Storage**: N/A — in-memory React state only; no persistence  
**Testing**: Vitest 1.3 (unit) + Playwright (E2E, existing suite)  
**Target Platform**: Browser — desktop (≥ 768 px) and mobile (≥ 320 px)  
**Project Type**: Web application — frontend only changes  
**Performance Goals**: No new async operations; same 30-second end-to-end budget applies  
**Constraints**: Must not break existing POST `/api/convert` integration; no new runtime dependencies permitted without constitution justification  
**Scale/Scope**: Single-user local tool; no concurrent-user targets for this feature

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| # | Principle | Status | Notes |
|---|-----------|--------|-------|
| 1 | **Privacy & Data Minimisation** | ✅ PASS | Pure UI change — no new data flows, no external calls from the frontend. The existing backend proxy remains the only AI gateway. |
| 2 | **Zero Cost** | ✅ PASS | All changes use browser-native APIs (HTML5 drag events, CSS transitions) and existing packages (lucide-react, Tailwind). No new paid or free-tier cloud services. |
| 3 | **Simplicity (YAGNI)** | ✅ PASS | Native drag events replace react-dropzone (avoiding a new dependency). Tailwind `transition-all` + `animate-pulse` replace framer-motion. Each new component solves a concrete, present problem. |
| 4 | **Type Safety** | ✅ PASS | No new external data boundaries. All new component props use explicit TypeScript interfaces; no `any` types needed. |
| 5 | **UX/Performance** | ✅ PASS | Feature improves perceived performance (named progress steps reduce wait anxiety) without adding latency. 30-second budget is unchanged. |

**Post-Phase 1 re-check**: All gates still pass — see Phase 1 design confirms no data-model or contract changes.

## Project Structure

### Documentation (this feature)

```text
specs/004-frontend-ui-redesign/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output (N/A — no new entities)
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks — NOT created here)
```

### Source Code (repository root)

```text
frontend/
├── src/
│   ├── components/
│   │   ├── DropZone.tsx          # NEW — drag-and-drop + click-to-browse file upload
│   │   ├── ProgressSteps.tsx     # NEW — replaces ProgressSpinner with named steps
│   │   ├── HowItWorks.tsx        # NEW — 3-step explainer for hero header
│   │   ├── ConvertForm.tsx       # MODIFIED — swap <input type="file"> for <DropZone>
│   │   ├── ResultCard.tsx        # MODIFIED — polished success screen layout
│   │   └── ProgressSpinner.tsx   # DELETED (replaced by ProgressSteps)
│   └── pages/
│       └── HomePage.tsx          # MODIFIED — branded hero header + layout update
└── src/__tests__/
    ├── DropZone.test.tsx          # NEW — unit tests for drag-and-drop
    └── ProgressSteps.test.tsx     # NEW — unit tests for step indicator
```

**Structure Decision**: Web application, Option 2. All changes are confined to `frontend/src/`. No backend files change. No new top-level directories.

## Complexity Tracking

No constitution violations — section left intentionally blank.
