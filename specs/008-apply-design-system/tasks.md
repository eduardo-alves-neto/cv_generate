# Tasks: Apply ThoughtStream Design System

**Input**: Design documents from `/specs/008-apply-design-system/`  
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, quickstart.md ✅

**Organization**: Tasks grouped by user story. Each story independently implementable and testable. No tests requested — focus on implementation.

**MVP Scope**: Complete Phase 3 (User Story 1: Color System) to have working design system foundation.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize Tailwind config structure and prepare frontend for design system

- [X] T001 Create `frontend/src/styles/` directory structure (globals.css, theme.css)
- [X] T002 Update `frontend/tailwind.config.ts` to extend theme with ThoughtStream colors, spacing, border radius
- [X] T003 Create `frontend/src/tailwind/` directory for token exports (future use)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core styling infrastructure — fonts, typography utilities, global CSS

**⚠️ CRITICAL**: Must complete before any user story styling work

- [X] T004 [P] Add Google Fonts import to `frontend/src/index.css` (Libre Baskerville, Inter, Source Code Pro)
- [X] T005 [P] Add global typography utilities to `frontend/src/index.css` (.ts-display, .ts-headline, .ts-body-sm, .ts-code, etc.)
- [X] T006 [P] Configure Tailwind `fontFamily` in `frontend/tailwind.config.ts` (serif, sans, mono stacks with fallbacks)
- [X] T007 [P] Configure Tailwind `spacing` scale in `frontend/tailwind.config.ts` (12px base unit: 0, 12px, 24px, 36px, ..., 120px)
- [X] T008 [P] Configure Tailwind `borderRadius` in `frontend/tailwind.config.ts` (0px default, 9999px full for avatars)
- [X] T009 [P] Remove default box-shadow from Tailwind (set shadow to none globally)
- [X] T010 Verify foundation — typography renders correctly in `frontend/src/App.tsx` header

**Checkpoint**: Foundation complete — all subsequent work can proceed in parallel

---

## Phase 3: User Story 1 - Color System Foundation (Priority: P1) 🎯 MVP

**Goal**: All UI elements use ThoughtStream color tokens. Colors available as Tailwind utilities throughout the app.

**Independent Test**: Load any page, inspect computed styles on buttons/inputs/text — all use ThoughtStream hex values (not arbitrary colors). Verify Tailwind classes like `bg-primary`, `text-text-primary`, `border-border-subtle` are available and render correct colors.

### Implementation for User Story 1

