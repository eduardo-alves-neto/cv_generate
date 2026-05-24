# Phase 0 Research: Design System Implementation

**Date**: 2026-05-09  
**Feature**: Apply ThoughtStream Design System  
**Branch**: 008-apply-design-system

---

## Research 1: Font Loading Strategy

### Question
Self-hosted fonts (static files) vs Google Fonts API vs system font fallbacks — which approach for Libre Baskerville, Inter, Source Code Pro?

### Decision
**Google Fonts API** (via `@import` in global CSS)

### Rationale

1. **Simplicity**: No additional build complexity; URL-based import in CSS requires zero configuration
2. **Performance**: Google Fonts CDN is globally distributed and aggressively cached by browsers
3. **Zero cost**: Google Fonts is free and requires no API key (unlike custom hosted solutions or paid CDNs)
4. **Browser consistency**: Font rendering via Google Fonts is identical across all browsers (no custom subsetting needed)
5. **Maintenance**: Font updates handled by Google; no need to track font file versions or upgrades
6. **Fallback chain**: If Google Fonts fails, system fonts (Georgia, Helvetica, monospace) provide readable fallback per DESIGN.md spec

### Implementation
```css
/* frontend/src/styles/globals.css */
@import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=Inter:wght@400;500;600;700&family=Source+Code+Pro:wght@400&display=swap');
```

### Alternatives Considered

| Alternative | Why Rejected |
|-------------|-------------|
| Self-hosted static fonts | Adds build complexity (font subsetting, version management), increases bundle size, no better performance than CDN |
| System fonts only | Degraded typography quality; Libre Baskerville serif warmth is core to brand identity |
| Bundles fonts in Next.js/Vite | Over-engineered for zero-cost constraint; Vite static serving doesn't optimize fonts |

---

## Research 2: Color Token Export & Reuse Pattern

### Question
Should color tokens (and later, spacing/typography tokens) be:  
(a) Inline in `frontend/tailwind.config.ts` only, or  
(b) Exported from `packages/tailwind/` for reuse in docs, components, and API responses?

### Decision
**Option (a): Inline in frontend/tailwind.config.ts** (v1); defer `packages/tailwind` until v2

### Rationale

1. **Simplicity (Constitution III)**: Tailwind config is the single source of truth; adding a package layer adds complexity with no current benefit
2. **No external consumers yet**: Backend doesn't need color tokens (API has no color responsibility); only frontend components consume them
3. **Zero cost**: No additional build step, no new package exports
4. **Vite integration**: Tailwind + Vite handle theme config and CSS generation seamlessly
5. **Future-proof**: If future features (docs site, design tool integration) need token export, migrate to `packages/tailwind` then

### Implementation
```typescript
// frontend/tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        // Brand palette
        primary: '#78716C',
        secondary: '#A8A29E',
        tertiary: '#1C1917',
        // Surface palette
        background: '#FAFAF9',
        surface: '#F5F5F4',
        'surface-raised': '#EFEDEB',
        // Content palette
        'text-primary': '#1C1917',
        'text-secondary': '#57534E',
        'text-tertiary': '#A8A29E',
        // Border palette
        'border-subtle': '#E7E5E4',
        'border-medium': '#D6D3D1',
        'border-strong': '#A8A29E',
        // Semantic
        success: '#65A30D',
        warning: '#CA8A04',
        error: '#DC2626',
        info: '#78716C',
      },
    },
  },
};
```

### Alternatives Considered

| Alternative | Why Rejected |
|-------------|-------------|
| Export from `packages/tailwind` now | Adds build step, new package, config import complexity; no current consumers justify it |
| Inline + duplicate in docs | Maintainability burden; tokens will drift between sources |
| CSS custom properties in globals.css | Reduces Tailwind's theming power; Tailwind's config-based approach is idiomatic |

---

## Research 3: Component Refactoring Order & Strategy

### Question
In what order should components be refactored to ThoughtStream specs? Dependency-order (lowest-level first) or visual-order (full pages at a time)?

### Decision
**Dependency-order: atoms → molecules → organisms** (bottom-up)

### Rationale

1. **Integration testing**: Refactoring buttons first means all pages that use buttons can test against the new styles immediately
2. **Minimal rework**: If pages are refactored first, atom-level changes force re-testing; bottom-up avoids re-testing composed components
3. **Parallelizable**: Multiple developers can work on different component layers without conflicts
4. **Staged rollout**: Can deploy color + typography foundations, then add component specs incrementally
5. **Faster feedback**: Visual QA can validate buttons/inputs early; complex pages tested later once foundations are solid

### Component Dependency Graph

```
Level 0 (Atoms): Button, Input, Checkbox, Radio, Chip
    ↓
Level 1 (Molecules): Form groups, Card, List items, Buttons + Icon combos
    ↓
Level 2 (Organisms): Forms, Navigation, Card sections, Page layouts
    ↓
Level 3 (Pages): Home, Job description form, Resume preview, Results
```

### Implementation Strategy

**Phase 1a (Week 1)**: Color tokens + typography globals  
**Phase 1b (Week 2)**: Level 0 atoms (Button, Input, Checkbox, Radio, Chip)  
**Phase 1c (Week 3)**: Level 1 molecules (FormGroup, Card, ListItem)  
**Phase 2a (Week 4)**: Level 2 organisms (Forms, Navigation)  
**Phase 2b (Week 5)**: Level 3 pages + integration testing  

### Alternatives Considered

| Alternative | Why Rejected |
|-------------|-------------|
| Page-by-page refactoring | Inconsistency until all pages done; testing burden multiplied; atoms refactored multiple times |
| Single monolithic refactor | High risk; impossible to land incrementally; rollback affects entire feature |
| Parallel atom + page refactor | Merge conflicts; atoms change underneath pages; testing chaotic |

---

## Summary

All research questions resolved. No blockers. Design system implementation can proceed to Phase 1 (design contracts and quickstart).
