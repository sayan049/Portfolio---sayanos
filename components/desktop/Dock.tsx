'use client'

import { useRef, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useOSStore } from '@/stores/os.store'
import { DOCK_APPS } from '@/lib/constants'
import type { AppId } from '@/lib/constants'
import { lerp } from '@/lib/utils'
import { APP_ICONS } from '@/components/ui/Icons'

const BASE_SIZE      = 44
const MAX_SIZE       = 58
const MAGNIFY_RANGE  = 80



function DockIcon({
  id,
  label,
  mouseX,
}: {
  id:     AppId
  label:  string
  mouseX: number | null
}) {
  const ref     = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const openApp = useOSStore(s => s.openApp)
  const windows = useOSStore(s => s.windows)
  const isOpen  = windows[id].isOpen && !windows[id].isMinimized

  // Calculate distance-based scale per prompt formula:
  // lerp(52, 72, 1 - (distance / 96))
  let scale = 1
  if (mouseX !== null && ref.current) {
    const rect     = ref.current.getBoundingClientRect()
    const center   = rect.left + rect.width / 2
    const distance = Math.abs(mouseX - center)
    if (distance < MAGNIFY_RANGE) {
      const t = 1 - (distance / MAGNIFY_RANGE)
      const targetSize = lerp(BASE_SIZE, MAX_SIZE, t)
      scale = targetSize / BASE_SIZE
    }
  }

  return (
    <div className="flex flex-col items-center" style={{ position: 'relative' }}>
      <motion.div
        ref={ref}
        id={`dock-icon-${id}`}
        animate={{ width: BASE_SIZE * scale, height: BASE_SIZE * scale }}
        transition={{ type: 'spring', stiffness: 320, damping: 22 }}
        onClick={() => openApp(id)}
        title={label}
        className=""
        style={{
          display:         'flex',
          alignItems:      'center',
          justifyContent:  'center',
          background:      'transparent',
          cursor:          'pointer',
          flexShrink:      0,
          transformOrigin: 'bottom center',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ scale: scale * 1.02 }}
        whileTap={{ scale: scale * 0.95 }}
      >
        {APP_ICONS[id]}
      </motion.div>

      {/* SayanOS Style Tooltip */}
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.9 }}
        animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10, scale: isHovered ? 1 : 0.9 }}
        transition={{ duration: 0.15 }}
        style={{
          position: 'absolute',
          top: -46,
          background: 'rgba(28, 28, 30, 0.75)',
          backdropFilter: 'blur(12px)',
          padding: '4px 10px',
          borderRadius: 6,
          color: 'rgba(255, 255, 255, 0.9)',
          fontSize: 13,
          fontWeight: 500,
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        }}
      >
        {label}
      </motion.div>

      {/* Active indicator — 3x3px cyan dot per prompt */}
      <div
        style={{
          width:        4,
          height:       4,
          borderRadius: '50%',
          background:   'var(--os-cyan)',
          marginTop:    4,
          opacity:      isOpen ? 1 : 0,
          transition:   'opacity 0.15s',
          boxShadow:    isOpen ? '0 0 6px var(--os-cyan)' : 'none',
        }}
      />
    </div>
  )
}

export function Dock() {
  const [mouseX, setMouseX]           = useState<number | null>(null)
  const dockRef                       = useRef<HTMLDivElement>(null)

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setMouseX(e.clientX)
  }, [])

  return (
    <motion.div
      ref={dockRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setMouseX(null)}
      className="" // removed generic glass
      style={{
        display:             'flex',
        alignItems:          'flex-end',
        gap:                 8,
        padding:             '6px 12px',
        borderRadius:        24,
        background:          'rgba(255, 255, 255, 0.08)',
        backdropFilter:      'blur(40px) saturate(200%)',
        WebkitBackdropFilter:'blur(40px) saturate(200%)',
        border:              '1px solid rgba(255, 255, 255, 0.15)',
        boxShadow:           '0 12px 36px rgba(0, 0, 0, 0.4)',
        height:              BASE_SIZE + 20, // Lock height so dock background doesn't expand vertically
      }}
    >
      {DOCK_APPS.map((app, index) => (
        <div key={app.id} style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
          {/* Separator between apps if needed */}
          {index === 6 && (
            <div
              style={{
                width: 1, height: 36,
                background: 'var(--os-border-light)',
                marginRight: 4,
              }}
            />
          )}
          <DockIcon
            id={app.id}
            label={app.label}
            mouseX={mouseX}
          />
        </div>
      ))}
    </motion.div>
  )
}