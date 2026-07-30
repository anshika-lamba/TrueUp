// pages/LandingPage.tsx
import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { AlertTriangle, ArrowRight } from 'lucide-react'

import { MarketingNavbar } from '@/components/MarketingNavbar'
import { MarketingFooter } from '@/components/MarketingFooter'
import { FramedPanel } from '@/vfx/FramedPanel'
import { DataStream } from '@/vfx/DataStream'
import { InstrumentPanel } from '@/vfx/InstrumentPanel'
import { ThresholdFlash } from '@/vfx/ThresholdFlash'
import { ArtifactForge } from '@/vfx/ArtifactForge'
import { Constellation } from '@/vfx/Constellation'
import { useAuthStore } from '@/store/auth-store'

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}

const flowWords = ['Every', 'dollar', 'flows', 'through', 'your', 'stack.']

function ThresholdSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-20% 0px' })
  const [flashed, setFlashed] = useState(false)

  return (
    <section
      id="act-threshold"
      className="relative flex min-h-screen flex-col items-center justify-center px-8 py-32"
    >
      <div ref={ref}>
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-[420px]"
        >
          <motion.div
            animate={inView && !flashed ? { rotate: [0, -1.5, 1.5, 0] } : {}}
            transition={{ duration: 0.4 }}
          >
            <FramedPanel label="ALERT.001" accent="rose">
              <div className="flex flex-col items-center text-center">
                <AlertTriangle size={32} color="var(--marketing-rose)" aria-hidden="true" />
                <p className="mt-3 font-mono text-sm font-bold uppercase tracking-widest text-[var(--marketing-rose)]">
                  Budget exceeded
                </p>
                <p
                  className="mt-2 font-mono text-3xl font-bold text-[var(--marketing-text)]"
                  style={{ fontVariantNumeric: 'tabular-nums' }}
                >
                  $47.20 over
                </p>
                <p className="mt-4 text-[13px] text-[var(--marketing-text-muted)]">
                  OpenAI GPT-4 Tokens · 4.85M / 3M plan limit
                </p>
                <p className="mt-6 font-mono text-[10px] uppercase text-[var(--marketing-text-subtle)]">
                  3 minutes ago
                </p>
              </div>
            </FramedPanel>
          </motion.div>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-16 text-center text-4xl font-semibold"
        >
          The moment usage crosses cost.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mx-auto mt-4 max-w-[500px] text-center text-base text-[var(--marketing-text-muted)]"
        >
          TrueUp catches every overage the instant it happens.
        </motion.p>
      </div>

      <ThresholdFlash trigger={inView} onComplete={() => setFlashed(true)} />
    </section>
  )
}

