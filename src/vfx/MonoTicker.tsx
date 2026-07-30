import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

interface MonoTickerProps {
  values: string[]
  interval?: number
  className?: string
}

export function MonoTicker({ values, interval = 1500, className = '' }: MonoTickerProps) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (values.length <= 1) return
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % values.length)
    }, interval)
    return () => clearInterval(id)
  }, [values.length, interval])

  const current = values[index] ?? ''

  return (
    <span
      className={`inline-block font-mono text-[11px] text-[var(--marketing-text-subtle)] ${className}`}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="inline-block"
        >
          {current}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}