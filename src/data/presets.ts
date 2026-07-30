import type { BillingPayload, Preset, UsageMetric } from './types';
import { samplePayload } from './sample';

function cloneWith(
  overrides: Partial<BillingPayload> & {
    metricPatches?: Record<string, Partial<UsageMetric>>;
  },
): BillingPayload {
  const { metricPatches, ...payloadOverrides } = overrides;

  const metrics = samplePayload.metrics.map((metric) => {
    const patch = metricPatches?.[metric.id];
    return patch ? { ...metric, ...patch } : { ...metric };
  });

  const payload: BillingPayload = {
    ...samplePayload,
    ...payloadOverrides,
    customer: { ...samplePayload.customer, ...payloadOverrides.customer },
    vendor: { ...samplePayload.vendor, ...payloadOverrides.vendor },
    metrics,
    lineItems: payloadOverrides.lineItems
      ? payloadOverrides.lineItems.map((item) => ({ ...item }))
      : samplePayload.lineItems.map((item) => ({ ...item })),
  };

  return payload;
}

export const presets: Preset[] = [
  {
    key: 'token_spike',
    label: 'Token Spike',
    description: 'OpenAI GPT-4 at 161% — critical overage',
    payload: cloneWith({}),
  },
  {
    key: 'db_surge',
    label: 'DB Surge',
    description: 'Supabase DB at 99% — near storage cap',
    payload: cloneWith({
      metricPatches: {
        'supabase-db': {
          used: 7.95,
          sparklineValues: [50, 60, 70, 78, 85, 94, 99],
        },
        'openai-tokens': {
          used: 1800000,
          sparklineValues: [20, 30, 35, 42, 48, 55, 60],
        },
      },
      lineItems: [
        {
          id: 'li-base-plan',
          description: 'Growth Pro Plan — May 2024',
          quantity: 1,
          unit: 'month',
          unitPrice: 499.03,
          amount: 499.03,
          isOverage: false,
          metricId: '',
        },
        {
          id: 'li-openai-included',
          description: 'OpenAI GPT-4 Tokens (included)',
          quantity: 1800000,
          unit: 'tokens',
          unitPrice: 0.00003,
          amount: 54.0,
          isOverage: false,
          metricId: 'openai-tokens',
        },
        {
          id: 'li-supabase-db',
          description: 'Supabase Database Storage',
          quantity: 7.95,
          unit: 'GB',
          unitPrice: 0.125,
          amount: 0.99,
          isOverage: false,
          metricId: 'supabase-db',
        },
        {
          id: 'li-supabase-bandwidth',
          description: 'Supabase Bandwidth Egress',
          quantity: 180,
          unit: 'GB',
          unitPrice: 0.09,
          amount: 16.2,
          isOverage: false,
          metricId: 'supabase-bandwidth',
        },
        {
          id: 'li-stripe-api',
          description: 'Stripe API Calls',
          quantity: 48500,
          unit: 'calls',
          unitPrice: 0.0004,
          amount: 19.4,
          isOverage: false,
          metricId: 'stripe-api',
        },
        {
          id: 'li-edge-compute',
          description: 'Edge Compute Invocations',
          quantity: 2100000,
          unit: 'invocations',
          unitPrice: 0.0000002,
          amount: 0.41,
          isOverage: false,
          metricId: 'edge-compute',
        },
        {
          id: 'li-db-proximity',
          description: 'Database Proximity Monitoring',
          quantity: 1,
          unit: 'service',
          unitPrice: 44.17,
          amount: 44.17,
          isOverage: false,
          metricId: 'supabase-db',
        },
      ],
      subtotal: 634.2,
      taxAmount: 55.49,
      total: 689.69,
      isOverBudget: true,
      notes:
        'Supabase database storage at 99.4% of allocated capacity. OpenAI token usage normalized this period but storage headroom is critically low.',
    }),
  },
  {
    key: 'bandwidth_cap',
    label: 'Bandwidth Cap',
    description: 'Network egress at 94% — approaching limit',
    payload: cloneWith({
      metricPatches: {
        'supabase-bandwidth': {
          used: 235,
          sparklineValues: [40, 52, 65, 72, 80, 88, 94],
        },
      },
      lineItems: [
        {
          id: 'li-base-plan',
          description: 'Growth Pro Plan — May 2024',
          quantity: 1,
          unit: 'month',
          unitPrice: 499.03,
          amount: 499.03,
          isOverage: false,
          metricId: '',
        },
        {
          id: 'li-openai-included',
          description: 'OpenAI GPT-4 Tokens (included)',
          quantity: 3000000,
          unit: 'tokens',
          unitPrice: 0.00003,
          amount: 90.0,
          isOverage: false,
          metricId: 'openai-tokens',
        },
        {
          id: 'li-supabase-db',
          description: 'Supabase Database Storage',
          quantity: 7.8,
          unit: 'GB',
          unitPrice: 0.125,
          amount: 0.98,
          isOverage: false,
          metricId: 'supabase-db',
        },
        {
          id: 'li-supabase-bandwidth',
          description: 'Supabase Bandwidth Egress',
          quantity: 235,
          unit: 'GB',
          unitPrice: 0.09,
          amount: 21.15,
          isOverage: false,
          metricId: 'supabase-bandwidth',
        },
        {
          id: 'li-stripe-api',
          description: 'Stripe API Calls',
          quantity: 48500,
          unit: 'calls',
          unitPrice: 0.0004,
          amount: 19.4,
          isOverage: false,
          metricId: 'stripe-api',
        },
        {
          id: 'li-edge-compute',
          description: 'Edge Compute Invocations',
          quantity: 2100000,
          unit: 'invocations',
          unitPrice: 0.0000002,
          amount: 0.41,
          isOverage: false,
          metricId: 'edge-compute',
        },
        {
          id: 'li-overage-credit',
          description: 'Overage billing credit — within grace period',
          quantity: 1,
          unit: 'credit',
          unitPrice: -32.27,
          amount: -32.27,
          isOverage: false,
          metricId: '',
        },
      ],
      subtotal: 598.7,
      taxAmount: 52.39,
      total: 651.09,
      alertThreshold: 90,
      isOverBudget: false,
      notes:
        'Network egress at 94% of monthly allocation. Usage is within budget but approaching the configured alert threshold.',
    }),
  },
];

export function getPreset(key: string): Preset {
  const preset = presets.find((entry) => entry.key === key);
  if (!preset) {
    throw new Error(`Unknown preset key: ${key}`);
  }
  return preset;
}
