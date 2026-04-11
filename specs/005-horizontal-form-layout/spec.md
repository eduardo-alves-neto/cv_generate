# Feature Specification: Horizontal Form Layout

**Feature Branch**: `005-horizontal-form-layout`  
**Created**: 2026-04-11  
**Status**: Draft  
**Input**: User description: "AS INFORMAÇÕES DO TOPO NÃO SÃO NESCESSARIAS, O CONTEUDO PRINCIPAL DEVE SER ALINHADO HORIZONTALMENTE(OU SEJA, O CAMPO DE COLOCAR A DESCRIÇÃO DA VAGA DEVE FICAR A ESQUERDA DO CAMPO DE COLOCAR O CURRICULO)"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Two-Column Side-by-Side Form (Priority: P1)

A returning user opens the tool and is immediately presented with the conversion form — no hero text or explainer steps to scroll past. The job description textarea occupies the left half of the screen and the PDF drop zone occupies the right half, both at the same height. The user can fill both fields simultaneously without vertical scrolling.

**Why this priority**: This is the entire scope of the feature. The two-column layout is the direct answer to the user request and delivers the full value in a single deliverable unit.

**Independent Test**: Open the page at a viewport width of 1024 px or wider. The job description field and the CV upload zone must be visible side by side without scrolling. No hero header or "How it works" section must appear on the page.

**Acceptance Scenarios**:

1. **Given** the page loads at a desktop viewport (≥ 768 px wide), **When** the user views the page, **Then** the job description textarea and the PDF drop zone appear side by side on the same row, each occupying approximately half the available width.
2. **Given** the page loads at a mobile viewport (< 768 px wide), **When** the user views the page, **Then** the two fields stack vertically (PDF drop zone above or below the textarea) without horizontal overflow.
3. **Given** the two-column layout is displayed, **When** the user inspects the page, **Then** no hero header section and no "How it works" explainer section are present.
4. **Given** both fields are filled and the user submits, **When** the conversion succeeds, **Then** the success screen replaces the form exactly as it did before — the layout change does not affect the conversion flow.
5. **Given** the page is viewed at exactly 768 px wide, **When** the user views the page, **Then** the layout does not produce horizontal scrollbars or visually broken columns.

---

### Edge Cases

- What happens when the textarea is focused and grows taller than the drop zone? Both columns must maintain consistent top alignment; the drop zone must not shrink or collapse.
- What happens when a validation error message appears under one of the fields? The error message expands the column it belongs to vertically without breaking the overall horizontal alignment of the two columns.
- What happens on a screen narrower than 320 px? The layout must not produce horizontal overflow; minimum safe width is 320 px.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The page MUST display the job description textarea and the PDF upload zone side by side on viewports ≥ 768 px wide.
- **FR-002**: The two columns MUST occupy equal width (approximately 50/50 split) within the available content area on desktop viewports.
- **FR-003**: On viewports < 768 px, the layout MUST stack the two fields vertically with no horizontal overflow.
- **FR-004**: The hero header section (product name, tagline) MUST be removed from the page.
- **FR-005**: The "How it works" three-step explainer section MUST be removed from the page.
- **FR-006**: The submit button MUST remain visible and accessible below both columns on all viewport sizes.
- **FR-007**: The progress indicator MUST continue to appear after form submission, below the two columns, unchanged in behaviour.
- **FR-008**: All existing field validation (PDF-only, 10 MB limit, job description required) MUST continue to work without regression.
- **FR-009**: The privacy disclosure line MUST remain visible below the submit button.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: On a 1280 × 800 px desktop viewport, both the job description field and the PDF upload zone are fully visible without scrolling on page load.
- **SC-002**: The page renders without horizontal scrollbars or overflow at 320 px, 768 px, and 1280 px viewport widths.
- **SC-003**: The removal of the hero and "How it works" sections reduces the vertical distance a user must scroll before reaching the form to zero — the form is the first visible element on page load at all viewport sizes.
- **SC-004**: 100% of existing acceptance scenarios for file validation, job description validation, error display, conversion, and download remain passing after the layout change.

## Assumptions

- The two-column layout targets desktop-first usage; on mobile the stacked layout is the acceptable fallback.
- The minimum supported viewport width remains 320 px (unchanged from the existing app).
- The page title (`CV to ATS Converter`) may be kept as a compact single-line heading above the two-column form, or removed entirely — a minimal page identifier is assumed useful but its size and prominence are significantly reduced relative to the current hero header.
- The success screen (ResultCard) is not affected by this layout change and remains full-width below where the form was.
- The progress steps indicator (shown during conversion) remains below the form columns and spans the full width.
