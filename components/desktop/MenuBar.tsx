'use client'

import { useState } from 'react'
import { useOSStore } from '@/stores/os.store'
import { useClock } from '@/hooks/useClock'
import { motion, AnimatePresence } from 'framer-motion'
import { TimeMachine } from '@/components/desktop/TimeMachine'

const VolumeOnIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
    <polygon points="11,5 6,9 2,9 2,15 6,15 11,19" fill="currentColor" opacity="0.9"/>
    <path d="M15.54 8.46a5 5 0 010 7.07" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M19.07 4.93a10 10 0 010 14.14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
)

const VolumeOffIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
    <polygon points="11,5 6,9 2,9 2,15 6,15 11,19" fill="currentColor" opacity="0.9"/>
    <line x1="23" y1="9" x2="17" y2="15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    <line x1="17" y1="9" x2="23" y2="15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
)

export function MenuBar() {
  const { timeFull }          = useClock()
  const activeWindowTitle     = useOSStore(s => s.activeWindowTitle)
  const soundEnabled          = useOSStore(s => s.soundEnabled)
  const toggleSound           = useOSStore(s => s.toggleSound)
  const showToast             = useOSStore(s => s.showToast)
  const openApp               = useOSStore(s => s.openApp)
  
  const [activeMenu, setActiveMenu] = useState<string | null>(null)

  const handleLogoClick = () => {
    setActiveMenu(null)
    const store = useOSStore.getState()
    store.setAboutOpen(true)
  }

  const handleToggleFullscreen = () => {
    setActiveMenu(null)
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => showToast('Fullscreen blocked by browser'))
    } else {
      if (document.exitFullscreen) document.exitFullscreen()
    }
  }

  const handleToggleDock = () => {
    setActiveMenu(null)
    const store = useOSStore.getState()
    store.toggleDock()
  }

  const menus = {
    File: [
      { label: 'New Window', onClick: () => { showToast('Please select an app from the dock'); setActiveMenu(null) } },
      { label: 'Open Safari', onClick: () => { openApp('safari'); setActiveMenu(null) } },
      { label: 'Open Terminal', onClick: () => { openApp('terminal'); setActiveMenu(null) } },
    ],
    View: [
      { label: 'Toggle Fullscreen', onClick: handleToggleFullscreen },
      { label: useOSStore(s => s.dockVisible) ? 'Hide Dock' : 'Show Dock', onClick: handleToggleDock },
    ],
    Help: [
      { label: 'SayanOS Help', onClick: () => { openApp('ai-assistant'); setActiveMenu(null) } },
      { label: 'About SayanOS', onClick: handleLogoClick },
    ]
  }

  return (
    <>
      {/* Overlay to close menus when clicking outside */}
      {activeMenu && (
        <div 
          className="fixed inset-0 z-[200]" 
          onClick={() => setActiveMenu(null)}
        />
      )}

      <div
        className="flex items-center justify-between px-3 select-none relative z-[201]"
        style={{
          height: 28,
          background: 'rgba(12, 12, 18, 0.85)',
          backdropFilter: 'blur(20px) saturate(160%)',
          WebkitBackdropFilter: 'blur(20px) saturate(160%)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        {/* Left section */}
        <div className="flex items-center gap-1">
          <button
            onClick={handleLogoClick}
            className="flex items-center justify-center rounded hover:bg-white/10 transition-colors"
            style={{ width: 32, height: 28, padding: '0 6px' }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://img.icons8.com/color/32/operating-system.png"
              alt="SayanOS"
              width={18}
              height={18}
              style={{ objectFit: 'contain' }}
            />
          </button>

          <MenuBarItem label="SayanOS" bold />
          
          {Object.entries(menus).map(([label, items]) => (
            <MenuBarDropdown 
              key={label}
              label={label}
              items={items}
              isActive={activeMenu === label}
              onClick={() => setActiveMenu(activeMenu === label ? null : label)}
            />
          ))}
        </div>

        {/* Center — active window name */}
        <div
          className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
          style={{ fontSize: 13, color: 'var(--os-text-3)' }}
        >
          {activeWindowTitle}
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2">
          <TimeMachine />
          <div style={{ width: 1, height: 12, background: 'var(--os-border)' }} />
          <button
            onClick={toggleSound}
            className="flex items-center justify-center rounded hover:bg-white/10 transition-colors"
            style={{ width: 22, height: 22, color: 'var(--os-text-3)' }}
          >
            {soundEnabled ? <VolumeOnIcon /> : <VolumeOffIcon />}
          </button>

          <div style={{ width: 1, height: 12, background: 'var(--os-border)' }} />

          <div className="flex items-center gap-1.5">
            <div
              style={{
                width: 6, height: 6, borderRadius: '50%',
                background: 'var(--os-green)',
                boxShadow: '0 0 6px var(--os-green)',
              }}
            />
            <span style={{ fontSize: 11, color: 'var(--os-text-3)', letterSpacing: '0.04em' }}>
              ONLINE
            </span>
          </div>

          <div style={{ width: 1, height: 12, background: 'var(--os-border)' }} />

          <span className="font-mono" style={{ fontSize: 12, color: 'var(--os-text-2)' }}>
            {timeFull}
          </span>
        </div>
      </div>
    </>
  )
}

function MenuBarItem({ label, bold }: { label: string; bold?: boolean }) {
  return (
    <div
      className="flex items-center px-2 rounded cursor-pointer"
      style={{
        fontSize: 13,
        fontWeight: bold ? 600 : 400,
        color: bold ? 'var(--os-text)' : 'var(--os-text-2)',
        height: 22,
      }}
    >
      {label}
    </div>
  )
}

interface MenuDropdownProps {
  label: string
  items: { label: string; onClick: () => void }[]
  isActive: boolean
  onClick: () => void
}

function MenuBarDropdown({ label, items, isActive, onClick }: MenuDropdownProps) {
  return (
    <div className="relative">
      <button
        onClick={onClick}
        className="flex items-center px-2 rounded transition-colors"
        style={{
          fontSize: 13,
          fontWeight: 400,
          color: isActive ? 'var(--os-text)' : 'var(--os-text-2)',
          background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
          height: 22,
        }}
      >
        {label}
      </button>

      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute left-0 mt-1 py-1 rounded-lg border border-white/10 shadow-2xl overflow-hidden"
            style={{
              background: 'rgba(24, 24, 32, 0.7)',
              backdropFilter: 'blur(30px) saturate(180%)',
              minWidth: 200,
            }}
          >
            {items.map((item, idx) => (
              <button
                key={idx}
                onClick={item.onClick}
                className="w-full text-left px-3 py-1.5 hover:bg-[#4FC3F7] hover:text-black transition-colors"
                style={{
                  fontSize: 13,
                  color: 'var(--os-text-2)',
                  fontFamily: 'inherit'
                }}
              >
                {item.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}