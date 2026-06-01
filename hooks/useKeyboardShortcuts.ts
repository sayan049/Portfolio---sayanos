'use client'

import { useEffect, useRef } from 'react'
import { useOSStore } from '@/stores/os.store'

const KONAMI = [
  'ArrowUp','ArrowUp','ArrowDown','ArrowDown',
  'ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a',
]

export function useKeyboardShortcuts() {
  const openApp   = useOSStore(s => s.openApp)
  const showToast = useOSStore(s => s.showToast)
  const konamiRef = useRef<string[]>([])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      konamiRef.current = [...konamiRef.current, e.key].slice(-10)

      if (konamiRef.current.join(',') === KONAMI.join(',')) {
        konamiRef.current = []
        showToast('🔓 SECRET MODE — UNLOCKED')

        // Warm palette shift for 4 seconds per prompt
        document.documentElement.style.setProperty('--os-bg',      '#0C0A06')
        document.documentElement.style.setProperty('--os-surface',  '#1A1508')
        document.documentElement.style.setProperty('--os-surface-2','#221C0A')
        document.documentElement.style.setProperty('--os-cyan',     '#F59E0B')
        document.documentElement.style.setProperty('--os-text',     '#FEF3C7')

        setTimeout(() => {
          document.documentElement.style.setProperty('--os-bg',       '#09090C')
          document.documentElement.style.setProperty('--os-surface',   '#141418')
          document.documentElement.style.setProperty('--os-surface-2', '#1A1A21')
          document.documentElement.style.setProperty('--os-cyan',      '#4FC3F7')
          document.documentElement.style.setProperty('--os-text',      '#EDEDF5')
        }, 4000)
      }
      // Ctrl + ` (Backquote) is the universal VS Code terminal shortcut and avoids dead keys
      if (e.ctrlKey && e.code === 'Backquote') {
        e.preventDefault()
        openApp('terminal')
        return
      }

      // Alt (Option) shortcuts for other apps. 
      // Note: Option+I and Option+\` are "dead keys" on Mac, so we use Alt+A for AI assistant.
      if (e.altKey) {
        switch (e.code) {
          case 'KeyT': e.preventDefault(); openApp('terminal');       break
          case 'KeyP': e.preventDefault(); openApp('projects');       break
          case 'KeyA': e.preventDefault(); openApp('ai-assistant');   break
          case 'KeyM': e.preventDefault(); openApp('system-monitor'); break
        }
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [openApp, showToast])
}