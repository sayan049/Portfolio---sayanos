'use client'

import { cn } from '@/lib/utils'

interface SeparatorProps {
  orientation?: 'horizontal' | 'vertical'
  className?:   string
}

export function Separator({ orientation = 'horizontal', className }: SeparatorProps) {
  if (orientation === 'vertical') {
    return (
      <div
        className={cn(className)}
        style={{ width: 1, alignSelf: 'stretch', background: 'var(--os-border)' }}
      />
    )
  }
  return (
    <div
      className={cn(className)}
      style={{ height: 1, width: '100%', background: 'var(--os-border)' }}
    />
  )
}