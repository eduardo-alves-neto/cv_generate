# Quickstart: Melhorar Formatação do PDF e Preservar Informações em Português

**Branch**: `003-pdf-format-pt` | **Date**: 2026-04-10

## What changes in this feature

This feature modifies three backend files only — no new dependencies, no new environment variables, no new services.

| File | What changes |
|------|-------------|
| `backend/src/services/geminiClient.ts` | New prompt: Portuguese, full information preservation, additional sections |
| `backend/src/services/contentParser.ts` | Portuguese header keys, additional section parsing |
| `backend/src/services/pdfGenerator.ts` | Visual improvements, additional sections rendering |
| `backend/src/types.ts` | `AdditionalSection` interface + `additionalSections?` field on `ATSContent` |

## Setup

No changes to `.env` or dependencies. Run from the project root:

```bash
pnpm dev
```

## Testing the feature manually

1. Open `http://localhost:5173`
2. Upload a PDF resume (in any language — Portuguese or English)
3. Paste a job description in Portuguese
4. Click **"Converter para ATS"** (the button label is part of feature 002 and stays in Portuguese)
5. Download the resulting PDF and verify:
   - All text is in Portuguese (pt-BR)
   - No sections from the original CV are missing
   - Section headers are visually distinct (bold, larger font)
   - Spacing between sections is consistent

## Running unit tests

```bash
pnpm test
```

The test files affected by this feature:
- `backend/tests/services/geminiClient.test.ts` — prompt construction tests
- `backend/tests/services/contentParser.test.ts` — Portuguese header parsing, additional sections
- `backend/tests/services/pdfGenerator.test.ts` — additional sections rendering

## Troubleshooting

| Problem | Solution |
|---------|----------|
| PDF output is in English | Verify `geminiClient.ts` prompt starts with `Responda APENAS em português (pt-BR)` |
| Sections from CV are missing | Check that the AI output contains `## SEÇÕES_ADICIONAIS` and the parser handles it |
| PDF has overlapping text | Check `pdfGenerator.ts` for missing `moveDown()` calls after sections |
