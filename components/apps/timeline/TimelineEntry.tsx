'use client'

import { useEffect, useRef } from 'react'
import { Badge } from '@/components/ui/Badge'
import type { TimelineEntry as TEntry } from '@/data/timeline'

interface Props {
  entry: TEntry
  index: number
  scrollContainer: HTMLElement | null
}

export function TimelineEntryCard({ entry, index, scrollContainer }: Props) {
  const cardRef = useRef<HTMLDivElement>(null)
  const nodeRef = useRef<HTMLDivElement>(null)

  // Simple IntersectionObserver — works reliably even inside overflow:auto containers
  useEffect(() => {
    const card = cardRef.current
    const node = nodeRef.current
    if (!card || !node) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            const el = e.target as HTMLElement
            el.style.opacity  = '1'
            el.style.transform = 'translateX(0) translateY(0)'
            observer.unobserve(el)
          }
        })
      },
      { threshold: 0.05, rootMargin: '0px 0px -40px 0px', root: scrollContainer ?? undefined }
    )

    // Use a tiny delay so React has painted the layout
    const t = setTimeout(() => {
      observer.observe(card)
      observer.observe(node)
    }, 80)

    return () => { clearTimeout(t); observer.disconnect() }
  }, [scrollContainer, index])

  const isLeft = entry.side === 'left'

  return (
    <div
      style={{
        display:             'grid',
        gridTemplateColumns: '1fr 32px 1fr',
        gap:                 0,
        position:            'relative',
        marginBottom:        36,
        alignItems:          'start',
      }}
    >
      {/* ── LEFT COLUMN ── */}
      <div style={{ paddingRight: 20, paddingTop: 6 }}>
        {isLeft ? (
          <div
            ref={cardRef}
            style={{
              opacity:    0,
              transform:  'translateX(-30px) translateY(8px)',
              transition: `opacity 0.5s ease ${index * 0.06}s, transform 0.5s cubic-bezier(0.16,1,0.3,1) ${index * 0.06}s`,
            }}
          >
            <CardContent entry={entry} />
          </div>
        ) : (
          /* Year label shown on opposite side */
          <div style={{ textAlign: 'right', paddingTop: 6 }}>
            <div className="font-mono" style={{ fontSize: 14, color: 'var(--os-cyan)', fontWeight: 700 }}>
              {entry.year}
            </div>
            <div className="font-mono uppercase" style={{ fontSize: 9, color: 'var(--os-text-4)', letterSpacing: '0.12em', marginTop: 3 }}>
              {entry.phase}
            </div>
          </div>
        )}
      </div>

      {/* ── CENTER NODE ── */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2 }}>
        <div
          ref={nodeRef}
          style={{
            width:        22,
            height:       22,
            borderRadius: '50%',
            background:   entry.status === 'AVAILABLE'
              ? 'linear-gradient(135deg, #00c853, #00e676)'
              : 'linear-gradient(135deg, #4fc3f7, #81d4fa)',
            border:    '3px solid #0B0B0E',
            boxShadow: entry.status === 'AVAILABLE'
              ? '0 0 18px #00c85366, 0 0 0 3px #00c85322'
              : '0 0 18px #4fc3f766, 0 0 0 3px #4fc3f722',
            flexShrink:  0,
            marginTop:   8,
            opacity:     0,
            transform:   'scale(0)',
            transition:  `opacity 0.4s ease ${index * 0.06 + 0.1}s, transform 0.4s cubic-bezier(0.34,1.56,0.64,1) ${index * 0.06 + 0.1}s`,
          }}
        />
      </div>

      {/* ── RIGHT COLUMN ── */}
      <div style={{ paddingLeft: 20, paddingTop: 6 }}>
        {!isLeft ? (
          <div
            ref={cardRef}
            style={{
              opacity:    0,
              transform:  'translateX(30px) translateY(8px)',
              transition: `opacity 0.5s ease ${index * 0.06}s, transform 0.5s cubic-bezier(0.16,1,0.3,1) ${index * 0.06}s`,
            }}
          >
            <CardContent entry={entry} />
          </div>
        ) : (
          <div style={{ textAlign: 'left', paddingTop: 6 }}>
            <div className="font-mono" style={{ fontSize: 14, color: 'var(--os-cyan)', fontWeight: 700 }}>
              {entry.year}
            </div>
            <div className="font-mono uppercase" style={{ fontSize: 9, color: 'var(--os-text-4)', letterSpacing: '0.12em', marginTop: 3 }}>
              {entry.phase}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Card ─────────────────────────────────────────────────────────────────────
function CardContent({ entry }: { entry: TEntry }) {
  return (
    <div
      style={{
        background:     'rgba(255,255,255,0.04)',
        border:         '1px solid rgba(255,255,255,0.09)',
        borderRadius:   12,
        padding:        '16px 18px',
        backdropFilter: 'blur(12px)',
        transition:     'border-color 0.2s, background 0.2s',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement
        el.style.borderColor = 'rgba(79,195,247,0.3)'
        el.style.background  = 'rgba(79,195,247,0.06)'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement
        el.style.borderColor = 'rgba(255,255,255,0.09)'
        el.style.background  = 'rgba(255,255,255,0.04)'
      }}
    >
      {/* Title row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
        <h3 className="font-mono uppercase" style={{ fontSize: 12, fontWeight: 700, color: 'var(--os-text)', letterSpacing: '0.05em', flex: 1 }}>
          {entry.title}
        </h3>
        {entry.status && (
          <Badge label={entry.status} variant={entry.status === 'AVAILABLE' ? 'ACTIVE' : 'PRODUCTION'} dot />
        )}
      </div>

      {/* Description */}
      <p style={{ fontSize: 11.5, color: 'var(--os-text-3)', lineHeight: 1.65, marginBottom: 12 }}>
        {entry.description}
      </p>

      {/* Stack pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 12 }}>
        {entry.stack.map(tech => (
          <span
            key={tech}
            style={{
              fontSize:   9.5,
              color:      'var(--os-cyan)',
              background: 'rgba(79,195,247,0.1)',
              borderRadius: 4,
              padding:    '2px 6px',
              border:     '1px solid rgba(79,195,247,0.2)',
              fontFamily: 'monospace',
            }}
          >
            {tech}
          </span>
        ))}
      </div>

      {/* Projects */}
      {entry.projects.length > 0 && (
        <>
          <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--os-text-4)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6, fontFamily: 'monospace' }}>
            Projects
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {entry.projects.map(proj => (
              <div
                key={proj.name}
                style={{
                  background:   'rgba(0,0,0,0.25)',
                  border:       '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 8,
                  padding:      '9px 11px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--os-text)', fontFamily: 'monospace', flex: 1 }}>
                    {proj.name}
                  </span>
                  <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                    {proj.github && (
                      <a href={proj.github} target="_blank" rel="noopener noreferrer"
                        style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 9.5, color: 'var(--os-text-3)', padding: '2px 6px', borderRadius: 4, border: '1px solid rgba(255,255,255,0.1)', textDecoration: 'none', background: 'rgba(255,255,255,0.04)', transition: 'all 0.15s' }}
                        onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.color = '#fff'; el.style.borderColor = 'rgba(255,255,255,0.25)' }}
                        onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.color = 'var(--os-text-3)'; el.style.borderColor = 'rgba(255,255,255,0.1)' }}
                      >
                        <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                        </svg>
                        Code
                      </a>
                    )}
                    {proj.live && (
                      <a href={proj.live} target="_blank" rel="noopener noreferrer"
                        style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 9.5, color: 'var(--os-cyan)', padding: '2px 6px', borderRadius: 4, border: '1px solid rgba(79,195,247,0.3)', textDecoration: 'none', background: 'rgba(79,195,247,0.07)', transition: 'all 0.15s' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(79,195,247,0.18)' }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(79,195,247,0.07)' }}
                      >
                        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                          <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
                          <polyline points="15,3 21,3 21,9"/><line x1="10" y1="14" x2="21" y2="3"/>
                        </svg>
                        Live
                      </a>
                    )}
                  </div>
                </div>
                <p style={{ fontSize: 10.5, color: 'var(--os-text-3)', lineHeight: 1.5, margin: 0 }}>
                  {proj.desc}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}