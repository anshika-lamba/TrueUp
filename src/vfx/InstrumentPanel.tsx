import { useRef, useState } from 'react'
import { useMotionValueEvent, useScroll } from 'framer-motion'

import { PrecisionMeter } from '@/vfx/PrecisionMeter'

interface MeterConfig {
  id: string
  label: string
  threshold: number
  /** Multiplier applied to scroll progress; higher = rises faster. */
  rate: number
  /** Value reached at progress = 1. */
  target: number
}

const METERS: MeterConfig[] = [
  { id: 'openai', label: 'OpenAI Tokens', threshold: 90, rate: 1, target: 100 },
  { id: 'supabase', label: 'Supabase DB', threshold: 90, rate: 0.75, target: 78 },
  { id: 'stripe', label: 'Stripe API', threshold: 90, rate: 0.6, target: 65 },
  { id: 'bandwidth', label: 'Bandwidth', threshold: 90, rate: 0.7, target: 72 },
  { id: 'edge', label: 'Edge Compute', threshold: 90, rate: 0.55, target: 60 },
]

const BASE_VALUE = 30

export function InstrumentPanel() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const [values, setValues] = useState<Record<string, number>>(() =>
    Object.fromEntries(METERS.map((m) => [m.id, BASE_VALUE]))
  )

  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    const clampedProgress = Math.min(1, Math.max(0, progress))
    setValues(
      Object.fromEntries(
        METERS.map((m) => {
          const range = m.target - BASE_VALUE
          const next = BASE_VALUE + range * Math.min(1, clampedProgress * m.rate * 1.4)
          return [m.id, next]
        })
      )
    )
  })

  const total = 781.39

  return (
    <div ref={sectionRef} className="relative flex h-96 items-end justify-center gap-6 py-8">
      {METERS.map((meter) => (
        <PrecisionMeter
          key={meter.id}
          id={meter.id}
          label={meter.label}
          threshold={meter.threshold}
          value={values[meter.id]}
        />
      ))}

      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[10px] uppercase tracking-widest text-[var(--marketing-text-subtle)]">
        5 STREAMS · REALTIME · ${total.toFixed(2)} CURRENT
      </div>
    </div>
  )
}