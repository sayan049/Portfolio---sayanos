import { create } from 'zustand'
import type { AppId } from '@/lib/constants'
import { DEFAULT_WINDOW_SIZES, CASCADE_START, CASCADE_OFFSET } from '@/lib/constants'

export type { AppId }

export interface WindowState {
  id:          AppId
  isOpen:      boolean
  isMinimized: boolean
  isFocused:   boolean
  isMaximized: boolean
  position:    { x: number; y: number }
  size:        { width: number; height: number }
  zIndex:      number
}

interface OSStore {
  hasBooted:  boolean
  setBooted:  () => void

  windows:      Record<AppId, WindowState>
  openApp:      (id: AppId) => void
  closeApp:     (id: AppId) => void
  minimizeApp:  (id: AppId) => void
  focusApp:     (id: AppId) => void
  moveWindow:   (id: AppId, pos: { x: number; y: number }) => void
  resizeWindow: (id: AppId, size: { width: number; height: number }, position?: { x: number; y: number }) => void
  bringToFront: (id: AppId) => void
  toggleMaximizeApp: (id: AppId) => void

  topZIndex: number

  soundEnabled: boolean
  toggleSound:  () => void

  activeProjectId:  string | null
  setActiveProject: (id: string | null) => void

  activeWindowTitle:    string
  setActiveWindowTitle: (title: string) => void

  toastMessage:  string | null
  showToast:     (msg: string) => void
  clearToast:    () => void

  dockVisible: boolean
  toggleDock:  () => void

  customWallpaper: string | null
  setCustomWallpaper: (url: string | null) => void
  initWallpaper: () => void

  isAboutOpen: boolean
  setAboutOpen: (open: boolean) => void

  safariUrl: string
  setSafariUrl: (url: string) => void
  safariTabs: { 
    id: string; 
    url: string; 
    title: string 
    isLoading?: boolean
    history: string[]
    historyIndex: number
  }[]
  setSafariTabs: (tabs: any[]) => void
  activeSafariTabId: string
  addSafariTab: (url?: string) => void
  closeSafariTab: (id: string) => void
  setActiveSafariTab: (id: string) => void
  navigateSafariTab: (url: string) => void
  goBackSafari: () => void
  goForwardSafari: () => void

  isGlitching: boolean
  triggerGlitch: () => void

  // Analytics
  sessionStartTime: number
  appOpenCount: Record<AppId, number>
}

const APP_IDS: AppId[] = [
  'finder', 'safari', 'terminal', 'projects', 'system-monitor',
  'timeline', 'ai-assistant', 'contact', 'resume', 'settings',
  'vscode', 'resume-game', 'vision-control', 'analytics', 'negotiator', 'github-city'
]

function buildDefaultWindows(): Record<AppId, WindowState> {
  const record = {} as Record<AppId, WindowState>
  APP_IDS.forEach((id, index) => {
    record[id] = {
      id,
      isOpen:      false,
      isMinimized: false,
      isMaximized: false,
      isFocused:   false,
      position: {
        x: CASCADE_START.x + index * CASCADE_OFFSET,
        y: CASCADE_START.y + index * CASCADE_OFFSET,
      },
      size:   DEFAULT_WINDOW_SIZES[id],
      zIndex: 100 + index,
    }
  })
  return record
}

