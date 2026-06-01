'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { motion, AnimatePresence } from 'framer-motion'
import { useOSStore } from '@/stores/os.store'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { MenuBar } from '@/components/desktop/MenuBar'
import { Dock } from '@/components/desktop/Dock'
import { Wallpaper } from '@/components/desktop/Wallpaper'
import { DesktopIcons } from '@/components/desktop/DesktopIcons'
import { WindowManager } from '@/components/windows/WindowManager'
import { ClockWidget } from '@/components/desktop/Widgets/ClockWidget'
import { StatusWidget } from '@/components/desktop/Widgets/StatusWidget'
import { Toast } from '@/components/ui/Toast'
import { AboutModal } from '@/components/os/AboutModal'
import { CopilotWidget } from '@/components/desktop/CopilotWidget'
import { LofiPlayerWidget } from '@/components/desktop/Widgets/LofiPlayerWidget'

export function Desktop() {
  const menuRef    = useRef<HTMLDivElement>(null)
  const clockRef   = useRef<HTMLDivElement>(null)
  const iconsRef   = useRef<HTMLDivElement>(null)
  const showToast  = useOSStore(s => s.showToast)
  const dockVisible = useOSStore(s => s.dockVisible)
  const isGlitching = useOSStore(s => s.isGlitching)

  useKeyboardShortcuts()

  useEffect(() => {
    const tl = gsap.timeline()

    // Menu bar slides down
    tl.fromTo(menuRef.current,
      { y: -28, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.35, ease: 'power3.out' },
      0.15
    )

    // Desktop icons fade in
    tl.fromTo(iconsRef.current,
      { opacity: 0, scale: 0.95 },
      { opacity: 1, scale: 1, duration: 0.3, ease: 'power2.out' },
      0.25
    )


    // Clock widget fades in
    tl.fromTo(clockRef.current,
      { opacity: 0, y: -8 },
      { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' },
      0.45
    )

    // Welcome toast
    tl.add(() => {
      const hour = new Date().getHours()
      let greeting = 'Good evening'
      if (hour < 12) greeting = 'Good morning'
      else if (hour < 18) greeting = 'Good afternoon'
      showToast(`${greeting} — SayanOS Online`)
    }, 0.55)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className={`fixed inset-0 overflow-hidden ${isGlitching ? 'os-glitch' : ''}`} style={{ background: 'var(--os-bg)' }}>
      {/* Wallpaper layer */}
      <Wallpaper />
      
      {/* Multiplayer Cursors */}


      {/* Menu Bar */}
      <div ref={menuRef} style={{ opacity: 0, position: 'relative', zIndex: 9999 }}>
        <MenuBar />
      </div>

      {/* Desktop area */}
      <div
        className="absolute inset-0"
        style={{ top: 28, bottom: 80, zIndex: 1 }}
      >
        {/* Desktop icons */}
        <div ref={iconsRef} style={{ opacity: 0 }}>
          <DesktopIcons />
        </div>

        {/* Widgets */}
        <div
          ref={clockRef}
          style={{ opacity: 0, position: 'absolute', top: 16, right: 20, zIndex: 100 }}
        >
          <ClockWidget />
          <div style={{ marginTop: 8 }}>
            <StatusWidget />
          </div>
        </div>

        {/* Lofi / Spotify Player Widget */}
        <LofiPlayerWidget />

        {/* Windows */}
        <WindowManager />
      </div>

      {/* Dock */}
      <AnimatePresence>
        {dockVisible && (
          <motion.div
            key="os-dock"
            initial={{ y: 80, opacity: 0, x: '-50%' }}
            animate={{ y: 0, opacity: 1, x: '-50%' }}
            exit={{ y: 80, opacity: 0, x: '-50%', transition: { duration: 0.2 } }}
            transition={{ type: 'spring', damping: 25, stiffness: 300, mass: 0.8 }}
            style={{
              position: 'fixed',
              bottom: 10,
              left: '50%',
              zIndex: 9998,
            }}
          >
            <Dock />
          </motion.div>
        )}
      </AnimatePresence>

      {/* About SayanOS Modal */}
      <AboutModal />

      {/* Sayan Copilot (Context-Aware AI) */}
      <CopilotWidget />

      {/* Toast notifications */}
      <Toast />
    </div>
  )
}