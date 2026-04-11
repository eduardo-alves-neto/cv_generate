# Feature Specification: Frontend UI Redesign

**Feature Branch**: `004-frontend-ui-redesign`  
**Created**: 2026-04-10  
**Status**: Draft  
**Input**: User description: "precisamos melhorar drasticamente a nossa interface no front-end, atualmente esta muito simples"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Drag-and-Drop File Upload (Priority: P1)

A job seeker opens the tool and immediately understands how to upload their CV. Instead of an invisible browser file picker, they are greeted by a clearly marked drop zone. They drag their PDF onto it and see instant visual feedback confirming the file was accepted (filename, size, green border).

**Why this priority**: The current native file input is the most jarring and unfamiliar element. Replacing it with a visual drop zone is the single change with the biggest impact on perceived quality and ease of use.

**Independent Test**: Can be tested completely in isolation — open the app, drag a PDF onto the drop zone, and verify the file is accepted and named correctly. All other features can remain unchanged.

**Acceptance Scenarios**:

1. **Given** the page is loaded, **When** the user drags a PDF file over the drop zone, **Then** the zone highlights with an active border and "Drop here" text.
2. **Given** a PDF is dropped, **When** the drop completes, **Then** the file name and size appear below the zone and the zone returns to its resting state with a success indicator.
3. **Given** the user clicks the drop zone instead of dragging, **When** the click fires, **Then** the native file picker opens as a fallback.
4. **Given** a non-PDF file is dropped, **When** the drop completes, **Then** an inline error message explains only PDF files are accepted and no file is selected.
5. **Given** a PDF larger than 10 MB is dropped, **When** the drop completes, **Then** an inline error states the size limit and no file is selected.

---

### User Story 2 - Animated Progress Feedback (Priority: P2)

While the AI processes the CV, the user sees a step-by-step animated progress indicator instead of a generic spinner. Each stage ("Reading your CV", "Optimising for ATS", "Generating PDF") lights up in sequence, giving the user confidence that something meaningful is happening and how far along the process is.

**Why this priority**: The conversion takes 3–8 seconds. A named progress flow dramatically reduces perceived wait time and eliminates the anxiety of not knowing whether the tool is stuck. It also educates users about what the tool actually does.

**Independent Test**: Can be tested by submitting a valid conversion and verifying all steps appear and animate in order. The download step works independently of any upload UX change.

**Acceptance Scenarios**:

1. **Given** the user submits the form, **When** conversion starts, **Then** the form is replaced by a progress view showing at least 3 named stages.
2. **Given** the progress view is shown, **When** each stage begins, **Then** the corresponding label activates (e.g., bold, coloured icon) and previous stages show a completion mark.
3. **Given** the conversion completes successfully, **When** the final stage finishes, **Then** the progress view transitions smoothly to the success state.
4. **Given** the conversion fails mid-process, **When** the error is received, **Then** the active stage shows an error indicator and a human-readable error message is displayed below.

---

### User Story 3 - Polished Hero Header and Branding (Priority: P3)

A first-time visitor arrives at the page and immediately understands the tool's value. The header goes beyond a plain `<h1>`: it includes a brief tagline, a subtle background treatment (gradient or pattern), and the product name is visually prominent. A short "How it works" summary (3 icons + labels) appears below the header before the form.

**Why this priority**: First impressions shape trust. A visually polished header communicates that the tool is professional and reliable, which is especially important for job seekers who will trust it with their personal career documents.

**Independent Test**: Can be assessed purely by viewing the landing state — no interaction required. The header and how-it-works section render independently of the form and conversion flow.

**Acceptance Scenarios**:

1. **Given** the page loads, **When** the viewport is desktop-sized (≥ 768 px wide), **Then** the header occupies the full width, the product name is at least 32 px, and the tagline is visible below it.
2. **Given** the page loads, **When** the viewport is mobile-sized (< 768 px), **Then** the header text stacks vertically without overflow and remains legible.
3. **Given** the "How it works" section is rendered, **When** inspected, **Then** exactly 3 steps are displayed, each with a distinct icon and a one-line label.

---

### User Story 4 - Success Screen with Conversion Summary (Priority: P4)

