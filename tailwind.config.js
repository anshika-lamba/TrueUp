/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // rgb(var(...) / <alpha-value>) pattern lets opacity modifiers
        // (bg-foreground/95, bg-geist-red/[0.08]) work correctly.
        background: 'rgb(var(--color-bg) / <alpha-value>)',
        foreground: {
          DEFAULT: 'rgb(var(--color-text) / <alpha-value>)',
          muted: 'var(--text-muted)',
          subtle: 'var(--text-subtle)',
          disabled: 'var(--text-disabled)',
        },
        geist: {
          'accent-1': 'rgb(var(--color-accent-1) / <alpha-value>)',
          'accent-2': 'rgb(var(--color-accent-2) / <alpha-value>)',
          red: 'rgb(var(--color-danger) / <alpha-value>)',
          blue: 'rgb(var(--color-info) / <alpha-value>)',
          success: 'rgb(var(--color-success) / <alpha-value>)',
          warning: 'rgb(var(--color-warning) / <alpha-value>)',
        },
        studio: {
          bg: '#09090b',
          surface: '#18181b',
          border: '#27272a',
          muted: '#3f3f46',
          text: '#fafafa',
          subtext: '#a1a1aa',
        },
      },
      fontFamily: {
        sans: [
          'Geist',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'sans-serif',
        ],
        mono: [
          '"Geist Mono"',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'monospace',
        ],
      },
      fontSize: {
        micro: ['10px', { lineHeight: '14px', letterSpacing: '0' }],
        'body-sm': ['13px', { lineHeight: '18px', letterSpacing: '-0.01em' }],
        body: ['14px', { lineHeight: '20px', letterSpacing: '-0.01em' }],
        'body-lg': ['16px', { lineHeight: '22px', letterSpacing: '-0.015em' }],
        'display-sm': ['18px', { lineHeight: '24px', letterSpacing: '-0.015em' }],
        'display-md': ['24px', { lineHeight: '30px', letterSpacing: '-0.02em' }],
        'display-lg': ['32px', { lineHeight: '38px', letterSpacing: '-0.03em' }],
      },
      boxShadow: {
        // shadow-as-border tokens — single source in index.css :root
        'ring-1': 'var(--shadow-flat)',
        'ring-1-strong': 'var(--shadow-raised)',
        'level-2': 'var(--shadow-raised)',
        'level-3': 'var(--shadow-elevated)',
        'level-3-highlight': 'var(--shadow-modal)',
        'focus-ring': 'var(--shadow-focus)',
      },
      transitionTimingFunction: {
        'geist-out': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
};