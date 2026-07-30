// store/billing-store.ts
import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import { samplePayload } from '../data/sample';
import { calcUsagePercent } from '../lib/format';
import { synthesizeNarrative } from '../lib/narrative-engine';
import type {
  ArtifactMode,
  BillingPayload,
  PresetKey,
  UsageMetric,
  ViewportMode,
} from '../data/types';

export interface BillingStoreState {
  payload: BillingPayload;
  basePayload: BillingPayload;
  mode: ArtifactMode;
  activePreset: PresetKey;
  viewport: ViewportMode;
  isExporting: boolean; // consumed by ExportMenu (Batch 7)
  exportError: string | null; // consumed by ExportMenu (Batch 7)
  simulationDay: number;

  setPayload: (payload: BillingPayload) => void;
  setMode: (mode: ArtifactMode) => void;
  setViewport: (v: ViewportMode) => void;
  setIsExporting: (v: boolean) => void;
  setExportError: (err: string | null) => void;
  setPreset: (key: PresetKey, payload: BillingPayload) => void;
  updateMetricUsage: (metricId: string, usagePercent: number) => void;
  setSimulationDay: (day: number) => void;

  getAlertCount: () => number;
}

export const useBillingStore = create<BillingStoreState>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      payload: { ...samplePayload, aiNarrative: synthesizeNarrative(samplePayload) },
      basePayload: { ...samplePayload, aiNarrative: synthesizeNarrative(samplePayload) },
      mode: 'email',
      activePreset: 'token_spike',
      viewport: 'desktop',
      isExporting: false,
      exportError: null,
      simulationDay: 30,

      setPayload: (payload) => {
        const next = { ...payload, aiNarrative: synthesizeNarrative(payload) };
        set({ payload: next, basePayload: next, simulationDay: 30 }, false, 'setPayload');
      },
      setMode: (mode) => set({ mode }, false, 'setMode'),
      setViewport: (viewport) => set({ viewport }, false, 'setViewport'),
      setIsExporting: (isExporting) =>
        set({ isExporting }, false, 'setIsExporting'),
      setExportError: (exportError) =>
        set({ exportError }, false, 'setExportError'),
      setPreset: (activePreset, payload) => {
        const next = { ...payload, aiNarrative: synthesizeNarrative(payload) };
        set({ activePreset, payload: next, basePayload: next, simulationDay: 30 }, false, 'setPreset');
      },

      updateMetricUsage: (metricId, usagePercent) => {
        const current = get().payload;

        let totalDelta = 0;
        let anyOverBudget = false;

        const nextMetrics: UsageMetric[] = current.metrics.map(
          (metric: UsageMetric) => {
            if (metric.id !== metricId) {
              if (metric.used > metric.limit) anyOverBudget = true;
              return metric;
            }

            const oldUsed = metric.used;
            const newUsed = (usagePercent / 100) * metric.limit;

            // Fix A2: overage portion prices at overageRate, base
            // (within-limit) usage still prices at unitPrice.
            const oldBase = Math.min(oldUsed, metric.limit) * metric.unitPrice;
            const oldOverage =
              Math.max(0, oldUsed - metric.limit) * metric.overageRate;
            const newBase = Math.min(newUsed, metric.limit) * metric.unitPrice;
            const newOverage =
              Math.max(0, newUsed - metric.limit) * metric.overageRate;

            totalDelta += newBase + newOverage - (oldBase + oldOverage);

            if (newUsed > metric.limit) anyOverBudget = true;

            return { ...metric, used: newUsed };
          },
        );

        const nextPayload: BillingPayload = {
          ...current,
          metrics: nextMetrics,
          isOverBudget: anyOverBudget,
          total: current.total + totalDelta,
          // lineItems intentionally left untouched — this recalculation
          // is display-only for live slider interactions.
        };
        nextPayload.aiNarrative = synthesizeNarrative(nextPayload);

        set({ payload: nextPayload, basePayload: nextPayload, simulationDay: 30 }, false, 'updateMetricUsage');
      },

      setSimulationDay: (day) => {
        const base = get().basePayload;
        const ratio = day / 30;

        let anyOverBudget = false;

        const nextMetrics = base.metrics.map((metric) => {
          const simulatedUsed = metric.used * ratio;
          if (simulatedUsed > metric.limit) anyOverBudget = true;
          return { ...metric, used: simulatedUsed };
        });

        let newSubtotal = 0;
        const nextLineItems = base.lineItems.map((item) => {
          const simulatedQty = item.quantity * ratio;
          const simulatedAmt = item.amount * ratio;
          newSubtotal += simulatedAmt;
          return { ...item, quantity: simulatedQty, amount: simulatedAmt };
        });

        const newTaxAmount = newSubtotal * base.taxRate;
        const newTotal = newSubtotal + newTaxAmount;

        const nextPayload: BillingPayload = {
          ...base,
          metrics: nextMetrics,
          lineItems: nextLineItems,
          subtotal: newSubtotal,
          taxAmount: newTaxAmount,
          total: newTotal,
          isOverBudget: anyOverBudget,
        };
        nextPayload.aiNarrative = synthesizeNarrative(nextPayload);

        set({ payload: nextPayload, simulationDay: day }, false, 'setSimulationDay');
      },

      getAlertCount: () => {
        const current = get().payload;
        const threshold = current.alertThreshold;

        return current.metrics.filter((metric: UsageMetric) => {
          if (!metric.limit) return false;
          return calcUsagePercent(metric.used, metric.limit) >= threshold;
        }).length;
      },
    })),
    { name: 'billing-store' },
  ),
);