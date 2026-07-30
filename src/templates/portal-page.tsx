import * as React from 'react';
import { Page, Row, Column, Heading, Paragraph, Button, Divider, Html } from '@unlayer/react-elements';
import type { BillingPayload, UsageMetric, MetricTrend } from '../data/types';
import { palette, mobileFixCSS } from '../lib/theme';
import {
  formatCurrency,
  formatNumber,
  formatPercent,
  calcUsagePercent,
  formatDateShort,
  formatPeriod,
  formatUnitPrice,
} from '../lib/format';
import { getSparklineBars } from '../tools/sparkline';
import { getProgressBarStyle } from '../tools/progress-bar';

// Hard-coded dark theme colors — Portal always renders on dark bg
const COLORS = {
  bg: '#09090b',
  surface: '#141416',
  surfaceHover: '#1a1a1d',
  border: 'rgba(255,255,255,0.08)',
  borderStrong: 'rgba(255,255,255,0.12)',
  text: '#fafafa',
  textMuted: 'rgba(255,255,255,0.65)',
  textSubtle: 'rgba(255,255,255,0.45)',
  textDisabled: 'rgba(255,255,255,0.30)',
} as const;

function getUsageColorDark(pct: number): string {
  if (pct >= 90) return '#f43f5e'; // rose
  if (pct >= 70) return '#f59e0b'; // amber
  return '#10b981'; // emerald
}

function trendGlyph(trend: MetricTrend): { symbol: string; color: string } {
  if (trend === 'up') return { symbol: '↑', color: '#f43f5e' };
  if (trend === 'down') return { symbol: '↓', color: '#10b981' };
  return { symbol: '→', color: COLORS.textSubtle };
}

function categoryBadgeColor(category: UsageMetric['category']): string {
  switch (category) {
    case 'compute':
      return '#3b82f6';
    case 'storage':
      return '#10b981';
    case 'network':
      return '#f59e0b';
    case 'api':
      return '#f43f5e';
    case 'database':
      return '#a855f7';
    default:
      return COLORS.textMuted;
  }
}

