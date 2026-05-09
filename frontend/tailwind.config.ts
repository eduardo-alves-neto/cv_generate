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
        // shadcn/ui compatibility tokens (map to ThoughtStream values)
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
        // ThoughtStream extended tokens
        surface: {
          DEFAULT: 'hsl(var(--surface))',
          raised: 'hsl(var(--surface-raised))',
        },
        'text-primary': 'hsl(var(--text-primary))',
        'text-secondary': 'hsl(var(--text-secondary))',
        'text-tertiary': 'hsl(var(--text-tertiary))',
        'border-subtle': 'hsl(var(--border-subtle))',
        'border-medium': 'hsl(var(--border-medium))',
        'border-strong': 'hsl(var(--border-strong))',
        success: 'hsl(var(--success))',
        warning: 'hsl(var(--warning))',
        info: 'hsl(var(--info))',
        error: 'hsl(var(--error))',
      },
      fontFamily: {
        // ThoughtStream font stacks
        serif: ['Libre Baskerville', 'Georgia', '"Times New Roman"', 'serif'],
        sans: ['Inter', '-apple-system', '"Segoe UI"', 'Helvetica', 'sans-serif'],
        mono: ['"Source Code Pro"', '"Fira Code"', 'Consolas', 'monospace'],
      },
      borderRadius: {
        // ThoughtStream: completely flat — 0px everywhere, full for avatars only
        none: '0px',
        sm: '0px',
        DEFAULT: '0px',
        md: '0px',
        lg: '0px',
        xl: '0px',
        '2xl': '0px',
        '3xl': '0px',
        full: '9999px',
      },
      boxShadow: {
        // ThoughtStream: completely flat — no shadows
        sm: 'none',
        DEFAULT: 'none',
        md: 'none',
        lg: 'none',
        xl: 'none',
        '2xl': 'none',
        inner: 'none',
        // Focus ring only
        focus: '0 0 0 2px hsl(var(--background)), 0 0 0 4px hsl(var(--primary))',
      },
      spacing: {
        // ThoughtStream 12px base unit scale
        '3': '12px',
        '6': '24px',
        '9': '36px',
        '12': '48px',
        '15': '60px',
        '18': '72px',
        '21': '84px',
        '24': '96px',
        '27': '108px',
        '30': '120px',
      },
    },
  },
  plugins: [],
}

export default config