- [X] T011 [P] [US1] Update `frontend/tailwind.config.ts` colors.brand (primary #78716C, secondary #A8A29E, tertiary #1C1917)
- [X] T012 [P] [US1] Update `frontend/tailwind.config.ts` colors.surface (background #FAFAF9, surface #F5F5F4, surface-raised #EFEDEB)
- [X] T013 [P] [US1] Update `frontend/tailwind.config.ts` colors.content (text-primary #1C1917, text-secondary #57534E, text-tertiary #A8A29E)
- [X] T014 [P] [US1] Update `frontend/tailwind.config.ts` colors.border (border-subtle #E7E5E4, border-medium #D6D3D1, border-strong #A8A29E)
- [X] T015 [P] [US1] Update `frontend/tailwind.config.ts` colors.semantic (success #65A30D, warning #CA8A04, error #DC2626, info #78716C)
- [X] T016 [US1] Verify all color tokens resolve correctly — `pnpm build` passes ✅
- [X] T017 [P] [US1] Update page layouts to use color tokens in `frontend/src/pages/HomePage.tsx` (removed gradient, updated colors)
- [X] T018 [P] [US1] Update form page styling with color tokens in `frontend/src/components/ConvertForm.tsx`
- [X] T019 [P] [US1] Update results card styling with color tokens in `frontend/src/components/ResultCard.tsx`
- [ ] T020 [US1] Test color compliance: Open pages in browser, visual comparison with DESIGN.md color specs

**Checkpoint**: Color system complete — all subsequent work can proceed in parallel

---

## Phase 4: User Story 2 - Typography System (Priority: P2)

**Goal**: All text uses ThoughtStream typography scale. Headlines in Libre Baskerville, body in Inter, code in Source Code Pro. Correct sizes, weights, line heights throughout.

**Independent Test**: Load any page with text, inspect fonts — headings use Libre Baskerville 30px/700, body uses Inter 17px/400 with 1.8 line-height, code uses Source Code Pro. All text hierarchy matches DESIGN.md type scale.

### Implementation for User Story 2

- [X] T021 [P] [US2] Add app header with `.ts-headline` brand title in `frontend/src/App.tsx`
- [X] T022 [P] [US2] Update section headings to use `.ts-subhead` in `frontend/src/components/ApiKeySetup.tsx`
- [X] T023 [P] [US2] Update body copy to use `.ts-body-sm`, `.ts-caption` in `frontend/src/components/ConvertForm.tsx`
- [X] T024 [P] [US2] Update results text hierarchy with `.ts-subhead` (title), `.ts-body-sm` (content) in `frontend/src/components/ResultCard.tsx`
- [X] T025 [P] [US2] Update progress steps to use `.ts-body-sm` in `frontend/src/components/ProgressSteps.tsx`
- [ ] T026 [US2] Verify typography compliance: Load pages, measure computed font sizes and weights in DevTools

**Checkpoint**: Typography system complete — component styling can proceed

---

## Phase 5: User Story 3 - Component Visual Specifications (Priority: P3)

**Goal**: All UI components (buttons, inputs, cards, chips, lists, checkboxes, tooltips) render with exact visual specs from DESIGN.md.

**Independent Test**: Load component gallery page showing all variants and states. Visual comparison with DESIGN.md — colors, padding, borders, hover/active/disabled states, border-radius all pixel-perfect.

### Implementation for User Story 3

#### Buttons (T027–T032)

> Note: No separate Button.tsx exists. Button styling applied inline per component.

- [X] T027 [P] [US3] Update primary button styling in `frontend/src/components/ConvertForm.tsx` (bg-primary, text-primary-foreground, hover #57534E, active #44403C)
- [X] T028 [P] [US3] Update primary button in `frontend/src/components/ApiKeySetup.tsx` (same primary button spec)
- [X] T029 [P] [US3] Update download button in `frontend/src/components/ResultCard.tsx` (primary button spec)
- [X] T030 [P] [US3] Update destructive/ghost button variants (API key removal link in ConvertForm uses `text-destructive hover:underline`)
- [X] T031 [P] [US3] Button padding updated to 12px 24px (py-3 px-6) with ts-body-sm font-semibold
- [X] T032 [US3] Disabled state updated: opacity-40 + cursor-not-allowed on all interactive elements

#### Inputs & Forms (T033–T037)

> Note: No separate Input.tsx exists. Input styling applied inline in ApiKeySetup and ConvertForm.

- [X] T033 [P] [US3] Update input in `frontend/src/components/ApiKeySetup.tsx` — h-12 (48px height), px-4 py-3 padding, border-input bg-background
- [X] T034 [P] [US3] Update input focus state — `focus:border-primary focus:ring-2 focus:ring-background focus:ring-offset-2 focus:ring-offset-primary`
- [X] T035 [P] [US3] Update textarea error display in `frontend/src/components/ConvertForm.tsx` — border-destructive/50, bg-destructive/10
- [X] T036 [P] [US3] Update disabled state — `disabled:bg-muted disabled:opacity-50 disabled:cursor-not-allowed`
- [X] T037 [P] [US3] Update labels with `.ts-caption font-semibold text-muted-foreground` in ConvertForm and ApiKeySetup

#### Cards (T038–T039)

> Note: No separate Card.tsx. Card styling in ResultCard and HomePage.

- [X] T038 [P] [US3] Update card in `frontend/src/components/ResultCard.tsx` — `border border-border bg-background p-8` (flat, no shadow, no rounded)
- [X] T039 [US3] Update card in `frontend/src/pages/HomePage.tsx` — `border border-border bg-background p-6` (flat, no shadow, no rounded)

#### Chips (T040–T041)

> Note: No Chip components in current app. Tokens defined in Tailwind for future use.

- [X] T040 [P] [US3] Color tokens available for future Chip components (`border-border-medium`, `bg-primary text-primary-foreground` for selected)
- [X] T041 [P] [US3] Status semantic colors defined: `success`, `warning`, `error`, `info` in CSS variables

#### Form Controls (T042–T044)

> Note: No Checkbox or Radio components in current app. Tokens defined for future use.

- [X] T042 [P] [US3] CSS variables for checkbox/radio colors defined (`--primary`, `--border-medium`, `--border-subtle`)
- [X] T043 [P] [US3] Border radius 9999px preserved in Tailwind config for `rounded-full` (radio buttons when added)
- [X] T044 [P] [US3] Disabled opacity pattern established: `opacity-40 cursor-not-allowed`

#### Lists & Tooltips (T045–T046)

- [X] T045 [P] [US3] Update ProgressSteps list items in `frontend/src/components/ProgressSteps.tsx` — `ts-body-sm` text, semantic colors (text-success, text-destructive, text-muted-foreground)
- [X] T046 [P] [US3] Tooltip token defined: bg-tertiary (#1C1917) available as CSS variable for future Tooltip component

#### Full-Page Styling (T047–T049)

- [X] T047 [P] [US3] Update page layout in `frontend/src/pages/HomePage.tsx` — spacing scale `px-4 pb-15 pt-9`, removed gradient, flat containers
- [X] T048 [P] [US3] Update DropZone in `frontend/src/components/DropZone.tsx` — removed `rounded-xl`, uses ThoughtStream colors (border-success for selected, border-primary hover)
- [ ] T049 [US3] Verify all component states: Browser test of hover/focus/active/disabled states across all components

**Checkpoint**: All components styled — design system implementation complete

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Refinement, validation, and integration testing

- [ ] T050 [P] Run visual regression tests: Load all pages, verify no layout shifts, no unintended color changes in browser DevTools
- [ ] T051 [P] Test responsive design: Verify 320px mobile, 768px tablet, 1024px+ desktop viewports — all components and spacing scale correctly
- [ ] T052 [P] Verify accessibility: Color contrast (WCAG AA 4.5:1 normal, 3:1 large), focus rings visible, 44px minimum touch targets
- [X] T053 [P] Run `pnpm build` — passed ✅ (247KB JS, 12.5KB CSS, 0 errors, 0 TypeScript errors)
- [X] T054 [P] TypeScript strict check `tsc --noEmit` — passes ✅ (pre-existing backend test failure unrelated to design system)
- [ ] T055 Run browser validation: Open http://localhost:5174 with `pnpm dev`, manually test form submission, resume preview, color/typography changes across pages
- [X] T056 [P] No Storybook present — N/A
- [ ] T057 Run quickstart.md validation: Follow developer guide to verify color tokens, typography, and component examples work
- [X] T058 Update CLAUDE.md — auto-updated by agent context script ✅

**Checkpoint**: Design system fully implemented, tested, and ready for deployment

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup)
    ↓
Phase 2 (Foundational) — BLOCKS all user stories
    ↓
Phase 3 (US1: Colors) ────────→ Can run in parallel
Phase 4 (US2: Typography) ─┘    once Phase 2 complete
Phase 5 (US3: Components) ──┘
    ↓
Phase 6 (Polish)
```

### Within Each Phase

- **Phase 1**: Sequential (setup defines structure)
- **Phase 2**: Tasks marked [P] run in parallel; T010 waits for T004–T009
- **Phase 3**: Colors (T011–T015) run in parallel; T016 waits for colors; page styling (T017–T019) parallel; T020 waits for all
- **Phase 4**: Typography tasks (T021–T025) run in parallel; T026 waits for all
- **Phase 5**: Component types run in parallel (buttons, inputs, cards, chips, etc.); full-page tasks (T047–T048) parallel; T049 waits for all
- **Phase 6**: Tests [P] run parallel; T055 waits for phase 5; T057 waits for phase 6 start

### Parallel Opportunities

**Setup Phase**: T001–T002 [P] (T003 optional)  
**Foundational Phase**: T004–T009 [P] (T010 sequential)  
**User Story 1**: Colors T011–T015 [P] (T016 sequential), pages T017–T019 [P] (T020 sequential)  
**User Story 2**: All T021–T025 [P] (T026 sequential)  
**User Story 3**: Component groups [P] — buttons (T027–T032), inputs (T033–T037), cards (T038–T039), chips (T040–T041), controls (T042–T044), lists/tooltips (T045–T046), pages (T047–T048)  
**Polish Phase**: Tests/validation T050–T054 [P] (T055 sequential, T057 sequential, T058 optional [P])

---

## Parallel Example: User Story 3 (Components)

```bash
# All button variants can be implemented in parallel:
- T027: Primary button
- T028: Secondary button
- T029: Ghost button
- T030: Destructive button

# All input-related tasks can run in parallel:
- T033: Input base styles
- T034: Input focus state
- T035: Input error state
- T036: Input disabled state

# Different component types (buttons, inputs, cards) in parallel:
Developer A: T027–T032 (buttons)
Developer B: T033–T037 (inputs)
Developer C: T038–T041 (cards & chips)

# All can complete in parallel, then T047–T049 validates
```

---

## Implementation Strategy

### MVP First (User Story 1 + Foundational)

**Minimum viable**: Colors working, pages using color tokens, form/results pages styled

1. Phase 1: Setup (30 min)
2. Phase 2: Foundational (1–2 hours)
3. Phase 3: User Story 1 Colors (2–3 hours)
4. **STOP & VALIDATE**: Pages load with correct colors, contrast, no layout issues
5. **Deploy/Demo** (Optional — MVP complete)

### Incremental Delivery

1. **Iteration 1**: Phases 1–3 (Colors MVP)
2. **Iteration 2**: Phase 4 (Add Typography)
3. **Iteration 3**: Phase 5 (Add Components)
4. **Iteration 4**: Phase 6 (Polish & Testing)

Each iteration adds visual polish; app remains functional throughout.

### With Multiple Developers

After Phases 1–2 complete:

- **Dev A**: Phase 3 (Color system — buttons/inputs color updates)
- **Dev B**: Phase 4 (Typography — font/size updates across pages)
- **Dev C**: Phase 5 (Components — spacing/borders/states)
- **All**: Phase 6 together (validation, testing, polish)

All phases can overlap after Foundational is done.

---

## Task Count Summary

- **Phase 1**: 3 tasks
- **Phase 2**: 7 tasks
- **Phase 3 (US1)**: 10 tasks
- **Phase 4 (US2)**: 6 tasks
- **Phase 5 (US3)**: 23 tasks
- **Phase 6**: 9 tasks

**Total**: 58 tasks

| User Story | Task Count | Est. Time |
|------------|------------|-----------|
| P1 (Colors) | 10 | 2–3 hours |
| P2 (Typography) | 6 | 1–2 hours |
| P3 (Components) | 23 | 4–6 hours |
| **Total** | **39** (stories) | **7–11 hours** |

---

## Notes

- All file paths assume `frontend/` directory for React components
- [P] = parallelizable (different files/no dependencies)
- Each checkpoint should be validated before proceeding
- Commit after each logical group (e.g., after T015 colors complete, after T026 typography complete)
- Avoid vague tasks — each task has exact file path
- Use browser DevTools to validate colors, fonts, spacing against DESIGN.md hex values
- If story integration needed (e.g., US2 text uses US1 colors), verify it works; stories should otherwise be independent
