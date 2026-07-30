import { useEffect, useRef } from 'react'
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion'

interface CountUpNumberProps {
  value: number
  duration?: number
  format?: (n: number) => string
  className?: string
  startOnView?: boolean
}

const defaultFormat = (n: number) => new Intl.NumberFormat('en-US').format(n)

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function CountUpNumber({
  value,
  duration = 2000,
  format = defaultFormat,
  className = '',
  startOnView = true,
}: CountUpNumberProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-10% 0px' })
  const shouldStart = startOnView ? isInView : true

  const motionValue = useMotionValue(0)
  const springValue = useSpring(motionValue, {
    stiffness: 60,
    damping: 20,
    duration: duration / 1000,
  })
  const rounded = useTransform(springValue, (v) => format(Math.round(v)))

  useEffect(() => {
    if (!shouldStart) return
    if (prefersReducedMotion()) {
      motionValue.set(value)
      return
    }
    motionValue.set(value)
  }, [shouldStart, value, motionValue])

  if (prefersReducedMotion()) {
    return (
      <span ref={ref} className={className} style={{ fontVariantNumeric: 'tabular-nums' }}>
        {format(value)}
      </span>
    )
  }

  return (
    <motion.span
      ref={ref}
      className={className}
      style={{ fontVariantNumeric: 'tabular-nums' }}
    >
      {rounded}
    </motion.span>
  )
}