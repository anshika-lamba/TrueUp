import * as React from 'react';
import { Document, Row, Column, Heading, Paragraph, Divider, Html } from '@unlayer/react-elements';
import type { BillingPayload } from '../data/types';
import { palette, documentTheme, getUsageColor, printCSS } from '../lib/theme';
import {
  formatCurrency,
  formatNumber,
  formatPercent,
  calcUsagePercent,
  formatDate,
  formatPeriod,
  formatUnitPrice,
} from '../lib/format';
import { getProgressBarStyle } from '../tools/progress-bar';

const theme = documentTheme;

// Rule 2: Row[] not Fragment
function buildUsageSummaryRows(payload: BillingPayload): React.ReactElement[] {
  return payload.metrics.map((metric) => {
    const pct = calcUsagePercent(metric.used, metric.limit);
    const isOver = pct >= 100;
    const usageColor = getUsageColor(pct, 'document');
    const progressStyle = getProgressBarStyle({
      percent: pct,
      height: 6,
      mode: 'document',
      containerWidth: 300,
    });

    return (
      <Row
        key={metric.id}
        className="no-break"
        style={{
          borderBottom: `1px solid ${theme.border}`,
          padding: '8px 0',
        }}
      >
        <Column style={{ width: '30%' }}>
          <Paragraph style={{ color: theme.body, margin: 0, fontSize: '11px' }}>{metric.label}</Paragraph>
        </Column>
        <Column style={{ width: '25%' }}>
          <Paragraph style={{ color: theme.muted, margin: 0, fontSize: '11px' }}>
            {formatNumber(metric.used)} / {formatNumber(metric.limit)} {metric.unit}
          </Paragraph>
        </Column>
        <Column style={{ width: '15%', textAlign: 'right' }}>
          <Paragraph style={{ color: usageColor, margin: 0, fontSize: '11px', fontWeight: 700 }}>
            {isOver ? '! ' : ''}
            {formatPercent(pct)}
          </Paragraph>
        </Column>
        <Column style={{ width: '30%' }}>
          <div style={progressStyle.containerStyle}>
            <div style={progressStyle.fillStyle} />
          </div>
        </Column>
      </Row>
    );
  });
}

// Rule 2: Row[] not Fragment
function buildDocLineItemRows(payload: BillingPayload): React.ReactElement[] {
  return payload.lineItems.map((item, i) => {
    const bg = i % 2 === 0 ? '#ffffff' : palette.neutral[50];
    return (
      <Row
        key={item.id}
        className="no-break"
        style={{
          background: bg,
          padding: '8px 0',
          borderBottom: `1px solid ${theme.border}`,
        }}
      >
        <Column style={{ width: '40%' }}>
          <Paragraph
            style={{
              margin: 0,
              fontSize: '11px',
              color: item.isOverage ? theme.danger : theme.body,
              fontWeight: item.isOverage ? 700 : 400,
            }}
          >
            {item.isOverage ? 'OVERAGE — ' : ''}
            {item.description}
          </Paragraph>
        </Column>
        <Column style={{ width: '20%', textAlign: 'center' }}>
          <Paragraph style={{ margin: 0, fontSize: '11px', color: theme.muted }}>
            {formatNumber(item.quantity)} {item.unit}
          </Paragraph>
        </Column>
        <Column style={{ width: '20%', textAlign: 'right' }}>
          <Paragraph style={{ margin: 0, fontSize: '11px', color: theme.muted }}>
            {formatUnitPrice(item.unitPrice, item.unit)}
          </Paragraph>
        </Column>
        <Column style={{ width: '20%', textAlign: 'right' }}>
          <Paragraph style={{ margin: 0, fontSize: '11px', color: theme.body, fontWeight: 600 }}>
            {formatCurrency(item.amount, payload.currency)}
          </Paragraph>
        </Column>
      </Row>
    );
  });
}

export interface InvoiceDocProps {
  payload: BillingPayload;
}

