import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FramedPanel } from '@/vfx/FramedPanel'

type Tab = 'email' | 'portal' | 'pdf'

const TABS: { id: Tab; label: string }[] = [
  { id: 'email', label: 'Alert Email' },
  { id: 'portal', label: 'Live Portal' },
  { id: 'pdf', label: 'Audit PDF' },
]

const EMAIL_ROWS = [
  { service: 'OpenAI GPT-4', usage: '4.85M tokens', cost: '$48.50', over: true },
  { service: 'Supabase DB', usage: '12.3 GB', cost: '$12.30', over: false },
  { service: 'Stripe API', usage: '2,840 calls', cost: '$8.52', over: false },
  { service: 'Edge Compute', usage: '980 ms avg', cost: '$9.10', over: false },
  { service: 'Bandwidth', usage: '88.4 GB', cost: '$4.42', over: false },
]

const PORTAL_METRICS = [
  { label: 'Monthly Spend', value: '$82.84', delta: '+12.4%', up: true },
  { label: 'Budget Used', value: '94.2%', delta: '+6.1%', up: true },
  { label: 'Overage Alerts', value: '3', delta: '+2', up: true },
  { label: 'Est. Next Bill', value: '$91.40', delta: '+$8.56', up: true },
]

const PDF_LINES = [
  '┌──────────────────────────────────────────┐',
  '│  TRUEUP AUDIT REPORT · 2024-01           │',
  '│  Generated: 2024-01-31 23:59 UTC         │',
  '├──────────────────────────────────────────┤',
  '│  SERVICE          USAGE      COST        │',
  '├──────────────────────────────────────────┤',
  '│  OpenAI GPT-4     4.85M tok  $48.50 ⚠   │',
  '│  Supabase DB      12.3 GB    $12.30      │',
  '│  Stripe API       2,840 req  $ 8.52      │',
  '│  Edge Compute     980ms avg  $ 9.10      │',
  '│  Bandwidth        88.4 GB    $ 4.42      │',
  '├──────────────────────────────────────────┤',
  '│  TOTAL                       $82.84      │',
  '│  BUDGET LIMIT                $87.50      │',
  '│  REMAINING                   $ 4.66      │',
  '└──────────────────────────────────────────┘',
]

function EmailPane() {
  return (
    <div className="flex flex-col gap-1">
      <div className="mb-3 border-b border-[var(--marketing-border)] pb-3">
        <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--marketing-text-subtle)]">
          From: alerts@trueup.io · Subject: ⚠ Budget Alert — January 2024
        </p>
      </div>
      <p className="mb-4 text-[13px] text-[var(--marketing-text-muted)]">
        One or more services have exceeded 90% of budget. See breakdown:
      </p>
      <div className="overflow-hidden rounded border border-[var(--marketing-border)]">
        <table className="w-full font-mono text-[12px]">
          <thead>
            <tr className="border-b border-[var(--marketing-border)] bg-[var(--marketing-panel)]">
              <th className="px-3 py-2 text-left text-[10px] uppercase tracking-widest text-[var(--marketing-text-subtle)]">Service</th>
              <th className="px-3 py-2 text-right text-[10px] uppercase tracking-widest text-[var(--marketing-text-subtle)]">Usage</th>
              <th className="px-3 py-2 text-right text-[10px] uppercase tracking-widest text-[var(--marketing-text-subtle)]">Cost</th>
            </tr>
          </thead>
          <tbody>
            {EMAIL_ROWS.map((row) => (
              <tr key={row.service} className="border-b border-[var(--marketing-border)] last:border-0">
                <td className="px-3 py-2 text-[var(--marketing-text)]">
                  {row.over && (
                    <span className="mr-1.5 text-[var(--marketing-rose)]">⚠</span>
                  )}
                  {row.service}
                </td>
                <td className="px-3 py-2 text-right text-[var(--marketing-text-muted)]">{row.usage}</td>
                <td className={`px-3 py-2 text-right font-bold ${row.over ? 'text-[var(--marketing-rose)]' : 'text-[var(--marketing-text)]'}`}>
                  {row.cost}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function PortalPane() {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        {PORTAL_METRICS.map((m) => (
          <div
            key={m.label}
            className="rounded border border-[var(--marketing-border)] bg-[var(--marketing-panel)] p-4"
          >
            <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--marketing-text-subtle)]">
              {m.label}
            </p>
            <p className="mt-1 font-mono text-xl font-bold text-[var(--marketing-text)]">{m.value}</p>
            <p className={`mt-0.5 font-mono text-[11px] ${m.up ? 'text-[var(--marketing-rose)]' : 'text-[var(--marketing-emerald)]'}`}>
              {m.delta}
            </p>
          </div>
        ))}
      </div>
      <div className="h-2 w-full rounded-full bg-[var(--marketing-border)]">
        <motion.div
          className="h-full rounded-full bg-[var(--marketing-emerald)]"
          initial={{ width: 0 }}
          animate={{ width: '94.2%' }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{ backgroundColor: 'var(--marketing-rose)' }}
        />
      </div>
      <p className="font-mono text-[10px] text-right uppercase tracking-widest text-[var(--marketing-text-subtle)]">
        94.2% budget consumed · 4.66 remaining
      </p>
    </div>
  )
}

function PdfPane() {
  return (
    <pre className="overflow-x-auto font-mono text-[11px] leading-relaxed text-[var(--marketing-text-muted)]">
      {PDF_LINES.join('\n')}
    </pre>
  )
}

const PANES: Record<Tab, JSX.Element> = {
  email: <EmailPane />,
  portal: <PortalPane />,
  pdf: <PdfPane />,
}

export function ArtifactForge() {
  const [active, setActive] = useState<Tab>('email')

  return (
    <div className="mx-auto w-full max-w-[720px]">
      {/* Tab bar */}
      <div className="mb-[-1px] flex gap-0">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActive(tab.id)}
            className={[
              'relative px-5 py-2 font-mono text-[11px] uppercase tracking-widest transition-colors',
              'border border-b-0 border-[var(--marketing-border)]',
              'first:rounded-tl-sm last:rounded-tr-sm',
              active === tab.id
                ? 'bg-[var(--marketing-panel)] text-[var(--marketing-text)] z-10'
                : 'bg-transparent text-[var(--marketing-text-subtle)] hover:text-[var(--marketing-text-muted)]',
            ].join(' ')}
          >
            {tab.label}
            {active === tab.id && (
              <span
                className="absolute bottom-0 left-0 right-0 h-[1px]"
                style={{ backgroundColor: 'var(--marketing-panel, #0d0d0d)' }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Content panel */}
      <FramedPanel label={`OUTPUT.${active.toUpperCase()}`} accent="emerald" className="!rounded-tl-none min-h-[280px]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {PANES[active]}
          </motion.div>
        </AnimatePresence>
      </FramedPanel>
    </div>
  )
}
