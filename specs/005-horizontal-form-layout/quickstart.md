# Quickstart: Horizontal Form Layout

**Branch**: `005-horizontal-form-layout`  
**Date**: 2026-04-11

## Prerequisites

1. Node.js 20+, pnpm 8+ installed.
2. `GEMINI_API_KEY` set in `backend/.env` (no changes to backend for this feature).
3. You are on branch `005-horizontal-form-layout`.

## Start the development environment

```bash
pnpm install          # from repo root
pnpm dev              # frontend :5173 + backend :3001
```

Open `http://localhost:5173`.

## Files to change

| File | Action | What changes |
|------|--------|--------------|
| `frontend/src/pages/HomePage.tsx` | MODIFY | Remove `<header>` block; remove `<HowItWorks />`; remove HowItWorks import; widen container to `max-w-4xl` |
| `frontend/src/components/ConvertForm.tsx` | MODIFY | Wrap the two field `<div>`s in a `grid grid-cols-1 sm:grid-cols-2 gap-4` container; span error/submit/privacy with `sm:col-span-2` |
| `frontend/src/components/HowItWorks.tsx` | DELETE | No remaining callers |

## Layout contract for ConvertForm

```
<form>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
    <!-- Left column -->
    <div>  ← Job Description label + textarea + char counter  </div>
    <!-- Right column -->
    <div>  ← PDF Resume label + DropZone  </div>
    <!-- Full-width rows (sm:col-span-2) -->
    <div class="sm:col-span-2">  ← error alert (conditional)  </div>
    <div class="sm:col-span-2">  ← submit button  </div>
    <div class="sm:col-span-2">  ← privacy disclosure  </div>
  </div>
</form>
```

Note: `items-start` on the grid prevents the drop zone from stretching to match the textarea height, preserving the drop zone's natural compact size. If equal-height columns are preferred, remove `items-start`.

## Running tests

```bash
pnpm test                        # Vitest unit tests (all workspaces)
cd frontend && pnpm typecheck    # TypeScript strict check
pnpm test:e2e                    # Playwright (requires pnpm dev running)
```

## Acceptance checklist (manual testing)

- [ ] Page loads — no hero header, no "How it works" section visible
- [ ] At 1280 px viewport: job description textarea on the left, PDF drop zone on the right, side by side
- [ ] At 640 px viewport: fields transition to stacked layout
- [ ] At 320 px viewport: no horizontal overflow
- [ ] Form validation still works: empty submit → error; non-PDF → DropZone error; large file → DropZone error
- [ ] Full conversion flow: upload PDF + paste job description → Convert → download PDF
- [ ] "Converter outro currículo" resets the form correctly
- [ ] Privacy disclosure still visible below the submit button