function InvoiceDoc({ payload }: InvoiceDocProps): React.ReactElement {
  return (
    <Document
      style={{
        background: '#ffffff',
        fontFamily: theme.fontFamily,
        fontSize: '11px',
        color: theme.body,
      }}
    >
      <Row>
        <Column>
          <Html html={`<style>${printCSS} .no-break { page-break-inside: avoid; } .page-break { page-break-before: always; }</style>`} />
        </Column>
      </Row>

      <Row style={{ background: payload.brandConfig?.color || palette.blue[600], padding: '20px 28px' }} className="no-break">
        <Column style={{ width: '50%' }}>
          <Paragraph style={{ color: '#ffffff', fontWeight: 800, fontSize: '16px', margin: 0, letterSpacing: '-0.02em' }}>
            TrueUp
          </Paragraph>
        </Column>
        <Column style={{ width: '50%', textAlign: 'right' }}>
          <Paragraph style={{ color: '#ffffff', fontWeight: 700, fontSize: '13px', margin: 0, letterSpacing: '0.1em' }}>
            TAX INVOICE
          </Paragraph>
          <Paragraph style={{ color: '#ffffff', fontSize: '11px', margin: 0 }}>
            {payload.invoiceId}
          </Paragraph>
        </Column>
      </Row>

      <Row style={{ padding: '20px 28px' }} className="no-break">
        <Column style={{ width: '50%' }}>
          <Paragraph style={{ color: theme.muted, fontSize: '10px', margin: '0 0 4px 0', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Billed To
          </Paragraph>
          <Paragraph style={{ color: theme.heading, fontWeight: 700, margin: 0 }}>
            {payload.customer.name}
          </Paragraph>
          <Paragraph style={{ color: theme.body, margin: 0 }}>{payload.customer.company}</Paragraph>
          <Paragraph style={{ color: theme.muted, margin: 0 }}>{payload.customer.address}</Paragraph>
          <Paragraph style={{ color: theme.muted, margin: 0 }}>
            {payload.customer.city}, {payload.customer.country}
          </Paragraph>
          {payload.customer.vatId ? (
            <Paragraph style={{ color: theme.muted, margin: 0 }}>VAT: {payload.customer.vatId}</Paragraph>
          ) : null}
          <Paragraph style={{ color: theme.muted, margin: 0 }}>{payload.customer.email}</Paragraph>
        </Column>
        <Column style={{ width: '50%' }}>
          <Paragraph style={{ color: theme.muted, fontSize: '10px', margin: '0 0 4px 0', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Issued By
          </Paragraph>
          <Paragraph style={{ color: theme.heading, fontWeight: 700, margin: 0 }}>
            {payload.vendor.name}
          </Paragraph>
          <Paragraph style={{ color: theme.body, margin: 0 }}>{payload.vendor.company}</Paragraph>
          <Paragraph style={{ color: theme.muted, margin: 0 }}>{payload.vendor.address}</Paragraph>
          <Paragraph style={{ color: theme.muted, margin: 0 }}>
            {payload.vendor.city}, {payload.vendor.country}
          </Paragraph>
          {payload.vendor.vatId ? (
            <Paragraph style={{ color: theme.muted, margin: 0 }}>VAT: {payload.vendor.vatId}</Paragraph>
          ) : null}
          <Paragraph style={{ color: theme.muted, margin: 0 }}>{payload.vendor.email}</Paragraph>
        </Column>
      </Row>

      <Row
        style={{ background: palette.neutral[800], padding: '14px 28px' }}
        className="no-break"
      >
        <Column style={{ width: '25%' }}>
          <Paragraph style={{ color: palette.neutral[400], fontSize: '10px', margin: 0, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Plan</Paragraph>
          <Paragraph style={{ color: '#ffffff', margin: 0, fontWeight: 600 }}>{payload.planName}</Paragraph>
        </Column>
        <Column style={{ width: '25%' }}>
          <Paragraph style={{ color: palette.neutral[400], fontSize: '10px', margin: 0, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Period</Paragraph>
          <Paragraph style={{ color: '#ffffff', margin: 0, fontWeight: 600 }}>
            {formatPeriod(payload.periodStart, payload.periodEnd)}
          </Paragraph>
        </Column>
        <Column style={{ width: '25%' }}>
          <Paragraph style={{ color: palette.neutral[400], fontSize: '10px', margin: 0, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Currency</Paragraph>
          <Paragraph style={{ color: '#ffffff', margin: 0, fontWeight: 600 }}>{payload.currency}</Paragraph>
        </Column>
        <Column style={{ width: '25%' }}>
          <Paragraph style={{ color: palette.neutral[400], fontSize: '10px', margin: 0, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Total Due</Paragraph>
          <Paragraph style={{ color: '#ffffff', margin: 0, fontWeight: 700 }}>
            {formatCurrency(payload.total, payload.currency)}
          </Paragraph>
        </Column>
      </Row>

      <Row style={{ padding: '20px 28px 8px 28px' }}>
        <Column style={{ borderBottom: `2px solid ${theme.accent}`, paddingBottom: '4px' }}>
          <Heading headingType="h3" style={{ color: theme.heading, margin: 0, letterSpacing: '-0.02em' }}>
            Usage Summary
          </Heading>
        </Column>
      </Row>

      <Row style={{ padding: '0 28px' }}>
        <Column>{buildUsageSummaryRows(payload)}</Column>
      </Row>

      <Row style={{ padding: '12px 28px 0 28px' }}>
        <Column>
          <Divider style={{ borderColor: theme.border }} />
        </Column>
      </Row>

      <Row style={{ padding: '20px 28px 8px 28px' }}>
        <Column style={{ borderBottom: `2px solid ${theme.accent}`, paddingBottom: '4px' }}>
          <Heading headingType="h3" style={{ color: theme.heading, margin: 0, letterSpacing: '-0.02em' }}>
            Itemized Charges
          </Heading>
        </Column>
      </Row>

      <Row style={{ background: theme.accent, padding: '8px 28px' }} className="no-break">
        <Column style={{ width: '40%' }}>
          <Paragraph style={{ color: '#ffffff', fontSize: '10px', margin: 0, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Description
          </Paragraph>
        </Column>
        <Column style={{ width: '20%', textAlign: 'center' }}>
          <Paragraph style={{ color: '#ffffff', fontSize: '10px', margin: 0, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Qty
          </Paragraph>
        </Column>
        <Column style={{ width: '20%', textAlign: 'right' }}>
          <Paragraph style={{ color: '#ffffff', fontSize: '10px', margin: 0, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Unit Price
          </Paragraph>
        </Column>
        <Column style={{ width: '20%', textAlign: 'right' }}>
          <Paragraph style={{ color: '#ffffff', fontSize: '10px', margin: 0, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Amount
          </Paragraph>
        </Column>
      </Row>

      <Row style={{ padding: '0 28px' }}>
        <Column>{buildDocLineItemRows(payload)}</Column>
      </Row>

      <Row style={{ padding: '16px 28px' }} className="no-break">
        <Column style={{ width: '60%' }} />
        <Column style={{ width: '40%' }}>
          <Row>
            <Column style={{ width: '50%' }}>
              <Paragraph style={{ color: theme.muted, margin: 0, fontSize: '11px' }}>Subtotal</Paragraph>
            </Column>
            <Column style={{ width: '50%', textAlign: 'right' }}>
              <Paragraph style={{ color: theme.body, margin: 0, fontSize: '11px' }}>
                {formatCurrency(payload.subtotal, payload.currency)}
              </Paragraph>
            </Column>
          </Row>
          <Row>
            <Column style={{ width: '50%' }}>
              <Paragraph style={{ color: theme.muted, margin: 0, fontSize: '11px' }}>
                Tax ({formatPercent(payload.taxRate * 100)})
              </Paragraph>
            </Column>
            <Column style={{ width: '50%', textAlign: 'right' }}>
              <Paragraph style={{ color: theme.body, margin: 0, fontSize: '11px' }}>
                {formatCurrency(payload.taxAmount, payload.currency)}
              </Paragraph>
            </Column>
          </Row>
          <Divider style={{ borderColor: theme.border, margin: '6px 0' }} />
          <Row>
            <Column style={{ width: '50%' }}>
              <Paragraph style={{ color: theme.accent, fontWeight: 700, margin: 0, fontSize: '13px' }}>
                TOTAL DUE
              </Paragraph>
            </Column>
            <Column style={{ width: '50%', textAlign: 'right' }}>
              <Paragraph style={{ color: theme.accent, fontWeight: 700, margin: 0, fontSize: '13px' }}>
                {formatCurrency(payload.total, payload.currency)}
              </Paragraph>
            </Column>
          </Row>
        </Column>
      </Row>

      {payload.notes ? (
        <Row style={{ padding: '0 28px 16px 28px' }} className="no-break">
          <Column
            style={{
              background: palette.amber[50],
              border: `1px solid ${palette.amber[100]}`,
              borderRadius: '6px',
              padding: '10px 14px',
            }}
          >
            <Paragraph style={{ color: palette.amber[900], margin: 0, fontSize: '10px' }}>
              {payload.notes}
            </Paragraph>
          </Column>
        </Row>
      ) : null}

      <Row style={{ padding: '0 28px 20px 28px' }}>
        <Column>
          <Paragraph style={{ color: theme.muted, fontSize: '9px', margin: 0 }}>
            Payment due by {formatDate(payload.dueDate)}. Late payments may be subject to service
            suspension per the terms of service. Please reference invoice {payload.invoiceId} in all
            correspondence.
          </Paragraph>
        </Column>
      </Row>

      <Row
        style={{
          background: palette.neutral[900],
          borderTop: `2px solid ${theme.accent}`,
          padding: '14px 28px',
        }}
        className="no-break"
      >
        <Column style={{ width: '60%' }}>
          <Paragraph style={{ color: palette.neutral[300], fontSize: '9px', margin: 0 }}>
            {payload.vendor.company} — {payload.vendor.email}
          </Paragraph>
        </Column>
        <Column style={{ width: '40%', textAlign: 'right' }}>
          <Paragraph style={{ color: palette.neutral[300], fontSize: '9px', margin: 0 }}>
            {payload.invoiceId} — Page 1 of 1
          </Paragraph>
        </Column>
      </Row>
    </Document>
  );
}

export default InvoiceDoc;