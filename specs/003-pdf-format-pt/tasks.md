# Tasks: Melhorar Formatação do PDF e Preservar Informações em Português

**Input**: Design documents from `/specs/003-pdf-format-pt/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/api.md ✅, quickstart.md ✅

**Scope**: Backend-only — 4 files modified, no new dependencies, no API contract changes.

**Organization**: Tasks grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies between them)
- **[Story]**: Which user story this task belongs to (US1, US2)

---

## Phase 1: Foundational (Blocking Prerequisite)

**Purpose**: The `AdditionalSection` type must exist in `types.ts` before the parser and PDF generator can reference it.

**⚠️ CRITICAL**: Both US1 (contentParser) and US2 (pdfGenerator) depend on this phase.

- [X] T001 Add `AdditionalSection` interface ✓ `{ title: string; content: string }` and optional `additionalSections?: AdditionalSection[]` field to `ATSContent` in `backend/src/types.ts`

**Checkpoint**: Type compiles — run `pnpm --filter backend build` (or `tsc --noEmit`) with no errors before continuing.

---

## Phase 2: User Story 1 — PDF ATS em Português com Informações Preservadas (Priority: P1) 🎯 MVP

**Goal**: The Gemini API returns a fully Portuguese response preserving all CV sections, and the parser correctly maps it into `ATSContent` including any additional sections.

**Independent Test**: Run `pnpm --filter backend test` — contentParser tests must pass for Portuguese headers and additional section extraction; the mock-based geminiClient test must confirm the new prompt text is present.

### Implementation for User Story 1

- [X] T002 [P] [US1] Rewrite `PROMPT_TEMPLATE` in `backend/src/services/geminiClient.ts`: (a) add `Responda APENAS em português (pt-BR).` as the first line; (b) change all section headers to Portuguese (`## CONTATO`, `## RESUMO`, `## EXPERIÊNCIA`, `## EDUCAÇÃO`, `## HABILIDADES`, `## SEÇÕES_ADICIONAIS`); (c) update contact field labels to `Nome`, `Email`, `Telefone`, `Localização`, `LinkedIn`; (d) update experience labels to `Empresa`, `Cargo`, `Período`; (e) update education labels to `Instituição`, `Curso`, `Período`; (f) add preservation directive: `Inclua TODAS as informações do currículo original que não sejam contraditórias com os requisitos da vaga. Adapte a apresentação, mas não omita seções.`; (g) add `## SEÇÕES_ADICIONAIS` block with `### NomeDaSeção` sub-heading format for any sections beyond the standard five.

- [X] T003 [P] [US1] Update `backend/src/services/contentParser.ts` to: (a) change all `extractSection` calls to use Portuguese headers (`CONTATO`, `RESUMO`, `EXPERIÊNCIA`, `EDUCAÇÃO`, `HABILIDADES`); (b) update `parseContact` to recognise Portuguese keys (`nome`, `email`, `telefone`, `localização`, `linkedin`); (c) update `parseExperience` to recognise `empresa:`, `cargo:`, `período:`; (d) update `parseEducation` to recognise `instituição:`, `curso:`, `período:`; (e) add `parseAdditionalSections(rawText)` function that extracts everything after `## SEÇÕES_ADICIONAIS`, splits on `### ` to produce `AdditionalSection[]`; (f) include `additionalSections` in the returned `ATSContent`.

- [X] T004 [P] [US1] Update `backend/tests/services/contentParser.test.ts`: (a) replace all English-header fixtures with Portuguese headers; (b) add a test case with a `## SEÇÕES_ADICIONAIS` block containing two sub-sections and assert both appear in `additionalSections`; (c) add a test that an input without `## SEÇÕES_ADICIONAIS` returns `additionalSections` as undefined or empty.

- [X] T005 [P] [US1] Update `backend/tests/services/geminiClient.test.ts`: add a test that asserts `PROMPT_TEMPLATE` contains `pt-BR`, `CONTATO`, `SEÇÕES_ADICIONAIS`, and the preservation directive string (test the exported prompt or mock the model and inspect the argument passed to `generateContent`).

**Checkpoint**: User Story 1 is done when `pnpm --filter backend test` passes all tests and a manual conversion of an English CV produces Portuguese text with all sections.

---

## Phase 3: User Story 2 — Formatação Visual Melhorada no PDF Gerado (Priority: P2)

**Goal**: The generated PDF has visually distinct section headers, consistent spacing between all items, and additional sections from the CV rendered after the standard sections.

**Independent Test**: Open a generated PDF in any viewer and verify: (a) section titles are bold and larger than body text; (b) spacing between entries is consistent (no sections running together); (c) if the CV had a "Projetos" section, it appears in the PDF.