// Rule 2: Row[] not Fragment
function buildMetricCards(metrics: UsageMetric[]): React.ReactElement[] {
  return metrics.map((metric) => {
    const pct = calcUsagePercent(metric.used, metric.limit);
    const usageColor = getUsageColorDark(pct);
    const { symbol, color: trendColor } = trendGlyph(metric.trend);
    const badgeColor = categoryBadgeColor(metric.category);
    const bars = getSparklineBars({
      values: metric.sparklineValues,
      accentColor: usageColor,
      barWidth: 4,
      barGap: 2,
      height: 28,
    });
    const progressStyle = getProgressBarStyle({
      percent: pct,
      height: 6,
      mode: 'web',
      containerWidth: 260,
    });

    return (
      <Row
        key={metric.id}
        style={{
          background: COLORS.surface,
          borderRadius: '12px',
          border: `1px solid ${COLORS.border}`,
          borderTop: `2px solid ${usageColor}`,
          padding: '18px 20px',
          marginBottom: '10px',
        }}
      >
        <Column style={{ width: '100%' }}>
          <Row style={{ marginBottom: '10px' }}>
            <Column style={{ width: '70%' }}>
              <Paragraph
                style={{
                  color: COLORS.text,
                  fontWeight: 600,
                  fontSize: '14px',
                  margin: '0 0 4px 0',
                  letterSpacing: '-0.01em',
                }}
              >
                {metric.label}
              </Paragraph>
              <Paragraph
                style={{
                  display: 'inline-block',
                  color: badgeColor,
                  background: `${badgeColor}18`,
                  border: `1px solid ${badgeColor}30`,
                  borderRadius: '4px',
                  fontSize: '10px',
                  padding: '2px 6px',
                  margin: '0',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                }}
              >
                {metric.category.toUpperCase()}
              </Paragraph>
            </Column>
            <Column style={{ width: '30%', textAlign: 'right' }}>
              <Paragraph style={{ color: trendColor, margin: 0, fontWeight: 700, fontSize: '16px' }}>
                {symbol}
              </Paragraph>
            </Column>
          </Row>

          <Row>
            <Column style={{ width: '60%' }}>
              <Paragraph
                style={{
                  color: COLORS.text,
                  fontSize: '22px',
                  fontWeight: 700,
                  margin: 0,
                  letterSpacing: '-0.03em',
                  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                }}
              >
                {formatNumber(metric.used, true)}
                <span
                  style={{
                    color: COLORS.textSubtle,
                    fontSize: '13px',
                    fontWeight: 400,
                    marginLeft: '6px',
                  }}
                >
                  / {formatNumber(metric.limit, true)} {metric.unit}
                </span>
              </Paragraph>
            </Column>
            <Column style={{ width: '40%', textAlign: 'right' }}>
              <Paragraph
                style={{
                  color: usageColor,
                  fontSize: '20px',
                  fontWeight: 800,
                  margin: 0,
                  letterSpacing: '-0.03em',
                  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                }}
              >
                {formatPercent(pct)}
              </Paragraph>
            </Column>
          </Row>

          <Row style={{ marginTop: '10px' }}>
            <Column style={{ width: '100%' }}>
              <div style={progressStyle.containerStyle}>
                <div style={progressStyle.fillStyle} />
              </div>
            </Column>
          </Row>

          <Row style={{ marginTop: '12px' }}>
            <Column style={{ width: '50%' }}>
              <Paragraph style={{ color: COLORS.textSubtle, fontSize: '11px', margin: 0, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}>
                {formatUnitPrice(metric.overageRate, metric.unit)}
              </Paragraph>
            </Column>
            <Column style={{ width: '50%', textAlign: 'right' }}>
              <div style={{ display: 'inline-flex', alignItems: 'flex-end', gap: '2px' }}>
                {bars.map((bar) => (
                  <div
                    key={bar.index}
                    style={{
                      width: '4px',
                      height: `${bar.heightPx}px`,
                      background: usageColor,
                      opacity: bar.opacity,
                      borderRadius: '1px',
                    }}
                  />
                ))}
              </div>
            </Column>
          </Row>
        </Column>
      </Row>
    );
  });
}

// Rule 2: Row[] not Fragment
function buildInvoiceRows(payload: BillingPayload): React.ReactElement[] {
  return payload.lineItems.map((item, index) => (
    <Row
      key={item.id}
      style={{
        background: index % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)',
        borderBottom: `1px solid ${COLORS.border}`,
        padding: '12px 4px',
      }}
    >
      <Column style={{ width: '55%' }}>
        <Paragraph style={{ color: COLORS.text, margin: 0, fontSize: '13px', fontWeight: 500 }}>
          {item.description}
          {item.isOverage ? (
            <span
              style={{
                display: 'inline-block',
                color: '#f43f5e',
                background: 'rgba(244,63,94,0.1)',
                border: '1px solid rgba(244,63,94,0.3)',
                borderRadius: '3px',
                fontSize: '9px',
                padding: '1px 5px',
                marginLeft: '8px',
                fontWeight: 700,
                letterSpacing: '0.08em',
                verticalAlign: 'middle',
              }}
            >
              OVERAGE
            </span>
          ) : null}
        </Paragraph>
      </Column>
      <Column style={{ width: '20%', textAlign: 'center' }}>
        <Paragraph
          style={{
            color: COLORS.textMuted,
            margin: 0,
            fontSize: '12px',
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
          }}
        >
          {formatNumber(item.quantity, true)} {item.unit}
        </Paragraph>
      </Column>
      <Column style={{ width: '25%', textAlign: 'right' }}>
        <Paragraph
          style={{
            color: COLORS.text,
            margin: 0,
            fontWeight: 700,
            fontSize: '13px',
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
            letterSpacing: '-0.02em',
          }}
        >
          {formatCurrency(item.amount, payload.currency)}
        </Paragraph>
      </Column>
    </Row>
  ));
}

export interface PortalPageProps {
  payload: BillingPayload;
}

