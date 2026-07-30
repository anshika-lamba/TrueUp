import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

interface ThresholdFlashProps {
  trigger: boolean
  onComplete?: () => void
}

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function ThresholdFlash({ trigger, onComplete }: ThresholdFlashProps) {
  const [hasFlashed, setHasFlashed] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!trigger || hasFlashed) return
    setHasFlashed(true)

    if (prefersReducedMotion()) {
      onComplete?.()
      return
    }

    setVisible(true)
  }, [trigger, hasFlashed, onComplete])

  if (!visible) return null

  return (
    <motion.div
      aria-hidden="true"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 0.4, 0] }}
      transition={{ duration: 0.4 }}
      onAnimationComplete={() => {
        setVisible(false)
        onComplete?.()
      }}
      className="pointer-events-none fixed inset-0 z-50"
      style={{ backgroundColor: 'var(--marketing-rose)' }}
    />
  )
}