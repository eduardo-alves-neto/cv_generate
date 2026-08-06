import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // shadcn/ui compatibility tokens (mapped to the editorial design system)
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          active: 'hsl(var(--primary-active))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        // Editorial design-system extended tokens
        canvas: {
          DEFAULT: 'hsl(var(--canvas))',
          soft: 'hsl(var(--canvas-soft))',
          deep: 'hsl(var(--canvas-deep))',
        },
        ink: 'hsl(var(--ink))',
        hairline: {
          DEFAULT: 'hsl(var(--hairline))',
          soft: 'hsl(var(--hairline-soft))',
          strong: 'hsl(var(--hairline-strong))',
        },
        success: 'hsl(var(--success))',
        warning: 'hsl(var(--warning))',
        info: 'hsl(var(--info))',
        error: 'hsl(var(--error))',
        // Atmospheric gradient orb stops — decoration only, never fills or text
        'gradient-mint': '#a7e5d3',
        'gradient-peach': '#f4c5a8',
        'gradient-lavender': '#c8b8e0',
        'gradient-sky': '#a8c8e8',
        'gradient-rose': '#e8b8c4',
      },
      fontFamily: {
        // Waldenburg Light substitute (licensed typeface) — display serif at weight 300
        serif: ['"EB Garamond"', '"Times New Roman"', 'serif'],
        sans: ['Inter', '-apple-system', '"Segoe UI"', 'Helvetica', 'sans-serif'],
        mono: ['"Source Code Pro"', '"Fira Code"', 'Consolas', 'monospace'],
      },
      borderRadius: {
        // Editorial system: soft pill geometry for CTAs, generous card rounding
        none: '0px',
        xs: '4px',
        sm: '6px',
        DEFAULT: '8px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        xxl: '24px',
        '2xl': '24px',
        pill: '9999px',
        full: '9999px',
      },
      boxShadow: {
        // Single soft-drop shadow tier — used only on hovered cards
        sm: 'none',
        DEFAULT: 'none',
        md: 'none',
        lg: 'none',
        xl: 'none',
        '2xl': 'none',
        inner: 'none',
        'soft-drop': '0 4px 16px rgba(0, 0, 0, 0.04)',
        focus: '0 0 0 2px hsl(var(--canvas)), 0 0 0 4px hsl(var(--ink))',
      },
      // 4px base spacing unit — Tailwind's default scale already aligns
      // (1=4px · 2=8px · 3=12px · 4=16px · 5=20px · 6=24px · 8=32px · 12=48px · 24=96px)
    },
  },
  plugins: [],
}

export default config
