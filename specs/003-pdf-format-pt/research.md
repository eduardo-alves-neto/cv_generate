# Research: Melhorar Formatação do PDF e Preservar Informações em Português

**Branch**: `003-pdf-format-pt` | **Date**: 2026-04-10
**Status**: Complete — all decisions resolved

---

## 1. Prompt Strategy — Portuguese Output + Full Information Preservation

**Decision**: Rewrite `PROMPT_TEMPLATE` in `geminiClient.ts` with explicit Portuguese language instruction, an `## ADDITIONAL_SECTIONS` output block, and a preservation directive.

**Rationale**:
- The current prompt does not specify a language; the AI defaults to the language it detects in the input (often English).
- Adding `Responda APENAS em português (pt-BR)` as the first line is the simplest, most reliable way to enforce Portuguese output across all models.
- The current prompt format defines only 5 fixed sections (CONTACT, SUMMARY, EXPERIENCE, EDUCATION, SKILLS). Any extra CV content (certifications, languages, projects) is silently dropped by both the prompt and the parser.
- A new `## SECOES_ADICIONAIS` output block lets the AI capture all remaining content as free-form sections, which the parser can then forward to the PDF generator.
- A preservation directive ("inclua TODAS as informações do currículo original que não sejam contraditórias com a vaga") closes the omission gap without risking hallucination.

**Alternatives considered**:
- **Dynamic section listing in prompt** (tell the AI to mirror every section it finds): Too open-ended — the AI might invent section names or merge sections unpredictably.
- **Post-processing with a second AI call**: Unnecessary complexity. A single well-structured prompt is sufficient for Gemini 2.5 Flash.
- **User-controlled section selection**: Out of scope for this feature; the spec requires full preservation by default.

---

## 2. Additional Sections — Data Model and Parser Extension

**Decision**: Add `additionalSections?: AdditionalSection[]` to `ATSContent` in `types.ts`. Each entry has `{ title: string; content: string }`. The parser extracts everything after `## HABILIDADES` (the last standard section) as additional sections, splitting on `## ` headers.

**Rationale**:
- The existing 5-section fixed model cannot represent "Projetos", "Certificações", "Idiomas", "Publicações", etc.
- A generic `AdditionalSection` type (title + raw content string) is the simplest extension that lets the PDF generator render any section without knowing its semantics.
- Keeping additional sections as raw text strings avoids creating specific parsers for every possible section type — YAGNI.

**Alternatives considered**:
- **Map<string, string>**: Loses ordering, which matters for PDF layout.
- **Union type with known section names**: Requires maintaining a whitelist of section names — doesn't scale to user-generated sections.
- **Single `extraText` string**: Doesn't give the PDF generator enough structure to render section headers.

---

## 3. PDF Formatting Improvements — PDFKit

**Decision**: Extend `pdfGenerator.ts` with improved section header style, consistent item spacing, and a new `addAdditionalSection` helper. Section titles in the PDF will use their Portuguese names as provided by the AI.

**Changes**:
- Section header: increase visual weight by adding a colored left bar (4pt, `#1a1a2e`) before the title text, instead of a full-width rule below it. This is more visually distinct without sacrificing ATS compatibility (it's just a line, not a table).
- Experience entries: add `moveDown(0.2)` after bullets to prevent entries from running together.
- Additional sections: rendered as plain text blocks using the same font/size as the body — preserving ATS compatibility.
- Section title font size: increase from 13pt to 14pt for better visual hierarchy.

**Alternatives considered**:
- **Full redesign with custom font**: Requires bundling a TTF font — adds package complexity. Helvetica built into PDFKit is sufficient.
- **Two-column layout**: Explicitly prohibited by ATS compatibility constraint.
- **Colored section backgrounds**: Not ATS-safe.

---

## 4. Portuguese Section Headers in the Prompt

**Decision**: The prompt instructs the AI to use Portuguese section headers (CONTATO, RESUMO, EXPERIÊNCIA, EDUCAÇÃO, HABILIDADES, SEÇÕES_ADICIONAIS). The parser keys on these Portuguese headers.

**Rationale**:
- If the parser still looks for `## CONTACT`, `## SUMMARY`, etc., while the AI outputs `## CONTATO`, `## RESUMO`, the parser produces empty sections and the PDF is blank.
- The parser must be updated to match whichever headers the prompt defines.
- Using Portuguese headers end-to-end (prompt → parser) is simpler than maintaining a translation table.

**Parser header mapping**:
| Prompt Header | Parser Key | `ATSContent` field |
|---|---|---|
| `## CONTATO` | CONTATO | contactInfo |
| `## RESUMO` | RESUMO | summary |
| `## EXPERIÊNCIA` | EXPERIÊNCIA | experience |
| `## EDUCAÇÃO` | EDUCAÇÃO | education |
| `## HABILIDADES` | HABILIDADES | skills |
| `## SEÇÕES_ADICIONAIS` or any `## ` after HABILIDADES | — | additionalSections[] |

**Alternatives considered**:
- **Keep English headers in prompt, translate in parser**: Adds a translation layer with no benefit.
- **Accept either language in the parser**: Regex with both options — works but is fragile and harder to maintain.

---

## Summary of Resolved Decisions

| Topic | Decision |
|-------|----------|
| Portuguese output | Add explicit `pt-BR` instruction as first line of prompt |
| Information preservation | Add preservation directive + `## SEÇÕES_ADICIONAIS` block to prompt |
| Additional sections data model | `additionalSections?: AdditionalSection[]` in `ATSContent` |
| Parser | Update all header keys to Portuguese; extract additional sections after HABILIDADES |
| PDF section titles | Use Portuguese title as returned by AI (no hardcoded translation in generator) |
| PDF visual improvements | Left-bar section headers (14pt bold), consistent item spacing, additional sections as plain text |
| API contract | No change — POST /api/convert still returns PDF blob |
