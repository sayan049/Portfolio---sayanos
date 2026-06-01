'use client'

import { motion } from 'framer-motion'
import { listItemVariants } from '@/lib/motion'
import type { SkillModule } from '@/data/skills'

interface ModuleCardProps {
  module: SkillModule
}

function SparkGraph({ data, color }: { data: number[]; color: string }) {
  const max    = Math.max(...data)
  const min    = Math.min(...data)
  const range  = max - min || 1
  const width  = 120
  const height = 28
  const step   = width / (data.length - 1)

  const points = data
    .map((v, i) => `${i * step},${height - ((v - min) / range) * height}`)
    .join(' ')

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: 'visible' }}>
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.6"
      />
      {/* End dot */}
      <circle
        cx={data.length * step - step}
        cy={height - ((data[data.length - 1] - min) / range) * height}
        r="2.5"
        fill={color}
        opacity="0.9"
      />
    </svg>
  )
}

function EfficiencyBar({ value, color }: { value: number; color: string }) {
  const blocks = 10
  const filled = Math.round(value / 10)

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span className="font-mono" style={{ fontSize: 10, color: 'var(--os-text-3)', width: 65 }}>
        Efficiency:
      </span>
      <div style={{ display: 'flex', gap: 2 }}>
        {Array.from({ length: blocks }).map((_, i) => (
          <div
            key={i}
            style={{
              width:        6,
              height:       12,
              borderRadius: 1.5,
              background:   i < filled ? color : 'var(--os-surface-3)',
              opacity:      i < filled ? 0.85 : 0.4,
              transition:   'background 0.3s ease',
              boxShadow:    i < filled ? `0 0 4px ${color}44` : 'none',
            }}
          />
        ))}
      </div>
      <span className="font-mono" style={{ fontSize: 11, color, width: 32, textAlign: 'right' }}>
        {value}%
      </span>
    </div>
  )
}

export function ModuleCard({ module: m }: ModuleCardProps) {
  const statusColors: Record<string, string> = {
    ACTIVE:    'var(--os-green)',
    LEARNING:  'var(--os-cyan)',
    EXPLORING: 'var(--os-amber)',
  }
  const color = statusColors[m.status] ?? 'var(--os-text-3)'

  return (
    <motion.div
      variants={listItemVariants}
      style={{
        background:   'var(--os-surface-2)',
        border:       '1px solid var(--os-border)',
        borderRadius: 10,
        padding:      '16px 18px',
      }}
      whileHover={{
        borderColor: 'var(--os-border-light)',
        transition:  { duration: 0.15 },
      }}
    >
      {/* Header: name + status */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              width:      7,
              height:     7,
              borderRadius: '50%',
              background: color,
              boxShadow:  `0 0 6px ${color}`,
              animation:  m.status === 'ACTIVE'
                ? 'pulseDot 2.5s ease-in-out infinite'
                : m.status === 'LEARNING'
                  ? 'pulseDot 1.5s ease-in-out infinite'
                  : 'none',
            }}
          />
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--os-text)', letterSpacing: '0.02em' }}>
            {m.name}
          </span>
        </div>
        <span
          className="font-mono uppercase"
          style={{
            fontSize: 9, letterSpacing: '0.08em',
            color, fontWeight: 600,
          }}
        >
          {m.status}
        </span>
      </div>

      {/* Spark graph */}
      <div style={{ marginBottom: 12 }}>
        <SparkGraph data={m.sparkData} color={color} />
      </div>

      {/* Skills list */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 14 }}>
        {m.skills.map(skill => (
          <span
            key={skill}
            style={{
              fontSize:     10,
              color:        'var(--os-text-3)',
              background:   'var(--os-surface-3)',
              borderRadius: 4,
              padding:      '2px 7px',
              border:       '1px solid var(--os-border)',
            }}
          >
            {skill}
          </span>
        ))}
      </div>

      {/* Efficiency bar */}
      <EfficiencyBar value={m.efficiency} color={color} />
    </motion.div>
  )
}