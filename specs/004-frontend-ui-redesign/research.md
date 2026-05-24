# Research: Frontend UI Redesign

**Phase**: 0 — Outline & Research  
**Branch**: `004-frontend-ui-redesign`  
**Date**: 2026-04-10

---

## Topic 1: Drag-and-Drop File Upload — Library vs. Native HTML5

**Decision**: Use native HTML5 drag-and-drop events (`onDragEnter`, `onDragOver`, `onDragLeave`, `onDrop`) combined with a hidden `<input type="file">` triggered by a click handler on the zone container.

**Rationale**:
- `react-dropzone` (the dominant library) is not in the existing dependency tree. Adding it would introduce ~20 KB (gzipped) for behaviour we can implement in ~60 lines of TypeScript.
- Constitution Principle III (Simplicity / YAGNI) explicitly requires that "new packages MUST be justified against an existing alternative already in the dependency tree." Native drag events are the existing alternative.
- Native implementation gives full control over styling states (idle, drag-over, error, success) via Tailwind class toggling.
- The `DataTransfer.files` API is supported in all modern browsers and can be unit-tested with `@testing-library/user-event`.

**Alternatives considered**:
- `react-dropzone` — rejected (new dependency, unnecessary complexity for single-file upload).
- `filepond` — rejected (heavy UI library, styling conflicts with Tailwind, new dependency).

---

## Topic 2: Progress Step Animation — Library vs. Tailwind CSS

**Decision**: Implement a step indicator using plain Tailwind CSS utilities: `transition-colors duration-300`, `animate-pulse` for the active step's icon, and a `✓` checkmark swap for completed steps. State is driven by a simple enum (`'pending' | 'active' | 'completed'`) stored in component state, advanced by `setTimeout` on a per-step schedule.

**Rationale**:
- `framer-motion` would provide smooth enter/exit animations but adds ~30 KB gzipped and is not in the dependency tree.
- Constitution Principle III forbids adding packages when an existing mechanism suffices.
- Tailwind transitions + opacity changes produce visually satisfying, smooth feedback without extra dependencies.
- The conversion is a black box (single synchronous response) — steps cannot reflect real server events. A time-based simulation (step advances every ~2 s) is honest about this and still dramatically reduces perceived wait time.

**Step schedule** (total budget ≤ 25 s, leaving 5 s headroom before the 30 s limit):
1. "Lendo seu currículo…" — shown immediately on submit
2. "Optimizando para ATS…" — advances after 3 s
3. "Gerando PDF…" — advances after 8 s
4. On API response (success or error) — overrides timer and transitions to final state

**Alternatives considered**:
- `framer-motion` — rejected (new dependency, overkill for 3 discrete states).
- CSS `@keyframes` in a global stylesheet — rejected (less maintainable than Tailwind utility classes in this project).

---

## Topic 3: shadcn/ui Component Availability

**Decision**: No new shadcn/ui components need to be scaffolded. The project does not have a `frontend/src/components/ui/` directory — it builds its own Tailwind-based primitives inline. This pattern continues unchanged.

**Rationale**:
- Inspecting `frontend/src/components/` confirms all existing components (ConvertForm, ResultCard, ProgressSpinner) are hand-rolled with Tailwind classes.
- The existing `clsx` + `tailwind-merge` + `@radix-ui/react-label` + `@radix-ui/react-slot` packages provide the primitives needed for any new interactive element.
- Adding shadcn CLI-generated components would create a `/ui/` directory inconsistent with the current file structure.

**Alternatives considered**:
- Running `npx shadcn-ui add` for a `Progress` or `Card` component — rejected (creates structural inconsistency; the project already works without the `/ui/` subdirectory).

---

## Topic 4: Lucide Icons for New Components

**Decision**: Use the following icons from the already-installed `lucide-react` package:

| Component | Icon | Purpose |
|-----------|------|---------|
| DropZone | `UploadCloud` | Upload prompt in idle state |
| DropZone | `FileCheck2` | Confirmation after file selected |
| DropZone | `XCircle` | Error state |
| ProgressSteps | `Loader2` | Active step (spinning animation) |
| ProgressSteps | `CheckCircle2` | Completed step |
| ProgressSteps | `Circle` | Pending step (muted) |
| HowItWorks | `Upload`, `Sparkles`, `FileDown` | Steps 1, 2, 3 |
| ResultCard | `CheckCircle2` | Success headline icon |

**Rationale**: All icons are available in lucide-react 0.309. No extra icons package needed.

---

## Topic 5: Privacy Notice (Constitution Requirement)

**Decision**: Add a single-line disclosure below the form: *"Your CV and job description are processed by Google Gemini AI. No data is stored."*

**Rationale**:
- Constitution Principle I states: *"Operators MUST disclose in the UI that content is processed by the configured AI provider."*
- The existing UI has no such disclosure — this is an open compliance gap. The redesign is the right moment to close it.
- A single-line `<p>` element below the submit button satisfies the principle without cluttering the form.

---

## All NEEDS CLARIFICATION items resolved

No `[NEEDS CLARIFICATION]` markers were present in the spec. All research topics above were identified proactively from constitution requirements and codebase inspection.
