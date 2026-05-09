# Tasks: Prioritize Job Description Requirements in CV Conversion

**Input**: Design documents from `/specs/007-job-desc-priority/`  
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, quickstart.md ✅

**Scope**: Single-file prompt rewrite — `backend/src/services/geminiClient.ts` only.  
No new routes, schemas, dependencies, or frontend changes.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)

---

## Phase 1: Setup

**Purpose**: Confirm baseline before touching any code.

- [x] T001 Run `pnpm test --filter=backend` and confirm all existing tests pass before making any changes

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Understand the current prompt structure so the incremental edits in Phases 3–5 are safe.

**⚠️ CRITICAL**: Phases 3–5 depend on this understanding before editing `PROMPT_TEMPLATE`.

- [x] T002 Read `backend/src/services/geminiClient.ts` (full file) and note the exact position of the `INSTRUÇÃO IMPORTANTE` paragraph, the `FORMATO` block, and the `{cvText}` / `{jobDescription}` placeholders
- [x] T003 Read `backend/tests/services/geminiClient.test.ts` (full file) and identify existing assertions about the prompt string so new tests do not duplicate them

**Checkpoint**: Baseline understood — user story implementation can now begin.

---

## Phase 3: User Story 1 — CV Contradicts Job Requirements (Priority: P1) 🎯 MVP

**Goal**: When the CV contains statements that contradict the job description (work mode, seniority level, years of experience), the AI removes or re-frames those statements and surfaces compatible experience instead, without fabricating anything.

**Independent Test**: Upload a CV that states "prefiro trabalho presencial" against a job description requiring remote work. The output CV must not contain any on-site preference and must highlight any remote-compatible experience from the original CV.

### Implementation for User Story 1

- [x] T004 [US1] In `backend/tests/services/geminiClient.test.ts`, add a unit test that inspects the prompt string built by `generateATSContent` (via the mocked Gemini client) and asserts it contains the substring `"PRIORIDADE DA VAGA"`
- [x] T005 [US1] In `backend/tests/services/geminiClient.test.ts`, add a unit test asserting the prompt contains `"CONTRADIÇÕES"` and `"NUNCA invente"`
- [x] T006 [US1] In `backend/src/services/geminiClient.ts`, update `PROMPT_TEMPLATE`: insert a `PRIORIDADE DA VAGA:` block — containing rule 1 (CONTRADIÇÕES) and rule 4 (non-fabrication constraint) — immediately after the `INSTRUÇÃO IMPORTANTE` paragraph and before the `FORMATO` line, exactly as specified in `specs/007-job-desc-priority/quickstart.md`
- [x] T007 [US1] Run `pnpm test --filter=backend` and confirm T004 and T005 now pass

**Checkpoint**: Contradiction suppression is live. US1 independently testable via the manual smoke test in quickstart.md.

---

## Phase 4: User Story 2 — Job Requires Skills Not Mentioned in CV (Priority: P2)

**Goal**: When the job requires skills absent from the CV, the AI identifies adjacent or transferable experience and re-phrases it using the job's exact terminology; exact job-description keywords are used throughout skills and bullet points wherever real experience supports them.

**Independent Test**: Upload a CV with no mention of "Agile" against a job description that prominently requires Agile. The output CV must incorporate Agile framing wherever iterative or collaborative work can be inferred from the CV's actual content.

### Implementation for User Story 2

- [x] T008 [US2] In `backend/tests/services/geminiClient.test.ts`, add a unit test asserting the prompt contains `"LACUNAS DE HABILIDADES"`
- [x] T009 [US2] In `backend/tests/services/geminiClient.test.ts`, add a unit test asserting the prompt contains `"PALAVRAS-CHAVE ATS"`
- [x] T010 [US2] In `backend/src/services/geminiClient.ts`, extend `PROMPT_TEMPLATE`: append rule 2 (LACUNAS DE HABILIDADES) inside the `PRIORIDADE DA VAGA` block (between rule 1 and rule 4) and add the standalone `PALAVRAS-CHAVE ATS:` paragraph immediately after the `PRIORIDADE DA VAGA` block and before `FORMATO`, exactly as specified in `specs/007-job-desc-priority/quickstart.md`
- [x] T011 [US2] Run `pnpm test --filter=backend` and confirm T008 and T009 now pass

**Checkpoint**: Skill gap bridging and ATS keyword injection are live. US2 independently testable.

---

## Phase 5: User Story 3 — Job-Specific Work Mode or Context Not in CV (Priority: P3)

