# Data Model: CV to ATS Converter

**Branch**: `002-cv-ats-converter` | **Date**: 2026-04-10

All state is **in-memory only**. No database. Data lives for the duration of the backend
process; there is no persistence between restarts.

---

## Entities

### ConversionJob

Represents a single user-initiated conversion request from upload to PDF download.

```typescript
interface ConversionJob {
  id: string;                // uuid v4, generated at request receipt
  cvText: string;            // raw text extracted from uploaded PDF
  jobDescription: string;    // pasted job description text
  status: ConversionStatus;
  createdAt: Date;
  completedAt?: Date;
  errorMessage?: string;     // populated only when status === 'failed'
  result?: ATSResult;        // populated only when status === 'completed'
}

type ConversionStatus = 'pending' | 'processing' | 'completed' | 'failed';
```

**Validation rules** (enforced by Zod at API boundary):
- `cvText`: non-empty string after `.trim()`; max 50,000 characters
- `jobDescription`: non-empty string; min 1 char, max 10,000 characters
- `id`: valid UUID v4

**State transitions**:
```
pending → processing → completed
                    ↘ failed
```

---

### ATSResult

The output of a completed conversion: the generated ATS content and rendered PDF bytes.

```typescript
interface ATSResult {
  jobId: string;             // references ConversionJob.id
  pdfBuffer: Buffer;         // binary PDF data ready to stream to client
  structuredContent: ATSContent; // parsed AI output, used to generate PDF
  createdAt: Date;
}
```

---

### ATSContent

The structured representation of the AI-generated CV content. Parsed from Ollama output
before being fed to PDFKit.

```typescript
interface ATSContent {
  contactInfo: ContactInfo;
  summary?: string;
  experience: ExperienceEntry[];
  education: EducationEntry[];
  skills: string[];
}

interface ContactInfo {
  name: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedin?: string;
}

interface ExperienceEntry {
  company: string;
  role: string;
  period: string;           // e.g. "Jan 2020 – Mar 2023"
  bullets: string[];
}

interface EducationEntry {
  institution: string;
  degree: string;
  period?: string;
}
```

**Validation rules**:
- `contactInfo.name` MUST be non-empty
- `experience` and `education` are arrays; may be empty if not present in source CV
- `skills` is a flat string array; may be empty

---

### UploadedFile (transient)

Represents the incoming PDF file before text extraction. Only lives within the request
handler scope; never stored.

```typescript
interface UploadedFile {
  originalname: string;
  mimetype: string;          // MUST be 'application/pdf'
  size: number;              // bytes; MUST be <= 10_485_760 (10 MB)
  buffer: Buffer;            // raw file bytes from Multer memoryStorage
}
```

**Validation rules** (enforced pre-extraction):
- `mimetype === 'application/pdf'`
- `size <= 10_485_760`

---

## In-Memory Store

The backend holds a single `Map<string, ConversionJob>` keyed by job ID.

```typescript
// backend/src/store/jobs.ts
const jobs = new Map<string, ConversionJob>();
```

Since the application is local and single-user, no concurrency controls or TTL eviction
are needed for v1. The store is cleared on process restart.

---

## Zod Schemas (in `packages/shared/src/schemas.ts`)

```typescript
// ConvertRequestBody — validated from multipart form fields
export const ConvertRequestBodySchema = z.object({
  jobDescription: z.string().min(1).max(10_000),
});

// Error response shape
export const ApiErrorSchema = z.object({
  error: z.string(),
  code: z.enum([
    'INVALID_FILE',
    'FILE_TOO_LARGE',
    'INVALID_JOB_DESCRIPTION',
    'UNREADABLE_PDF',
    'AI_UNAVAILABLE',
    'AI_TIMEOUT',
    'INTERNAL_ERROR',
  ]),
});

export type ApiError = z.infer<typeof ApiErrorSchema>;
export type ConvertRequestBody = z.infer<typeof ConvertRequestBodySchema>;
```
