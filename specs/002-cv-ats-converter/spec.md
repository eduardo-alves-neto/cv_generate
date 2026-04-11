# Feature Specification: CV to ATS Converter

**Feature Branch**: `002-cv-ats-converter`
**Created**: 2026-04-10
**Amended**: 2026-04-10 — AI provider changed from Ollama (local) to Google Gemini API
**Status**: Draft
**Input**: User description: "CV to ATS Converter - gerador de curriculos otimizados para sistemas ATS usando IA"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Upload and Convert CV (Priority: P1)

A job seeker uploads their existing PDF resume and pastes a job description.
They click "Convert to ATS" and, within 30 seconds, download a new PDF that has
been restructured and optimised to pass ATS filters for that specific job posting.

**Why this priority**: This is the complete, end-to-end core workflow of the product.
Without it, no other story has value. Every other story extends or refines this flow.

**Independent Test**: Can be fully tested by uploading a sample PDF + pasting a job
description, clicking Convert, and verifying a valid PDF is returned that contains
the candidate's key data in plain, ATS-readable format.

**Acceptance Scenarios**:

1. **Given** a user has a CV in PDF format and a job description text,
   **When** they upload the PDF and paste the job description then click "Convert to ATS",
   **Then** a new PDF is generated within 30 seconds and made available for download.

2. **Given** the conversion completes successfully,
   **When** the user opens the downloaded PDF,
   **Then** it contains the candidate's key sections (contact info, experience, education,
   skills) in a clean, single-column, ATS-friendly layout — no complex tables, graphics,
   or multi-column formatting.

3. **Given** a user submits the form,
   **When** the AI is processing,
   **Then** a visible progress indicator (e.g., spinner with elapsed time) is shown and
   the UI remains responsive.

---

### User Story 2 - Invalid or Unsupported File Handling (Priority: P2)

A user accidentally uploads a file that is not a valid PDF, or a PDF that cannot be
parsed (e.g., password-protected, corrupted, or image-only scan with no text layer).
They receive a clear, actionable error message explaining what went wrong.

**Why this priority**: Robust error handling protects user experience and prevents silent
failures. Users who get cryptic errors will abandon the tool.

**Independent Test**: Can be fully tested by uploading a non-PDF file, a corrupted PDF,
and an image-only PDF. Each should produce a distinct, readable error message without
crashing the application.

**Acceptance Scenarios**:

1. **Given** a user uploads a file that is not a PDF (e.g., .docx, .jpg),
   **When** they submit the form,
   **Then** an error message is shown immediately (before AI processing) explaining the
   file must be a PDF.

2. **Given** a user uploads a PDF that contains no extractable text (image-only scan),
   **When** the system attempts to parse it,
   **Then** a human-readable error message is shown advising the user to provide a
   text-based PDF or to copy-paste their CV content.

3. **Given** the AI service (Gemini API) is unavailable or returns an error,
   **When** the user submits a valid CV + job description,
   **Then** a clear error message informs them of the issue, with a hint to check their
   API key configuration or try again later.

---

### User Story 3 - Re-download Result (Priority: P3)

A user who has already converted a CV can re-download the result within the same
session without re-running the conversion.

**Why this priority**: Convenience feature — the P1 story already delivers a download;
this ensures the file remains accessible during the current session without re-uploading.

**Acceptance Scenarios**:

1. **Given** a conversion has completed successfully in the current session,
   **When** the user clicks "Download Again",
   **Then** the same PDF is served without re-running the AI and the download begins
   immediately.

---

### Edge Cases

- What happens when the job description field is left empty?
  The system MUST require a non-empty job description before allowing submission.
- What happens when the uploaded PDF exceeds 10 MB?
  The system MUST reject it with a clear message stating the size limit.
- What happens if the CV text is in a language other than Portuguese or English?
  The AI is expected to preserve the input language; no translation is performed.
- What happens if the user navigates away mid-conversion?
  The in-progress conversion is abandoned; no background processing continues after
  the session ends.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST accept a PDF file upload from the user (max 10 MB).
- **FR-002**: System MUST accept a plain-text job description pasted by the user
  (min 1 character, max 10,000 characters).
- **FR-003**: System MUST extract readable text from the uploaded PDF before sending
  it to the AI layer.
- **FR-004**: System MUST send the extracted CV text and job description to the
  configured AI API for optimisation.
- **FR-005**: System MUST return an ATS-optimised PDF to the user for download upon
  successful completion.
- **FR-006**: System MUST display a progress indicator during the AI processing phase.
- **FR-007**: System MUST show a human-readable error message for: invalid file type,
  unreadable PDF, AI service unavailable, and processing timeout.
- **FR-008**: System MUST complete the full conversion workflow within 30 seconds on
  a standard internet connection with the default AI model (Gemini 1.5 Flash).
- **FR-009**: System MUST transmit CV data exclusively to the configured AI provider
  API over HTTPS. No other third-party service, analytics platform, or storage service
  MAY receive user content.
- **FR-010**: System MUST be fully functional on desktop and mobile viewports
  (minimum 320 px wide).
- **FR-011**: System MUST allow re-download of the most recent conversion result
  within the same browser session without re-running the AI.

### Key Entities

- **CV Upload**: A PDF file provided by the user; has raw bytes, extracted text content,
  file name, and file size.
- **Job Description**: Plain text provided by the user describing the target job role,
  requirements, and responsibilities.
- **Conversion Request**: Associates one CV Upload with one Job Description; has a status
  (pending, processing, completed, failed) and a timestamp.
- **ATS Result**: The output PDF generated by the AI layer; belongs to one Conversion
  Request and is available for download during the current session.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A user with a standard text-based PDF resume and a pasted job description
  can complete the full conversion workflow (upload → download) in under 30 seconds.
- **SC-002**: User data (CV text, job description) is transmitted exclusively to the
  Gemini API over HTTPS — verified by network monitoring showing no outbound requests
  to any host other than `generativelanguage.googleapis.com`.
- **SC-003**: The generated ATS PDF contains all key resume sections (contact info,
  experience, education, skills) in a clean, single-column layout with no complex
  formatting elements.
- **SC-004**: Invalid inputs (wrong file type, empty job description) produce an error
  message within 2 seconds, with no crash or unhandled exception.
- **SC-005**: The application renders correctly and all interactive elements are
  accessible on a 375 px wide (mobile) viewport.
- **SC-006**: The development environment starts with a single command after the
  `GEMINI_API_KEY` environment variable is set.

## Assumptions

- Users have a Google Gemini API key (obtainable for free at
  [aistudio.google.com](https://aistudio.google.com)). This is a documented
  prerequisite, not an in-app setup step.
- The application targets modern browsers (Chrome, Firefox, Safari, Edge — last 2 major
  versions). Internet Explorer is out of scope.
- CV files are text-based PDFs (not scanned images). Image-only PDFs are treated as an
  error case (FR-007).
- Result storage is session-only — converted PDFs are held in memory for the duration
  of the browser session. Persistent history across sessions is out of scope.
- No user authentication is required. The application is single-user and does not need
  accounts or login.
- The output PDF language matches the input language; no translation is performed.
- Internet connectivity is required to reach the Gemini API.
