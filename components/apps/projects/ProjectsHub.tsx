'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useOSStore } from '@/stores/os.store'
import { PROJECTS } from '@/data/projects'
import { Badge } from '@/components/ui/Badge'
import { ProjectDashboard } from './ProjectDashboard'

export function ProjectsHub() {
  const activeProjectId  = useOSStore(s => s.activeProjectId)
  const setActiveProject = useOSStore(s => s.setActiveProject)
  const [selected, setSelected] = useState<string>(activeProjectId ?? 'messmate')

  const handleSelect = (id: string) => {
    setSelected(id)
    setActiveProject(id)
  }

  const activeProject = PROJECTS.find(p => p.id === selected)

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      {/* Left sidebar */}
      <div
        style={{
          width:        220,
          flexShrink:   0,
          borderRight:  '1px solid var(--os-border)',
          background:   'rgba(13, 13, 17, 0.6)',
          display:      'flex',
          flexDirection:'column',
          overflowY:    'auto',
        }}
      >
        {/* Header */}
        <div style={{ padding: '16px 16px 12px' }}>
          <div
            className="font-mono uppercase"
            style={{
              fontSize: 10, letterSpacing: '0.1em',
              color: 'var(--os-text-3)',
            }}
          >
            Systems Hub
          </div>
        </div>

        {/* Project list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '0 8px' }}>
          {PROJECTS.map(project => (
            <button
              key={project.id}
              onClick={() => handleSelect(project.id)}
              style={{
                display:      'flex',
                alignItems:   'center',
                gap:          8,
                width:        '100%',
                textAlign:    'left',
                padding:      '8px 10px',
                borderRadius: 7,
                border:       'none',
                cursor:       'pointer',
                background:   selected === project.id
                  ? 'rgba(79, 195, 247, 0.08)'
                  : 'transparent',
                transition:   'background 0.15s',
              }}
            >
              {/* Status dot */}
              <div
                style={{
                  width:      6,
                  height:     6,
                  borderRadius: '50%',
                  background: getStatusColor(project.status),
                  flexShrink: 0,
                  boxShadow:  selected === project.id
                    ? `0 0 6px ${getStatusColor(project.status)}`
                    : 'none',
                }}
              />

              {/* Name + badge */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize:     12,
                    fontWeight:   selected === project.id ? 600 : 400,
                    color:        selected === project.id ? 'var(--os-text)' : 'var(--os-text-2)',
                    overflow:     'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace:   'nowrap',
                    transition:   'color 0.15s',
                  }}
                >
                  {project.name}
                </div>
              </div>

              <Badge
                label={project.status}
                variant={project.status}
                dot={false}
                className="!text-[8px] !px-1.5 !py-0"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        {activeProject ? (
          <ProjectDashboard project={activeProject} />
        ) : null}
      </div>
    </div>
  )
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'PRODUCTION':   return 'var(--os-green)'
    case 'ACTIVE':       return 'var(--os-cyan)'
    case 'STABLE':       return 'var(--os-blue)'
    case 'IN DEV':       return 'var(--os-amber)'
    case 'EXPERIMENTAL': return 'var(--os-amber)'
    case 'ARCHIVED':     return 'var(--os-text-3)'
    default:             return 'var(--os-text-3)'
  }
}