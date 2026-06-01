'use client'

import { useOSStore } from '@/stores/os.store'
import type { AppId } from '@/lib/constants'

interface WindowControlsProps {
  id:        AppId
  isHovered: boolean
}

export function WindowControls({ id, isHovered }: WindowControlsProps) {
  const closeApp    = useOSStore(s => s.closeApp)
  const minimizeApp = useOSStore(s => s.minimizeApp)
  const toggleMaximizeApp = useOSStore(s => s.toggleMaximizeApp)

  return (
    <div className="flex items-center gap-2 window-control">
      {/* Close */}
      <button
        onClick={(e) => { e.stopPropagation(); closeApp(id) }}
        className="flex items-center justify-center rounded-full transition-all"
        style={{
          width: 12, height: 12,
          background: 'var(--mac-close)',
          border: 'none',
          cursor: 'pointer',
          flexShrink: 0,
        }}
      >
        {isHovered && (
          <svg width="6" height="6" viewBox="0 0 6 6" fill="none">
            <line x1="1" y1="1" x2="5" y2="5" stroke="#8B1C1A" strokeWidth="1.2" strokeLinecap="round"/>
            <line x1="5" y1="1" x2="1" y2="5" stroke="#8B1C1A" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
        )}
      </button>

      {/* Minimize */}
      <button
        onClick={(e) => { e.stopPropagation(); minimizeApp(id) }}
        className="flex items-center justify-center rounded-full transition-all"
        style={{
          width: 12, height: 12,
          background: 'var(--mac-minimize)',
          border: 'none',
          cursor: 'pointer',
          flexShrink: 0,
        }}
      >
        {isHovered && (
          <svg width="6" height="2" viewBox="0 0 6 2" fill="none">
            <line x1="0.5" y1="1" x2="5.5" y2="1" stroke="#7A5800" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
        )}
      </button>

      {/* Maximize */}
      <button
        onClick={(e) => { e.stopPropagation(); toggleMaximizeApp(id) }}
        className="flex items-center justify-center rounded-full transition-all"
        style={{
          width: 12, height: 12,
          background: 'var(--mac-maximize)',
          border: 'none',
          cursor: 'pointer',
          flexShrink: 0,
        }}
      >
        {isHovered && (
          <svg width="6" height="6" viewBox="0 0 6 6" fill="none">
            <path d="M3 1V5M1 3H5" stroke="#0A3A0A" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
        )}
      </button>
    </div>
  )
}