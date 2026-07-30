import { useRef, useEffect, useCallback } from 'react'

interface Node {
  x: number
  y: number
  r: number
  month: string
  value: number
  over: boolean
  vx: number
  vy: number
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const VALUES = [42.1, 55.3, 38.8, 61.2, 49.7, 73.4, 58.9, 82.8, 67.3, 91.0, 78.5, 95.2]
const BUDGET = 87.5

function buildNodes(W: number, H: number): Node[] {
  const cx = W / 2
  const cy = H / 2
  return MONTHS.map((month, i) => {
    const angle = (i / 12) * Math.PI * 2 - Math.PI / 2
    const radius = Math.min(W, H) * 0.35
    const jitter = (Math.random() - 0.5) * 30
    const value = VALUES[i]
    return {
      x: cx + Math.cos(angle) * (radius + jitter),
      y: cy + Math.sin(angle) * (radius + jitter),
      r: 3 + (value / 100) * 6,
      month,
      value,
      over: value > BUDGET,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
    }
  })
}

function drawEdges(ctx: CanvasRenderingContext2D, nodes: Node[]) {
  for (let i = 0; i < nodes.length; i++) {
    const a = nodes[i]
    const b = nodes[(i + 1) % nodes.length]
    ctx.beginPath()
    ctx.moveTo(a.x, a.y)
    ctx.lineTo(b.x, b.y)
    ctx.strokeStyle = 'rgba(255,255,255,0.06)'
    ctx.lineWidth = 1
    ctx.stroke()

    // Connect to nearest 2 non-adjacent nodes
    for (let j = i + 3; j < nodes.length - 1; j++) {
      const c = nodes[j]
      const dist = Math.hypot(a.x - c.x, a.y - c.y)
      if (dist < 160) {
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(c.x, c.y)
        ctx.strokeStyle = `rgba(255,255,255,${0.025 * (1 - dist / 160)})`
        ctx.lineWidth = 0.5
        ctx.stroke()
      }
    }
  }
}

function drawNodes(ctx: CanvasRenderingContext2D, nodes: Node[], t: number) {
  nodes.forEach((node, i) => {
    const pulse = 1 + Math.sin(t * 0.002 + i * 0.7) * 0.18
    const r = node.r * pulse

    // Glow
    const grd = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, r * 4)
    if (node.over) {
      grd.addColorStop(0, 'rgba(244,63,94,0.5)')
      grd.addColorStop(1, 'rgba(244,63,94,0)')
    } else {
      grd.addColorStop(0, 'rgba(16,185,129,0.4)')
      grd.addColorStop(1, 'rgba(16,185,129,0)')
    }
    ctx.beginPath()
    ctx.arc(node.x, node.y, r * 4, 0, Math.PI * 2)
    ctx.fillStyle = grd
    ctx.fill()

    // Core dot
    ctx.beginPath()
    ctx.arc(node.x, node.y, r, 0, Math.PI * 2)
    ctx.fillStyle = node.over ? 'rgba(244,63,94,0.9)' : 'rgba(16,185,129,0.85)'
    ctx.fill()

    // Label
    ctx.font = '9px monospace'
    ctx.fillStyle = 'rgba(255,255,255,0.35)'
    ctx.textAlign = 'center'
    ctx.fillText(node.month, node.x, node.y - r - 5)
  })
}

export function Constellation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const nodesRef = useRef<Node[]>([])
  const rafRef = useRef<number>(0)
  const rotationRef = useRef(0)
  const scrollRef = useRef(0)

  const animate = useCallback((t: number) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const W = canvas.width
    const H = canvas.height

    ctx.clearRect(0, 0, W, H)

    // Slow auto-rotation + scroll-driven tilt
    rotationRef.current += 0.0008
    const baseRot = rotationRef.current
    const scrollTilt = scrollRef.current * 0.001

    ctx.save()
    ctx.translate(W / 2, H / 2)
    ctx.rotate(baseRot + scrollTilt)
    ctx.translate(-W / 2, -H / 2)

    // Gentle float
    nodesRef.current.forEach((node) => {
      node.x += node.vx
      node.y += node.vy
      const dx = node.x - W / 2
      const dy = node.y - H / 2
      const dist = Math.hypot(dx, dy)
      const maxR = Math.min(W, H) * 0.42
      if (dist > maxR) {
        node.vx -= dx * 0.0002
        node.vy -= dy * 0.0002
      }
    })

    drawEdges(ctx, nodesRef.current)
    drawNodes(ctx, nodesRef.current, t)

    ctx.restore()

    rafRef.current = requestAnimationFrame(animate)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      nodesRef.current = buildNodes(canvas.width, canvas.height)
    }

    resize()
    window.addEventListener('resize', resize)

    const onScroll = () => { scrollRef.current = window.scrollY }
    window.addEventListener('scroll', onScroll, { passive: true })

    rafRef.current = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
      window.removeEventListener('scroll', onScroll)
    }
  }, [animate])

  return (
    <canvas
      ref={canvasRef}
      className="w-full"
      style={{ height: 420 }}
      aria-hidden="true"
    />
  )
}
