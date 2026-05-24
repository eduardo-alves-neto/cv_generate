# Data Model: Prioritize Job Description Requirements in CV Conversion

**Feature**: 007-job-desc-priority  
**Date**: 2026-04-17

## No data model changes

This feature introduces no new entities, fields, or state transitions.

The existing data flow is unchanged:

```
POST /api/convert (multipart)
  └── file: PDF binary
  └── jobDescription: string
  └── geminiApiKey: string
        │
        ▼
  extractTextFromPdf() → cvText: string
        │
        ▼
  generateATSContent(cvText, jobDescription, apiKey) → rawAIResponse: string
        │  ← ONLY THIS FUNCTION'S PROMPT_TEMPLATE CHANGES
        ▼
  parseATSContent(rawAIResponse) → ATSContent
        │
        ▼
  generatePDF(structuredContent) → pdfBuffer: Buffer
        │
        ▼
  Response: PDF binary
```

All TypeScript types (`ATSContent`, `ConvertRequestBody`, `ExperienceEntry`, etc.) remain unchanged. No Zod schema additions are needed because no new external data boundaries are introduced.
