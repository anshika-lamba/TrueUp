import { useState } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import {
  Flame,
  Database,
  Wifi,
  Zap,
  Cpu,
  HardDrive,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { useBillingStore } from '../store/billing-store';
import {
  formatCurrency,
  formatPercent,
  calcUsagePercent,
  formatNumber,
} from '../lib/format';
import { presets } from '../data/presets';
import { samplePayload } from '../data/sample';
import type { MetricCategory, MetricTrend, BillingPayload } from '../data/types';
import Spotlight from '../vfx/Spotlight';
import { EmptyState } from '../vfx/EmptyState';
import {
  fadeInUp,
  staggerContainer,
  buttonMotion,
  tabPillTransition,
  EASE_OUT,
  DURATION_FAST,
} from '../vfx/motion';

const PRESET_ICON: Record<string, typeof Flame> = {
  token_spike: Flame,
  db_surge: Database,
  bandwidth_cap: Wifi,
};

const CATEGORY_ICON: Record<MetricCategory, typeof Cpu> = {
  compute: Cpu,
  storage: HardDrive,
  network: Wifi,
  api: Zap,
  database: Database,
};

const TREND_ICON: Record<MetricTrend, { Icon: typeof TrendingUp; color: string }> = {
  up: { Icon: TrendingUp, color: '#ee0000' },
  down: { Icon: TrendingDown, color: '#0070f3' },
  stable: { Icon: Minus, color: '#666666' },
};

function getSliderColor(pct: number): string {
  if (pct >= 90) return '#ee0000';
  if (pct >= 70) return '#f5a623';
  return '#ededed';
}

/**
 * Validates a parsed payload object before applying it to the store.
 * Returns an error message string, or null if valid.
 */
function validatePayload(parsed: unknown): string | null {
  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    return 'Payload must be a JSON object, not an array or primitive.';
  }
  const p = parsed as Record<string, unknown>;
  if (typeof p.invoiceId !== 'string') return 'Missing required field: invoiceId (string)';
  if (!Array.isArray(p.metrics)) return 'Missing required field: metrics (array)';
  if (!Array.isArray(p.lineItems)) return 'Missing required field: lineItems (array)';
  if (typeof p.total !== 'number') return 'Missing required field: total (number)';
  if (typeof p.customer !== 'object' || p.customer === null)
    return 'Missing required field: customer (object)';
  const c = p.customer as Record<string, unknown>;
  if (typeof c.name !== 'string') return 'Missing required field: customer.name (string)';
  if (typeof c.company !== 'string') return 'Missing required field: customer.company (string)';
  return null;
}

