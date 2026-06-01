'use client'

import { cn } from '@/lib/utils'
import type { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?:    'sm' | 'md' | 'lg'
}

export function Button({
  variant = 'secondary',
  size    = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  const base = 'inline-flex items-center justify-center font-geist rounded-input transition-all duration-150 cursor-pointer select-none'

  const variants = {
    primary:   'bg-os-cyan text-os-bg hover:brightness-110',
    secondary: 'bg-os-surface-2 text-os-text-2 border border-os-border hover:bg-os-surface-3 hover:text-os-text hover:border-os-border-l',
    ghost:     'text-os-text-2 hover:bg-os-surface-2 hover:text-os-text',
    danger:    'bg-transparent text-os-red border border-os-border hover:bg-os-red/10',
  }

  const sizes = {
    sm: 'text-xs px-3 py-1.5',
    md: 'text-body px-4 py-2',
    lg: 'text-sub px-5 py-2.5',
  }

  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  )
}