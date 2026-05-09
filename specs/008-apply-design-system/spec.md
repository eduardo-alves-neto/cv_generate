# Feature Specification: Apply ThoughtStream Design System

**Feature Branch**: `008-apply-design-system`  
**Created**: 2026-05-09  
**Status**: Draft  
**Input**: User description: "mudarmos o estilo do front end(sem remover libs de estilização que ja temos) para seguir exatamente o padrão especificado pelo arquivo @DESIGN.md ( este arquivo sera a fonte da verdade sobre a estilização do nosso site)"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Color System Foundation (Priority: P1)

All UI elements across the application render using the ThoughtStream color palette. Users see consistent warm, neutral tones anchoring the interface while content takes visual priority. The color system is defined in design tokens and integrated into Tailwind CSS configuration.

**Why this priority**: Color is foundational to visual identity and perception. All other styling depends on having tokens available. This MVP slice ensures the entire palette is accessible to developers.

**Independent Test**: Can be tested by verifying Tailwind extends `theme.colors` with all ThoughtStream tokens (Primary #78716C, Secondary #A8A29E, Tertiary #1C1917, Background #FAFAF9, Surface #F5F5F4, etc.) and all UI elements use these tokens instead of arbitrary hex values.

**Acceptance Scenarios**:

1. **Given** a freshly loaded app page, **When** inspecting element colors, **Then** all interactive elements (buttons, links, borders) use one of the ThoughtStream color tokens
2. **Given** the Tailwind config file, **When** checking theme.colors, **Then** all brand, surface, content, border, and semantic colors from DESIGN.md are defined
3. **Given** a button component, **When** rendered on page, **Then** its text, background, and border use tokens (not hardcoded hex values)

---

### User Story 2 - Typography System (Priority: P2)

All text across the app uses the ThoughtStream font stack with proper type scale. Headlines render in Libre Baskerville for literary warmth, body text in Inter for clarity, and code in Source Code Pro. Each text element uses correct size, weight, and line height from the scale.

**Why this priority**: Typography is core to reading experience and brand perception. Once colors are set, typography provides the most visible transformation. Independently testable by checking font rendering.

**Independent Test**: Can be tested by verifying page displays correct fonts (inspect font-family computed styles), all heading levels use Libre Baskerville, body text uses Inter with 1.8 line height, and code blocks use Source Code Pro. Checking that the type scale (Display 40px, Headline 30px, Body 17px, etc.) is applied to corresponding elements.

**Acceptance Scenarios**:

1. **Given** a page with headline text, **When** inspecting computed styles, **Then** font-family is Libre Baskerville and size is 30px weight 700
2. **Given** body copy on page, **When** measuring rendered text, **Then** font is Inter, size 17px, line-height 1.8
3. **Given** a code snippet inline or in a block, **When** viewing rendered output, **Then** font is Source Code Pro, size 15px, line-height 1.7

---

### User Story 3 - Component Visual Specifications (Priority: P3)

All UI components (buttons, inputs, cards, chips, lists, checkboxes, tooltips, etc.) render with exact visual specifications from DESIGN.md: correct padding, border styles, hover/active states, disabled appearance, and color usage. No decorative elements, gradients, or rounded corners (except avatars at full circle).

**Why this priority**: Components enforce the design system rules across the interface. P3 because once foundation (colors, typography) is solid, component styling completes the visual transformation.

**Independent Test**: Can be tested by rendering component gallery with all variants (primary/secondary/ghost/destructive buttons in normal/hover/active/disabled states, input fields in focus/error/disabled, cards elevated/default, etc.) and visually comparing to DESIGN.md specifications.

**Acceptance Scenarios**:

1. **Given** a primary button component, **When** rendered, **Then** background is #78716C, text is #FAFAF9, padding is 12px 24px, border-radius is 0px, and hover state changes background to #57534E
2. **Given** a text input field, **When** in focus state, **Then** border is #78716C and focus ring is `0 0 0 2px #FAFAF9, 0 0 0 4px #78716C`
3. **Given** a card component, **When** rendered, **Then** background is #FAFAF9, border is 1px solid #E7E5E4, radius is 0px, padding is 36px, shadow is none
4. **Given** disabled elements anywhere, **When** viewed, **Then** opacity is 0.4 and cursor is not-allowed

---

### Edge Cases

- What happens when custom colors from old design are referenced in inline styles or deprecated classnames? (All should be replaced with ThoughtStream tokens)
- How does system handle font fallback if Libre Baskerville fails to load? (Falls back to Georgia, then Times New Roman, then serif)
- What about dark mode or high-contrast accessibility modes? (Not in scope for v1; DESIGN.md light theme only)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Tailwind CSS configuration MUST extend theme with all ThoughtStream color tokens (brand, surface, content, border, semantic palettes as defined in DESIGN.md)
- **FR-002**: All text elements MUST use correct font from ThoughtStream font stack (Libre Baskerville for headings, Inter for UI/body, Source Code Pro for code)
- **FR-003**: All text elements MUST apply correct size, weight, and line-height from the type scale (e.g., Display 40px/700, Headline 30px/700, Body 17px/400)
- **FR-004**: Spacing across the app MUST follow 12px base unit system with scales of 12, 24, 36, 48, 60, 72, 96, 120px
- **FR-005**: All interactive elements MUST have 0px border-radius except avatars which use full circular rounding (9999px)
- **FR-006**: System MUST render completely flat with no shadows (all shadow properties set to none)
- **FR-007**: Button components MUST support all variants (Primary, Secondary, Ghost, Destructive) with exact specs: colors, padding, borders, hover/active/disabled states
- **FR-008**: Input fields MUST display with correct styling: 48px height, 12px 16px padding, focus ring, error border color, disabled opacity
- **FR-009**: Card components MUST render with default and elevated variants per specs (different backgrounds and borders)
- **FR-010**: Chip, list, checkbox, radio, and tooltip components MUST match all visual specifications in DESIGN.md
- **FR-011**: No breaking changes to component APIs or React prop interfaces — styling only
- **FR-012**: Existing dependencies (Tailwind CSS, shadcn/ui, lucide-react, clsx) MUST NOT be removed or downgraded

### Key Entities

- **Color Token**: A named color value (e.g., Primary #78716C) mapped to semantic role in UI (anchors, links, icons)
- **Typography Token**: Font family, size, weight, line-height combo assigned to semantic level (Display, Headline, Body, Caption, etc.)
- **Component Spec**: Visual definition including colors, spacing, borders, shadows, states for a reusable UI element
- **Design System**: ThoughtStream — minimal, contemplative design philosophy prioritizing white space and typographic clarity over ornament

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of color values in rendered UI match ThoughtStream palette hex codes from DESIGN.md (verifiable by visual inspection and computed style checking)
- **SC-002**: 100% of text renders in correct font family from font stack (no fallback to system fonts unless file fails to load)
- **SC-003**: All component visual specs (padding, borders, spacing, shadows, radius) match DESIGN.md pixel-for-pixel (testable via layout inspection)
- **SC-004**: Page layout stability: no layout shift or reflow when theme is applied (responsive breakpoints maintain functionality)
- **SC-005**: All buttons, inputs, cards, and interactive elements support hover/focus/active/disabled visual states per spec
- **SC-006**: Zero performance regression: page load time, First Contentful Paint, and Cumulative Layout Shift metrics remain within 5% of baseline

## Assumptions

- Libre Baskerville, Inter, and Source Code Pro fonts are either already loaded in the project or will be added via Google Fonts or local files during implementation
- Mobile-first responsive design is preserved; only CSS styling changes, no layout restructuring needed
- Tailwind CSS is already in use and configuration can be extended (no major version changes needed)
- Component library (shadcn/ui) adapts smoothly to new Tailwind configuration without breaking
- DESIGN.md represents the complete, final visual specification and will not change during implementation
- Users have modern browsers supporting CSS Grid, CSS custom properties, and modern font features (no IE11 support needed)
- Existing React component structure and props remain unchanged; only inline styles and Tailwind classnames are updated
