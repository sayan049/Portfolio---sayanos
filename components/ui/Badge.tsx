'use client'

import { cn } from '@/lib/utils'

type BadgeVariant = 'PRODUCTION' | 'ACTIVE' | 'STABLE' | 'EXPERIMENTAL' | 'ARCHIVED' | 'IN DEV' | 'default'

const VARIANT_STYLES: Record<BadgeVariant, { bg: string; color: string; dot: string }> = {
  PRODUCTION:   { bg: 'rgba(52,211,153,0.1)',  color: '#34D399', dot: '#34D399' },
  ACTIVE:       { bg: 'rgba(79,195,247,0.1)',  color: '#4FC3F7', dot: '#4FC3F7' },
  STABLE:       { bg: 'rgba(129,140,248,0.1)', color: '#818CF8', dot: '#818CF8' },
  EXPERIMENTAL: { bg: 'rgba(251,191,36,0.1)',  color: '#FBBF24', dot: '#FBBF24' },
  'IN DEV':     { bg: 'rgba(251,191,36,0.1)',  color: '#FBBF24', dot: '#FBBF24' },
  ARCHIVED:     { bg: 'rgba(86,86,110,0.15)',  color: '#56566E', dot: '#56566E' },
  default:      { bg: 'rgba(86,86,110,0.15)',  color: '#9898B0', dot: '#9898B0' },
}

interface BadgeProps {
  label:    string
  variant?: BadgeVariant
  dot?:     boolean
  className?: string
}

export function Badge({ label, variant = 'default', dot = true, className }: BadgeProps) {
  const style = VARIANT_STYLES[variant] ?? VARIANT_STYLES.default

  return (
    <span
      className={cn('inline-flex items-center gap-1.5 font-mono', className)}
      style={{
        background:   style.bg,
        color:        style.color,
        borderRadius: 5,
        padding:      '2px 8px',
        fontSize:     10,
        letterSpacing:'0.08em',
        fontWeight:   500,
        border:       `1px solid ${style.color}22`,
      }}
    >
      {dot && (
        <span
          style={{
            width:        5,
            height:       5,
            borderRadius: '50%',
            background:   style.dot,
            flexShrink:   0,
          }}
        />
      )}
      {label}
    </span>
  )
}