export function LandingPage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const primaryHref = isAuthenticated ? '/studio' : '/signup'

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[var(--marketing-bg)] text-[var(--marketing-text)]">
      <MarketingNavbar />

      <section className="flex min-h-screen flex-col items-center justify-center px-8 pt-20">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.6 }}
          className="mb-8 rounded-full border border-[var(--marketing-border)] bg-[var(--marketing-panel)] px-4 py-1.5 font-mono text-[11px] uppercase tracking-widest text-[var(--marketing-text-muted)]"
        >
          Built for the Unlayer Elements Challenge
        </motion.div>

        <motion.h1
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-[900px] text-center text-[56px] font-semibold leading-[1.05]"
          style={{ letterSpacing: '-0.04em' }}
        >
          Every dollar in your stack. Accounted for.
        </motion.h1>

        <motion.p
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-6 max-w-[640px] text-center text-lg leading-relaxed text-[var(--marketing-text-muted)]"
        >
          TrueUp turns your usage data into an alert email, a live portal, and an
          audit PDF — all from one payload, all in real-time.
        </motion.p>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-10 flex gap-4"
        >
          <Link
            to={primaryHref}
            className="flex h-11 items-center rounded-md bg-[var(--marketing-emerald)] px-6 font-mono text-xs font-bold uppercase tracking-wider text-black transition-all hover:scale-[1.02] hover:bg-emerald-400 active:scale-[0.97]"
          >
            Enter studio
          </Link>
          <a
            href="#code"
            className="flex h-11 items-center rounded-md border-2 border-white/20 px-6 font-mono text-xs font-bold uppercase tracking-wider text-[var(--marketing-text)] transition-all hover:border-white/40 hover:bg-white/[0.04]"
          >
            Read the code
          </a>
        </motion.div>

        <p className="mt-6 text-sm text-[var(--marketing-text-subtle)]">
          or{' '}
          <Link to="/studio" className="text-[var(--marketing-emerald)] underline">
            try it live
          </Link>{' '}
          — no signup required
        </p>

        <motion.div
          animate={{ y: [0, 4, 0] }}
          transition={{ duration: 1.6, repeat: Infinity }}
          className="absolute bottom-10 font-mono text-[10px] uppercase tracking-widest text-[var(--marketing-text-subtle)]"
        >
          Scroll to see the flow ↓
        </motion.div>
      </section>

      <section
        id="act-flow"
        className="flex min-h-screen flex-col items-center justify-center px-8 py-32"
      >
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-10%' }}
          transition={{ staggerChildren: 0.08 }}
          className="mb-16 max-w-[800px] text-center text-4xl font-semibold"
        >
          {flowWords.map((word) => (
            <motion.span
              key={word}
              variants={fadeInUp}
              transition={{ duration: 0.4 }}
              className="mr-3 inline-block"
            >
              {word}
            </motion.span>
          ))}
        </motion.h2>

        <DataStream />

        <p className="mt-10 font-mono text-[10px] uppercase tracking-widest text-[var(--marketing-text-subtle)]">
          3 streams · 47 events/sec · you control the flow
        </p>
      </section>

      <section
        id="act-instruments"
        className="flex min-h-screen flex-col items-center justify-center px-8 py-32"
      >
        <span className="font-mono text-[11px] uppercase tracking-widest text-[var(--marketing-text-subtle)]">
          Measurement
        </span>
        <h2 className="mb-4 mt-4 max-w-[700px] text-center text-4xl font-semibold">
          TrueUp measures every current.
        </h2>
        <p className="mb-16 max-w-[500px] text-center text-base text-[var(--marketing-text-muted)]">
          Real-time gauges for every metric that matters to your bottom line.
        </p>

        <InstrumentPanel />

        <p className="mt-16 font-mono text-[11px] text-[var(--marketing-text-subtle)]">
          Click any meter to inspect
        </p>
      </section>

      <ThresholdSection />

      <section id="act-forge" className="px-8 py-32">
        <div className="mx-auto max-w-[1280px]">
          <span className="font-mono text-[11px] uppercase tracking-widest text-[var(--marketing-text-subtle)]">
            Manufacture
          </span>
          <h2
            className="mb-4 mt-2 max-w-[600px] text-[40px] font-semibold"
            style={{ letterSpacing: '-0.03em' }}
          >
            One payload. Three artifacts.
          </h2>
          <p className="mb-16 max-w-[500px] text-base text-[var(--marketing-text-muted)]">
            Feed TrueUp your billing JSON. Ship email, portal, and PDF — all from
            the same source.
          </p>

          <ArtifactForge />
        </div>
      </section>

      <section
        id="act-constellation"
        className="flex min-h-screen flex-col items-center justify-center px-8 py-32"
      >
        <span className="font-mono text-[11px] uppercase tracking-widest text-[var(--marketing-text-subtle)]">
          Scale
        </span>
        <h2
          className="mb-16 mt-4 max-w-[800px] text-center text-4xl font-semibold"
          style={{ letterSpacing: '-0.03em' }}
        >
          12 months. Thousands of events. One system of truth.
        </h2>

        <Constellation />

        <p className="mt-8 font-mono text-[11px] text-[var(--marketing-text-subtle)]">
          Scroll to spin
        </p>
      </section>

      <section
        id="act-cta"
        className="relative flex min-h-screen flex-col items-center justify-center px-8 py-32"
      >
        <div
          className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.05]"
          aria-hidden="true"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
            className="h-[600px] w-[600px]"
          >
            <Constellation />
          </motion.div>
        </div>

        <div className="relative z-10 flex flex-col items-center">
          <span className="font-mono text-[11px] uppercase tracking-widest text-[var(--marketing-text-subtle)]">
            Ready
          </span>
          <h2
            className="mt-4 max-w-[900px] text-center text-[64px] font-semibold"
            style={{ letterSpacing: '-0.04em' }}
          >
            Build one. Ship three.
          </h2>
          <p className="mt-6 max-w-[600px] text-center text-lg text-[var(--marketing-text-muted)]">
            The billing engine your finance team will thank you for.
          </p>

          <div className="mt-12 flex gap-4">
            <Link
              to={primaryHref}
              className="flex h-11 items-center gap-2 rounded-md bg-[var(--marketing-emerald)] px-6 font-mono text-xs font-bold uppercase tracking-wider text-black transition-all hover:scale-[1.02] hover:bg-emerald-400 active:scale-[0.97]"
            >
              Enter studio
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.4, repeat: Infinity }}
                className="inline-flex"
              >
                <ArrowRight size={14} aria-hidden="true" />
              </motion.span>
            </Link>
            <a
              href="#code"
              className="flex h-11 items-center rounded-md border-2 border-white/20 px-6 font-mono text-xs font-bold uppercase tracking-wider text-[var(--marketing-text)] transition-all hover:border-white/40 hover:bg-white/[0.04]"
            >
              Read the code
            </a>
          </div>

          <p className="mt-8 font-mono text-[11px] text-[var(--marketing-text-subtle)]">
            no signup · full source visible · built on @unlayer/react-elements
          </p>
        </div>
      </section>

      <MarketingFooter />
    </div>
  )
}