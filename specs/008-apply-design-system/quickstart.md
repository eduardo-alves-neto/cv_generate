# Developer Quickstart: ThoughtStream Design System

**For**: Frontend developers implementing components  
**Reference**: [data-model.md](./data-model.md) for complete token definitions  
**Source of Truth**: [../../DESIGN.md](../../DESIGN.md)

---

## Quick Setup

### 1. Font Import (Global)

Add to `frontend/src/styles/globals.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=Inter:wght@400;500;600;700&family=Source+Code+Pro:wght@400&display=swap');

@layer base {
  body {
    @apply font-sans bg-background text-text-primary;
  }

  /* Typography scale */
  .text-display { @apply font-serif text-4xl font-bold leading-tight tracking-tighter; }
  .text-headline { @apply font-serif text-3xl font-bold leading-snug tracking-tight; }
  .text-subhead { @apply font-serif text-2xl font-normal leading-relaxed tracking-tight; }
  .text-body-lg { @apply font-sans text-xl font-normal leading-relaxed; }
  .text-body { @apply font-sans text-base font-normal leading-relaxed; }
  .text-body-sm { @apply font-sans text-sm font-normal leading-relaxed; }
  .text-caption { @apply font-sans text-xs font-normal leading-tight tracking-widest; }
  .text-overline { @apply font-sans text-xs font-semibold leading-snug tracking-widest uppercase; }
  .text-code { @apply font-mono text-sm font-normal leading-relaxed; }
}
```

### 2. Tailwind Config

Extend `frontend/tailwind.config.ts`:

```typescript
export default {
  theme: {
    extend: {
      colors: {
        // Brand
        primary: '#78716C',
        secondary: '#A8A29E',
        tertiary: '#1C1917',
        // Surface
        background: '#FAFAF9',
        surface: '#F5F5F4',
        'surface-raised': '#EFEDEB',
        // Content
        'text-primary': '#1C1917',
        'text-secondary': '#57534E',
        'text-tertiary': '#A8A29E',
        // Border
        'border-subtle': '#E7E5E4',
        'border-medium': '#D6D3D1',
        'border-strong': '#A8A29E',
        // Semantic
        success: '#65A30D',
        warning: '#CA8A04',
        error: '#DC2626',
        info: '#78716C',
      },
      spacing: {
        // 12px base unit
        3: '12px',
        6: '24px',
        9: '36px',
        12: '48px',
        15: '60px',
        18: '72px',
        21: '84px',
        24: '96px',
        27: '108px',
        30: '120px',
      },
      borderRadius: {
        0: '0px',
        full: '9999px', // avatars only
      },
      fontFamily: {
        serif: ['Libre Baskerville', 'Georgia', 'Times New Roman', 'serif'],
        sans: ['Inter', '-apple-system', 'Segoe UI', 'Helvetica', 'sans-serif'],
        mono: ['Source Code Pro', 'Fira Code', 'Consolas', 'monospace'],
      },
    },
  },
};
```

---

## Component Examples

### Button

```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

export function Button({ variant = 'primary', size = 'md', disabled, ...props }: ButtonProps) {
  const baseClasses = 'font-sans font-semibold transition-colors duration-200 rounded-none';
  
  const variantClasses = {
    primary: 'bg-primary text-background border border-primary hover:bg-opacity-95 active:bg-opacity-90',
    secondary: 'bg-transparent text-primary border border-border-medium hover:bg-surface active:bg-surface-raised',
    ghost: 'bg-transparent text-primary border-none hover:bg-surface active:bg-surface-raised',
    destructive: 'bg-error text-background border border-error hover:bg-opacity-95 active:bg-opacity-90',
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-xs',      // 8px 16px / 13px
    md: 'px-6 py-3 text-sm',      // 12px 24px / 15px
    lg: 'px-9 py-4 text-base',    // 16px 36px / 17px
  };

  const disabledClasses = disabled ? 'opacity-40 cursor-not-allowed' : '';

  return (
    <button
      className={clsx(baseClasses, variantClasses[variant], sizeClasses[size], disabledClasses)}
      disabled={disabled}
      {...props}
    />
  );
}
```

### Input

```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

export function Input({ label, helperText, error, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-2">
      {label && <label className="text-xs font-semibold text-text-secondary">{label}</label>}
      <input
        className={clsx(
          'h-12 bg-background border border-border-medium rounded-none px-4 py-3 font-sans text-sm',
          'text-text-primary placeholder-text-tertiary',
          'focus:outline-none focus:border-primary focus:ring-2 focus:ring-background focus:ring-offset-2 focus:ring-offset-primary',
          error && 'border-error',
          props.disabled && 'bg-surface opacity-50 cursor-not-allowed'
        )}
        {...props}
      />
      {error && <span className="text-xs text-error">{error}</span>}
      {helperText && !error && <span className="text-xs text-text-tertiary">{helperText}</span>}
    </div>
  );
}
```

