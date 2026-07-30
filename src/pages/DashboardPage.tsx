import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, LayoutGrid, FileText, Flame, Database, Wifi, ArrowRight } from 'lucide-react'

import { MarketingNavbar } from '@/components/MarketingNavbar'
import { MarketingFooter } from '@/components/MarketingFooter'
import { FramedPanel } from '@/vfx/FramedPanel'
import { CountUpNumber } from '@/vfx/CountUpNumber'
import { useAuthStore } from '@/store/auth-store'
import { useBillingStore } from '@/store/billing-store'
import { presets, getPreset } from '@/data/presets'
import type { ArtifactMode, PresetKey } from '@/data/types'

// ─── Stat card ───────────────────────────────────────────────────────────────
interface StatCardProps {
  panelLabel: string
  value: number
  label: string
}

function StatCard({ panelLabel, value, label }: StatCardProps) {
  return (
    <FramedPanel label={panelLabel} accent="emerald">
      <CountUpNumber
        value={value}
        className="font-mono text-[48px] font-bold text-[var(--marketing-text)]"
        format={(n) => String(Math.round(n))}
      />
      <p className="mt-3 font-mono text-[11px] uppercase tracking-widest text-[var(--marketing-text-subtle)]">
        {label}
      </p>
    </FramedPanel>
  )
}

// ─── Artifact card ────────────────────────────────────────────────────────────
interface ArtifactCardProps {
  panelLabel: string
  icon: React.ReactNode
  title: string
  description: string
  onClick: () => void
}

function ArtifactCard({ panelLabel, icon, title, description, onClick }: ArtifactCardProps) {
  return (
    <FramedPanel label={panelLabel} accent="emerald" hover className="cursor-pointer" >
      <button
        type="button"
        onClick={onClick}
        className="flex h-full w-full flex-col text-left"
        aria-label={`Open ${title} artifact`}
      >
        <div className="mb-6 text-[var(--marketing-emerald)]">{icon}</div>
        <p className="text-[20px] font-semibold text-[var(--marketing-text)]">{title}</p>
        <p className="mt-3 text-sm text-[var(--marketing-text-muted)]">{description}</p>
        <div className="mt-8 flex items-center justify-between">
          <motion.span
            className="font-mono text-[11px] uppercase tracking-widest text-[var(--marketing-emerald)]"
            whileHover={{ x: 4 }}
            transition={{ type: 'tween', duration: 0.15 }}
          >
            Open →
          </motion.span>
        </div>
      </button>
    </FramedPanel>
  )
}

// ─── Scenario row ─────────────────────────────────────────────────────────────
interface ScenarioRowProps {
  icon: React.ReactNode
  title: string
  description: string
  presetKey: PresetKey
  isLast: boolean
  onClick: () => void
}

function ScenarioRow({ icon, title, description, isLast, onClick }: ScenarioRowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'flex w-full items-center gap-4 px-2 py-5 text-left transition-colors hover:bg-[var(--marketing-panel)]',
        !isLast ? 'border-b border-[var(--marketing-border)]' : '',
      ].join(' ')}
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-[var(--marketing-panel)] text-[var(--marketing-emerald)]">
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-[14px] font-medium text-[var(--marketing-text)]">{title}</p>
        <p className="mt-1 text-[12px] text-[var(--marketing-text-muted)]">{description}</p>
      </div>
      <span className="font-mono text-[11px] uppercase tracking-widest text-[var(--marketing-text-muted)] transition-colors hover:text-[var(--marketing-emerald)]">
        Load →
      </span>
    </button>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────
const ARTIFACT_CARDS: {
  panelLabel: string
  icon: React.ReactNode
  title: string
  description: string
  mode: ArtifactMode
}[] = [
  {
    panelLabel: 'ARTIFACT.01',
    icon: <Mail size={24} aria-hidden="true" />,
    title: 'Alert Email',
    description: 'Outlook-safe HTML that renders in every mail client.',
    mode: 'email',
  },
  {
    panelLabel: 'ARTIFACT.02',
    icon: <LayoutGrid size={24} aria-hidden="true" />,
    title: 'Billing Portal',
    description: 'Dark-mode live dashboard for in-app embedding.',
    mode: 'web',
  },
  {
    panelLabel: 'ARTIFACT.03',
    icon: <FileText size={24} aria-hidden="true" />,
    title: 'PDF Invoice',
    description: 'Print-ready A4 with itemized breakdowns and tax.',
    mode: 'document',
  },
]

const SCENARIO_ROWS: {
  icon: React.ReactNode
  presetKey: PresetKey
}[] = [
  { icon: <Flame size={14} aria-hidden="true" />, presetKey: 'token_spike' },
  { icon: <Database size={14} aria-hidden="true" />, presetKey: 'db_surge' },
  { icon: <Wifi size={14} aria-hidden="true" />, presetKey: 'bandwidth_cap' },
]

