import * as React from 'react';
import {
  Email,
  Row,
  Column,
  Heading,
  Paragraph,
  Button,
  Html,
} from '@unlayer/react-elements';
import type {
  BillingPayload,
  UsageMetric,
} from '../data/types';
import type { ArtifactMode } from '../data/types';
import {
  emailTheme,
  getUsageColor,
  mobileFixCSS,
  palette,
} from '../lib/theme';
import {
  formatCurrency,
  formatNumber,
  formatPercent,
  calcUsagePercent,
  formatDateShort,
  formatPeriod,
} from '../lib/format';
import { renderSparklineEmail } from '../tools/sparkline';
import type { SparklineOptions } from '../tools/sparkline';
import { renderProgressBarEmail } from '../tools/progress-bar';
import type { ProgressBarOptions } from '../tools/progress-bar';

const EMAIL_MODE: ArtifactMode = 'email';

interface AlertEmailProps {
  payload: BillingPayload;
}

function getStatusBadgeHtml(pct: number): string {
  let label: string;
  let bg: string;
  let fg: string;
  let ring: string;

  if (pct >= 100) {
    label = 'OVER LIMIT';
    bg = palette.rose[50];
    fg = palette.rose[700];
    ring = palette.rose[100];
  } else if (pct >= 80) {
    label = 'WARNING';
    bg = palette.amber[50];
    fg = palette.amber[700];
    ring = palette.amber[100];
  } else {
    label = 'ON TRACK';
    bg = palette.emerald[50];
    fg = palette.emerald[700];
    ring = palette.emerald[100];
  }

  return `<span style="display:inline-block;padding:3px 10px;border-radius:9999px;font-size:10px;font-weight:800;letter-spacing:0.08em;background:${bg};color:${fg};border:1px solid ${ring};font-family:'Inter',-apple-system,sans-serif;">${label}</span>`;
}

function buildMetricRows(metrics: UsageMetric[]): React.ReactElement[] {
  // Rule 2: Row[] not Fragment
  return metrics.map((metric) => {
    const pct = calcUsagePercent(metric.used, metric.limit);
    const usageColor = getUsageColor(pct, EMAIL_MODE);

    const isOver = pct >= 100;
    const isWarning = pct >= 80 && pct < 100;
    const rowBg = isOver
      ? palette.rose[50]
      : isWarning
      ? palette.amber[50]
      : '#ffffff';

    const sparklineOptions: SparklineOptions = {
      values: metric.sparklineValues,
      max: 100,
      accentColor: usageColor,
      barWidth: 14,
      barGap: 3,
      height: 32,
    };

    const progressOptions: ProgressBarOptions = {
      percent: pct,
      height: 6,
      mode: EMAIL_MODE,
      containerWidth: 560,
    };

    const badgeHtml = getStatusBadgeHtml(pct);
    const progressHtml = renderProgressBarEmail(progressOptions);
    const sparklineHtml = renderSparklineEmail(sparklineOptions);

    return (
      <Row
        key={metric.id}
        style={{
          backgroundColor: rowBg,
          padding: '20px 32px',
          borderLeft: `3px solid ${usageColor}`,
          borderBottom: `1px solid ${palette.neutral[100]}`,
        }}
      >
        <Column style={{ width: '100%' }}>
          <Row>
            <Column style={{ width: '55%' }}>
              <Paragraph
                style={{
                  fontSize: '14px',
                  fontWeight: 700,
                  color: palette.neutral[900],
                  margin: '0 0 6px 0',
                  letterSpacing: '-0.01em',
                }}
              >
                {metric.label}
              </Paragraph>
              {/* ESCAPE HATCH: pill badge with border needs raw inline span */}
              <Html html={badgeHtml} />
            </Column>
            <Column style={{ width: '45%', textAlign: 'right' }}>
              <Paragraph
                style={{
                  fontSize: '11px',
                  color: palette.neutral[500],
                  textAlign: 'right',
                  margin: 0,
                  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                  letterSpacing: '-0.02em',
                }}
              >
                {formatNumber(metric.used)} / {formatNumber(metric.limit)} {metric.unit}
              </Paragraph>
              <Paragraph
                style={{
                  fontSize: '22px',
                  fontWeight: 800,
                  color: usageColor,
                  textAlign: 'right',
                  margin: '4px 0 0 0',
                  letterSpacing: '-0.03em',
                  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                }}
              >
                {formatPercent(pct)}
              </Paragraph>
            </Column>
          </Row>

          <Row style={{ padding: '14px 0 10px 0' }}>
            <Column style={{ width: '100%' }}>
              {/* ESCAPE HATCH: pixel-width progress bar cells */}
              <Html html={progressHtml} />
            </Column>
          </Row>

          <Row>
            <Column style={{ width: '100%', textAlign: 'right' }}>
              {/* ESCAPE HATCH: sparkline bars need vertical-align:bottom */}
              <Html html={sparklineHtml} />
            </Column>
          </Row>
        </Column>
      </Row>
    );
  });
}

