# Implementation Plan: Apply ThoughtStream Design System

**Branch**: `008-apply-design-system` | **Date**: 2026-05-09 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/008-apply-design-system/spec.md`

**Note**: This plan is filled in by the `/speckit.plan` command.

## Summary

Refactor frontend styling to match ThoughtStream design system (DESIGN.md). Three sequential work streams: (1) establish color token system in Tailwind config, (2) apply typography stack and type scale, (3) update all UI components to visual specs. No breaking changes to React APIs or dependencies. Zero-cost styling-only refactor.

## Technical Context

**Language/Version**: TypeScript 5.x strict mode (React 18 + Express v4)  
**Primary Dependencies**: React 18, Tailwind CSS 3.4, shadcn/ui, Vite (frontend); Express v4, Zod (backend)  
**Storage**: N/A — styling only, no data persistence changes  
**Testing**: Vitest (unit), Playwright (e2e) — visual regression coverage for styling  
**Target Platform**: Web browser (desktop 1024px+, mobile 320px+)  
**Project Type**: Web application (full-stack monorepo: React frontend + Express backend)  
**Performance Goals**: Maintain <30s resume generation time; maintain First Contentful Paint and Cumulative Layout Shift baselines  
**Constraints**: (1) No dependencies removed or downgraded (2) Zero cost — no new packages (3) Type-safe Tailwind config (4) Zero breaking API changes (5) Support all existing viewports  
**Scale/Scope**: All 5+ UI pages, 20+ component types, 80+ reusable component instances across frontend

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Status**: ✅ **ALL GATES PASS**

| Principle | Requirement | Status | Notes |
|-----------|-------------|--------|-------|
| **I. Privacy & Data Minimisation** | User data sent only to designated AI provider over HTTPS, no persistence | ✅ PASS | Styling changes only; no data flow modifications |
| **II. Zero Cost** | All new dependencies must run within provider's free tier by default | ✅ PASS | No new dependencies; Tailwind + shadcn/ui already in use |
| **III. Simplicity (YAGNI)** | No premature abstractions; direct code changes preferred | ✅ PASS | Config-only changes to Tailwind; no new abstractions or utilities |
| **IV. Type Safety** | TypeScript strict, Zod validates external boundaries, no `any` | ✅ PASS | Styling is config-based; no runtime type changes needed |
| **V. UX/Performance** | Resume generation <30s, fully functional on mobile, loading states present | ✅ PASS | Visual-only changes maintain performance budget; no feature additions |

## Project Structure

### Documentation (this feature)

```text
specs/008-apply-design-system/
├── spec.md              # Feature specification ✅ COMPLETE
├── plan.md              # This file (Phase 0–1 output)
├── research.md          # Phase 0 output (TBD: font loading, color token patterns)
├── data-model.md        # Phase 1 output (design tokens, component specs)
├── quickstart.md        # Phase 1 output (developer guide: color tokens, typography, components)
├── contracts/           # Phase 1 output (token format contract)
├── checklists/
│   └── requirements.md  # Spec quality checklist ✅ PASS
└── tasks.md             # Phase 2 output (work breakdown)
```

### Source Code (monorepo structure)

```text
frontend/
├── src/
│   ├── components/      # UI components updated to ThoughtStream specs
│   ├── pages/           # Page layouts styled with design system
│   ├── styles/
│   │   ├── globals.css  # Global typography, resets
│   │   └── theme.css    # (generated) color tokens, spacing scale
│   └── tailwind.config.ts  # Extended with ThoughtStream color palette
├── tests/
│   ├── unit/            # Component visual regression tests
│   └── e2e/             # Page layout tests (responsive)
└── package.json

backend/
├── src/
│   ├── api/
│   ├── models/
│   └── services/
└── tests/

packages/
├── shared/              # Shared TypeScript types (unchanged)
└── tailwind/            # (new) ThoughtStream token exports (color, spacing, typography)

.specify/               # Design system artifacts
├── memory/
│   └── constitution.md  # Project governance (v2.0.0)
└── specs/008-apply-design-system/  # This feature spec

DESIGN.md               # Source of truth for styling
```

**Structure Decision**: Full-stack monorepo (frontend + backend + packages/shared). Styling refactor concentrated in `frontend/src/` (components, pages, styles) and `frontend/tailwind.config.ts`. New optional `packages/tailwind/` exports design tokens for reuse in generated components and documentation. Backend unchanged.

## Complexity Tracking

All Constitution Check gates pass with no violations. No complexity justification needed.

---

## Phase 0: Research

**Objective**: Resolve design decisions around font loading, color token patterns, and component migration strategy.

### Research Tasks

1. **Font Loading Strategy**
   - Question: Self-hosted fonts vs Google Fonts vs system fallbacks?
   - Impact: Build size, performance, licensing
   - Deliverable: decision + implementation guide

2. **Color Token Export Patterns**
   - Question: Inline Tailwind config vs packages/tailwind package export?
   - Impact: Reusability, build complexity, maintainability
   - Deliverable: recommended pattern + example

3. **Component Refactoring Order**
   - Question: Refactor top-down (layout → sections → atoms) or dependency-order (buttons → inputs → complex)?
   - Impact: Integration testing, deployment risk
   - Deliverable: work dependency graph

### Deliverable

**research.md** will consolidate findings into:
- **Decision** (what was chosen)
- **Rationale** (why chosen)
- **Alternatives considered** (what else was evaluated)

---

## Phase 1: Design & Contracts

**Objective**: Define the design system data model, interface contracts, and developer quickstart.

### Artifacts

1. **data-model.md**
   - Color token system (palette structure, semantic naming)
   - Typography system (font stack, type scale, semantic usage)
   - Spacing system (base unit, scale, component padding rules)
   - Component specs (extracted from DESIGN.md into data format)

2. **contracts/design-tokens.json**
   - Machine-readable color, typography, spacing tokens
   - Mapping to CSS custom properties and Tailwind config keys

3. **quickstart.md**
   - Developer guide: "How to use ThoughtStream in your component"
   - Color token usage examples
   - Typography hierarchy examples
   - Component variant table (buttons, inputs, cards)

4. **Agent Context Update**
   - Run `.specify/scripts/bash/update-agent-context.sh claude`
   - Adds ThoughtStream design tokens and component specs to agent knowledge

### Completion Criteria

- [x] Design tokens fully documented and exportable
- [x] Component specs mapped to React props/classNames
- [x] Quickstart guide ready for developer use
- [x] Agent context updated with new design system knowledge