After a successful conversion, the user sees a polished success screen that replaces the generic "Your ATS CV is ready!" text. It includes a prominent download button, a brief bullet-point summary of the improvements made (sourced from the AI response metadata or a static tip list), and a clearly visible "Convert another CV" action.

**Why this priority**: The success state is the payoff moment. Enhancing it increases satisfaction and reduces the likelihood the user leaves thinking "did it actually work?". It is lower priority than upload and progress because users reach it only after the other flows succeed.

**Independent Test**: Can be tested by completing a full conversion and verifying the success screen layout, the download button, and the "Convert another" link all work correctly.

**Acceptance Scenarios**:

1. **Given** conversion succeeds, **When** the success screen appears, **Then** the download button is prominently displayed above the fold.
2. **Given** the success screen is shown, **When** the user clicks the download button, **Then** the browser downloads a file named `ats-cv.pdf`.
3. **Given** the success screen is shown, **When** the user clicks "Convert another CV", **Then** the form resets to idle state, blobUrl is revoked, and the upload zone is empty.

---

### Edge Cases

- What happens when the user drops a file while conversion is already in progress? The drop zone must be disabled and show a locked state.
- What happens if the user navigates away and returns during conversion? The in-memory state is lost; the page returns to idle with no error (no persistent state is guaranteed).
- What happens if the browser does not support the drag-and-drop API? The click-to-browse fallback must always be available.
- What happens if the progress steps finish faster than the minimum animation duration? Steps must display for at least 600 ms each so users can read the labels.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Users MUST be able to upload a PDF by dragging it onto a visible drop zone.
- **FR-002**: Users MUST be able to upload a PDF by clicking the drop zone to open a file picker (fallback).
- **FR-003**: The drop zone MUST display a highlighted state while a file is being dragged over it.
- **FR-004**: The drop zone MUST display the selected file's name and size after a successful drop or file selection.
- **FR-005**: The drop zone MUST display an inline error and reject the file if it is not a PDF or exceeds 10 MB.
- **FR-006**: The drop zone MUST be non-interactive (locked appearance) while conversion is in progress.
- **FR-007**: The progress view MUST display at least 3 labelled processing stages in sequence during conversion.
- **FR-008**: Each progress stage MUST visually distinguish between pending, active, and completed states.
- **FR-009**: The header MUST display the product name, a tagline, and a 3-step "How it works" summary on every page load.
- **FR-010**: The header and how-it-works section MUST be responsive and legible on screens from 320 px to 1 440 px wide.
- **FR-011**: The success screen MUST contain a single prominent download button and a "Convert another CV" action.
- **FR-012**: Clicking "Convert another CV" MUST fully reset the interface to its initial idle state, including clearing the drop zone.
- **FR-013**: All existing functional behaviour (file validation, job description textarea, error messages, API call) MUST continue to work without regression.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A new user understands the tool's purpose without scrolling — the header, tagline, and how-it-works steps are all visible on first load at 1 280 × 800 px.
- **SC-002**: The time from page load to the user completing file selection is reduced — the drop zone is larger and more discoverable than the previous 14 px-tall native input.
- **SC-003**: During a conversion, the user can read the name of the current processing stage at all times — labels are at least 14 px and visible without scrolling on mobile.
- **SC-004**: 100% of existing acceptance scenarios for file validation, error display, and download remain passing after the redesign (no functional regressions).
- **SC-005**: The interface renders without layout breakage at 320 px, 768 px, and 1 280 px viewport widths.

## Assumptions

- The redesign is a visual and interaction upgrade only; no changes to the backend API, data models, or business logic are in scope.
- The tool continues to support a single-page, single-conversion flow — no multi-file upload, history, or authentication is introduced.
- The existing component structure (ConvertForm, ResultCard, ProgressSpinner, HomePage) will be refactored in place; no routing changes are required.
- The AI processing steps displayed during the progress animation are static labels — they do not reflect real-time server events, as the backend uses a single synchronous response.
- Mobile-first responsiveness is required; tablet and desktop layouts are enhancements above the mobile baseline.
- The "How it works" section contains static content (no CMS or dynamic content source).
