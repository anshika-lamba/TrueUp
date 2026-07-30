import { useCallback, useMemo, useRef, type MouseEvent } from 'react'

const STREAM_1 = [
  '$0.0004', '1,247 tokens', '12ms', '$0.09/GB', '1 req', '$0.0012',
  '892 tokens', '8ms', '$0.02/GB', '3 req', '$0.0031', '2,105 tokens',
  '19ms', '$0.11/GB', '2 req', '$0.0007', '445 tokens', '6ms',
  '$0.04/GB', '1 req', '$0.0021', '1,882 tokens', '14ms', '$0.08/GB',
  '4 req', '$0.0015', '733 tokens', '9ms', '$0.03/GB', '2 req',
  '$0.0042', '3,014 tokens', '22ms', '$0.14/GB', '1 req', '$0.0009',
  '612 tokens', '7ms', '$0.05/GB', '3 req',
]

const STREAM_2 = [
  'SELECT * FROM usage_events', 'OPENAI_API', 'SUPABASE_DB', 'INSERT INTO invoices',
  'STRIPE_WEBHOOK', 'EDGE_FUNCTION', 'UPDATE metrics SET', 'BANDWIDTH_LOG',
  'OPENAI_API', 'SUPABASE_DB', 'SELECT COUNT(*)', 'STRIPE_WEBHOOK',
  'EDGE_FUNCTION', 'DELETE FROM cache', 'BANDWIDTH_LOG', 'OPENAI_API',
  'SUPABASE_DB', 'INSERT INTO invoices', 'SELECT * FROM usage_events',
  'STRIPE_WEBHOOK', 'EDGE_FUNCTION', 'UPDATE metrics SET', 'BANDWIDTH_LOG',
  'OPENAI_API', 'SUPABASE_DB', 'SELECT COUNT(*)', 'STRIPE_WEBHOOK',
  'EDGE_FUNCTION', 'DELETE FROM cache', 'BANDWIDTH_LOG', 'OPENAI_API',
  'SUPABASE_DB', 'INSERT INTO invoices', 'SELECT * FROM usage_events',
  'STRIPE_WEBHOOK', 'EDGE_FUNCTION', 'UPDATE metrics SET', 'BANDWIDTH_LOG',
  'OPENAI_API', 'SUPABASE_DB',
]

const STREAM_3 = [
  '47.2¢', '184.62¢', '$4.87', '$12.40', '9.03¢', '221.15¢', '$7.62',
  '$3.14', '68.4¢', '156.90¢', '$9.28', '$15.77', '22.1¢', '199.44¢',
  '$5.03', '$8.91', '41.6¢', '132.08¢', '$11.20', '$2.65', '77.9¢',
  '204.31¢', '$6.44', '$13.02', '15.3¢', '167.55¢', '$8.19', '$4.36',
  '53.8¢', '190.77¢', '$10.05', '$1.99', '29.4¢', '211.60¢', '$7.83',
  '$9.47', '61.2¢', '145.22¢', '$3.71', '$14.58',
]

function makeStream(base: string[]) {
  // Duplicate so the -100% loop is seamless.
  return [...base, ...base]
}

interface RowProps {
  items: string[]
  opacity: number
  baseTop: string
}

function StreamRow({ items, opacity, baseTop }: RowProps) {
  return (
    <div
      className="marketing-flow-track absolute left-0 flex w-max whitespace-nowrap gap-10 font-mono text-xs text-[var(--marketing-text-subtle)]"
      style={{
        top: baseTop,
        opacity,
        animation: 'flow-left var(--flow-duration, 30s) linear infinite',
      }}
    >
      {items.map((item, i) => (
        <span key={`${item}-${i}`}>{item}</span>
      ))}
    </div>
  )
}

export function DataStream() {
  const containerRef = useRef<HTMLDivElement>(null)

  const stream1 = useMemo(() => makeStream(STREAM_1), [])
  const stream2 = useMemo(() => makeStream(STREAM_2), [])
  const stream3 = useMemo(() => makeStream(STREAM_3), [])

  const handleMouseMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const rect = e.currentTarget.getBoundingClientRect()
    const relativeX = (e.clientX - rect.left) / rect.width // 0 (left) -> 1 (right)
    // Left half slower (60s), right half faster (10s).
    const duration = 60 - relativeX * 50
    e.currentTarget.style.setProperty('--flow-duration', `${Math.max(10, duration)}s`)
  }, [])

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative h-64 w-full overflow-hidden"
      style={{
        maskImage:
          'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
        WebkitMaskImage:
          'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
      }}
      aria-hidden="true"
    >
      <StreamRow items={stream1} opacity={0.3} baseTop="10%" />
      <StreamRow items={stream2} opacity={0.5} baseTop="48%" />
      <StreamRow items={stream3} opacity={0.3} baseTop="86%" />
    </div>
  )
}