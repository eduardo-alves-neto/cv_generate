# Phase 1 Data Model: ThoughtStream Design System

**Date**: 2026-05-09  
**Feature**: Apply ThoughtStream Design System  
**Branch**: 008-apply-design-system

---

## Design Token System

### Color Tokens

All colors below map to Tailwind CSS `theme.colors` extensions and are available as className utilities (e.g., `bg-primary`, `text-text-primary`, `border-border-subtle`).

#### Brand Palette
| Token | Hex | Tailwind Key | Role |
|-------|-----|--------------|------|
| Primary | `#78716C` | `primary` | Links, active states, icons, primary buttons |
| Secondary | `#A8A29E` | `secondary` | Supporting accents, dividers, secondary text |
| Tertiary | `#1C1917` | `tertiary` | Strong emphasis, headings, dark text |

#### Surface Palette
| Token | Hex | Tailwind Key | Role |
|-------|-----|--------------|------|
| Background | `#FAFAF9` | `background` | Page background, card backgrounds |
| Surface | `#F5F5F4` | `surface` | Section backgrounds, default container |
| Surface Raised | `#EFEDEB` | `surface-raised` | Hover states, callout blocks, elevated surfaces |

#### Content Palette
| Token | Hex | Tailwind Key | Role |
|-------|-----|--------------|------|
| Text Primary | `#1C1917` | `text-primary` | Body copy, headings |
| Text Secondary | `#57534E` | `text-secondary` | Bylines, metadata, captions |
| Text Tertiary | `#A8A29E` | `text-tertiary` | Placeholders, disabled labels |

#### Border Palette
| Token | Hex | Tailwind Key | Role |
|-------|-----|--------------|------|
| Border Subtle | `#E7E5E4` | `border-subtle` | Section dividers (hairline) |
| Border Medium | `#D6D3D1` | `border-medium` | Input borders, card borders |
| Border Strong | `#A8A29E` | `border-strong` | Emphasis borders |

#### Semantic Palette
| Token | Hex | Tailwind Key | Role |
|-------|-----|--------------|------|
| Success | `#65A30D` | `success` | Success messages, checkmarks |
| Warning | `#CA8A04` | `warning` | Warning messages, alerts |
| Error | `#DC2626` | `error` | Error messages, destructive actions |
| Info | `#78716C` | `info` | Info messages, help text |

---

## Typography System

### Font Stack
| Level | Font Family | Fallback Chain |
|-------|-------------|-----------------|
| **Display/Headings** | Libre Baskerville | Georgia, Times New Roman, serif |
| **UI/Body** | Inter | -apple-system, Segoe UI, Helvetica, sans-serif |
| **Mono/Code** | Source Code Pro | Fira Code, Consolas, monospace |

### Type Scale

All values available as Tailwind utilities. Semantic class names (e.g., `.text-heading`, `.text-body`) map to size + weight + line-height combos.

| Level | Font | Size | Weight | Line Height | Letter Spacing | Usage | Tailwind |
|-------|------|------|--------|-------------|----------------|-------|----------|
| **Display** | Libre Baskerville | 40px | 700 | 1.2 | -0.02em | Hero article titles | `text-display` |
| **Headline** | Libre Baskerville | 30px | 700 | 1.3 | -0.015em | Post titles | `text-headline` |
| **Subhead** | Libre Baskerville | 22px | 400 | 1.4 | -0.01em | Section headings | `text-subhead` |
| **Body Large** | Inter | 20px | 400 | 1.75 | 0 | Featured paragraph, lede | `text-body-lg` |
| **Body** | Inter | 17px | 400 | 1.8 | 0 | Default reading text | `text-body` (default) |
| **Body Small** | Inter | 15px | 400 | 1.7 | 0 | Sidebar text, footnotes | `text-body-sm` |
| **Caption** | Inter | 13px | 400 | 1.5 | 0.01em | Image captions, dates | `text-caption` |
| **Overline** | Inter | 11px | 600 | 1.4 | 0.08em | Category labels | `text-overline` |
| **Code** | Source Code Pro | 15px | 400 | 1.7 | 0 | Inline code, blocks | `text-code` |

