import type { ReactNode, CSSProperties } from 'react'

type Accent = 'emerald' | 'amber' | 'rose' | 'blue' | 'neutral'

interface FramedPanelProps {
  label: string
  children: ReactNode
  className?: string
  hover?: boolean
  accent?: Accent
}

const ACCENT_BORDER: Record<Accent, string> = {
  emerald: 'border-[var(--marketing-border-emerald)]',
  amber: 'border-[color:rgba(245,158,11,0.25)]',
  rose: 'border-[color:rgba(244,63,94,0.3)]',
  blue: 'border-[color:rgba(59,130,246,0.25)]',
  neutral: 'border-[var(--marketing-border)]',
}

const ACCENT_GLOW: Record<Accent, string> = {
  emerald: 'var(--marketing-emerald-glow)',
  amber: 'rgba(245,158,11,0.35)',
  rose: 'var(--marketing-rose-glow)',
  blue: 'rgba(59,130,246,0.35)',
  neutral: 'rgba(255,255,255,0.12)',
}

export function FramedPanel({
  label,
  children,
  className = '',
  hover = false,
  accent = 'neutral',
}: FramedPanelProps) {
  return (
    <div
      className={[
        'relative rounded-sm border p-6',
        ACCENT_BORDER[accent],
        hover
          ? 'transition-all duration-300 hover:border-[var(--marketing-border-strong)]'
          : '',
        className,
      ].join(' ')}
      style={
        hover
          ? ({ '--panel-glow': ACCENT_GLOW[accent] } as CSSProperties)
          : undefined
      }
      onMouseEnter={
        hover
          ? (e) => {
              e.currentTarget.style.boxShadow = `0 0 40px -10px ${ACCENT_GLOW[accent]}`
            }
          : undefined
      }
      onMouseLeave={
        hover
          ? (e) => {
              e.currentTarget.style.boxShadow = 'none'
            }
          : undefined
      }
    >
      <span className="absolute -top-2 left-4 bg-[var(--marketing-bg)] px-2 font-mono text-[10px] uppercase tracking-widest text-[var(--marketing-text-subtle)]">
        {label}
      </span>
      {children}
    </div>
  )
}