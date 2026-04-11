# API Contracts: CV to ATS Converter

**Branch**: `002-cv-ats-converter` | **Date**: 2026-04-10
**Base URL**: `http://localhost:3001/api` (dev)

---

## POST /convert

Accepts a CV PDF + job description. Returns an ATS-optimised PDF for download.

### Request

```
POST /api/convert
Content-Type: multipart/form-data
```

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `cv` | File (PDF) | Yes | `application/pdf`, max 10 MB |
| `jobDescription` | string | Yes | 1–10,000 characters |

### Success Response

```
HTTP 200 OK
Content-Type: application/pdf
Content-Disposition: attachment; filename="ats-cv.pdf"

[binary PDF data]
```

### Error Responses

All error bodies follow this shape:
```json
{ "error": "<human-readable message>", "code": "<ERROR_CODE>" }
```

| HTTP Status | Code | When |
|-------------|------|------|
| `400` | `INVALID_FILE` | No file attached, or file is not a PDF |
| `400` | `FILE_TOO_LARGE` | PDF exceeds 10 MB |
| `400` | `INVALID_JOB_DESCRIPTION` | jobDescription missing or empty |
| `422` | `UNREADABLE_PDF` | PDF parses but contains no extractable text |
| `503` | `AI_UNAVAILABLE` | Ollama is not running or unreachable at localhost:11434 |
| `504` | `AI_TIMEOUT` | Ollama did not respond within 90 seconds |
| `500` | `INTERNAL_ERROR` | Unexpected server error |

### Example error body

```json
{
  "error": "Could not extract text from the uploaded PDF. Please use a text-based PDF or copy-paste your CV content.",
  "code": "UNREADABLE_PDF"
}
```

---

## GET /health

Liveness check. Used by the frontend to detect whether the backend and Ollama are
reachable before the user submits a conversion.

### Request

```
GET /api/health
```

### Response

```
HTTP 200 OK
Content-Type: application/json
```

```json
{
  "status": "ok",
  "ollama": "available" | "unavailable"
}
```

- `status` is always `"ok"` as long as the backend process is running.
- `ollama` reflects whether the backend can reach `http://localhost:11434` at the time
  of the request.

---

## Ollama Internal Contract

The backend calls Ollama's local HTTP API directly. This is an **internal** contract
(not exposed to the frontend), documented here for implementation reference.

### Endpoint

```
POST http://localhost:11434/api/generate
Content-Type: application/json
```

### Request body

```json
{
  "model": "llama3.2:3b",
  "stream": false,
  "prompt": "<see Prompt Template below>"
}
```

### Response body (Ollama)

```json
{
  "response": "<generated text>",
  "done": true
}
```

Only `response` is used. Validated against:
```typescript
const OllamaResponseSchema = z.object({
  response: z.string(),
  done: z.boolean(),
});
```

### Prompt Template

The backend interpolates CV text and job description into the following prompt:

```
You are a professional CV writer specialising in ATS optimisation.

Given the following CV content and job description, rewrite the CV
to maximise its score in Applicant Tracking Systems. Output ONLY
the structured CV in the exact format below — no extra commentary.

=== JOB DESCRIPTION ===
{jobDescription}

=== ORIGINAL CV ===
{cvText}

=== OUTPUT FORMAT ===
CONTACT_INFO:
Name: <full name>
Email: <email or NONE>
Phone: <phone or NONE>
Location: <city, country or NONE>
LinkedIn: <url or NONE>

SUMMARY:
<2-3 sentence professional summary tailored to the job>

EXPERIENCE:
<Company> | <Job Title> | <Start – End>
- <achievement bullet 1>
- <achievement bullet 2>

EDUCATION:
<Institution> | <Degree> | <Year>

SKILLS:
<comma-separated list of relevant skills>
```

### Parsing rules

The backend parser reads the Ollama response line-by-line:
- Lines matching `SECTION_HEADER:` begin a new section
- Lines beginning with `- ` inside EXPERIENCE are bullet points
- `|`-delimited lines in EXPERIENCE are company/role/period headers
- The SKILLS line is split on `,`
- Any field value of `NONE` is treated as absent (`undefined`)

---

## CORS Policy

```
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Methods: GET, POST
Access-Control-Allow-Headers: Content-Type
```

The backend only allows requests from the Vite dev server. In production builds the
frontend is served by the same Express process (static files), so CORS is not needed.
