'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export interface PipelineStage {
  label: string
  event: string
  color: string
}

export interface RealtimeEvent {
  name:  string
  dir:   '↑' | '↓'
  color: string
}

interface RealtimeVizProps {
  pipeline: PipelineStage[]
  events: RealtimeEvent[]
}

export function RealtimeViz({ pipeline, events }: RealtimeVizProps) {
  const dotsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    // Kill existing tweens on re-render to prevent overlapping animations
    dotsRef.current.forEach(dot => {
      if (dot) gsap.killTweensOf(dot)
    })

    dotsRef.current.forEach((dot, i) => {
      if (!dot) return
      gsap.fromTo(dot,
        { left: '0%', opacity: 0 },
        {
          left:    '100%',
          opacity: 1,
          duration: 1.8,
          delay:   i * 0.3,
          repeat:  -1,
          ease:    'none',
          onStart: () => gsap.set(dot, { opacity: 1 }),
        }
      )
    })
    
    return () => {
      dotsRef.current.forEach(dot => {
        if (dot) gsap.killTweensOf(dot)
      })
    }
  }, [pipeline, events])

  if (!pipeline || pipeline.length === 0) return null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Pipeline */}
      <div>
        <div
          style={{ fontSize: 11, color: 'var(--os-text-3)', letterSpacing: '0.08em', marginBottom: 16 }}
          className="font-mono uppercase"
        >
          Event Pipeline
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 0, overflowX: 'auto', paddingBottom: 8 }}>
          {pipeline.map((stage, i) => (
            <div key={`stage-${stage.event}-${i}`} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
              {/* Stage card */}
              <div
                style={{
                  background:   'var(--os-surface-2)',
                  border:       `1px solid ${stage.color}33`,
                  borderRadius: 8,
                  padding:      '10px 12px',
                  textAlign:    'center',
                  minWidth:     110,
                }}
              >
                <div style={{ fontSize: 11, color: stage.color, fontWeight: 600 }}>
                  {stage.label}
                </div>
                <div
                  style={{ fontSize: 9, color: 'var(--os-text-3)', marginTop: 4 }}
                  className="font-mono"
                >
                  {stage.event}
                </div>
              </div>

              {/* Connector arrow */}
              {i < pipeline.length - 1 && (
                <div
                  style={{
                    position: 'relative',
                    width:    40,
                    height:   2,
                    background: 'var(--os-border)',
                    flexShrink: 0,
                    overflow: 'hidden',
                  }}
                >
                  <div
                    ref={el => { dotsRef.current[i] = el }}
                    style={{
                      position:     'absolute',
                      top:          '50%',
                      transform:    'translateY(-50%)',
                      width:        6,
                      height:       6,
                      borderRadius: '50%',
                      background:   stage.color,
                      boxShadow:    `0 0 6px ${stage.color}`,
                    }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      right:    4,
                      top:      '50%',
                      transform:'translateY(-50%)',
                      color:    'var(--os-text-3)',
                      fontSize: 10,
                    }}
                  >
                    ›
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Socket events */}
      {events && events.length > 0 && (
        <div>
          <div
            style={{ fontSize: 11, color: 'var(--os-text-3)', letterSpacing: '0.08em', marginBottom: 12 }}
            className="font-mono uppercase"
          >
            Stream Events
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 6 }}>
            {events.map((ev, i) => (
              <div
                key={`ev-${ev.name}-${i}`}
                style={{
                  display:     'flex',
                  alignItems:  'center',
                  gap:         8,
                  padding:     '7px 12px',
                  background:  'var(--os-surface-2)',
                  borderRadius: 6,
                  border:      '1px solid var(--os-border)',
                }}
              >
                <span style={{ color: ev.color, fontSize: 13, fontWeight: 700 }}>{ev.dir}</span>
                <span className="font-mono" style={{ fontSize: 11, color: 'var(--os-text-2)' }}>
                  {ev.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}