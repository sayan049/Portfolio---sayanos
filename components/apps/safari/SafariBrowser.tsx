'use client'

import { useEffect, useRef, useCallback } from 'react'
import { useOSStore } from '@/stores/os.store'

export function SafariBrowser() {
  const safariUrl    = useOSStore(s => s.safariUrl)
  const setSafariUrl = useOSStore(s => s.setSafariUrl)
  const iframeRef    = useRef<HTMLIFrameElement>(null)

  // Full sandbox — scripts needed for proxy intercept to work
  const sandboxRules = 'allow-same-origin allow-scripts allow-forms allow-popups allow-top-navigation-by-user-activation'

  // We directly use the safariUrl in the iframe.
  // Google search works because we appended &igu=1 in SafariToolbar.
  // YouTube works because we rewrite to embed in SafariToolbar.
  const proxySrc = safariUrl
  const navigateSafariTab = useOSStore(s => s.navigateSafariTab)

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === 'safari-navigate' && e.data.url) {
        navigateSafariTab(e.data.url)
      }
    }
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [navigateSafariTab])

  const handleLoad = () => {
    try {
      const title = iframeRef.current?.contentDocument?.title
      if (title) {
        const state = useOSStore.getState()
        useOSStore.setState({
          safariTabs: state.safariTabs.map(t =>
            t.id === state.activeSafariTabId ? { ...t, title, isLoading: false } : t
          ),
        })
      } else {
        const state = useOSStore.getState()
        useOSStore.setState({
          safariTabs: state.safariTabs.map(t =>
            t.id === state.activeSafariTabId ? { ...t, isLoading: false } : t
          ),
        })
      }
    } catch {
      const state = useOSStore.getState()
      useOSStore.setState({
        safariTabs: state.safariTabs.map(t =>
          t.id === state.activeSafariTabId ? { ...t, isLoading: false } : t
        ),
      })
    }
  }

  return (
    <div className="w-full h-full relative bg-white">
      <iframe
        ref={iframeRef}
        key={proxySrc}          /* force remount on URL change */
        src={proxySrc}
        className="w-full h-full border-none"
        sandbox={sandboxRules}
        allowFullScreen
        title="Safari Browser"
        onLoad={handleLoad}
      />
    </div>
  )
}
