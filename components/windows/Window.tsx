'use client'

import { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import { useOSStore } from '@/stores/os.store'
import { useWindowDrag } from '@/hooks/useWindowDrag'
import { WindowControls } from './WindowControls'
import { APP_NAMES } from '@/lib/constants'
import type { AppId } from '@/lib/constants'
import { APP_ICONS } from '@/components/ui/Icons'

interface WindowProps {
  id:       AppId
  children: React.ReactNode
}

type ResizeEdge = 't' | 'b' | 'l' | 'r' | 'tl' | 'tr' | 'bl' | 'br'

const windowVariants: Variants = {
  initial: {
    opacity: 0,
    scale:   0.85,
    y:       20,
    transition: { duration: 0 },
  },
  open: {
    opacity:  1,
    scale:    1,
    scaleX:   1,
    scaleY:   1,
    x:        0,
    y:        0,
    transition: { type: 'spring', stiffness: 340, damping: 28, mass: 0.9 },
  },
  minimized: (custom: { dx: number, dy: number, scaleX: number, scaleY: number }) => ({
    x:       custom.dx,
    y:       custom.dy,
    scaleX:  custom.scaleX,
    scaleY:  custom.scaleY,
    opacity: [1, 0.9, 0], // Sucks into the dock, stays mostly visible until the end
    transition: {
      duration: 0.45,
      ease: [0.32, 0, 0.1, 1], // Classic Apple fluid ease
      opacity: { duration: 0.15, delay: 0.3 }
    },
  }),
  closed: {
    opacity: 0,
    scale:   0.92,
    y:       -10,
    transition: { duration: 0.18, ease: 'easeIn' },
  },
}

export function Window({ id, children }: WindowProps) {
  const win              = useOSStore(s => s.windows[id])
  const moveWindow       = useOSStore(s => s.moveWindow)
  const focusApp         = useOSStore(s => s.focusApp)
  const setTitle         = useOSStore(s => s.setActiveWindowTitle)
  const resizeWindow     = useOSStore(s => s.resizeWindow)
  const toggleMaximize   = useOSStore(s => s.toggleMaximizeApp)

  const [isDragging, setIsDragging] = useState(false)
  const [snapPreview, setSnapPreview] = useState<'left'|'right'|'top'|null>(null)

  const handleMove = useCallback((pos: { x: number; y: number }) => {
    moveWindow(id, pos)
  }, [id, moveWindow])

  const { onPointerDown: dragDown, onPointerMove: dragMove, onPointerUp: dragUp } = useWindowDrag({
    onMove:     handleMove,
    onSnapPreview: setSnapPreview,
    onSnap: (edge) => {
      const w = window.innerWidth
      const h = window.innerHeight
      if (edge === 'left') {
        resizeWindow(id, { width: w / 2, height: h - 28 - 75 }, { x: 0, y: 28 })
        if (win.isMaximized) toggleMaximize(id)
      } else if (edge === 'right') {
        resizeWindow(id, { width: w / 2, height: h - 28 - 75 }, { x: w / 2, y: 28 })
        if (win.isMaximized) toggleMaximize(id)
      } else if (edge === 'top') {
        if (!win.isMaximized) toggleMaximize(id)
      }
    },
    initialPos: win.position,
    windowSize: win.size,
  })

  const handlePointerDown = (e: React.PointerEvent<HTMLElement>) => {
    setIsDragging(true)
    dragDown(e)
  }
  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => { dragMove(e) }
  const handlePointerUp   = () => { setIsDragging(false); dragUp() }

  const handleFocus = () => { focusApp(id); setTitle(APP_NAMES[id]) }

  // ── 8-Way Resize Handler ──────────────────────────────────────────────
  const resizeRef = useRef<{
    startX: number; startY: number; startW: number; startH: number; startPosX: number; startPosY: number
  } | null>(null)

  const handleResize = (e: React.PointerEvent<HTMLDivElement>, edge: ResizeEdge) => {
    e.stopPropagation(); e.preventDefault()
    resizeRef.current = {
      startX: e.clientX, startY: e.clientY,
      startW: win.size.width, startH: win.size.height,
      startPosX: win.position.x, startPosY: win.position.y,
    }
    const MIN_W = 320, MIN_H = 200

    const onMove = (ev: PointerEvent) => {
      if (!resizeRef.current) return
      const { startX, startY, startW, startH, startPosX, startPosY } = resizeRef.current
      const dx = ev.clientX - startX, dy = ev.clientY - startY
      let newW = startW, newH = startH, newX = startPosX, newY = startPosY

      if (edge.includes('r')) newW = Math.max(MIN_W, startW + dx)
      if (edge.includes('b')) newH = Math.max(MIN_H, startH + dy)
      if (edge.includes('l')) { newW = Math.max(MIN_W, startW - dx); if (newW > MIN_W) newX = startPosX + dx }
      if (edge.includes('t')) { newH = Math.max(MIN_H, startH - dy); if (newH > MIN_H) newY = startPosY + dy }

      resizeWindow(id, { width: newW, height: newH }, { x: newX, y: newY })
    }
    const onUp = () => {
      resizeRef.current = null
      document.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerup',   onUp)
      document.body.style.cursor = ''
    }
    document.addEventListener('pointermove', onMove)
    document.addEventListener('pointerup',   onUp)
  }

  const isMaximized = win.isMaximized

  // ── Compute layout for maximized vs normal ────────────────────────────
  // When maximized: fill from y=0 to the top of the dock (75px from bottom)
  // When normal: use stored position/size
  const DOCK_HEIGHT = 75
  const windowStyle: React.CSSProperties = isMaximized
    ? {
        position: 'absolute',
        left:     0,
        top:      0,
        width:    '100%',
        height:   `calc(100% - ${DOCK_HEIGHT}px)`,
        zIndex:   99999,
        borderRadius: 0,
      }
    : {
        position: 'absolute',
        left:     win.position.x,
        top:      win.position.y,
        width:    win.size.width,
        height:   win.size.height,
        zIndex:   win.zIndex,
        borderRadius: 12,
      }

  // ── Calculate Genie Dock Target ────────────────────────────
  let dx = 0, dy = 600, customScaleX = 0.05, customScaleY = 0.05
  if (typeof window !== 'undefined') {
    const dockEl = document.getElementById(`dock-icon-${id}`)
    if (dockEl) {
      const dockRect = dockEl.getBoundingClientRect()
      
      const winW = isMaximized ? window.innerWidth : win.size.width
      const winH = isMaximized ? (window.innerHeight - DOCK_HEIGHT) : win.size.height
      const winX = isMaximized ? 0 : win.position.x
      const winY = isMaximized ? 0 : win.position.y

      // Transform origin is 'bottom center', so we base calculations on that point
      const winBottomCenterX = winX + winW / 2
      const winBottomCenterY = winY + winH

      const dockCenterX = dockRect.left + dockRect.width / 2
      const dockCenterY = dockRect.top + dockRect.height / 2

      dx = dockCenterX - winBottomCenterX
      // Slight offset so it sucks exactly into the icon's visual center
      dy = dockCenterY - winBottomCenterY

      // Avoid division by zero
      customScaleX = Math.max(0.01, dockRect.width / winW)
      customScaleY = Math.max(0.01, dockRect.height / winH)
    }
  }

  const renderSnapPreview = () => {
    if (!snapPreview) return null
    const w = window.innerWidth
    const h = window.innerHeight
    const baseStyle: React.CSSProperties = {
      position: 'fixed',
      zIndex: 999999,
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      border: '2px solid rgba(255,255,255,0.4)',
      borderRadius: snapPreview === 'top' ? 0 : 12,
      transition: 'all 0.15s cubic-bezier(0.2, 0.8, 0.2, 1)',
      pointerEvents: 'none'
    }

    if (snapPreview === 'left') {
      return <div style={{ ...baseStyle, top: 28, left: 0, width: w/2, height: h - 28 - 75 }} />
    }
    if (snapPreview === 'right') {
      return <div style={{ ...baseStyle, top: 28, left: w/2, width: w/2, height: h - 28 - 75 }} />
    }
    if (snapPreview === 'top') {
      return <div style={{ ...baseStyle, top: 0, left: 0, width: w, height: h - 75 }} />
    }
  }

  return (
    <>
      {renderSnapPreview()}
      <AnimatePresence>
      {win.isOpen && (
        <motion.div
          key={id}
          variants={windowVariants}
          custom={{ dx, dy, scaleX: customScaleX, scaleY: customScaleY }}
          initial="initial"
          animate={win.isMinimized ? 'minimized' : 'open'}
          exit="closed"
          onMouseDown={handleFocus}
          style={{
            ...windowStyle,
            // Visual style below — always the same regardless of maximized state
            pointerEvents:   win.isMinimized ? 'none' : 'auto',
            visibility:      win.isMinimized ? 'hidden' : 'visible',
            background:      'rgba(28, 28, 36, 0.92)',
            backdropFilter:  'blur(40px) saturate(180%)',
            border:          `1px solid ${win.isFocused ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.07)'}`,
            boxShadow:       isDragging
              ? '0 28px 80px rgba(0,0,0,0.75)'
              : win.isFocused
                ? '0 8px 40px rgba(0,0,0,0.55), 0 0 0 0.5px rgba(255,255,255,0.12), inset 0 1px 0 rgba(255,255,255,0.1)'
                : '0 4px 20px rgba(0,0,0,0.35)',
            display:         'flex',
            flexDirection:   'column',
            // Genie needs transformOrigin at bottom center so the window
            // appears to collapse toward the dock (which sits at the bottom)
            transformOrigin: 'bottom center',
            // Only animate box-shadow/border — NOT position/size (that causes the jank)
            transition:      'box-shadow 0.2s ease, border-color 0.2s ease',
            overflow:        'hidden',
          }}
        >
          {/* Unfocused dim overlay */}
          {!win.isFocused && (
            <div style={{
              position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1,
              background: 'rgba(0,0,0,0.18)', borderRadius: 'inherit',
            }} />
          )}

          {/* ── Title Bar ───────────────────────────────────── */}
          <div
            className="flex items-center"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            style={{
              height:       40,
              background:   win.isFocused
                ? 'linear-gradient(180deg, rgba(60,60,75,0.95) 0%, rgba(38,38,50,0.95) 100%)'
                : 'rgba(32,32,42,0.92)',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              padding:      '0 12px',
              cursor:       isDragging ? 'grabbing' : isMaximized ? 'default' : 'grab',
              flexShrink:   0,
              position:     'relative',
              zIndex:       2,
              userSelect:   'none',
              borderRadius: isMaximized ? '0' : '12px 12px 0 0',
            }}
          >
            <WindowControls id={id} isHovered={true} />

            {/* Centred icon + title */}
            <div
              className="absolute inset-0 flex items-center justify-center gap-1.5 pointer-events-none"
              style={{ paddingLeft: 72, paddingRight: 72 }}
            >
              <div style={{ width: 14, height: 14, flexShrink: 0, opacity: 0.9 }}>
                {APP_ICONS[id]}
              </div>
              <span style={{
                fontSize: 12, fontWeight: 500, letterSpacing: '0.01em',
                color:        win.isFocused ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.38)',
                whiteSpace:   'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>
                {APP_NAMES[id]}
              </span>
            </div>
          </div>

          {/* ── Content ─────────────────────────────────────── */}
          <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
            {children}
          </div>

          {/* ── 8-Way Resize Handles (only when not maximized) ── */}
          {!isMaximized && (
            <>
              <div onPointerDown={e => handleResize(e, 't')}  style={{ position:'absolute', top:-4,    left:12,   right:12,  height:8,  cursor:'ns-resize',   zIndex:10 }} />
              <div onPointerDown={e => handleResize(e, 'b')}  style={{ position:'absolute', bottom:-4, left:12,   right:12,  height:8,  cursor:'ns-resize',   zIndex:10 }} />
              <div onPointerDown={e => handleResize(e, 'l')}  style={{ position:'absolute', top:12,    bottom:12, left:-4,   width:8,   cursor:'ew-resize',   zIndex:10 }} />
              <div onPointerDown={e => handleResize(e, 'r')}  style={{ position:'absolute', top:12,    bottom:12, right:-4,  width:8,   cursor:'ew-resize',   zIndex:10 }} />
              <div onPointerDown={e => handleResize(e, 'tl')} style={{ position:'absolute', top:-4,    left:-4,   width:14,  height:14, cursor:'nwse-resize', zIndex:11 }} />
              <div onPointerDown={e => handleResize(e, 'tr')} style={{ position:'absolute', top:-4,    right:-4,  width:14,  height:14, cursor:'nesw-resize', zIndex:11 }} />
              <div onPointerDown={e => handleResize(e, 'bl')} style={{ position:'absolute', bottom:-4, left:-4,   width:14,  height:14, cursor:'nesw-resize', zIndex:11 }} />
              <div onPointerDown={e => handleResize(e, 'br')} style={{ position:'absolute', bottom:-4, right:-4,  width:14,  height:14, cursor:'nwse-resize', zIndex:11 }} />
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
    </>
  )
}