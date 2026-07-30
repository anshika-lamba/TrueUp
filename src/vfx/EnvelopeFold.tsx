import { motion } from 'framer-motion'

import { FramedPanel } from '@/vfx/FramedPanel'

interface EnvelopeFoldProps {
  label: string
  delay?: number
}

const STROKE_MS = 400
const STEP_MS = 150

const pathVariants = (index: number) => ({
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: STROKE_MS / 1000, delay: (index * STEP_MS) / 1000 },
      opacity: { duration: 0.1, delay: (index * STEP_MS) / 1000 },
    },
  },
})

const fillDelay = (4 * STEP_MS + STROKE_MS) / 1000

export function EnvelopeFold({ label, delay = 0 }: EnvelopeFoldProps) {
  return (
    <FramedPanel label={label} hover accent="emerald" className="group">
      <motion.div
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
        className="relative flex items-center justify-center"
        title="Renders in Gmail, Outlook, Apple Mail"
      >
        <motion.svg
          viewBox="0 0 200 130"
          className="h-32 w-full"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-10%' }}
          transition={{ delayChildren: delay }}
        >
          {/* 1. Bottom rectangle (envelope back) */}
          <motion.rect
            x="8" y="8" width="184" height="114" rx="4"
            stroke="var(--marketing-emerald)" strokeWidth="1.5" fill="none"
            variants={pathVariants(0)}
          />
          {/* 2. Left triangle flap */}
          <motion.path
            d="M 8 12 L 100 68 L 8 118"
            stroke="var(--marketing-emerald)" strokeWidth="1.5" fill="none"
            variants={pathVariants(1)}
          />
          {/* 3. Right triangle flap */}
          <motion.path
            d="M 192 12 L 100 68 L 192 118"
            stroke="var(--marketing-emerald)" strokeWidth="1.5" fill="none"
            variants={pathVariants(2)}
          />
          {/* 4. Top diagonal fold line */}
          <motion.path
            d="M 8 8 L 100 68 L 192 8"
            stroke="var(--marketing-emerald)" strokeWidth="1.5" fill="none"
            variants={pathVariants(3)}
          />
          <motion.rect
            x="8" y="8" width="184" height="114" rx="4"
            fill="var(--marketing-emerald)"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.05 }}
            viewport={{ once: true }}
            transition={{ delay: fillDelay + delay, duration: 0.3 }}
          />
          <motion.text
            x="100" y="72" textAnchor="middle"
            fontFamily="var(--font-mono, monospace)"
            fontSize="11" letterSpacing="0.15em"
            fill="var(--marketing-text-muted)"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: fillDelay + delay, duration: 0.3 }}
          >
            EMAIL
          </motion.text>
        </motion.svg>
      </motion.div>
    </FramedPanel>
  )
}