# Feature Specification: User-Provided Gemini API Key

**Feature Branch**: `006-user-gemini-api-key`  
**Created**: 2026-04-14  
**Status**: Draft  
**Input**: User description: "em vez de termos nossa propria chave da api do gemini, podemos pedir esta chave para que vai estar usando nosso sistema, mas temos que deixar um tutoria de como o usuario podera pegar esta chave"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Provide API Key Before Converting (Priority: P1)

A new user arrives at the CV converter tool for the first time. Before being able to use the conversion feature, the system prompts them to supply their own Gemini API key. The user can follow an embedded, step-by-step tutorial to obtain a free key from Google AI Studio, paste it into a dedicated input field, and then proceed with the conversion as normal.

**Why this priority**: Without a valid API key, no conversion can occur. This is the foundational gate that every user must pass through before any other user story is relevant.

**Independent Test**: Can be fully tested by visiting the app without an API key and verifying that the key input field and tutorial appear, that entering a valid key unlocks the conversion button, and that a conversion completes successfully.

**Acceptance Scenarios**:

1. **Given** the user has not yet provided an API key, **When** they open the application, **Then** the conversion form is disabled and a prominent notice informs them that an API key is required.
2. **Given** the user has pasted a valid API key and confirmed it, **When** they submit the conversion form, **Then** the conversion proceeds and returns a result without errors.
3. **Given** the user enters an invalid or malformed API key, **When** they attempt to run a conversion, **Then** the system displays a clear error message explaining that the key is invalid and directing them back to the tutorial.

---

### User Story 2 - Follow the Tutorial to Obtain a Key (Priority: P2)

A user does not yet have a Gemini API key. They open the in-app tutorial and follow the steps to create a Google account (if needed), navigate to Google AI Studio, and generate a free API key. After completing the tutorial, they return to the application ready to paste their new key.

**Why this priority**: The tutorial is the primary self-service mechanism that reduces friction and support burden. Users who cannot find or understand the tutorial will abandon the product.

**Independent Test**: Can be fully tested by following the tutorial steps end-to-end and confirming that each step accurately describes the current Google AI Studio interface and that the resulting key works in the application.

**Acceptance Scenarios**:

1. **Given** the user has not yet obtained an API key, **When** they click "Como obter minha chave?" (or equivalent help link), **Then** a step-by-step tutorial is displayed describing exactly how to get a free Gemini API key from Google AI Studio.
2. **Given** the tutorial is visible, **When** the user reads through it, **Then** it covers: where to go, what account/permissions are needed, how to generate the key, and how to copy and paste it into the application.
3. **Given** the user has followed all tutorial steps, **When** they return to the API key input field, **Then** they can paste the copied key and the application accepts it without further configuration.

---

### User Story 3 - Key Persisted Across Sessions (Priority: P3)

A returning user who has previously entered their API key opens the application and immediately sees the conversion form ready for use — they are not asked to re-enter the key on every visit.

**Why this priority**: Convenience for returning users; prevents repeated friction for a credential that rarely changes.

**Independent Test**: Can be tested independently by entering a key, closing the browser, reopening the app, and verifying that the key field is pre-populated and conversion works without re-entry.

**Acceptance Scenarios**:

1. **Given** the user previously saved a valid API key, **When** they revisit the application, **Then** the key is pre-loaded and the conversion form is immediately available.
2. **Given** the user wants to use a different key, **When** they clear or update the stored key, **Then** the new key is used for subsequent conversions and the old key is discarded.

---

### Edge Cases

- What happens when the user's API key is valid but has exceeded Google's free-tier quota? The system should display a meaningful message distinct from "invalid key" and point the user to check their quota in Google AI Studio.
- What happens if the user pastes the key with leading/trailing whitespace? The system should silently trim whitespace before validation.
- What happens if the user clears browser storage? The system should detect the missing key and prompt them to re-enter it, showing the tutorial link again.
- What happens if the tutorial steps become outdated due to Google AI Studio interface changes? The tutorial content should be easy to update independently of other product code.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display an API key input field to users who have not yet provided a key, blocking access to the conversion feature until a key is supplied.
- **FR-002**: System MUST validate that the supplied key is non-empty and conforms to the expected format before accepting it.
- **FR-003**: System MUST store the provided API key in the user's browser so it persists across page reloads and sessions without requiring server-side storage of user credentials.
- **FR-004**: System MUST use the user-supplied key for all AI service calls and MUST NOT fall back to any system-wide key.
- **FR-005**: System MUST provide a step-by-step tutorial — accessible directly within the application — explaining how to obtain a free Gemini API key from Google AI Studio.
- **FR-006**: The tutorial MUST cover at minimum: (1) where to go to create a key, (2) what Google account is needed, (3) how to generate and copy the key, and (4) how to paste it into the application.
- **FR-007**: System MUST display a user-friendly error when the AI service rejects the key, distinguishing between "invalid key" and "quota exceeded" where the service provides that information.
- **FR-008**: System MUST allow users to update or remove their stored API key at any time via a clearly labeled action in the interface.
- **FR-009**: System MUST silently strip leading and trailing whitespace from the key before validation and storage.

### Key Entities

- **API Key**: The credential supplied by the user. Stored only in the user's own browser. Has states: absent, provided-but-unvalidated, active, invalid, quota-exceeded.
- **Tutorial**: A self-contained instructional guide embedded in the application. Contains ordered steps with descriptions. Maintained independently of conversion logic so it can be updated without touching business code.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A user with no prior Gemini experience can obtain a free API key and successfully run their first conversion within 5 minutes of opening the application.
- **SC-002**: 90% of users who begin the tutorial complete it and successfully enter a working key on their first attempt.
- **SC-003**: Returning users with a stored key experience zero extra steps — the conversion form is immediately available without re-entering their key.
- **SC-004**: API key errors (invalid or quota-exceeded) are communicated in plain language, with actionable next steps, so users can self-resolve without outside support.
- **SC-005**: The system never exposes the user's API key in application logs, error messages displayed to others, or URLs.

## Assumptions

- Users accessing the application have a modern web browser that supports local storage; no server-side session management is required for key persistence.
- Google AI Studio continues to offer a free tier for Gemini API keys; the tutorial is written based on this premise.
- The tutorial will be authored in Portuguese (pt-BR) to match the application's existing language.
- Only one API key per browser session is needed; multi-account or multi-key management is out of scope.
- The application remains single-user per browser session; key-sharing or team credential management is not required.
- The existing backend can accept the API key forwarded per-request from the frontend rather than reading it exclusively from a server environment variable.