function buildLineItemRows(payload: BillingPayload): React.ReactElement[] {
  // Rule 2: Row[] not Fragment
  return payload.lineItems.map((item, index) => {
    const isAlt = index % 2 === 1;
    const bg = isAlt ? palette.neutral[50] : '#ffffff';
    const isOverage = item.isOverage;

    return (
      <Row
        key={item.id}
        style={{
          backgroundColor: bg,
          padding: '14px 32px',
          borderBottom: `1px solid ${palette.neutral[100]}`,
        }}
      >
        <Column style={{ width: '68%' }}>
          <Paragraph
            style={{
              fontSize: '13px',
              margin: 0,
              color: isOverage ? palette.rose[700] : palette.neutral[800],
              fontWeight: isOverage ? 700 : 500,
              letterSpacing: '-0.01em',
              lineHeight: '1.5',
            }}
          >
            {isOverage && (
              <span
                style={{
                  display: 'inline-block',
                  padding: '2px 6px',
                  marginRight: '8px',
                  fontSize: '9px',
                  fontWeight: 800,
                  letterSpacing: '0.1em',
                  background: palette.rose[100],
                  color: palette.rose[700],
                  borderRadius: '3px',
                  verticalAlign: 'middle',
                }}
              >
                OVERAGE
              </span>
            )}
            {item.description}
          </Paragraph>
        </Column>
        <Column style={{ width: '32%', textAlign: 'right' }}>
          <Paragraph
            style={{
              fontSize: '14px',
              margin: 0,
              textAlign: 'right',
              fontWeight: 700,
              color: isOverage ? palette.rose[700] : palette.neutral[900],
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
              letterSpacing: '-0.02em',
            }}
          >
            {formatCurrency(item.amount, payload.currency)}
          </Paragraph>
        </Column>
      </Row>
    );
  });
}

