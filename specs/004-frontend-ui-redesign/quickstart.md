# Quickstart: Frontend UI Redesign

**Branch**: `004-frontend-ui-redesign`  
**Date**: 2026-04-10

## Prerequisites

1. Node.js 20+, pnpm 8+ installed.
2. `GEMINI_API_KEY` set in `backend/.env` (no changes to backend for this feature).
3. You are on branch `004-frontend-ui-redesign`.

## Start the development environment

```bash
pnpm install          # install all workspace deps (run from repo root)
pnpm dev              # starts frontend on :5173 + backend on :3001
```

Open `http://localhost:5173` in your browser.

## Files to change

All changes are in `frontend/src/`:

| File | Action | Description |
|------|--------|-------------|
| `components/DropZone.tsx` | CREATE | Drag-and-drop + click file upload zone |
| `components/ProgressSteps.tsx` | CREATE | 3-step named progress indicator |
| `components/HowItWorks.tsx` | CREATE | 3-step "How it works" explainer |
| `components/ConvertForm.tsx` | MODIFY | Replace `<input type="file">` with `<DropZone>` |
| `components/ResultCard.tsx` | MODIFY | Polished success screen layout |
| `components/ProgressSpinner.tsx` | DELETE | Replaced by ProgressSteps |
| `pages/HomePage.tsx` | MODIFY | Branded hero header + how-it-works + layout |

## Component contracts

### `<DropZone>`

```ts
interface DropZoneProps {
  onFileSelect: (file: File) => void        // called when valid PDF selected
  onFileError: (message: string) => void    // called when invalid file dropped/selected
  selectedFile: File | null                 // controlled — shown as confirmation
  disabled?: boolean                        // locked during conversion
}
```

States: `idle` | `drag-over` | `selected` | `error`

### `<ProgressSteps>`

```ts
interface ProgressStepsProps {
  isActive: boolean    // true while conversion is in progress
  hasError: boolean    // true if conversion failed
}
```

Internal step schedule (simulated — API is a single synchronous call):
- Step 1 "Lendo seu currículo" — shown immediately (`isActive` becomes true)
- Step 2 "Optimizando para ATS" — after 3 000 ms
- Step 3 "Gerando PDF" — after 8 000 ms
- On `isActive → false` (API responded):
  - `hasError = false` → all steps show ✓ (success)
  - `hasError = true` → active step shows ✗ (error)

### `<HowItWorks>`

No props — purely presentational. Static 3-step list:
1. **Upload** — Upload your PDF resume
2. **AI** — Gemini AI rewrites it for ATS
3. **Download** — Download your optimised PDF

### `<ResultCard>` (updated props — unchanged interface)

```ts
interface ResultCardProps {
  blobUrl: string
  onReset: () => void
}
```

Visual changes only: larger download CTA, success icon, improved copy.

## Running tests

```bash
# Unit tests (Vitest)
pnpm test

# Type checking
cd frontend && pnpm typecheck

# E2E tests (requires pnpm dev running in another terminal)
pnpm test:e2e
```

## Acceptance checklist (manual testing)

- [ ] Drag a PDF onto the drop zone → file name and size appear
- [ ] Drag a non-PDF → inline error shown, no file selected
- [ ] Click the drop zone → native file picker opens
- [ ] Submit with valid file + job description → 3 progress steps animate sequentially
- [ ] Conversion succeeds → polished success screen with download button
- [ ] "Convert another CV" → form resets, drop zone is empty
- [ ] Resize to 320 px viewport → no overflow, all text legible
- [ ] Privacy disclosure visible below the submit button
