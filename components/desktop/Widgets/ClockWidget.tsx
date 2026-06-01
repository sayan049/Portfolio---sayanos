'use client'

import { useClock } from '@/hooks/useClock'

export function ClockWidget() {
  const { hours, minutes, ampm, date } = useClock()

  return (
    <div
      style={{
        background: 'rgba(20,20,28,0.72)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid var(--glass-border)',
        borderRadius: 12,
        padding: '14px 18px',
        minWidth: 160,
      }}
    >
      {/* Time */}
      <div className="flex items-end gap-1.5">
        <span
          className="font-mono font-semibold"
          style={{ fontSize: 28, color: 'var(--os-text)', lineHeight: 1 }}
        >
          {hours}:{minutes}
        </span>
        <span
          className="font-mono"
          style={{ fontSize: 11, color: 'var(--os-text-3)', marginBottom: 3 }}
        >
          {ampm}
        </span>
      </div>

      {/* Date */}
      <div
        style={{ fontSize: 12, color: 'var(--os-text-2)', marginTop: 6 }}
      >
        {date}
      </div>

      {/* Separator */}
      <div
        style={{
          height: 1,
          background: 'var(--os-border)',
          margin: '10px 0',
        }}
      />

      {/* Status */}
      <div className="flex items-center gap-2">
        <div className="status-dot status-dot-pulse" />
        <span
          style={{ fontSize: 10, color: 'var(--os-text-3)', letterSpacing: '0.1em' }}
          className="font-mono uppercase"
        >
          System Online
        </span>
      </div>
    </div>
  )
}