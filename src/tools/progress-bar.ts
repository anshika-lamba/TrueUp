// tools/progress-bar.ts
import type React from 'react';
import type { ArtifactMode } from '../data/types';
import type { ToolDefinition } from './types';
import { getUsageColor, palette } from '../lib/theme';

// ESCAPE HATCH: pixel-calculated <td> widths for fill/track are
// impossible via Column props. HTML string consumed by <Html html={...}>.

export interface ProgressBarOptions {
  percent: number;
  height?: number;
  mode: ArtifactMode;
  containerWidth?: number;
  [key: string]: unknown;
}

export interface ProgressBarStyleData {
  containerStyle: React.CSSProperties;
  fillStyle: React.CSSProperties;
  trackStyle: React.CSSProperties;
  color: string;
  displayPercent: number;
  isOverage: boolean;
}

function getTrackColor(mode: ArtifactMode): string {
  return mode === 'web' ? palette.neutral[800] : palette.neutral[200];
}

export function renderProgressBarEmail(opts: ProgressBarOptions): string {
  const { percent, height = 8, mode, containerWidth = 560 } = opts;

  const displayPercent = Math.min(percent, 100);
  const color = getUsageColor(percent, mode);
  const trackColor = getTrackColor(mode);

  const fillWidth = Math.round((displayPercent / 100) * containerWidth);
  const remainWidth = containerWidth - fillWidth;

  const fillCell =
    `<td style="width:${fillWidth}px;height:${height}px;background:${color};` +
    `border-radius:${remainWidth > 0 ? `${height / 2}px 0 0 ${height / 2}px` : `${height / 2}px`};` +
    `font-size:0;line-height:0;">&nbsp;</td>`;

  const trackCell =
    remainWidth > 0
      ? `<td style="width:${remainWidth}px;height:${height}px;background:${trackColor};` +
        `border-radius:0 ${height / 2}px ${height / 2}px 0;font-size:0;line-height:0;">&nbsp;</td>`
      : '';

  return (
    `<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;width:${containerWidth}px;">` +
    `<tr>${fillCell}${trackCell}</tr>` +
    `</table>`
  );
}

export function getProgressBarStyle(opts: ProgressBarOptions): ProgressBarStyleData {
  const { percent, height = 8, mode } = opts;

  const displayPercent = Math.min(percent, 100);
  const isOverage = percent > 100;
  const color = getUsageColor(percent, mode);
  const trackColor = getTrackColor(mode);

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    height,
    borderRadius: height / 2,
    overflow: 'hidden',
    background: trackColor,
  };

  const fillStyle: React.CSSProperties = {
    width: `${displayPercent}%`,
    height: '100%',
    background: color,
    borderRadius: height / 2,
    ...(mode === 'web' ? { transition: 'width 0.3s ease' } : {}),
    ...(isOverage && mode === 'web'
      ? {
          backgroundImage:
            'repeating-linear-gradient(45deg, rgba(255,255,255,0.15) 0, ' +
            'rgba(255,255,255,0.15) 4px, transparent 4px, transparent 8px)',
        }
      : {}),
  };

  const trackStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    background: trackColor,
  };

  return { containerStyle, fillStyle, trackStyle, color, displayPercent, isOverage };
}

export const progressBarTool: ToolDefinition<ProgressBarOptions> = {
  name: 'trueup-progress-bar',
  label: 'Usage Progress Bar',
  icon: 'trending-up',
  options: {
    percent: { type: 'number', defaultValue: 0 },
    height: { type: 'number', defaultValue: 8 },
    mode: { type: 'string', defaultValue: 'email' },
    containerWidth: { type: 'number', defaultValue: 560 },
  },
  renderers: {
    email: renderProgressBarEmail,
    web: getProgressBarStyle,
    document: renderProgressBarEmail,
  },
};