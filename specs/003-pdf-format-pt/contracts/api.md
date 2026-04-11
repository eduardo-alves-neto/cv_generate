# API Contracts: Melhorar Formatação do PDF e Preservar Informações em Português

**Branch**: `003-pdf-format-pt` | **Date**: 2026-04-10

## No API Contract Changes

The REST API surface is unchanged from feature 002. The external contract remains:

```
POST /api/convert
Content-Type: multipart/form-data

Fields:
  file          application/pdf   Required. PDF resume. Max 10 MB.
  jobDescription text/plain       Required. Job description. 1–10,000 chars.

Response (success):
  200 OK
  Content-Type: application/pdf
  Body: PDF binary

Response (errors):
  415  { error: string, code: "INVALID_FILE" }
  413  { error: string, code: "FILE_TOO_LARGE" }
  400  { error: string, code: "INVALID_JOB_DESCRIPTION" }
  422  { error: string, code: "UNREADABLE_PDF" }
  503  { error: string, code: "AI_UNAVAILABLE" }
  504  { error: string, code: "AI_TIMEOUT" }
  500  { error: string, code: "INTERNAL_ERROR" }
```

The only observable change for consumers is that the **content of the returned PDF** is now in Portuguese and contains more complete information from the uploaded CV.

```
GET /api/health
Response: 200 { status: "ok" }
```