### Card

```typescript
interface CardProps {
  elevated?: boolean;
  children: React.ReactNode;
}

export function Card({ elevated = false, children }: CardProps) {
  return (
    <div
      className={clsx(
        'border rounded-none p-9',
        elevated
          ? 'bg-surface border-border-medium'
          : 'bg-background border-border-subtle hover:border-border-medium transition-colors'
      )}
    >
      {children}
    </div>
  );
}
```

### Typography Utilities

```typescript
export const Typography = {
  Display: (props: React.HTMLAttributes<HTMLHeadingElement>) => 
    <h1 className="text-display" {...props} />,
  
  Headline: (props: React.HTMLAttributes<HTMLHeadingElement>) => 
    <h2 className="text-headline" {...props} />,
  
  Subhead: (props: React.HTMLAttributes<HTMLHeadingElement>) => 
    <h3 className="text-subhead" {...props} />,
  
  Body: (props: React.HTMLAttributes<HTMLParagraphElement>) => 
    <p className="text-body" {...props} />,
  
  BodySmall: (props: React.HTMLAttributes<HTMLParagraphElement>) => 
    <p className="text-body-sm" {...props} />,
  
  Caption: (props: React.HTMLAttributes<HTMLElement>) => 
    <span className="text-caption" {...props} />,
};
```

---

## Common Patterns

### Color Usage

```tsx
// Primary action
<button className="bg-primary text-background">Submit</button>

// Secondary action
<button className="border border-border-medium text-primary">Cancel</button>

// Emphasis text
<h2 className="text-tertiary">Important heading</h2>

// Disabled state
<button className="opacity-40 cursor-not-allowed">Disabled</button>

// Error message
<span className="text-error">This field is required</span>

// Success badge
<span className="bg-success text-background text-overline">✓ Complete</span>
```

### Spacing

```tsx
// Section spacing (gap between major sections)
<div className="py-30">
  <Typography.Headline>Section</Typography.Headline>
</div>

// Component padding
<Card className="p-12">Content</Card>

// Tight spacing
<div className="gap-3 flex flex-col">
  <p>Item 1</p>
  <p>Item 2</p>
</div>
```

### Focus States

All interactive elements must have visible focus rings:

```tsx
<input
  className={clsx(
    'border border-border-medium',
    'focus:outline-none',
    'focus:border-primary',
    'focus:ring-2 focus:ring-background focus:ring-offset-2 focus:ring-offset-primary'
  )}
/>
```

---

## Accessibility Checklist

- [ ] All text has sufficient color contrast (4.5:1 for normal, 3:1 for large)
- [ ] Interactive elements have 44px minimum height/width
- [ ] Focus ring is visible on all keyboard navigation
- [ ] Buttons use `<button>` tag (not divs with onclick)
- [ ] Form inputs have `<label>` tags
- [ ] Images have `alt` text
- [ ] Icon buttons have `aria-label`
- [ ] Color isn't the only way to convey meaning (use icons, text, patterns)

---

## Testing Visual Compliance

1. **Manual Testing**: Compare rendered component against DESIGN.md spec
   - Colors: Use color picker to verify hex values
   - Spacing: Measure padding/margins with browser DevTools
   - Typography: Confirm font family, size, weight, line-height

2. **Visual Regression Tests** (Playwright):
   ```typescript
   test('Button renders with primary variant', async ({ page }) => {
     await page.goto('/components/button');
     await expect(page.locator('[data-test="button-primary"]')).toHaveCSS('background-color', 'rgb(120, 113, 108)'); // #78716C
   });
   ```

3. **Responsive Testing**:
   - Mobile (320px): All elements visible, no overflow
   - Tablet (768px): Section spacing increases to 84px
   - Desktop (1024px+): Section spacing increases to 120px

---

## Troubleshooting

**Issue**: Colors don't match DESIGN.md
- **Solution**: Verify Tailwind config has all color tokens; check for Tailwind class typos (e.g., `bg-primary` not `bg-brand-primary`)

**Issue**: Fonts not loading
- **Solution**: Check Google Fonts import in globals.css; verify font names match CSS family names

**Issue**: Focus ring not visible
- **Solution**: Ensure `focus:ring-2` and `focus:ring-offset-2` classes are present; check for `outline-none` override

**Issue**: Spacing doesn't align to 12px grid
- **Solution**: Use Tailwind spacing utilities (p-3, p-6, py-30, etc.) not arbitrary values

---

## See Also

- [data-model.md](./data-model.md) — Complete token definitions
- [../../DESIGN.md](../../DESIGN.md) — Full design system spec
- [../../CLAUDE.md](../../CLAUDE.md) — Project architecture + dev commands