export default function AlertEmail({ payload }: AlertEmailProps): React.ReactElement {
  const {
    customer,
    planName,
    periodStart,
    periodEnd,
    dueDate,
    total,
    subtotal,
    taxAmount,
    metrics,
    invoiceId,
    notes,
    isOverBudget,
    currency,
    vendor,
  } = payload;

  const firstName = customer.name.split(' ')[0];
  const company = customer.company;

  const criticalMetrics = payload.metrics.filter(
    (m) => calcUsagePercent(m.used, m.limit) >= payload.alertThreshold,
  );
  const alertCount = criticalMetrics.length;

  const headerGradient = payload.brandConfig?.color
    ? `linear-gradient(135deg, ${payload.brandConfig.color} 0%, ${payload.brandConfig.color} 100%)`
    : isOverBudget
    ? `linear-gradient(135deg, ${palette.rose[700]} 0%, ${palette.rose[600]} 60%, ${palette.rose[500]} 100%)`
    : `linear-gradient(135deg, ${palette.emerald[700]} 0%, ${palette.emerald[600]} 60%, ${palette.emerald[500]} 100%)`;

  const badgeText = isOverBudget ? 'BUDGET ALERT' : 'USAGE NOTICE';

  const periodLabel = formatPeriod(periodStart, periodEnd);

  // ESCAPE HATCH: brand mark + badge side-by-side with vertical-align
  const headerBrandHtml = `
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;font-family:'Inter',-apple-system,sans-serif;">
      <tbody>
        <tr>
          <td style="text-align:left;vertical-align:middle;">
            <div style="display:inline-block;width:36px;height:36px;background:rgba(255,255,255,0.15);border:1px solid rgba(255,255,255,0.25);border-radius:10px;text-align:center;line-height:36px;color:#ffffff;font-weight:900;font-size:16px;letter-spacing:-0.05em;vertical-align:middle;">T</div>
            <div style="display:inline-block;margin-left:12px;vertical-align:middle;">
              <div style="color:#ffffff;font-size:18px;font-weight:800;letter-spacing:-0.02em;line-height:1.1;">TrueUp</div>
              <div style="color:rgba(255,255,255,0.75);font-size:10px;margin-top:2px;letter-spacing:0.15em;font-weight:600;text-transform:uppercase;">FinOps Engine</div>
            </div>
          </td>
          <td style="text-align:right;vertical-align:middle;">
            <span style="display:inline-block;padding:7px 14px;border-radius:9999px;background:rgba(0,0,0,0.25);color:#ffffff;font-size:10px;font-weight:800;letter-spacing:0.15em;border:1px solid rgba(255,255,255,0.2);">${badgeText}</span>
          </td>
        </tr>
      </tbody>
    </table>
  `;

  // ESCAPE HATCH: three-column stats strip with vertical divider borders
  const statsTableHtml = `
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;font-family:'Inter',-apple-system,sans-serif;">
      <tbody>
        <tr>
          <td style="text-align:left;padding:0 20px 0 0;width:33%;">
            <div style="color:rgba(255,255,255,0.55);font-size:10px;text-transform:uppercase;letter-spacing:0.12em;font-weight:600;">Current Total</div>
            <div style="color:#ffffff;font-size:26px;font-weight:800;margin-top:6px;letter-spacing:-0.03em;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;">${formatCurrency(total, currency)}</div>
          </td>
          <td style="text-align:left;padding:0 20px;width:33%;border-left:1px solid rgba(255,255,255,0.1);border-right:1px solid rgba(255,255,255,0.1);">
            <div style="color:rgba(255,255,255,0.55);font-size:10px;text-transform:uppercase;letter-spacing:0.12em;font-weight:600;">Alerts Triggered</div>
            <div style="color:${palette.rose[400]};font-size:26px;font-weight:800;margin-top:6px;letter-spacing:-0.03em;">${alertCount}</div>
          </td>
          <td style="text-align:left;padding:0 0 0 20px;width:33%;">
            <div style="color:rgba(255,255,255,0.55);font-size:10px;text-transform:uppercase;letter-spacing:0.12em;font-weight:600;">Due Date</div>
            <div style="color:#ffffff;font-size:16px;font-weight:800;margin-top:8px;letter-spacing:-0.02em;">${formatDateShort(dueDate)}</div>
          </td>
        </tr>
      </tbody>
    </table>
  `;

  // ESCAPE HATCH: ledger totals with right-aligned monospace amounts
  const totalsTableHtml = `
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;font-family:'Inter',-apple-system,sans-serif;">
      <tbody>
        <tr>
          <td style="font-size:12px;color:${palette.neutral[500]};padding:6px 0;font-weight:500;">Subtotal</td>
          <td style="font-size:13px;color:${palette.neutral[800]};text-align:right;padding:6px 0;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-weight:600;">${formatCurrency(subtotal, currency)}</td>
        </tr>
        <tr>
          <td style="font-size:12px;color:${palette.neutral[500]};padding:6px 0;font-weight:500;">Tax</td>
          <td style="font-size:13px;color:${palette.neutral[800]};text-align:right;padding:6px 0;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-weight:600;">${formatCurrency(taxAmount, currency)}</td>
        </tr>
        <tr>
          <td colspan="2" style="border-top:1px solid ${palette.neutral[200]};padding:10px 0 0 0;"></td>
        </tr>
        <tr>
          <td style="font-size:15px;font-weight:800;color:${palette.neutral[900]};padding:10px 0 0 0;letter-spacing:-0.02em;">Total Due</td>
          <td style="font-size:24px;font-weight:800;color:${palette.neutral[900]};text-align:right;padding:10px 0 0 0;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:-0.03em;">${formatCurrency(total, currency)}</td>
        </tr>
        <tr>
          <td colspan="2" style="font-size:11px;color:${palette.neutral[500]};padding:8px 0 0 0;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;">Due ${formatDateShort(dueDate)}</td>
        </tr>
      </tbody>
    </table>
  `;

  // ESCAPE HATCH: two-column footer with independent alignment
  const footerTableHtml = `
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;font-family:'Inter',-apple-system,sans-serif;">
      <tbody>
        <tr>
          <td style="vertical-align:top;font-size:10px;color:${palette.neutral[500]};line-height:1.7;">
            <div style="font-weight:700;color:${palette.neutral[700]};margin-bottom:4px;letter-spacing:-0.01em;">${vendor.company}</div>
            ${vendor.address}, ${vendor.city}, ${vendor.country}<br />
            <span style="font-family:ui-monospace,SFMono-Regular,Menlo,monospace;color:${palette.neutral[400]};">${invoiceId}</span><br />
            <a href="https://app.trueup.dev/unsubscribe" style="color:${palette.neutral[500]};text-decoration:underline;">Unsubscribe</a>
            &nbsp;·&nbsp;
            <a href="https://app.trueup.dev/privacy" style="color:${palette.neutral[500]};text-decoration:underline;">Privacy</a>
          </td>
          <td style="vertical-align:top;text-align:right;font-size:10px;color:${palette.neutral[400]};">
            <div style="color:${palette.neutral[600]};font-weight:600;">Powered by</div>
            <div style="color:${palette.emerald[600]};font-weight:800;letter-spacing:-0.02em;margin-top:2px;font-size:12px;">TrueUp FinOps</div>
          </td>
        </tr>
      </tbody>
    </table>
  `;

  return (
    <Email
      style={{
        backgroundColor: palette.neutral[100],
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      {/* Mobile fix CSS */}
      <Row style={{ backgroundColor: emailTheme.background, padding: '0' }}>
        <Column style={{ width: '100%' }}>
          {/* ESCAPE HATCH: raw <style> block for mobile media queries */}
          <Html html={`<style>${mobileFixCSS}</style>`} />
        </Column>
      </Row>

      {/* HEADER — gradient banner with brand mark */}
      <Row style={{ background: headerGradient, padding: '32px 32px 28px 32px' }}>
        <Column style={{ width: '100%' }}>
          <Html html={headerBrandHtml} />
          <Heading
            headingType="h1"
            style={{
              color: '#ffffff',
              fontSize: '26px',
              margin: '24px 0 6px 0',
              letterSpacing: '-0.03em',
              lineHeight: '1.2',
              fontWeight: 800,
            }}
          >
            {isOverBudget ? 'Your usage has exceeded budget' : 'Your usage needs attention'}
          </Heading>
          <Paragraph
            style={{
              color: 'rgba(255,255,255,0.85)',
              fontSize: '13px',
              margin: 0,
              fontWeight: 500,
            }}
          >
            {periodLabel} · {planName} plan
          </Paragraph>
        </Column>
      </Row>

      {/* STATS STRIP — dark inset */}
      <Row style={{ backgroundColor: palette.neutral[900], padding: '22px 32px' }}>
        <Column style={{ width: '100%' }}>
          <Html html={statsTableHtml} />
        </Column>
      </Row>

      {/* GREETING */}
      <Row style={{ backgroundColor: emailTheme.background, padding: '28px 32px 4px 32px' }}>
        <Column style={{ width: '100%' }}>
          <Paragraph
            style={{
              fontSize: '15px',
              color: palette.neutral[800],
              margin: 0,
              lineHeight: '1.6',
              fontWeight: 400,
            }}
          >
            Hi {firstName}, your{' '}
            <strong style={{ color: palette.neutral[900], fontWeight: 700 }}>{planName}</strong>{' '}
            account at{' '}
            <strong style={{ color: palette.neutral[900], fontWeight: 700 }}>{company}</strong>{' '}
            has triggered {alertCount} usage alert{alertCount === 1 ? '' : 's'}. Here is your
            real-time breakdown:
          </Paragraph>
        </Column>
      </Row>

      {/* AI NARRATIVE */}
      {payload.aiNarrative ? (
        <Row style={{ backgroundColor: emailTheme.background, padding: '12px 32px 0 32px' }}>
          <Column style={{ width: '100%' }}>
            <Html html={`
              <div style="font-size:14px;color:${palette.neutral[800]};margin:0;line-height:1.6;background-color:${payload.brandConfig?.color || palette.blue[500]}10;padding:14px 18px;border-left:4px solid ${payload.brandConfig?.color || palette.blue[500]};border-radius:4px;font-family:'Inter', -apple-system, sans-serif;">
                <strong style="font-weight:700;color:${payload.brandConfig?.color || palette.blue[600]};display:block;margin-bottom:4px;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;">✨ AI Insight</strong>
                ${payload.aiNarrative}
              </div>
            `} />
          </Column>
        </Row>
      ) : null}

      {/* SECTION LABEL — usage */}
      <Row style={{ backgroundColor: emailTheme.background, padding: '28px 32px 14px 32px' }}>
        <Column style={{ width: '100%' }}>
          <Heading
            headingType="h2"
            style={{
              fontSize: '11px',
              color: palette.neutral[500],
              margin: 0,
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              fontWeight: 700,
            }}
          >
            Usage Breakdown · {periodLabel}
          </Heading>
        </Column>
      </Row>

      {buildMetricRows(metrics)}

      {/* SECTION LABEL — line items */}
      <Row style={{ backgroundColor: emailTheme.background, padding: '32px 32px 14px 32px' }}>
        <Column style={{ width: '100%' }}>
          <Heading
            headingType="h2"
            style={{
              fontSize: '11px',
              color: palette.neutral[500],
              margin: 0,
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              fontWeight: 700,
            }}
          >
            Invoice Breakdown
          </Heading>
        </Column>
      </Row>

      {buildLineItemRows(payload)}

      {/* TOTALS */}
      <Row
        style={{
          backgroundColor: palette.neutral[50],
          padding: '20px 32px 24px 32px',
          borderTop: `2px solid ${palette.neutral[200]}`,
        }}
      >
        <Column style={{ width: '100%' }}>
          <Html html={totalsTableHtml} />
        </Column>
      </Row>

      {/* NOTES */}
      {notes ? (
        <Row
          style={{
            backgroundColor: palette.amber[50],
            padding: '16px 32px',
            borderLeft: `3px solid ${palette.amber[500]}`,
          }}
        >
          <Column style={{ width: '100%' }}>
            <Paragraph
              style={{
                fontSize: '12px',
                color: palette.amber[900],
                margin: 0,
                fontWeight: 500,
                lineHeight: '1.6',
              }}
            >
              <strong
                style={{
                  fontWeight: 700,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  fontSize: '10px',
                }}
              >
                NOTE
              </strong>
              &nbsp;·&nbsp;{notes}
            </Paragraph>
          </Column>
        </Row>
      ) : null}

      {/* CTA */}
      <Row
        style={{
          backgroundColor: emailTheme.background,
          padding: '32px 32px 36px 32px',
          textAlign: 'center',
        }}
      >
        <Column style={{ width: '100%', textAlign: 'center' }}>
          <Button
            href="https://app.trueup.dev/billing"
            style={{
              backgroundColor: palette.neutral[900],
              color: '#ffffff',
              padding: '14px 32px',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '13px',
              letterSpacing: '-0.01em',
            }}
          >
            View Full Billing Portal →
          </Button>
        </Column>
      </Row>

      {/* FOOTER */}
      <Row
        style={{
          backgroundColor: palette.neutral[100],
          padding: '24px 32px',
          borderTop: `1px solid ${palette.neutral[200]}`,
        }}
      >
        <Column style={{ width: '100%' }}>
          <Html html={footerTableHtml} />
        </Column>
      </Row>
    </Email>
  );
}