export default function Inspector() {
  const payload = useBillingStore((s) => s.payload);
  const activePreset = useBillingStore((s) => s.activePreset);
  const setPreset = useBillingStore((s) => s.setPreset);
  const updateMetricUsage = useBillingStore((s) => s.updateMetricUsage);
  const setPayload = useBillingStore((s) => s.setPayload);
  const simulationDay = useBillingStore((s) => s.simulationDay);
  const setSimulationDay = useBillingStore((s) => s.setSimulationDay);

  const [showJson, setShowJson] = useState(false);
  const [jsonText, setJsonText] = useState(() => JSON.stringify(payload, null, 2));
  const [jsonError, setJsonError] = useState('');

  const total = payload.total;
  const taxRate = payload.taxRate;
  const isOverBudget = payload.isOverBudget;

  // Fix A3: validate before applying
  const handleApply = () => {
    try {
      const parsed = JSON.parse(jsonText) as unknown;
      const validationError = validatePayload(parsed);
      if (validationError) {
        setJsonError(validationError);
        return;
      }
      setPayload(parsed as BillingPayload);
      setJsonError('');
    } catch (e) {
      setJsonError((e as Error).message);
    }
  };

  return (
    <aside
      className="w-[280px] shrink-0 flex flex-col overflow-hidden border-r border-white/[0.06] bg-background"
      aria-label="Inspector panel"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-11 shrink-0 border-b border-white/[0.06]">
        <span
          className="text-body-sm font-semibold text-foreground tracking-tight"
          style={{ letterSpacing: '-0.03em' }}
        >
          Inspector
        </span>
        <LayoutGroup id="inspector-mode">
          <div
            className="flex items-center gap-0.5 p-0.5 rounded-md bg-geist-accent-1 shadow-ring-1 relative"
            role="group"
            aria-label="View mode"
          >
            {[
              { key: 'controls', label: 'Controls', active: !showJson },
              { key: 'json', label: 'JSON', active: showJson },
            ].map((t) => (
              <button
                key={t.key}
                type="button"
                aria-pressed={t.active}
                onClick={() => {
                  if (t.key === 'json') {
                    setJsonText(JSON.stringify(payload, null, 2));
                    setShowJson(true);
                  } else {
                    setShowJson(false);
                  }
                }}
                className="relative px-2 py-0.5 text-[10.5px] font-medium z-10"
              >
                {t.active && (
                  <motion.div
                    layoutId="inspector-pill"
                    className="absolute inset-0 rounded bg-white/[0.09] shadow-ring-1"
                    transition={tabPillTransition}
                  />
                )}
                <span
                  className={
                    'relative z-10 ' +
                    (t.active ? 'text-foreground' : 'text-foreground-muted')
                  }
                >
                  {t.label}
                </span>
              </button>
            ))}
          </div>
        </LayoutGroup>
      </div>

      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {!showJson ? (
            <motion.div
              key="controls"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: DURATION_FAST, ease: EASE_OUT }}
            >
              {/* Scenarios */}
              <div className="px-4 py-4 border-b border-white/[0.06]">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-[10px] tracking-widest text-foreground-subtle font-semibold uppercase">
                    Scenarios
                  </span>
                  <span className="font-mono text-[10px] text-foreground-subtle tnum">
                    {presets.length}
                  </span>
                </div>
                <motion.div
                  variants={staggerContainer}
                  initial="initial"
                  animate="animate"
                  className="flex flex-col gap-1"
                >
                  {presets.map((preset) => {
                    const Icon = PRESET_ICON[preset.key];
                    const active = activePreset === preset.key;
                    return (
                      <motion.div key={preset.key} variants={fadeInUp}>
                        <Spotlight className="rounded-md">
                          <button
                            type="button"
                            aria-pressed={active}
                            onClick={() => setPreset(preset.key, preset.payload)}
                            className={
                              'group w-full text-left rounded-md px-2.5 py-2 transition-all ' +
                              (active
                                ? 'bg-white/[0.04] shadow-ring-1-strong'
                                : 'hover:bg-white/[0.02]')
                            }
                          >
                            <div className="flex items-center gap-2.5">
                              <div
                                className={
                                  'w-5 h-5 rounded flex items-center justify-center transition-colors ' +
                                  (active
                                    ? 'bg-foreground text-background'
                                    : 'bg-geist-accent-2 text-foreground-muted')
                                }
                              >
                                <Icon className="w-2.5 h-2.5" strokeWidth={2.5} aria-hidden="true" />
                              </div>
                              <span
                                className={
                                  'text-[12.5px] font-medium flex-1 tracking-tight ' +
                                  (active ? 'text-foreground' : 'text-foreground-muted')
                                }
                                style={{ letterSpacing: '-0.02em' }}
                              >
                                {preset.label}
                              </span>
                              {active && (
                                <motion.div
                                  layoutId="active-preset-dot"
                                  className="w-1 h-1 rounded-full bg-foreground"
                                  transition={tabPillTransition}
                                />
                              )}
                            </div>
                            <p
                              className={
                                'text-[11px] mt-1 pl-[30px] leading-snug ' +
                                (active ? 'text-foreground-muted' : 'text-foreground-subtle')
                              }
                            >
                              {preset.description}
                            </p>
                          </button>
                        </Spotlight>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </div>

              {/* Timeline Simulator */}
              <div className="px-4 py-4 border-b border-white/[0.06]">
                <div className="mb-3">
                  <span className="font-mono text-[10px] tracking-widest text-foreground-subtle font-semibold uppercase">
                    Timeline Simulator
                  </span>
                </div>
                <div className="mb-2 flex items-center justify-between font-mono text-[11px]">
                  <span className="text-foreground-muted">Day {simulationDay} of 30</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={30}
                  step={1}
                  value={simulationDay}
                  aria-label="Billing cycle simulation day"
                  onChange={(e) => setSimulationDay(Number(e.target.value))}
                  className="w-full h-1 rounded-full cursor-pointer accent-white bg-white/[0.06]"
                  style={{ background: `linear-gradient(to right, #fafafa 0%, #fafafa ${(simulationDay / 30) * 100}%, rgba(255,255,255,0.06) ${(simulationDay / 30) * 100}%, rgba(255,255,255,0.06) 100%)` }}
                />
              </div>

              {/* Brand Configuration */}
              <div className="px-4 py-4 border-b border-white/[0.06]">
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-mono text-[10px] tracking-widest text-foreground-subtle font-semibold uppercase">
                    Brand Config
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={payload.brandConfig?.color || '#3b82f6'}
                    onChange={(e) =>
                      setPayload({
                        ...payload,
                        brandConfig: { ...payload.brandConfig, color: e.target.value },
                      })
                    }
                    className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent p-0"
                    aria-label="Brand color picker"
                  />
                  <span className="text-foreground-muted font-mono text-[11px]">
                    {payload.brandConfig?.color || '#3b82f6'}
                  </span>
                </div>
              </div>

              {/* Live Metrics */}
              <div className="px-4 py-4 border-b border-white/[0.06]">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-[10px] tracking-widest text-foreground-subtle font-semibold uppercase">
                    Live Metrics
                  </span>
                  <span className="font-mono text-[10px] text-foreground-subtle tnum">
                    {payload.metrics.length}
                  </span>
                </div>

                {/* Fix A8: empty state when no metrics */}
                {payload.metrics.length === 0 ? (
                  <EmptyState
                    icon={Zap}
                    title="No metrics tracked"
                    description="Add usage metrics to your payload to see them here."
                    action={{
                      label: 'Reset to sample',
                      onClick: () => setPayload(samplePayload),
                    }}
                  />
                ) : (
                  <motion.div
                    variants={staggerContainer}
                    initial="initial"
                    animate="animate"
                    className="flex flex-col gap-4"
                  >
                    {payload.metrics.map((metric) => {
                      const CategoryIcon = CATEGORY_ICON[metric.category];
                      const { Icon: TrendIcon, color: trendColor } = TREND_ICON[metric.trend];
                      const pct = calcUsagePercent(metric.used, metric.limit);
                      const clampedPct = Math.min(100, Math.max(0, pct));
                      const sliderColor = getSliderColor(pct);
                      const estimatedCost = metric.used * metric.unitPrice;

                      return (
                        <motion.div key={metric.id} variants={fadeInUp}>
                          <div className="flex items-center gap-2 mb-1.5">
                            <CategoryIcon
                              className="w-3 h-3 text-foreground-subtle"
                              strokeWidth={2}
                              aria-hidden="true"
                            />
                            <span
                              className="text-[12px] text-foreground-muted flex-1 truncate font-medium tracking-tight"
                              style={{ letterSpacing: '-0.02em' }}
                            >
                              {metric.label}
                            </span>
                            <TrendIcon
                              className="w-3 h-3"
                              strokeWidth={2}
                              style={{ color: trendColor }}
                              aria-hidden="true"
                            />
                            <span
                              className="text-[12px] font-semibold font-mono tnum"
                              style={{ color: sliderColor }}
                            >
                              {formatPercent(pct)}
                            </span>
                          </div>
                          <input
                            type="range"
                            min={0}
                            max={100}
                            value={clampedPct}
                            aria-label={`${metric.label} usage percentage`}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-valuenow={Math.round(clampedPct)}
                            aria-valuetext={`${formatPercent(pct)} of ${formatNumber(metric.limit, true)} ${metric.unit}`}
                            onChange={(e) =>
                              updateMetricUsage(metric.id, Number(e.target.value))
                            }
                            className="w-full h-1 rounded-full cursor-pointer"
                            style={{
                              background: `linear-gradient(to right, ${sliderColor} 0%, ${sliderColor} ${clampedPct}%, rgba(255,255,255,0.06) ${clampedPct}%, rgba(255,255,255,0.06) 100%)`,
                            }}
                          />
                          <div className="flex justify-between mt-1.5 font-mono text-[10.5px]">
                            <span className="text-foreground-subtle tnum">
                              {formatCurrency(estimatedCost)}
                            </span>
                            <span className="text-foreground-muted tnum">
                              {formatNumber(metric.used, true)} /{' '}
                              {formatNumber(metric.limit, true)} {metric.unit}
                            </span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                )}
              </div>

              {/* Metadata */}
              <div className="px-4 py-4">
                <div className="mb-3">
                  <span className="font-mono text-[10px] tracking-widest text-foreground-subtle font-semibold uppercase">
                    Metadata
                  </span>
                </div>
                <div className="flex flex-col gap-1.5 font-mono text-[11px]">
                  {[
                    ['Invoice', payload.invoiceId],
                    ['Plan', payload.planName],
                    ['Customer', payload.customer.company],
                    ['Period', payload.periodEnd],
                    ['Total', formatCurrency(total, payload.currency)],
                    ['Tax', formatPercent(taxRate * 100)],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="flex justify-between items-center gap-4"
                    >
                      <span className="text-foreground-subtle">{label}</span>
                      <span className="text-foreground-muted truncate tnum">{value}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center gap-4 pt-1.5 mt-1 border-t border-white/[0.06]">
                    <span className="text-foreground-subtle">Status</span>
                    <span
                      className={
                        'flex items-center gap-1 tnum ' +
                        (isOverBudget ? 'text-geist-red' : 'text-[#0070f3]')
                      }
                    >
                      {isOverBudget ? (
                        <>
                          <AlertTriangle className="w-2.5 h-2.5" strokeWidth={2.5} aria-hidden="true" />
                          over
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-2.5 h-2.5" strokeWidth={2.5} aria-hidden="true" />
                          ok
                        </>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="json"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: DURATION_FAST, ease: EASE_OUT }}
              className="p-4 flex flex-col gap-3"
            >
              <div className="flex items-center gap-2 text-foreground-muted text-[11px]">
                <span>Edit payload · Apply to update</span>
              </div>
              <textarea
                aria-label="JSON payload editor"
                className="w-full h-[400px] rounded-md p-3 bg-geist-accent-1 shadow-ring-1 font-mono text-[11px] text-foreground focus:shadow-focus-ring focus:outline-none transition-shadow resize-none"
                spellCheck={false}
                value={jsonText}
                onChange={(e) => setJsonText(e.target.value)}
              />
              <AnimatePresence>
                {jsonError && (
                  <motion.div
                    role="alert"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="flex items-start gap-2 px-3 py-2 rounded-md bg-geist-red/[0.08] shadow-[inset_0_0_0_1px_rgba(238,0,0,0.3)] text-geist-red text-[11px] font-mono"
                  >
                    <AlertTriangle
                      className="w-3 h-3 mt-0.5 shrink-0"
                      strokeWidth={2.5}
                      aria-hidden="true"
                    />
                    <span className="break-all">{jsonError}</span>
                  </motion.div>
                )}
              </AnimatePresence>
              <motion.button
                {...buttonMotion}
                type="button"
                onClick={handleApply}
                className="w-full h-9 rounded-md text-body-sm font-semibold text-background bg-foreground hover:bg-foreground/95 transition-colors"
              >
                Apply
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </aside>
  );
}