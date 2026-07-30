import type { ArtifactMode, ViewportMode } from '../data/types';

export interface MeasureConfig {
  contentWidth: number;
  gutterWidth: number;
  columnGap: number;
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
  };
}

const EMAIL_MEASURE: MeasureConfig = {
  contentWidth: 600,
  gutterWidth: 24,
  columnGap: 16,
  fontSize: {
    xs: '11px',
    sm: '13px',
    base: '14px',
    lg: '16px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '32px',
  },
};

const WEB_MEASURE: MeasureConfig = {
  contentWidth: 900,
  gutterWidth: 32,
  columnGap: 24,
  fontSize: {
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    xl: '22px',
    '2xl': '28px',
    '3xl': '40px',
  },
};

const DOCUMENT_MEASURE: MeasureConfig = {
  contentWidth: 794, // A4 @ 96dpi
  gutterWidth: 40,
  columnGap: 20,
  fontSize: {
    xs: '10px',
    sm: '11px',
    base: '12px',
    lg: '14px',
    xl: '18px',
    '2xl': '22px',
    '3xl': '28px',
  },
};

export function getMeasure(mode: ArtifactMode): MeasureConfig {
  switch (mode) {
    case 'email':
      return EMAIL_MEASURE;
    case 'web':
      return WEB_MEASURE;
    case 'document':
      return DOCUMENT_MEASURE;
    default:
      return EMAIL_MEASURE;
  }
}

export function getBodyBg(mode: ArtifactMode): string {
  switch (mode) {
    case 'email':
      return '#f5f5f5';
    case 'web':
      return '#0a0a0a';
    case 'document':
      return '#e5e5e5';
    default:
      return '#f5f5f5';
  }
}

export function getContainerBg(mode: ArtifactMode): string {
  switch (mode) {
    case 'email':
      return '#ffffff';
    case 'web':
      return '#171717';
    case 'document':
      return '#ffffff';
    default:
      return '#ffffff';
  }
}

export function getCanvasWidth(mode: ArtifactMode, viewport: ViewportMode): number {
  if (viewport === 'mobile') {
    return 390;
  }
  return getMeasure(mode).contentWidth;
}