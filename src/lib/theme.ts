// lib/theme.ts
import type { ArtifactMode } from '../data/types';

// ─────────────────────────────────────────────────────────
// Color ramps
// ─────────────────────────────────────────────────────────
export const palette = {
  emerald: {
    50: '#ecfdf5',
    100: '#d1fae5',
    400: '#34d399',
    500: '#10b981',
    600: '#059669',
    700: '#047857',
    900: '#064e3b',
  },
  amber: {
    50: '#fffbeb',
    100: '#fef3c7',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    900: '#78350f',
  },
  rose: {
    50: '#fff1f2',
    100: '#ffe4e6',
    400: '#fb7185',
    500: '#f43f5e',
    600: '#e11d48',
    700: '#be123c',
    900: '#881337',
  },
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    950: '#0a0a0a',
  },
  blue: {
    500: '#3b82f6',
    600: '#2563eb',
  },
  // Locked dark-canonical surface tokens — single source for anything
  // rendered on a dark background (web portal, studio shell).
  dark: {
    bg: '#09090b',
    surface: '#141416',
    surfaceRaised: '#1a1a1d',
    border: 'rgba(255,255,255,0.06)',
    borderStrong: 'rgba(255,255,255,0.12)',
    text: '#fafafa',
    textMuted: 'rgba(255,255,255,0.65)',
    textSubtle: 'rgba(255,255,255,0.45)',
    textDisabled: 'rgba(255,255,255,0.30)',
  },
} as const;

// ─────────────────────────────────────────────────────────
// Theme objects
// ─────────────────────────────────────────────────────────
export interface ThemeShape {
  fontFamily: string;
  background: string;
  surface: string;
  border: string;
  heading: string;
  body: string;
  muted: string;
  accent: string;
  danger: string;
  warning: string;
}

const EMAIL_SAFE_FONT_STACK =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

export const emailTheme: ThemeShape = {
  fontFamily: EMAIL_SAFE_FONT_STACK,
  background: palette.neutral[100],
  surface: '#ffffff',
  border: palette.neutral[200],
  heading: palette.neutral[900],
  body: palette.neutral[700],
  muted: palette.neutral[500],
  accent: palette.blue[600],
  danger: palette.rose[600],
  warning: palette.amber[600],
};

export const webTheme: ThemeShape = {
  fontFamily:
    "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  background: palette.dark.bg,
  surface: palette.dark.surface,
  border: palette.dark.border,
  heading: palette.dark.text,
  body: palette.dark.textMuted,
  muted: palette.dark.textSubtle,
  accent: palette.blue[500],
  danger: palette.rose[500],
  warning: palette.amber[500],
};

export const documentTheme: ThemeShape = {
  fontFamily: "'Inter', Arial, Helvetica, sans-serif",
  background: '#ffffff',
  surface: '#ffffff',
  border: palette.neutral[300],
  heading: palette.neutral[900],
  body: palette.neutral[800],
  muted: palette.neutral[600],
  accent: palette.blue[600],
  danger: palette.rose[700],
  warning: palette.amber[700],
};

// ─────────────────────────────────────────────────────────
// Usage color logic — single source of truth (fixes B1: three
// divergent implementations previously lived in this file,
// portal-page.tsx, and Inspector.tsx).
// ─────────────────────────────────────────────────────────
export function getUsageColor(pct: number, mode: ArtifactMode): string {
  if (pct >= 90) return palette.rose[500];
  if (pct >= 70) return palette.amber[500];
  return mode === 'email' ? palette.emerald[600] : palette.emerald[500];
}

// ─────────────────────────────────────────────────────────
// Verified Unlayer column classes
// ─────────────────────────────────────────────────────────
export const VERIFIED_COLUMN_CLASS = 'u-col';
export const VERIFIED_COLUMN_50_CLASS = 'u-col-50';

// ─────────────────────────────────────────────────────────
// Mobile fix CSS (targets verified Unlayer column classes)
// ─────────────────────────────────────────────────────────
export const mobileFixCSS = `
@media only screen and (max-width: 480px) {
  .${VERIFIED_COLUMN_CLASS}.${VERIFIED_COLUMN_50_CLASS} {
    width: 50% !important;
    display: inline-block !important;
    max-width: 50% !important;
  }
  .${VERIFIED_COLUMN_CLASS} {
    display: block !important;
    width: 100% !important;
  }
}

<!--[if mso]>
<style type="text/css">
  .${VERIFIED_COLUMN_CLASS}.${VERIFIED_COLUMN_50_CLASS} {
    width: 50% !important;
    display: inline-block !important;
  }
  table, td { border-collapse: collapse; }
</style>
<![endif]-->
`.trim();

// ─────────────────────────────────────────────────────────
// Print CSS
// ─────────────────────────────────────────────────────────
export const printCSS = `
@page {
  size: A4;
  margin: 0;
}

@media print {
  html, body {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    color-adjust: exact;
  }

  .no-break {
    page-break-inside: avoid;
    break-inside: avoid;
  }

  .page-break-before {
    page-break-before: always;
    break-before: page;
  }

  .page-break-after {
    page-break-after: always;
    break-after: page;
  }
}
`.trim();