function PortalPage({ payload }: PortalPageProps): React.ReactElement {
  const activeAlerts = payload.metrics.filter(
    (m) => calcUsagePercent(m.used, m.limit) >= payload.alertThreshold
  ).length;

  return (
    <Page
      style={{
        background: COLORS.bg,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        color: COLORS.text,
        minHeight: '100vh',
      }}
    >
      <Row>
        <Column>
          <Html html={`<style>${mobileFixCSS}</style>`} />
        </Column>
      </Row>

      {/* Top Nav */}
      <Row style={{ padding: '20px 28px', borderBottom: `1px solid ${COLORS.border}` }}>
        <Column style={{ width: '50%' }}>
          <Paragraph
            style={{
              color: COLORS.text,
              fontWeight: 700,
              fontSize: '17px',
              margin: 0,
              letterSpacing: '-0.03em',
            }}
          >
            <span
              style={{
                display: 'inline-block',
                width: '22px',
                height: '22px',
                background: COLORS.text,
                color: COLORS.bg,
                textAlign: 'center',
                lineHeight: '22px',
                borderRadius: '5px',
                fontSize: '13px',
                fontWeight: 800,
                marginRight: '8px',
                verticalAlign: 'middle',
                letterSpacing: '-0.05em',
              }}
            >
              T
            </span>
            <span style={{ verticalAlign: 'middle' }}>trueup</span>
            <span
              style={{
                color: payload.brandConfig?.color || '#10b981',
                background: `${payload.brandConfig?.color || '#10b981'}1f`,
                border: `1px solid ${payload.brandConfig?.color || '#10b981'}4c`,
                borderRadius: '4px',
                fontSize: '9px',
                padding: '2px 6px',
                marginLeft: '10px',
                fontWeight: 700,
                letterSpacing: '0.12em',
                verticalAlign: 'middle',
              }}
            >
              FINOPS
            </span>
          </Paragraph>
        </Column>
        <Column style={{ width: '50%', textAlign: 'right' }}>
          <Paragraph style={{ color: COLORS.text, margin: 0, fontSize: '13px', fontWeight: 500 }}>
            {payload.customer.company}
          </Paragraph>
          <Paragraph style={{ color: COLORS.textSubtle, fontSize: '11px', margin: '2px 0 0 0' }}>
            {payload.planName}
          </Paragraph>
        </Column>
      </Row>

      {/* Page Title */}
      <Row style={{ padding: '32px 28px 8px 28px' }}>
        <Column>
          <Heading
            headingType="h1"
            style={{
              color: COLORS.text,
              margin: 0,
              fontSize: '28px',
              fontWeight: 700,
              letterSpacing: '-0.04em',
            }}
          >
            Billing Portal
          </Heading>
          <Paragraph style={{ color: COLORS.textSubtle, margin: '4px 0 0 0', fontSize: '13px' }}>
            {formatPeriod(payload.periodStart, payload.periodEnd)}
            <span style={{ margin: '0 8px', color: COLORS.textDisabled }}>·</span>
            <span style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}>{payload.invoiceId}</span>
          </Paragraph>
        </Column>
      </Row>

      {/* KPI Cards */}
      <Row style={{ padding: '20px 28px 8px 28px' }}>
        <Column style={{ width: '25%', paddingRight: '8px' }}>
          <div
            style={{
              background: COLORS.surface,
              border: `1px solid ${COLORS.border}`,
              borderRadius: '10px',
              padding: '14px 16px',
            }}
          >
            <Paragraph
              style={{
                color: COLORS.textSubtle,
                fontSize: '10px',
                margin: 0,
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                fontWeight: 600,
              }}
            >
              Total Due
            </Paragraph>
            <Paragraph
              style={{
                color: COLORS.text,
                fontSize: '20px',
                fontWeight: 700,
                margin: '6px 0 0 0',
                letterSpacing: '-0.03em',
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
              }}
            >
              {formatCurrency(payload.total, payload.currency)}
            </Paragraph>
          </div>
        </Column>
        <Column style={{ width: '25%', padding: '0 4px' }}>
          <div
            style={{
              background: COLORS.surface,
              border: `1px solid ${COLORS.border}`,
              borderRadius: '10px',
              padding: '14px 16px',
            }}
          >
            <Paragraph
              style={{
                color: COLORS.textSubtle,
                fontSize: '10px',
                margin: 0,
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                fontWeight: 600,
              }}
            >
              Active Alerts
            </Paragraph>
            <Paragraph
              style={{
                color: '#f43f5e',
                fontSize: '20px',
                fontWeight: 700,
                margin: '6px 0 0 0',
                letterSpacing: '-0.03em',
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
              }}
            >
              {formatNumber(activeAlerts)}
            </Paragraph>
          </div>
        </Column>
        <Column style={{ width: '25%', padding: '0 4px' }}>
          <div
            style={{
              background: COLORS.surface,
              border: `1px solid ${COLORS.border}`,
              borderRadius: '10px',
              padding: '14px 16px',
            }}
          >
            <Paragraph
              style={{
                color: COLORS.textSubtle,
                fontSize: '10px',
                margin: 0,
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                fontWeight: 600,
              }}
            >
              Subtotal
            </Paragraph>
            <Paragraph
              style={{
                color: COLORS.text,
                fontSize: '20px',
                fontWeight: 700,
                margin: '6px 0 0 0',
                letterSpacing: '-0.03em',
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
              }}
            >
              {formatCurrency(payload.subtotal, payload.currency)}
            </Paragraph>
          </div>
        </Column>
        <Column style={{ width: '25%', paddingLeft: '8px' }}>
          <div
            style={{
              background: COLORS.surface,
              border: `1px solid ${COLORS.border}`,
              borderRadius: '10px',
              padding: '14px 16px',
            }}
          >
            <Paragraph
              style={{
                color: COLORS.textSubtle,
                fontSize: '10px',
                margin: 0,
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                fontWeight: 600,
              }}
            >
              Services
            </Paragraph>
            <Paragraph
              style={{
                color: COLORS.text,
                fontSize: '20px',
                fontWeight: 700,
                margin: '6px 0 0 0',
                letterSpacing: '-0.03em',
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
              }}
            >
              {formatNumber(payload.metrics.length)}
            </Paragraph>
          </div>
        </Column>
      </Row>

      {/* AI NARRATIVE */}
      {payload.aiNarrative ? (
        <Row style={{ padding: '0 28px 12px 28px' }}>
          <Column>
            <Html html={`
              <div style="color:${COLORS.text};background-color:${payload.brandConfig?.color || '#3b82f6'}1a;border-left:4px solid ${payload.brandConfig?.color || '#3b82f6'};padding:16px 20px;margin:0;border-radius:6px;font-size:14px;line-height:1.6;font-family:'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace';">
                <strong style="font-weight:700;color:${payload.brandConfig?.color || '#3b82f6'};display:block;margin-bottom:6px;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;font-family:'Inter', -apple-system, sans-serif;">✨ AI Insight</strong>
                ${payload.aiNarrative}
              </div>
            `} />
          </Column>
        </Row>
      ) : null}

      {/* Section: Resource Usage */}
      <Row style={{ padding: '24px 28px 12px 28px' }}>
        <Column>
          <Paragraph
            style={{
              color: COLORS.textSubtle,
              margin: 0,
              fontSize: '10px',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              fontWeight: 700,
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
            }}
          >
            Resource Usage
          </Paragraph>
        </Column>
      </Row>

      <Row style={{ padding: '0 28px' }}>
        <Column>{buildMetricCards(payload.metrics)}</Column>
      </Row>

      {/* Section: Line Items */}
      <Row style={{ padding: '24px 28px 12px 28px' }}>
        <Column>
          <Paragraph
            style={{
              color: COLORS.textSubtle,
              margin: 0,
              fontSize: '10px',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              fontWeight: 700,
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
            }}
          >
            Invoice Line Items
          </Paragraph>
        </Column>
      </Row>

      {/* Table Header */}
      <Row
        style={{
          padding: '10px 32px',
          borderBottom: `1px solid ${COLORS.border}`,
          background: 'rgba(255,255,255,0.02)',
        }}
      >
        <Column style={{ width: '55%' }}>
          <Paragraph
            style={{
              color: COLORS.textDisabled,
              fontSize: '10px',
              margin: 0,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              fontWeight: 600,
            }}
          >
            Description
          </Paragraph>
        </Column>
        <Column style={{ width: '20%', textAlign: 'center' }}>
          <Paragraph
            style={{
              color: COLORS.textDisabled,
              fontSize: '10px',
              margin: 0,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              fontWeight: 600,
            }}
          >
            Qty
          </Paragraph>
        </Column>
        <Column style={{ width: '25%', textAlign: 'right' }}>
          <Paragraph
            style={{
              color: COLORS.textDisabled,
              fontSize: '10px',
              margin: 0,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              fontWeight: 600,
            }}
          >
            Amount
          </Paragraph>
        </Column>
      </Row>

      <Row style={{ padding: '0 28px' }}>
        <Column>{buildInvoiceRows(payload)}</Column>
      </Row>

      {/* Totals */}
      <Row style={{ padding: '20px 28px' }}>
        <Column style={{ width: '60%' }} />
        <Column style={{ width: '40%' }}>
          <Row>
            <Column style={{ width: '50%' }}>
              <Paragraph style={{ color: COLORS.textMuted, margin: 0, fontSize: '13px' }}>
                Subtotal
              </Paragraph>
            </Column>
            <Column style={{ width: '50%', textAlign: 'right' }}>
              <Paragraph
                style={{
                  color: COLORS.text,
                  margin: 0,
                  fontSize: '13px',
                  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                  fontWeight: 600,
                }}
              >
                {formatCurrency(payload.subtotal, payload.currency)}
              </Paragraph>
            </Column>
          </Row>
          <Row style={{ marginTop: '6px' }}>
            <Column style={{ width: '50%' }}>
              <Paragraph style={{ color: COLORS.textMuted, margin: 0, fontSize: '13px' }}>
                Tax ({formatPercent(payload.taxRate * 100)})
              </Paragraph>
            </Column>
            <Column style={{ width: '50%', textAlign: 'right' }}>
              <Paragraph
                style={{
                  color: COLORS.text,
                  margin: 0,
                  fontSize: '13px',
                  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                  fontWeight: 600,
                }}
              >
                {formatCurrency(payload.taxAmount, payload.currency)}
              </Paragraph>
            </Column>
          </Row>
          <Divider style={{ borderColor: COLORS.border, margin: '12px 0' }} />
          <Row>
            <Column style={{ width: '50%' }}>
              <Paragraph
                style={{
                  color: COLORS.text,
                  fontWeight: 700,
                  margin: 0,
                  fontSize: '16px',
                  letterSpacing: '-0.02em',
                }}
              >
                Total Due
              </Paragraph>
            </Column>
            <Column style={{ width: '50%', textAlign: 'right' }}>
              <Paragraph
                style={{
                  color: COLORS.text,
                  fontWeight: 800,
                  margin: 0,
                  fontSize: '20px',
                  letterSpacing: '-0.03em',
                  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                }}
              >
                {formatCurrency(payload.total, payload.currency)}
              </Paragraph>
            </Column>
          </Row>
        </Column>
      </Row>

      {/* Notes */}
      {payload.notes ? (
        <Row style={{ padding: '0 28px 20px 28px' }}>
          <Column
            style={{
              background: 'rgba(245,166,35,0.08)',
              border: '1px solid rgba(245,166,35,0.25)',
              borderRadius: '8px',
              padding: '12px 14px',
            }}
          >
            <Paragraph style={{ color: '#f5a623', margin: 0, fontSize: '12px', fontWeight: 500 }}>
              <span
                style={{
                  fontWeight: 700,
                  fontSize: '10px',
                  letterSpacing: '0.12em',
                  marginRight: '8px',
                }}
              >
                NOTE
              </span>
              {payload.notes}
            </Paragraph>
          </Column>
        </Row>
      ) : null}

      {/* CTAs */}
      <Row style={{ padding: '4px 28px 32px 28px' }}>
        <Column style={{ width: '50%' }}>
          <Button
            href="#pay"
            style={{
              background: COLORS.text,
              color: COLORS.bg,
              borderRadius: '8px',
              padding: '12px 24px',
              fontWeight: 700,
              fontSize: '13px',
              letterSpacing: '-0.01em',
            }}
          >
            Pay Now
          </Button>
        </Column>
        <Column style={{ width: '50%', textAlign: 'right' }}>
          <Button
            href="#history"
            style={{
              background: 'transparent',
              border: `1px solid ${COLORS.borderStrong}`,
              color: COLORS.text,
              borderRadius: '8px',
              padding: '12px 24px',
              fontWeight: 600,
              fontSize: '13px',
            }}
          >
            View History
          </Button>
        </Column>
      </Row>

      {/* Footer */}
      <Row
        style={{
          padding: '16px 28px',
          borderTop: `1px solid ${COLORS.border}`,
          background: 'rgba(255,255,255,0.02)',
        }}
      >
        <Column>
          <Paragraph
            style={{
              color: COLORS.textSubtle,
              fontSize: '10px',
              margin: 0,
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
              letterSpacing: '0.05em',
            }}
          >
            TRUEUP INC · GENERATED {formatDateShort(payload.periodEnd).toUpperCase()}
          </Paragraph>
        </Column>
      </Row>
    </Page>
  );
}

export default PortalPage;