export const useOSStore = create<OSStore>((set, get) => ({
  hasBooted: false,
  setBooted: () => set({ hasBooted: true, sessionStartTime: Date.now() }),

  windows:   buildDefaultWindows(),
  topZIndex: 200,

  sessionStartTime: Date.now(),
  appOpenCount: APP_IDS.reduce((acc, id) => {
    acc[id] = 0
    return acc
  }, {} as Record<AppId, number>),

  openApp: (id) => {
    const { topZIndex, windows } = get()
    const newZ = topZIndex + 1
    const updated = { ...windows }
    Object.keys(updated).forEach(k => {
      updated[k as AppId] = { ...updated[k as AppId], isFocused: false }
    })
    updated[id] = {
      ...updated[id],
      isOpen: true, isMinimized: false, isFocused: true, zIndex: newZ,
    }
    
    // Increment telemetry count
    const { appOpenCount } = get()
    
    set({ 
      windows: updated, 
      topZIndex: newZ,
      appOpenCount: { ...appOpenCount, [id]: (appOpenCount[id] || 0) + 1 }
    })
  },

  closeApp: (id) => {
    const { windows } = get()
    set({
      windows: {
        ...windows,
        [id]: { ...windows[id], isOpen: false, isFocused: false, isMinimized: false },
      },
    })
  },

  minimizeApp: (id) => {
    const { windows } = get()
    set({
      windows: {
        ...windows,
        [id]: { ...windows[id], isMinimized: true, isFocused: false },
      },
    })
  },

  toggleMaximizeApp: (id) => {
    const { windows, topZIndex } = get()
    const newZ = topZIndex + 1
    const isCurrentlyMaximized = windows[id].isMaximized
    const updated = { ...windows }
    Object.keys(updated).forEach(k => {
      updated[k as AppId] = { ...updated[k as AppId], isFocused: false }
    })
    updated[id] = {
      ...updated[id],
      isMaximized: !isCurrentlyMaximized,
      isFocused: true,
      zIndex: newZ,
    }
    set({ windows: updated, topZIndex: newZ })
  },

  focusApp: (id) => {
    const { topZIndex, windows } = get()
    const newZ = topZIndex + 1
    const updated = { ...windows }
    Object.keys(updated).forEach(k => {
      updated[k as AppId] = { ...updated[k as AppId], isFocused: false }
    })
    updated[id] = {
      ...updated[id],
      isFocused: true, isMinimized: false, zIndex: newZ,
    }
    set({ windows: updated, topZIndex: newZ })
  },

  moveWindow: (id, pos) => {
    const { windows } = get()
    set({ windows: { ...windows, [id]: { ...windows[id], position: pos } } })
  },

  resizeWindow: (id, size, position) => {
    const { windows } = get()
    set({
      windows: {
        ...windows,
        [id]: {
          ...windows[id],
          size,
          ...(position ? { position } : {})
        }
      }
    })
  },

  bringToFront: (id) => {
    const { topZIndex, windows } = get()
    const newZ = topZIndex + 1
    set({
      windows: { ...windows, [id]: { ...windows[id], zIndex: newZ, isFocused: true } },
      topZIndex: newZ,
    })
  },

  soundEnabled: false,
  toggleSound:  () => set(s => ({ soundEnabled: !s.soundEnabled })),

  activeProjectId:  null,
  setActiveProject: (id) => set({ activeProjectId: id }),

  activeWindowTitle:    'SayanOS',
  setActiveWindowTitle: (title) => set({ activeWindowTitle: title }),

  toastMessage: null,
  showToast: (msg) => {
    set({ toastMessage: msg })
    setTimeout(() => set({ toastMessage: null }), 3000)
  },
  clearToast: () => set({ toastMessage: null }),

  dockVisible: true,
  toggleDock:  () => set(s => ({ dockVisible: !s.dockVisible })),

  customWallpaper: null,
  setCustomWallpaper: (url) => {
    if (typeof window !== 'undefined') {
      if (url) localStorage.setItem('sayanos_wallpaper', url)
      else localStorage.removeItem('sayanos_wallpaper')
    }
    set({ customWallpaper: url })
  },
  initWallpaper: () => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sayanos_wallpaper')
      if (saved) set({ customWallpaper: saved })
    }
  },

  isAboutOpen: false,
  setAboutOpen: (open) => set({ isAboutOpen: open }),

  safariUrl: '',
  setSafariUrl: (url) => set({ safariUrl: url }),
  safariTabs: [{ id: 'tab-1', url: '', title: 'New Tab', isLoading: false, history: [], historyIndex: 0 }],
  setSafariTabs: (tabs) => set({ safariTabs: tabs }),
  activeSafariTabId: 'tab-1',
  addSafariTab: (url?: string) => set((s) => {
    const newId = `tab-${Date.now()}`
    const finalUrl = url || ''
    return {
      safariTabs: [...s.safariTabs, { id: newId, url: finalUrl, title: 'Loading...', isLoading: !!finalUrl, history: finalUrl ? [finalUrl] : [], historyIndex: 0 }],
      activeSafariTabId: newId,
      safariUrl: finalUrl
    }
  }),
  closeSafariTab: (id) => set((s) => {
    const filtered = s.safariTabs.filter(t => t.id !== id)
    if (filtered.length === 0) {
      return { safariTabs: [{ id: 'tab-new', url: '', title: 'New Tab', isLoading: false, history: [], historyIndex: 0 }], activeSafariTabId: 'tab-new', safariUrl: '' }
    }
    const newActiveId = s.activeSafariTabId === id ? filtered[filtered.length - 1].id : s.activeSafariTabId
    const newActiveUrl = filtered.find(t => t.id === newActiveId)?.url ?? ''
    return { safariTabs: filtered, activeSafariTabId: newActiveId, safariUrl: newActiveUrl }
  }),
  setActiveSafariTab: (id) => set((s) => {
    const tab = s.safariTabs.find(t => t.id === id)
    if (tab) {
      return { activeSafariTabId: id, safariUrl: tab.url }
    }
    return {}
  }),
  navigateSafariTab: (url) => set((s) => {
    const tabs = s.safariTabs.map(t => {
      if (t.id === s.activeSafariTabId) {
        const newHistory = t.history.slice(0, t.historyIndex + 1)
        newHistory.push(url)
        return { ...t, url, title: 'Loading...', isLoading: true, history: newHistory, historyIndex: newHistory.length - 1 }
      }
      return t
    })
    return { safariTabs: tabs, safariUrl: url }
  }),
  goBackSafari: () => set((s) => {
    let newUrl = s.safariUrl
    const tabs = s.safariTabs.map(t => {
      if (t.id === s.activeSafariTabId && t.historyIndex > 0) {
        const idx = t.historyIndex - 1
        newUrl = t.history[idx]
        return { ...t, url: newUrl, isLoading: true, historyIndex: idx }
      }
      return t
    })
    return { safariTabs: tabs, safariUrl: newUrl }
  }),
  goForwardSafari: () => set((s) => {
    let newUrl = s.safariUrl
    const tabs = s.safariTabs.map(t => {
      if (t.id === s.activeSafariTabId && t.historyIndex < t.history.length - 1) {
        const idx = t.historyIndex + 1
        newUrl = t.history[idx]
        return { ...t, url: newUrl, isLoading: true, historyIndex: idx }
      }
      return t
    })
    return { safariTabs: tabs, safariUrl: newUrl }
  }),

  isGlitching: false,
  triggerGlitch: () => {
    set({ isGlitching: true })
    setTimeout(() => set({ isGlitching: false }), 2000)
  }
}))