**Goal**: When the job specifies a work context (startup, regulated industry, international team, remote), the AI identifies compatible signals already in the CV (autonomy, rapid delivery, multi-role, compliance indicators) and highlights them.

**Independent Test**: Upload a generic CV against a job description that emphasises "fast-paced startup environment". The output must surface any autonomy, multi-hat, or rapid-delivery indicators from the CV content.

### Implementation for User Story 3

- [x] T012 [US3] In `backend/tests/services/geminiClient.test.ts`, add a unit test asserting the prompt contains `"MODO DE TRABALHO E CONTEXTO"`
- [x] T013 [US3] In `backend/src/services/geminiClient.ts`, extend `PROMPT_TEMPLATE`: append rule 3 (MODO DE TRABALHO E CONTEXTO) inside the `PRIORIDADE DA VAGA` block (between rules 2 and 4, keeping rule 4 last), exactly as specified in `specs/007-job-desc-priority/quickstart.md`
- [x] T014 [US3] Run `pnpm test --filter=backend` and confirm T012 now passes

**Checkpoint**: All three user stories are covered by the updated prompt. Full prompt matches the specification in quickstart.md.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final integrity checks and validation.

- [x] T015 [P] In `backend/src/services/geminiClient.ts`, verify that `{cvText}` and `{jobDescription}` placeholders are still present exactly once each in `PROMPT_TEMPLATE` and that all `contentParser.ts` section headers (CONTATO, RESUMO, EXPERIÊNCIA, EDUCAÇÃO, HABILIDADES, SEÇÕES_ADICIONAIS) remain unchanged
- [x] T016 [P] In `backend/tests/services/geminiClient.test.ts`, add a unit test asserting the prompt still contains `"{cvText}"` and `"{jobDescription}"` as literal substrings (guards against accidental placeholder removal in future edits)
- [x] T017 Run the full test suite with `pnpm test` and confirm all frontend, backend, and shared tests pass
- [ ] T018 Run a manual end-to-end smoke test via `pnpm dev` following the verification checklist in `specs/007-job-desc-priority/quickstart.md`: upload a CV that contradicts a job requirement and verify the output aligns with the job description without fabricating content

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 — BLOCKS Phases 3–5
- **US1 (Phase 3)**: Depends on Phase 2 — can begin once T002 and T003 are complete
- **US2 (Phase 4)**: Depends on Phase 3 completion (T006 must be done before T010 edits the same file)
- **US3 (Phase 5)**: Depends on Phase 4 completion (T010 must be done before T013 edits the same file)
- **Polish (Phase 6)**: Depends on Phase 5 completion

### User Story Dependencies

All stories edit the same file (`geminiClient.ts`) sequentially. Order is P1 → P2 → P3 to build the prompt incrementally.

- **US1 (P1)**: Start after Foundational — adds rules 1 + 4 to prompt
- **US2 (P2)**: Start after US1 — adds rule 2 + PALAVRAS-CHAVE ATS to prompt
- **US3 (P3)**: Start after US2 — adds rule 3 to prompt

### Parallel Opportunities

- T004 and T005 can run in parallel (both are new test blocks, different `describe`/`it` blocks)
- T008 and T009 can run in parallel (same reason)
- T015 and T016 in the Polish phase can run in parallel

---

## Parallel Example: User Story 1

```bash
# These two test tasks can be written simultaneously:
Task T004: "assert prompt contains PRIORIDADE DA VAGA"
Task T005: "assert prompt contains CONTRADIÇÕES and NUNCA invente"
# Then, only after both tests are written:
Task T006: Update PROMPT_TEMPLATE in geminiClient.ts
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001)
2. Complete Phase 2: Foundational (T002, T003)
3. Complete Phase 3: US1 (T004–T007)
4. **STOP and VALIDATE**: Smoke-test contradiction suppression with `pnpm dev`
5. The system now handles the highest-impact case (contradictions actively harm applications)

### Incremental Delivery

1. Setup + Foundational → baseline confirmed
2. US1 (contradiction suppression) → MVP, ship if needed
3. US2 (skill gap + keywords) → ATS matching improves
4. US3 (work mode context) → full spec coverage
5. Polish → final validation

---

## Notes

- All 18 tasks touch at most 2 files: `geminiClient.ts` (prompt) and `geminiClient.test.ts` (tests)
- [P] tasks touch different test `it()` blocks — safe to write in parallel
- Commit after each checkpoint (end of Phase 3, 4, 5) so each increment is independently revertable
- The final prompt text to use is in `specs/007-job-desc-priority/quickstart.md` — use it as the source of truth, do not improvise the wording
