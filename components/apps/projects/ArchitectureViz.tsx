'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export interface ArchitectureNode {
  id:    string
  label: string
  sub:   string
  x:     number
  y:     number
  color: string
}

export interface ArchitectureEdge {
  from: string
  to:   string
}

interface ArchitectureVizProps {
  nodes: ArchitectureNode[]
  edges: ArchitectureEdge[]
}

export function ArchitectureViz({ nodes, edges }: ArchitectureVizProps) {
  const svgRef  = useRef<SVGSVGElement>(null)
  const dotsRef = useRef<SVGCircleElement[]>([])

  // Re-run animation if nodes/edges change (different project selected)
  useEffect(() => {
    if (!svgRef.current) return

    // Clear existing animations to prevent overlapping on project switch
    gsap.killTweensOf('.arch-path')
    dotsRef.current.forEach(dot => gsap.killTweensOf(dot))

    const paths = svgRef.current.querySelectorAll<SVGPathElement>('.arch-path')

    // Animate paths drawing in
    paths.forEach((path, i) => {
      const len = path.getTotalLength()
      gsap.set(path, { strokeDasharray: len, strokeDashoffset: len })
      gsap.to(path, {
        strokeDashoffset: 0,
        duration: 0.8,
        delay: i * 0.15,
        ease: 'power2.out',
      })
    })

    // Animate dots traveling along paths
    dotsRef.current.forEach((dot, i) => {
      if (!dot) return
      const path = paths[i % paths.length]
      if (!path) return
      const len = path.getTotalLength()

      gsap.to({ progress: 0 }, {
        progress: 1,
        duration: 2,
        delay: i * 0.4,
        repeat: -1,
        ease: 'none',
        onUpdate: function () {
          const pt = path.getPointAtLength(this.targets()[0].progress * len)
          gsap.set(dot, { attr: { cx: pt.x, cy: pt.y } })
        },
      })
    })
    
    return () => {
      gsap.killTweensOf('.arch-path')
      dotsRef.current.forEach(dot => gsap.killTweensOf(dot))
    }
  }, [nodes, edges])

  const getNodeCenter = (id: string) => {
    const node = nodes.find(n => n.id === id)
    if (!node) return { x: 0, y: 0 }
    return { x: node.x + 60, y: node.y + 24 }
  }

  const getPath = (fromId: string, toId: string) => {
    const from = getNodeCenter(fromId)
    const to   = getNodeCenter(toId)
    const mx   = (from.x + to.x) / 2
    return `M ${from.x} ${from.y} C ${mx} ${from.y}, ${mx} ${to.y}, ${to.x} ${to.y}`
  }

  if (!nodes || nodes.length === 0) return null

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <svg
        ref={svgRef}
        viewBox="0 0 760 260"
        style={{ width: '100%', height: 'auto', overflow: 'visible' }}
      >
        {/* Edges */}
        {edges.map((edge, i) => (
          <path
            key={`edge-${edge.from}-${edge.to}-${i}`}
            className="arch-path"
            d={getPath(edge.from, edge.to)}
            fill="none"
            stroke="var(--os-border-light)"
            strokeWidth="1.5"
            opacity="0.6"
          />
        ))}

        {/* Moving dots */}
        {edges.map((edge, i) => (
          <circle
            key={`dot-${i}`}
            ref={el => { if (el) dotsRef.current[i] = el }}
            r="3.5"
            fill="var(--os-cyan)"
            opacity="0.9"
            style={{ filter: 'drop-shadow(0 0 4px var(--os-cyan))' }}
          />
        ))}

        {/* Nodes */}
        {nodes.map(node => (
          <g key={`node-${node.id}`} transform={`translate(${node.x}, ${node.y})`}>
            <rect
              width="120"
              height="48"
              rx="8"
              fill="var(--os-surface-2)"
              stroke={node.color}
              strokeWidth="1"
              strokeOpacity="0.5"
            />
            <text
              x="60"
              y="18"
              textAnchor="middle"
              fill={node.color}
              fontSize="11"
              fontFamily="var(--font-geist-sans)"
              fontWeight="600"
            >
              {node.label}
            </text>
            <text
              x="60"
              y="34"
              textAnchor="middle"
              fill="var(--os-text-3)"
              fontSize="9"
              fontFamily="var(--font-geist-sans)"
            >
              {node.sub}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}