**Implementation**: Use `@layer base` in globals.css to define semantic utilities:
```css
@layer base {
  .text-display { @apply font-serif text-4xl font-bold leading-tight -tracking-wide; }
  .text-headline { @apply font-serif text-3xl font-bold leading-snug -tracking-tight; }
  .text-body { @apply font-sans text-base font-normal leading-relaxed; }
  /* ... etc */
}
```

---

## Spacing System

| Property | Value | Tailwind Config |
|----------|-------|-----------------|
| Base Unit | 12px | `spacing: { 0: '0', 3: '12px', ... }` |
| Scale | 12, 24, 36, 48, 60, 72, 96, 120 | Multiples of base unit |
| Component Padding (small) | 12px | `p-3` |
| Component Padding (medium) | 24px | `p-6` |
| Component Padding (large) | 48px | `p-12` |
| Section Spacing (mobile) | 60px | `py-15` |
| Section Spacing (tablet) | 84px | `py-21` |
| Section Spacing (desktop) | 120px | `py-30` |

**Note**: Tailwind's default spacing scale (0, 4, 8, 12, 16, ...) is replaced with multiples of 12px (0, 12, 24, 36, 48, 60, 72, 84, 96, 108, 120).

---

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| **None** | 0px | All elements (default) — sharp geometric edges |
| **Full** | 9999px | Avatars only — circular |

**Implementation**: 
- Set `borderRadius: { '0': '0px', 'full': '9999px' }` in Tailwind config
- Default (no `rounded-*` class) = 0px
- Only avatars use `rounded-full`

---

## Shadow System

**Philosophy**: ThoughtStream is completely flat. No shadows.

| Level | CSS Value | Usage |
|-------|-----------|-------|
| All | `none` | No drop shadows on any element |
| **Focus Ring** | `0 0 0 2px #FAFAF9, 0 0 0 4px #78716C` | Keyboard focus indicators |

---

## Component Specifications

All specs extracted directly from DESIGN.md. Components organized by layer (atoms → molecules → organisms).

### Level 0: Atoms

#### Button Component
**Variants**: Primary, Secondary, Ghost, Destructive  
**Sizes**: Small (8px 16px / 13px), Medium (12px 24px / 15px), Large (16px 36px / 17px)

