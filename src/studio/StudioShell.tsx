import { Link } from 'react-router-dom';
import { motion, LayoutGroup } from 'framer-motion';
import {
  Mail,
  LayoutGrid,
  FileText,
  Monitor,
  Smartphone,
  Command,
  ArrowLeft,
} from 'lucide-react';
import { useBillingStore } from '../store/billing-store';
import { formatCurrency } from '../lib/format';
import type { ArtifactMode, ViewportMode } from '../data/types';
import Canvas from './Canvas';
import Inspector from './Inspector';
import CommandPalette from '../vfx/CommandPalette';
import { ExportMenu } from '../vfx/ExportMenu';
import { useToast } from '../vfx/Toast';
import { tabPillTransition, buttonMotion } from '../vfx/motion';

const MODE_TABS: { mode: ArtifactMode; label: string; Icon: typeof Mail }[] = [
  { mode: 'email', label: 'Email', Icon: Mail },
  { mode: 'web', label: 'Portal', Icon: LayoutGrid },
  { mode: 'document', label: 'Invoice', Icon: FileText },
];

const VIEWPORT_TABS: { viewport: ViewportMode; Icon: typeof Monitor }[] = [
  { viewport: 'desktop', Icon: Monitor },
  { viewport: 'mobile', Icon: Smartphone },
];

