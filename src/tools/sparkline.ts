// tools/sparkline.ts
import type { ToolDefinition } from './types';
import { palette } from '../lib/theme';

// ESCAPE HATCH: vertical-align:bottom on <td> is impossible via
// Column props. This renderer produces an HTML string consumed
// by <Html html={...}> in template components.

// Fix B6: single corner-radius value shared by email HTML bars and
// web (React) bars — do not hardcode a different radius in either.
export const SPARKLINE_BAR_RADIUS = '2px 2px 0 0';

export interface SparklineOptions {
  values: number[];
  max?: number;
  accentColor: string;
  barWidth?: number;
  barGap?: number;
  height?: number;
  [key: string]: unknown;
}

export interface SparklineBar {
  heightPx: number;
  opacity: number;
  value: number;
  normalizedValue: number;
  index: number;
}

function normalize(values: number[], max?: number): number[] {
  const effectiveMax = max ?? (values.length ? Math.max(...values) : 0);
  if (effectiveMax <= 0) {
    return values.map(() => 0);
  }
  return values.map((v) => Math.max(0, Math.min(100, (v / effectiveMax) * 100)));
}

export function getSparklineBars(opts: SparklineOptions): SparklineBar[] {
  const { values, max, height = 40 } = opts;
  const normalized = normalize(values, max);
  const total = values.length;

  return values.map((value, index) => {
    const normalizedValue = normalized[index];
    const heightPx = Math.max(2, (normalizedValue / 100) * height);
    const opacity = 0.4 + (index / Math.max(1, total - 1 || 1)) * 0.6;

    return { heightPx, opacity, value, normalizedValue, index };
  });
}

export function renderSparklineEmail(opts: SparklineOptions): string {
  const { values, max, accentColor, barWidth = 18, barGap = 3, height = 40 } = opts;

  const normalized = normalize(values, max);
  const total = values.length;

  const cells = values
    .map((_value, index) => {
      const normalizedValue = normalized[index];
      const barHeightPx = Math.max(2, Math.round((normalizedValue / 100) * height));
      const opacity = 0.4 + (index / Math.max(1, total - 1 || 1)) * 0.6;
      const paddingLeft = index === 0 ? 0 : barGap;

      return `<td style="width:${barWidth}px;padding-left:${paddingLeft}px;vertical-align:bottom;">` +
        `<div style="height:${barHeightPx}px;min-height:2px;width:${barWidth}px;` +
        `background-color:${accentColor};opacity:${opacity.toFixed(2)};` +
        `border-radius:${SPARKLINE_BAR_RADIUS};"></div>` +
        `</td>`;
    })
    .join('');

  return (
    `<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">` +
    `<tr>${cells}</tr>` +
    `</table>`
  );
}

export const sparklineTool: ToolDefinition<SparklineOptions> = {
  name: 'trueup-sparkline',
  label: 'Usage Sparkline',
  icon: 'bar-chart-2',
  options: {
    values: { type: 'json', defaultValue: [] },
    max: { type: 'number', defaultValue: 100 },
    accentColor: { type: 'color', defaultValue: palette.blue[600] },
    barWidth: { type: 'number', defaultValue: 18 },
    barGap: { type: 'number', defaultValue: 3 },
    height: { type: 'number', defaultValue: 40 },
  },
  renderers: {
    email: renderSparklineEmail,
    web: getSparklineBars,
    document: renderSparklineEmail,
  },
};