**Primary Button**
- Background: primary (#78716C)
- Text: background (#FAFAF9)
- Border: 1px solid primary
- Padding: 12px 24px (medium)
- Font: Inter 15px weight 600
- Radius: 0px
- Hover: background #57534E
- Active: background #44403C
- Disabled: opacity 0.4, cursor not-allowed

**Secondary Button** (similar pattern)  
**Ghost Button** (similar pattern)  
**Destructive Button** (similar pattern)

#### Input Component
- Height: 48px
- Background: background (#FAFAF9)
- Border: 1px solid border-medium (#D6D3D1)
- Radius: 0px
- Padding: 12px 16px
- Font: Inter 15px weight 400
- Text color: text-primary (#1C1917)
- Placeholder: text-tertiary (#A8A29E)
- Focus: Border primary, ring `0 0 0 2px #FAFAF9, 0 0 0 4px #78716C`
- Error: Border error (#DC2626)
- Disabled: Background surface, opacity 0.5

**Label**: Inter 13px weight 600, color text-secondary, margin-bottom 8px  
**Helper Text**: Inter 13px weight 400, color text-tertiary, margin-top 6px  
**Error Helper**: Same, color error

#### Checkbox Component
- Size: 18px
- Border: 1.5px solid border-medium
- Radius: 0px
- Background: background
- Checked: Background primary, border primary, checkmark background
- Indeterminate: Background primary, dash background
- Hover: Border primary
- Focus: Ring `0 0 0 2px background, 0 0 0 4px primary`
- Disabled: Opacity 0.4
- Label: Inter 15px weight 400, margin-left 10px

#### Radio Button Component
- Size: 18px
- Border: 1.5px solid border-medium
- Radius: 9999px (full)
- Background: background
- Selected: Border primary, inner dot primary (8px)
- Hover: Border primary
- Focus: Ring `0 0 0 2px background, 0 0 0 4px primary`
- Disabled: Opacity 0.4
- Label: Inter 15px weight 400, margin-left 10px

#### Chip Component (Filter)
- Background: transparent
- Border: 1px solid border-medium
- Radius: 0px
- Padding: 6px 14px
- Font: Inter 13px weight 500
- Text: text-secondary
- Selected: Background primary, text background, border primary

#### Chip Component (Status)
- Padding: 4px 12px
- Font: Inter 11px weight 600, uppercase
- Radius: 0px
- Success: Background #F0FDF4, text success, border 1px solid #BBF7D0
- Warning: Background #FEFCE8, text warning, border 1px solid #FEF08A
- Error: Background #FEF2F2, text error, border 1px solid #FECACA

### Level 1: Molecules

#### Card Component
**Default**
- Background: background
- Border: 1px solid border-subtle
- Radius: 0px
- Padding: 36px
- Shadow: none
- Hover: Border border-medium

**Elevated**
- Background: surface
- Border: 1px solid border-medium
- Radius: 0px
- Padding: 36px
- Shadow: none

#### List Item Component
- Padding: 16px 0
- Border bottom: 1px solid border-subtle
- Font: Inter 15px weight 400
- Text: text-primary
- Secondary text: text-tertiary 13px
- Hover: Background surface
- Active: Background surface-raised
- Leading element: 20px icon, color primary

#### Tooltip Component
- Background: tertiary (#1C1917)
- Text: background (#FAFAF9)
- Font: Inter 13px weight 500
- Padding: 8px 14px
- Radius: 0px
- Max width: 240px
- Arrow: 6px, same background color
- Delay: 300ms enter, 0ms leave
- Shadow: none

### Level 2: Organisms

Forms, navigation, and complex sections composed of atoms + molecules. Specifications in DESIGN.md Do's and Don'ts section.

---

## State Transitions

All components support these states:
- **Default**: Initial render
- **Hover**: Mouse over (desktop)
- **Active**: Clicked or selected
- **Focus**: Keyboard or programmatic focus
- **Disabled**: Input disabled, button disabled, etc.
- **Error**: Validation failure state (inputs, forms)
- **Loading**: Async operation in progress (buttons, inputs with loader)

---

## Accessibility Considerations

1. **Focus Ring**: All interactive elements use `0 0 0 2px #FAFAF9, 0 0 0 4px #78716C` for keyboard focus
2. **Color Contrast**: All text colors meet WCAG AA (4.5:1 for normal text, 3:1 for large text)
3. **Touch Targets**: Minimum 44px height for interactive elements (buttons, inputs, list items)
4. **Disabled State**: Opacity 0.4 + cursor not-allowed to indicate interactivity
5. **Semantic HTML**: Use `<button>`, `<input>`, `<label>` elements (not divs with onclick)
6. **ARIA Labels**: Provide `aria-label` or `aria-labelledby` where text isn't visible (icon buttons, etc.)

---

## Implementation Checklist

- [ ] Tailwind config extended with all color tokens
- [ ] Global CSS includes font imports + semantic utilities (text-display, text-body, etc.)
- [ ] Spacing scale updated to 12px base unit
- [ ] Border radius set to 0px default, 9999px for avatars
- [ ] Shadow removed from all components (set to none)
- [ ] Button component updated: all 4 variants + 3 sizes + all states
- [ ] Input component updated: focus ring, error state, disabled state
- [ ] Checkbox updated: checked, indeterminate, focus, disabled states
- [ ] Radio updated: selected, focus, disabled states
- [ ] Chip updated: filter + status variants, all semantic colors
- [ ] Card updated: default + elevated, hover state
- [ ] List item updated: hover, active, leading icon
- [ ] Tooltip updated: all positioning and delay
- [ ] Page layouts refactored: sections use spacing scale, maximum content width 680px
- [ ] Responsive breakpoints preserved: mobile/tablet/desktop layouts functional
- [ ] Visual regression tests pass: all components pixel-perfect vs DESIGN.md
