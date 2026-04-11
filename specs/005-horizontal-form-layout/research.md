# Research: Horizontal Form Layout

**Phase**: 0 — Outline & Research  
**Branch**: `005-horizontal-form-layout`  
**Date**: 2026-04-11

---

## Topic 1: Two-Column Equal-Height Layout Strategy

**Decision**: Use CSS Grid (`grid grid-cols-1 sm:grid-cols-2`) on the fields wrapper inside `ConvertForm.tsx`. The two field columns are grid items; error display, submit button, and privacy notice use `sm:col-span-2` to span the full width below.

**Rationale**:
- CSS Grid's default `align-items: stretch` gives both columns identical height automatically, even when one column (the textarea) grows taller than the other (the drop zone). No explicit height matching or JavaScript needed.
- `sm:grid-cols-2` (breakpoint at 640 px) provides the two-column layout on all viewports ≥ 640 px. The spec requires ≥ 768 px, so 640 px is a safe conservative choice that gives a little extra room.
- Tailwind Grid utilities are already in the dependency tree — no new packages.

**Alternatives considered**:
- `flex flex-row` — rejected: flexbox does not stretch sibling items to equal height by default without extra class manipulation.
- CSS Columns (`columns-2`) — rejected: designed for flowing text, not form fields.
- Separate component for each column — rejected: unnecessary abstraction for a layout-only change (Constitution Principle III).

---

## Topic 2: Container Width Adjustment

**Decision**: Widen the `HomePage` container from `max-w-2xl` (672 px) to `max-w-4xl` (896 px). Keep the same horizontal padding (`px-4`) and gradient background.

**Rationale**:
- `max-w-2xl` at 672 px leaves each column at roughly 316 px after gap. That is tight for a textarea + a drop zone with comfortable padding.
- `max-w-4xl` at 896 px gives each column ~428 px — spacious enough for both the textarea and the drop zone to breathe at desktop widths.
- `max-w-5xl` (1024 px) was considered but is unnecessarily wide for a two-field form on typical 1280 px monitors, leaving too much empty space on the sides.

**Alternatives considered**:
- `max-w-3xl` (768 px) — each column would be ~364 px, adequate but a bit tight for the drop zone's icon and text.
- `max-w-5xl` — rejected for the reason above.

---

## Topic 3: Hero Header — Remove Entirely vs. Compact Title

**Decision**: Remove the full hero header block (the `<header>` element with `h1` and `<p>` tagline). Replace with nothing — the form card is the first element on the page.

**Rationale**:
- The spec (FR-004, FR-005) is explicit: both the hero header and the "How it works" sections MUST be removed.
- The spec assumption states a compact page identifier "may be kept" but is optional. Given the user's explicit request that the top information is unnecessary, removing everything is the correct default.
- The browser tab title (`<title>`) already identifies the page; no additional on-page heading is required for a single-page tool.

**Alternatives considered**:
- Keep a compact `h1` (14–16 px, no tagline) — acceptable per spec assumption, but contradicts the user's stated intent ("as informações do topo não são necessárias"). Rejected.

---

## Topic 4: `HowItWorks.tsx` Disposal

**Decision**: Delete `frontend/src/components/HowItWorks.tsx`. Remove the import from `HomePage.tsx`.

**Rationale**:
- The component is used in exactly one place (`HomePage.tsx`) which is being modified to not use it.
- Constitution Principle III: "Abstractions…MUST solve a present problem." A component with zero callers is dead code.
- Deleting it avoids future confusion and keeps the component directory clean.

---

## Topic 5: Background Gradient

**Decision**: Keep the existing `bg-gradient-to-b from-primary/5 to-background` gradient on the `<main>` element. It applies to the full page and does not depend on the header being present.

**Rationale**: The gradient is subtle and applies to the entire page background regardless of content. Removing it would be an unnecessary cosmetic change outside the scope of this feature.

---

## All NEEDS CLARIFICATION items resolved

No clarification markers were present in the spec. All decisions above were derived from the spec requirements and the existing codebase.