export function DashboardPage() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const setMode = useBillingStore((s) => s.setMode)
  const setPreset = useBillingStore((s) => s.setPreset)

  const displayName = user?.name ?? 'there'

  const handleArtifact = (mode: ArtifactMode) => {
    setMode(mode)
    navigate('/studio')
  }

  const handlePreset = (key: PresetKey) => {
    const preset = getPreset(key)
    setPreset(key, preset.payload)
    navigate('/studio')
  }

  return (
    <div className="relative min-h-screen bg-[var(--marketing-bg)] text-[var(--marketing-text)]">
      <MarketingNavbar />

      <main className="mx-auto min-h-screen max-w-[1200px] px-8 py-16 pt-32">

        {/* ── Greeting ── */}
        <section aria-labelledby="dashboard-greeting">
          <span className="font-mono text-[11px] uppercase tracking-widest text-[var(--marketing-text-subtle)]">
            Dashboard
          </span>
          <motion.h1
            id="dashboard-greeting"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-4 text-[56px] font-semibold text-[var(--marketing-text)]"
            style={{ letterSpacing: '-0.04em' }}
          >
            Welcome, {displayName}.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-3 text-[18px] text-[var(--marketing-text-muted)]"
          >
            Your billing studio is ready to ship.
          </motion.p>
        </section>

        {/* ── Stats ── */}
        <section className="mt-16" aria-label="Statistics">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <StatCard panelLabel="STATS.01" value={3} label="Artifacts" />
            <StatCard panelLabel="STATS.02" value={5} label="Metrics tracked" />
            <StatCard panelLabel="STATS.03" value={3} label="Presets" />
          </div>
        </section>

        {/* ── Quick actions ── */}
        <section className="mt-16" aria-labelledby="dashboard-artifacts">
          <span className="font-mono text-[11px] uppercase tracking-widest text-[var(--marketing-text-subtle)]">
            Artifacts
          </span>
          <h2
            id="dashboard-artifacts"
            className="mt-3 text-[32px] font-semibold"
            style={{ letterSpacing: '-0.03em' }}
          >
            Choose your surface.
          </h2>
          <p className="mt-2 text-[15px] text-[var(--marketing-text-muted)]">
            Every artifact renders from the same payload.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {ARTIFACT_CARDS.map((card) => (
              <ArtifactCard
                key={card.mode}
                panelLabel={card.panelLabel}
                icon={card.icon}
                title={card.title}
                description={card.description}
                onClick={() => handleArtifact(card.mode)}
              />
            ))}
          </div>
        </section>

        {/* ── Recent scenarios ── */}
        <section className="mt-24" aria-labelledby="dashboard-scenarios">
          <span className="font-mono text-[11px] uppercase tracking-widest text-[var(--marketing-text-subtle)]">
            Scenarios
          </span>
          <h2
            id="dashboard-scenarios"
            className="mt-3 text-[24px] font-semibold"
            style={{ letterSpacing: '-0.02em' }}
          >
            Preset workflows
          </h2>

          <div className="mt-6">
            <FramedPanel label="SCENARIOS.03" accent="neutral">
              {SCENARIO_ROWS.map((row, i) => {
                const preset = presets.find((p) => p.key === row.presetKey)!
                return (
                  <ScenarioRow
                    key={row.presetKey}
                    icon={row.icon}
                    title={preset.label}
                    description={preset.description}
                    presetKey={row.presetKey}
                    isLast={i === SCENARIO_ROWS.length - 1}
                    onClick={() => handlePreset(row.presetKey)}
                  />
                )
              })}
            </FramedPanel>
          </div>
        </section>

        {/* ── Studio CTA ── */}
        <section className="mt-24" aria-label="Open studio">
          <div className="relative overflow-hidden rounded-xl bg-[var(--marketing-emerald)] p-16">
            {/* Dot pattern */}
            <svg
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.12]"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <pattern
                  id="cta-dots"
                  x="0"
                  y="0"
                  width="20"
                  height="20"
                  patternUnits="userSpaceOnUse"
                >
                  <circle cx="2" cy="2" r="1.5" fill="black" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#cta-dots)" />
            </svg>

            {/* Content */}
            <div className="relative z-10">
              <h2
                className="text-[40px] font-semibold text-black"
                style={{ letterSpacing: '-0.03em' }}
              >
                Ready to ship?
              </h2>
              <p className="mt-3 text-[16px] text-black/70">
                Open the interactive billing studio.
              </p>
              <motion.button
                type="button"
                onClick={() => navigate('/studio')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="mt-8 flex h-12 items-center gap-2 rounded-md bg-black px-8 font-mono text-xs font-bold uppercase tracking-wider text-[var(--marketing-emerald)] transition-colors hover:bg-black/90"
              >
                Open studio
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.4, repeat: Infinity }}
                  className="inline-flex"
                >
                  <ArrowRight size={14} aria-hidden="true" />
                </motion.span>
              </motion.button>
            </div>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  )
}
