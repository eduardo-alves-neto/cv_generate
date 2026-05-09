# Research: User-Provided Gemini API Key

**Feature**: 006-user-gemini-api-key  
**Date**: 2026-04-14

---

## Decision 1: Where to pass the API key from frontend to backend

**Decision**: Include `geminiApiKey` as a field in the multipart form body (alongside `jobDescription`), validated by the existing `ConvertRequestBodySchema` in `packages/shared`.

**Rationale**: Multer already parses non-file fields from multipart requests into `req.body`. Adding the key there lets us reuse the Zod validation layer that already guards `req.body` before any business logic runs. No new middleware or header-parsing code is needed.

**Alternatives considered**:
- _Custom HTTP header (`X-Gemini-Api-Key`)_: Semantically cleaner (credentials ≠ content), but would require separate header-parsing and Zod validation outside the shared schema boundary. Extra complexity without benefit for a single-developer tool.
- _Query string parameter_: Rejected — keys in URLs appear in server access logs and browser history. Security anti-pattern.
- _Separate `/api/validate-key` endpoint_: Rejected — adds a round-trip and complexity. The existing per-request validation is sufficient.

---

## Decision 2: Where to store the key in the browser

**Decision**: `localStorage` with the key name `cv_ats_gemini_api_key`.

**Rationale**: `localStorage` persists across browser sessions (satisfying User Story 3) without any server-side infrastructure. The key is a non-sensitive-in-isolation credential (only useful when combined with CV data sent over HTTPS), so browser-local storage is appropriate for this single-user local tool.

**Alternatives considered**:
- _`sessionStorage`_: Cleared when the tab is closed — fails User Story 3 (key must persist across sessions). Rejected.
- _Cookie_: Would be sent to the backend on every request automatically, increasing the risk of accidental logging. Adds CSRF surface area. Rejected.
- _In-memory React state only_: Cleared on page refresh — fails User Story 3. Rejected.

---

## Decision 3: How to surface the tutorial

**Decision**: An inline collapsible/accordion section rendered inside `ApiKeySetup.tsx`, visible only when no key is stored. The tutorial expands on click and does not open a separate page or modal.

**Rationale**: Keeps the full flow on one screen without navigation. Collapsed by default so returning users (with a key already stored) never see it. Simple to implement with a single `useState` boolean — no routing or modal infrastructure needed.

**Alternatives considered**:
- _Separate `/tutorial` route_: Requires React Router changes and navigation back to the form. More complex for no benefit. Rejected.
- _Modal/dialog overlay_: Same functionality but heavier implementation; also obscures the key input field while reading. Rejected.
- _External link to Google docs_: Breaks the in-app self-service flow; docs can go stale without a product release. Rejected.

---

## Decision 4: How the backend handles a missing key after the change

**Decision**: If `geminiApiKey` is absent or empty in the request body, the backend throws `AppError('AI_UNAVAILABLE', ...)` with a message directing the user to enter their key in the UI. The existing `AI_UNAVAILABLE` error code is reused (no new error code needed) — the message text is sufficient to distinguish the case.

**Rationale**: Adding a new `MISSING_API_KEY` error code would require updating the shared schema, the frontend `ERROR_MESSAGES` map, and the backend — three files — for a distinction that only manifests if the frontend sends a malformed request (which should not happen in normal usage). The YAGNI principle applies.

**Alternatives considered**:
- _New `MISSING_API_KEY` error code_: More descriptive in theory but adds schema/code churn for an edge case the frontend already prevents. Rejected.

---

## Decision 5: Backward compatibility with GEMINI_API_KEY env var

**Decision**: Remove the requirement that `GEMINI_API_KEY` be set in `backend/.env`. Mark it as deprecated/optional in `.env.example`. The backend `geminiClient.ts` will no longer call `process.env.GEMINI_API_KEY` in the hot path — the key comes exclusively from the per-request parameter.

**Rationale**: Keeping the env var as a fallback would add a hidden code path that is never exercised in production (since the frontend always sends the user's key) and could silently mask a missing key in integration tests. Removing it is simpler and more honest.

**Alternatives considered**:
- _Keep env var as fallback_: Would allow operator-set keys to override user keys — ambiguous behaviour, violates single-source-of-truth. Rejected.

---

## Decision 6: Tutorial content and steps

**Decision**: The tutorial (in pt-BR) will cover these steps:
1. Acesse [aistudio.google.com](https://aistudio.google.com) (link opens in new tab).
2. Faça login com sua conta Google (gratuita).
3. Clique em **"Get API key"** (canto superior esquerdo) → **"Create API key"**.
4. Selecione um projeto Google Cloud ou crie um novo.
5. Copie a chave gerada (começa com `AIza...`).
6. Cole a chave no campo acima e clique em **"Salvar chave"**.

**Rationale**: These are the current steps as of the assistant knowledge cutoff (August 2025). The tutorial is authored as plain text in a React component so it can be updated without touching business logic.

**Note**: If Google AI Studio changes its interface, update only `ApiKeySetup.tsx` — no other files are affected.