export default function StudioShell() {
  const mode = useBillingStore((s) => s.mode);
  const viewport = useBillingStore((s) => s.viewport);
  const payload = useBillingStore((s) => s.payload);
  const setMode = useBillingStore((s) => s.setMode);
  const setViewport = useBillingStore((s) => s.setViewport);

  const isOverBudget = payload.isOverBudget;
  const { showToast, toastElement } = useToast();

  return (
    <div className="relative flex flex-col h-screen overflow-hidden bg-background text-foreground">
      {/* Skip to content link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:rounded-md focus:text-sm focus:font-medium"
      >
        Skip to content
      </a>

      {/* Command Palette */}
      <CommandPalette />

      {/* Toast notifications */}
      {toastElement}

      {/* Header */}
      <header className="flex items-center h-12 px-4 shrink-0 border-b border-white/[0.06] bg-background">
        {/* Left: back + brand + breadcrumb */}
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard"
            aria-label="Back to dashboard"
            className="flex items-center gap-1.5 text-white/40 transition-colors hover:text-white"
          >
            <ArrowLeft className="w-3 h-3" strokeWidth={2} aria-hidden="true" />
            <span className="text-body-sm">Back</span>
          </Link>

          <span className="text-foreground-subtle text-body font-light">/</span>

          <a href="/" className="flex items-center gap-2 group" aria-label="TrueUp home">
            <div className="w-6 h-6 rounded-md bg-foreground flex items-center justify-center">
              <span
                className="text-background font-semibold text-[13px] leading-none"
                style={{ letterSpacing: '-0.08em' }}
              >
                T
              </span>
            </div>
            <span
              className="font-semibold text-body-sm tracking-tight text-foreground"
              style={{ letterSpacing: '-0.03em' }}
            >
              trueup
            </span>
          </a>

          <span className="text-foreground-subtle text-body font-light">/</span>
          <span className="text-foreground-muted text-body-sm font-medium">billing</span>
          <span className="text-foreground-subtle text-body font-light">/</span>
          <span className="text-foreground text-body-sm font-medium">studio</span>
        </div>

        {/* Center — mode tabs with FLIP pill */}
        <LayoutGroup id="mode-tabs">
          <div
            className="mx-auto flex items-center gap-0.5 p-0.5 rounded-md bg-geist-accent-1 shadow-ring-1 relative"
            role="tablist"
            aria-label="Artifact mode"
          >
            {MODE_TABS.map(({ mode: m, label, Icon }) => {
              const active = mode === m;
              return (
                <button
                  key={m}
                  role="tab"
                  aria-selected={active}
                  aria-pressed={active}
                  onClick={() => setMode(m)}
                  className="relative flex items-center gap-1.5 px-3 py-1 text-body-sm font-medium tracking-tight z-10"
                >
                  {active && (
                    <motion.div
                      layoutId="mode-pill"
                      className="absolute inset-0 rounded bg-white/[0.09] shadow-ring-1"
                      transition={tabPillTransition}
                    />
                  )}
                  <Icon
                    className={
                      'w-3 h-3 relative z-10 transition-colors ' +
                      (active ? 'text-foreground' : 'text-foreground-muted')
                    }
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                  <span
                    className={
                      'relative z-10 transition-colors ' +
                      (active ? 'text-foreground' : 'text-foreground-muted')
                    }
                  >
                    {label}
                  </span>
                </button>
              );
            })}
          </div>
        </LayoutGroup>

        {/* Right cluster */}
        <div className="flex items-center gap-3">
          <LayoutGroup id="viewport-tabs">
            <div
              className="flex items-center gap-0.5 p-0.5 rounded-md bg-geist-accent-1 shadow-ring-1 relative"
              role="group"
              aria-label="Viewport mode"
            >
              {VIEWPORT_TABS.map(({ viewport: v, Icon }) => {
                const active = viewport === v;
                return (
                  <button
                    key={v}
                    type="button"
                    aria-pressed={active}
                    aria-label={v === 'desktop' ? 'Desktop viewport' : 'Mobile viewport'}
                    onClick={() => setViewport(v)}
                    className="relative p-1 z-10"
                  >
                    {active && (
                      <motion.div
                        layoutId="viewport-pill"
                        className="absolute inset-0 rounded bg-white/[0.09] shadow-ring-1"
                        transition={tabPillTransition}
                      />
                    )}
                    <Icon
                      className={
                        'w-3 h-3 relative z-10 transition-colors ' +
                        (active ? 'text-foreground' : 'text-foreground-muted')
                      }
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                  </button>
                );
              })}
            </div>
          </LayoutGroup>

          <div className="h-4 w-px bg-white/10" aria-hidden="true" />

          {/* Total pill */}
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-md shadow-ring-1 bg-geist-accent-1">
            <span
              className={
                'w-1.5 h-1.5 rounded-full ' +
                (isOverBudget ? 'bg-geist-red animate-pulse' : 'bg-foreground')
              }
              aria-hidden="true"
            />
            <span className="font-mono text-micro text-foreground tnum">
              {formatCurrency(payload.total, payload.currency)}
            </span>
          </div>

          {isOverBudget && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              role="status"
              aria-live="polite"
              className="px-2 py-0.5 rounded-md bg-geist-red/[0.08] shadow-[inset_0_0_0_1px_rgba(238,0,0,0.3)] text-geist-red text-micro font-semibold uppercase tracking-widest"
            >
              Over Budget
            </motion.div>
          )}

          {/* Export menu */}
          <ExportMenu showToast={showToast} />

          <div className="h-4 w-px bg-white/10" aria-hidden="true" />

          {/* Command palette trigger */}
          <button
            {...buttonMotion}
            type="button"
            aria-label="Open command palette"
            aria-keyshortcuts="Control+K Meta+K"
            onClick={() =>
              window.dispatchEvent(
                new KeyboardEvent('keydown', {
                  key: 'k',
                  metaKey: true,
                  ctrlKey: true,
                }),
              )
            }
            className="flex items-center gap-1 px-1.5 py-0.5 rounded-md shadow-ring-1 bg-geist-accent-1 text-foreground-muted hover:text-foreground transition-colors"
          >
            <Command className="w-2.5 h-2.5" strokeWidth={2} aria-hidden="true" />
            <kbd className="font-mono text-[10px] font-medium">K</kbd>
          </button>
        </div>
      </header>

      {/* Body */}
      <main id="main-content" role="main" className="flex flex-1 min-h-0">
        <Inspector />
        <Canvas />
      </main>

      {/* Status bar */}
      <div className="flex items-center px-4 h-7 shrink-0 border-t border-white/[0.06] bg-background font-mono text-[10.5px] uppercase tracking-wider">
        <div className="flex items-center gap-3 text-foreground-subtle flex-1 tnum">
          <span className="text-foreground-muted">{payload.invoiceId}</span>
          <span className="text-foreground-subtle" aria-hidden="true">—</span>
          <span>{payload.planName}</span>
          <span className="text-foreground-subtle" aria-hidden="true">—</span>
          <span>{payload.metrics.length} metrics</span>
          <span className="text-foreground-subtle" aria-hidden="true">—</span>
          <span className="text-foreground-muted">
            {mode === 'email' ? 'Email' : mode === 'web' ? 'Page' : 'Document'}
          </span>
          <span className="text-foreground-subtle" aria-hidden="true">—</span>
          <span
            className="max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap"
            title={payload.customer.company}
          >
            {payload.customer.company}
          </span>
        </div>
        <div className="flex items-center gap-2 ml-auto text-foreground-subtle">
          <span>@unlayer/react-elements@0.1.20</span>
          <span className="w-1 h-1 rounded-full bg-foreground-muted" aria-hidden="true" />
          <span className="text-foreground-muted">ready</span>
        </div>
      </div>
    </div>
  );
}