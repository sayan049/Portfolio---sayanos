'use client'

import { useEffect, useRef } from 'react'
import { SKILL_MODULES } from '@/data/skills'
import { randomBetween } from '@/lib/utils'

interface GraphNode {
  id:     string
  label:  string
  x:      number
  y:      number
  vx:     number
  vy:     number
  color:  string
  radius: number
}

interface GraphEdge {
  from: string
  to:   string
}

const STATUS_COLORS: Record<string, string> = {
  ACTIVE:    '#34D399',
  LEARNING:  '#4FC3F7',
  EXPLORING: '#FBBF24',
}

const EDGES: GraphEdge[] = [
  { from: 'frontend', to: 'backend'  },
  { from: 'frontend', to: 'uiux'    },
  { from: 'backend',  to: 'database' },
  { from: 'backend',  to: 'realtime' },
  { from: 'backend',  to: 'devops'   },
  { from: 'realtime', to: 'ai'       },
  { from: 'ai',       to: 'frontend' },
  { from: 'uiux',     to: 'ai'       },
  { from: 'database', to: 'realtime' },
  { from: 'devops',   to: 'frontend' },
]

export function NodeGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const nodesRef  = useRef<GraphNode[]>([])
  const animRef   = useRef<number>(0)
  const hoverRef  = useRef<string | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rect   = canvas.getBoundingClientRect()
    const width  = rect.width
    const height = rect.height
    canvas.width  = width * 2
    canvas.height = height * 2
    ctx.scale(2, 2)

    // Init nodes
    nodesRef.current = SKILL_MODULES.map((m, i) => {
      const angle = (i / SKILL_MODULES.length) * Math.PI * 2
      const r     = Math.min(width, height) * 0.3
      return {
        id:     m.id,
        label:  m.name.replace(' ENGINE', '').replace(' CORE', '').replace(' LAYER', '')
                  .replace(' MODULES', '').replace('UI/UX ', 'UI/UX').replace(' & TOOLING', ''),
        x:      width / 2 + Math.cos(angle) * r + randomBetween(-20, 20),
        y:      height / 2 + Math.sin(angle) * r + randomBetween(-20, 20),
        vx:     randomBetween(-0.15, 0.15),
        vy:     randomBetween(-0.15, 0.15),
        color:  STATUS_COLORS[m.status] ?? '#9898B0',
        radius: 6,
      }
    })

    // Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect()
      const mx = e.clientX - r.left
      const my = e.clientY - r.top
      let found: string | null = null
      for (const node of nodesRef.current) {
        const dx = mx - node.x
        const dy = my - node.y
        if (Math.sqrt(dx * dx + dy * dy) < 20) {
          found = node.id
          break
        }
      }
      hoverRef.current = found
    }
    canvas.addEventListener('mousemove', handleMouseMove)

    function animate() {
      if (!ctx) return
      ctx.clearRect(0, 0, width, height)

      const nodes = nodesRef.current
      const hov   = hoverRef.current

      // Update positions (gentle drift)
      for (const n of nodes) {
        n.x += n.vx
        n.y += n.vy

        // Bounce off edges
        if (n.x < 30 || n.x > width - 30) n.vx *= -1
        if (n.y < 20 || n.y > height - 20) n.vy *= -1

        // Slight center gravity
        n.vx += (width / 2 - n.x) * 0.0001
        n.vy += (height / 2 - n.y) * 0.0001
      }

      // Draw edges
      for (const edge of EDGES) {
        const from = nodes.find(n => n.id === edge.from)
        const to   = nodes.find(n => n.id === edge.to)
        if (!from || !to) continue

        const isHighlighted = hov && (edge.from === hov || edge.to === hov)
        ctx.beginPath()
        ctx.moveTo(from.x, from.y)
        ctx.lineTo(to.x, to.y)
        ctx.strokeStyle = isHighlighted
          ? 'rgba(79, 195, 247, 0.35)'
          : 'rgba(44, 44, 56, 0.4)'
        ctx.lineWidth = isHighlighted ? 1.5 : 0.8
        ctx.stroke()
      }

      // Draw nodes
      for (const n of nodes) {
        const isHovered = hov === n.id

        // Glow
        if (isHovered) {
          ctx.beginPath()
          ctx.arc(n.x, n.y, 16, 0, Math.PI * 2)
          ctx.fillStyle = n.color + '15'
          ctx.fill()
        }

        // Node circle
        ctx.beginPath()
        ctx.arc(n.x, n.y, isHovered ? 8 : n.radius, 0, Math.PI * 2)
        ctx.fillStyle = n.color + (isHovered ? 'DD' : '88')
        ctx.fill()

        // Label
        ctx.font      = `${isHovered ? 11 : 9}px system-ui, sans-serif`
        ctx.fillStyle  = isHovered ? '#EDEDF5' : '#56566E'
        ctx.textAlign  = 'center'
        ctx.fillText(n.label, n.x, n.y + (isHovered ? 20 : 18))
      }

      animRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animRef.current)
      canvas.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <div
      style={{
        background:   'var(--os-surface-2)',
        border:       '1px solid var(--os-border)',
        borderRadius: 10,
        padding:      16,
      }}
    >
      <div
        className="font-mono uppercase"
        style={{ fontSize: 10, color: 'var(--os-text-3)', letterSpacing: '0.08em', marginBottom: 12 }}
      >
        Skill Interconnection Map
      </div>
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: 180, borderRadius: 8, cursor: 'crosshair' }}
      />
    </div>
  )
}