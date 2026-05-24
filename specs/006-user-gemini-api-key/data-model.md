# Data Model: User-Provided Gemini API Key

**Feature**: 006-user-gemini-api-key  
**Date**: 2026-04-14

---

## Entity: StoredApiKey (browser only)

Represents the Gemini API key a user has saved in their browser.

| Attribute | Type | Constraints | Notes |
|-----------|------|-------------|-------|
| `value` | `string` | Non-empty after trimming; matches `/^AIza[A-Za-z0-9_-]{35,}$/` pattern | Stored as a plain string in `localStorage['cv_ats_gemini_api_key']` |

**States**:

```text
absent ──(user enters key)──► provided-unvalidated
provided-unvalidated ──(first successful conversion)──► active
provided-unvalidated ──(API rejects key)──► invalid
active ──(API quota exceeded)──► quota-exceeded
active ──(user clears key)──► absent
invalid ──(user re-enters key)──► provided-unvalidated
quota-exceeded ──(user re-enters key or quota resets)──► provided-unvalidated
```

---

## Schema Change: ConvertRequestBodySchema (packages/shared)

The shared Zod schema gains one new required field:

```ts
// packages/shared/src/schemas.ts  (delta)
export const ConvertRequestBodySchema = z.object({
  jobDescription: z.string().min(1).max(10_000),
  geminiApiKey: z.string().min(1, 'API key is required'),
})
```

This field is:
- Validated at the backend boundary (Zod `safeParse`) before any AI call
- Never logged by the backend
- Not included in any response payload

---

## localStorage Layout

```text
Key:   cv_ats_gemini_api_key
Value: <raw API key string, trimmed>
```

No versioning or JSON wrapping — the value is stored as a plain string.  
Cleared by: user action ("Remover chave" button in `ApiKeySetup`), or the user clearing browser storage manually.

---

## No Server-Side Persistence

The API key is **never** stored on the server. The backend:
- Reads `geminiApiKey` from `req.body` for the duration of a single request
- Passes it directly to `GoogleGenAI({ apiKey })` constructor
- Does not write it to logs, the in-memory job store, or any external system