### Implementation for User Story 2

- [X] T006 [US2] Update `backend/src/services/pdfGenerator.ts`: (a) increase section header font size from 13pt to 14pt; (b) change the header rule from a full-width bottom rule to a left bar: draw a 3pt vertical line from `(doc.page.margins.left, doc.y)` to `(doc.page.margins.left, doc.y + 16)` in `#1a1a2e` before the section title text (then add `moveDown(0.3)` after); (c) add `moveDown(0.5)` after each experience entry's bullet list to prevent entries from running together; (d) add a `renderAdditionalSections(doc, sections)` helper that iterates `content.additionalSections ?? []`, calling `addSection(doc, sec.title)` and rendering `sec.content` as body text; (e) call `renderAdditionalSections` after the Skills section.

- [X] T007 [P] [US2] Update `backend/tests/services/pdfGenerator.test.ts`: add a test that passes an `ATSContent` with `additionalSections: [{ title: 'Projetos', content: 'Projeto X: descrição' }]` and asserts the returned buffer is non-empty (existing pattern); add a second test that passes `additionalSections: undefined` and asserts no error is thrown.

**Checkpoint**: User Stories 1 and 2 are both done — a full end-to-end conversion produces a Portuguese PDF with improved visual layout and all CV sections present.

---

## Phase 4: Polish & Validation

**Purpose**: Ensure all existing tests still pass, TypeScript compiles cleanly, and manual validation confirms both user stories work end-to-end.

- [X] T008 Run `pnpm test` and confirm all tests pass (including the updated contentParser, geminiClient, and pdfGenerator tests). Fix any regressions.

- [X] T009 Run `pnpm --filter backend build` (TypeScript strict compile `tsc --noEmit`) and fix any type errors introduced by the `AdditionalSection` changes.

- [X] T010 [P] Manual end-to-end validation per `quickstart.md`: start `pnpm dev`, upload a real CV (Portuguese or English), convert with a Portuguese job description, open the downloaded PDF and verify: (a) all text is in Portuguese; (b) all original CV sections are present; (c) section headers are visually distinct; (d) no text overlaps.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Foundational (Phase 1)**: No dependencies — start immediately
- **US1 (Phase 2)**: Depends on T001 (types.ts) — T002 and T003 can run in parallel once T001 is done
- **US2 (Phase 3)**: Depends on T001 (types.ts) — can start after T001; benefits from T003 being done (so parser produces additionalSections for testing), but T006 and T007 can be done independently
- **Polish (Phase 4)**: Depends on all implementation phases

### User Story Dependencies

- **US1 (P1)**: Depends on T001 only. T002 (geminiClient) and T003 (contentParser) are independent of each other.
- **US2 (P2)**: Depends on T001 only. Can start in parallel with US1 once T001 is done.

### Within Each User Story

- T001 before T002, T003, T006
- T002 and T003 in parallel (after T001)
- T004 and T005 in parallel (after T002 and T003)
- T006 in parallel with T002/T003 (after T001)
- T007 after T006

---

## Parallel Opportunities

### Phase 2 (US1)

```
T001 (types.ts)
    ├── T002 [P] geminiClient.ts (prompt rewrite)
    └── T003 [P] contentParser.ts (Portuguese headers + additional sections)
            ├── T004 [P] contentParser.test.ts
            └── T005 [P] geminiClient.test.ts
```

### Phase 3 (US2)

```
T001 (types.ts) — also unblocks:
    └── T006 pdfGenerator.ts (visual improvements + additional sections)
            └── T007 [P] pdfGenerator.test.ts
```

---

## Implementation Strategy

### MVP (US1 only — Portuguese output + full information)

1. Complete T001 — types.ts
2. Complete T002 + T003 in parallel — prompt and parser
3. Complete T004 + T005 in parallel — tests
4. **STOP and VALIDATE**: `pnpm test` passes; manual check that AI output is in Portuguese with all sections
5. Ship US1

### Incremental Delivery

1. T001 → T002+T003 (parallel) → T004+T005 (parallel) → validate US1
2. T006 → T007 → validate US2
3. T008+T009+T010 → ship

---

## Notes

- No new files need to be created — all changes are in existing backend files
- No frontend changes — the form labels and UI are already in Portuguese from feature 002
- No new dependencies needed
- The `[P]` tasks within a phase touch different files with no code dependency between them
- T002 (geminiClient) has no TypeScript dependency on T001 (types.ts) — the prompt is a plain string template
- T003 (contentParser) has a TypeScript dependency on T001 (must import `AdditionalSection` from types.ts)
