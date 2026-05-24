# API Contract: POST /api/convert

**Feature**: 006-user-gemini-api-key  
**Version change**: This contract updates the existing `/api/convert` endpoint to accept a user-supplied API key.

---

## Endpoint

```
POST /api/convert
Content-Type: multipart/form-data
```

---

## Request

### Form Fields

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `file` | File (PDF) | Yes | MIME type `application/pdf`; max 10 MB |
| `jobDescription` | string | Yes | 1–10 000 characters |
| `geminiApiKey` | string | Yes | Non-empty string; trimmed before use |

**Breaking change**: `geminiApiKey` is now a required field. Requests that omit it will receive a `400` error with code `AI_UNAVAILABLE`.

---

## Response

### Success `200 OK`

```
Content-Type: application/pdf
Content-Disposition: attachment; filename="ats-cv-<jobId>.pdf"
Content-Length: <bytes>
X-Job-Id: <uuid>
```

Body: binary PDF buffer.

### Error `400 Bad Request`

```json
{
  "error": "<human-readable message>",
  "code": "INVALID_FILE" | "FILE_TOO_LARGE" | "INVALID_JOB_DESCRIPTION"
}
```

### Error `422 Unprocessable Entity`

```json
{
  "error": "<human-readable message>",
  "code": "UNREADABLE_PDF"
}
```

### Error `503 Service Unavailable`

```json
{
  "error": "<human-readable message>",
  "code": "AI_UNAVAILABLE"
}
```

Covers: missing/invalid/quota-exceeded API key, or Gemini service outage.

### Error `504 Gateway Timeout`

```json
{
  "error": "The AI service timed out. Please try again.",
  "code": "AI_TIMEOUT"
}
```

---

## Security Notes

- `geminiApiKey` MUST be transmitted over HTTPS in production.
- The backend MUST NOT include `geminiApiKey` in any log line, error message body, or stored job record.
- The backend MUST NOT forward `geminiApiKey` to any service other than the configured AI provider.
