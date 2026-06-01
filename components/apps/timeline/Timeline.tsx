'use client'

import { useRef } from 'react'
import { TIMELINE_ENTRIES } from '@/data/timeline'
import { TimelineEntryCard } from './TimelineEntry'

export function Timeline() {
  const scrollRef = useRef<HTMLDivElement>(null)

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <div
        style={{
          padding:      '16px 24px',
          borderBottom: '1px solid var(--os-border)',
          flexShrink:   0,
        }}
      >
        <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--os-text)', marginBottom: 2 }}>
          MISSION TIMELINE
        </h2>
        <p style={{ fontSize: 12, color: 'var(--os-text-3)' }}>
          Engineering journey — from foundations to production systems
        </p>
      </div>

      {/* Scrollable timeline — ref passed to entries for ScrollTrigger */}
      <div
        ref={scrollRef}
        style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}
      >
        <div style={{ position: 'relative', maxWidth: 700, margin: '0 auto' }}>
          {/* Central vertical line */}
          <div
            style={{
              position:  'absolute',
              left:      '50%',
              transform: 'translateX(-50%)',
              top:       0,
              bottom:    0,
              width:     1,
              background:'var(--os-border)',
              zIndex:    1,
            }}
          />

          {TIMELINE_ENTRIES.map((entry, i) => (
            <TimelineEntryCard
              key={entry.id}
              entry={entry}
              index={i}
              scrollContainer={scrollRef.current}
            />
          ))}
        </div>
      </div>
    </div>
  )
}