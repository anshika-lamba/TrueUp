export type ArtifactMode = 'email' | 'web' | 'document';
export type ViewportMode = 'desktop' | 'mobile';
export type PresetKey = 'token_spike' | 'db_surge' | 'bandwidth_cap';
export type MetricCategory = 'compute' | 'storage' | 'network' | 'api' | 'database';
export type MetricTrend = 'up' | 'down' | 'stable';

export interface UsageMetric {
  id: string;
  label: string;
  category: MetricCategory;
  used: number;
  limit: number;
  unit: string;
  unitPrice: number;
  overageRate: number;
  sparklineValues: number[];
  trend: MetricTrend;
}

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  amount: number;
  isOverage: boolean;
  metricId: string;
}

export interface BillingContact {
  name: string;
  email: string;
  company: string;
  address: string;
  city: string;
  country: string;
  vatId?: string;
}

export interface BillingPayload {
  invoiceId: string;
  periodStart: string;
  periodEnd: string;
  dueDate: string;
  customer: BillingContact;
  vendor: BillingContact;
  metrics: UsageMetric[];
  lineItems: LineItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  currency: string;
  planName: string;
  alertThreshold: number;
  isOverBudget: boolean;
  notes?: string;
  brandConfig?: {
    color: string;
    logoUrl?: string;
  };
  aiNarrative?: string;
}

export interface Preset {
  key: PresetKey;
  label: string;
  description: string;
  payload: BillingPayload;
}
