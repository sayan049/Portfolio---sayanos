'use client'

import { useRef, useEffect, useCallback } from 'react'
import { MENU_BAR_HEIGHT } from '@/lib/constants'

interface DragOptions {
  onMove:         (pos: { x: number; y: number }) => void
  onSnapPreview?: (edge: 'left' | 'right' | 'top' | null) => void
  onSnap?:        (edge: 'left' | 'right' | 'top') => void
  initialPos:     { x: number; y: number }
  windowSize:     { width: number; height: number }
}

/**
 * Zero-lag window drag using raw DOM pointer events.
 * Bypasses React's synthetic event system entirely so there
 * are no re-render delays during the drag operation.
 */
export function useWindowDrag({ onMove, onSnapPreview, onSnap, initialPos, windowSize }: DragOptions) {
  // Always-fresh refs so DOM handlers never capture stale closures
  const onMoveRef         = useRef(onMove)
  const onSnapPreviewRef  = useRef(onSnapPreview)
  const onSnapRef         = useRef(onSnap)
  const initialPosRef     = useRef(initialPos)
  const windowSizeRef     = useRef(windowSize)

  useEffect(() => { onMoveRef.current = onMove },                 [onMove])
  useEffect(() => { onSnapPreviewRef.current = onSnapPreview },   [onSnapPreview])
  useEffect(() => { onSnapRef.current = onSnap },                 [onSnap])
  useEffect(() => { initialPosRef.current = initialPos },         [initialPos])
  useEffect(() => { windowSizeRef.current = windowSize },         [windowSize])

  const isDragging  = useRef(false)
  const snapEdgeRef = useRef<'left'|'right'|'top'|null>(null)
  const startPtr    = useRef({ x: 0, y: 0 })
  const startWin    = useRef({ x: 0, y: 0 })

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLElement>) => {
    // Don't drag from window control buttons
    if ((e.target as HTMLElement).closest('.window-control')) return
    e.preventDefault()
    e.currentTarget.setPointerCapture(e.pointerId)

    isDragging.current  = true
    startPtr.current    = { x: e.clientX, y: e.clientY }
    startWin.current    = { ...initialPosRef.current }
    document.body.style.userSelect = 'none'
    document.body.style.cursor     = 'grabbing'
  }, [])

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLElement>) => {
    if (!isDragging.current) return
    // Use requestAnimationFrame to stay in sync with the browser's render cycle
    const dx = e.clientX - startPtr.current.x
    const dy = e.clientY - startPtr.current.y

    const screenW = window.innerWidth
    const screenH = window.innerHeight
    
    // Snap edge detection
    let snapEdge: 'left' | 'right' | 'top' | null = null
    if (e.clientX <= 15) snapEdge = 'left'
    else if (e.clientX >= screenW - 15) snapEdge = 'right'
    else if (e.clientY <= MENU_BAR_HEIGHT + 5) snapEdge = 'top'

    if (snapEdgeRef.current !== snapEdge) {
      snapEdgeRef.current = snapEdge
      if (onSnapPreviewRef.current) onSnapPreviewRef.current(snapEdge)
    }

    // Allow window to be dragged partially off-screen (40px handle stays visible)
    const minX = -(windowSizeRef.current.width - 80)
    const maxX = screenW - 40
    const minY = MENU_BAR_HEIGHT
    const maxY = screenH - 40

    const newX = Math.min(maxX, Math.max(minX, startWin.current.x + dx))
    const newY = Math.min(maxY, Math.max(minY, startWin.current.y + dy))

    onMoveRef.current({ x: newX, y: newY })
  }, [])

  const onPointerUp = useCallback(() => {
    isDragging.current             = false
    document.body.style.userSelect = ''
    document.body.style.cursor     = ''
    
    if (snapEdgeRef.current && onSnapRef.current) {
      onSnapRef.current(snapEdgeRef.current)
    }
    if (onSnapPreviewRef.current) {
      onSnapPreviewRef.current(null)
    }
    snapEdgeRef.current = null
  }, [])

  return { onPointerDown, onPointerMove, onPointerUp }
}