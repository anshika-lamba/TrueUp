import { useState } from 'react'
import { motion } from 'framer-motion'

interface PrecisionMeterProps {
  label: string
  value: number
  threshold: number
  id: string
  onClick?: (id: string) => void
}

function severityOf(value: number): 'safe' | 'warn' | 'critical' {
  if (value >= 90) return 'critical'
  if (value >= 70) return 'warn'
  return 'safe'
}

const FILL_COLOR: Record<ReturnType<typeof severityOf>, string> = {
  safe: 'var(--marketing-emerald)',
  warn: 'var(--marketing-amber)',
  critical: 'var(--marketing-rose)',
}

const LED_COLOR: Record<ReturnType<typeof severityOf>, string> = {
  safe: 'var(--marketing-emerald)',
  warn: 'var(--marketing-amber)',
  critical: 'var(--marketing-rose)',
}

export function PrecisionMeter({ label, value, threshold, id, onClick }: PrecisionMeterProps) {
  const [expanded, setExpanded] = useState(false)
  const clamped = Math.min(100, Math.max(0, value))
  const severity = severityOf(clamped)
  const isOverThreshold = clamped >= threshold

  const handleClick = () => {
    setExpanded(true)
    window.setTimeout(() => setExpanded(false), 300)
    onClick?.(id)
  }

  return (
    <div className="flex flex-col items-center">
      <span className="mb-3 font-mono text-[10px] uppercase tracking-widest text-[var(--marketing-text-subtle)]">
        {label}
      </span>

      <motion.button
        type="button"
        onClick={handleClick}
        aria-label={`${label}: ${Math.round(clamped)} percent${isOverThreshold ? ', over threshold' : ''}`}
        animate={{ scale: expanded ? 1.05 : 1 }}
        transition={{ duration: 0.15 }}
        className="relative h-56 w-8 rounded-sm border focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--marketing-emerald)]"
        style={{
          backgroundColor: 'var(--marketing-panel)',
          borderColor: 'var(--marketing-border)',
        }}
      >
        <div
          className="absolute bottom-0 left-0 right-0 rounded-b-sm transition-[height] duration-500"
          style={{
            height: `${clamped}%`,
            backgroundColor: FILL_COLOR[severity],
            boxShadow: clamped > 70 ? `0 0 16px -2px ${FILL_COLOR[severity]}` : 'none',
          }}
        />

        <motion.div
          className="absolute right-[-2px] h-0.5 w-3 bg-white shadow-sm"
          style={{ bottom: `calc(${clamped}% - 1px)` }}
          animate={{ y: [0, 0.5, -0.5, 0] }}
          transition={{ duration: 0.3, repeat: Infinity }}
        />
      </motion.button>

      <span
        className="mt-3 font-mono text-xs font-bold text-[var(--marketing-text)]"
        style={{ fontVariantNumeric: 'tabular-nums' }}
      >
        {Math.round(clamped)}%
      </span>

      <span
        className={severity === 'critical' ? 'mt-2 h-2 w-2 animate-pulse rounded-full' : 'mt-2 h-2 w-2 rounded-full'}
        style={{ backgroundColor: LED_COLOR[severity] }}
        aria-hidden="true"
      />
    </div>
  )
}