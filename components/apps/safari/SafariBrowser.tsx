'use client'

import { useEffect, useRef, useCallback } from 'react'
import { useOSStore } from '@/stores/os.store'

export function SafariBrowser() {
  const safariUrl    = useOSStore(s => s.safariUrl)
  const setSafariUrl = useOSStore(s => s.setSafariUrl)
  const iframeRef    = useRef<HTMLIFrameElement>(null)

  // Full sandbox — scripts needed for proxy intercept to work
  const sandboxRules = 'allow-same-origin allow-scripts allow-forms allow-popups allow-top-navigation-by-user-activation'

  // Piped.video and YouTube embed load fine without proxy
  const isEmbedFriendly = safariUrl.includes('piped.video')
    || safariUrl.includes('youtube.com/embed')

  const proxySrc = (isEmbedFriendly || !safariUrl)
    ? safariUrl
    : `/api/proxy?url=${encodeURIComponent(safariUrl)}`

  const navigateSafariTab = useOSStore(s => s.navigateSafariTab)

  // ── Listen for navigation messages posted by the proxy's injected script ──
  const handleMessage = useCallback((event: MessageEvent) => {
    if (event.data?.type === 'safari-navigate') {
      const proxiedPath: string = event.data.url as string
      if (!proxiedPath) return

      // Extract the real destination URL from the proxy path
      let destUrl = proxiedPath
      if (proxiedPath.startsWith('/api/proxy?url=')) {
        try {
          destUrl = decodeURIComponent(proxiedPath.replace('/api/proxy?url=', ''))
        } catch { /* keep as is */ }
      }

      // Fix YouTube links explicitly to embeds
      if (destUrl.includes('youtube.com/watch') || destUrl.includes('youtu.be/')) {
        try {
          const urlObj = new URL(destUrl.replace('youtu.be/', 'youtube.com/watch?v='))
          const vid = urlObj.searchParams.get('v')
          if (vid) destUrl = `https://www.youtube.com/embed/${vid}?autoplay=1`
        } catch {}
      } else if (destUrl.includes('youtube.com') || destUrl.includes('youtu.be')) {
        // If it's a youtube homepage or search, redirect to Bing video search because YT blocks iframes
        destUrl = `https://www.bing.com/videos/search?q=youtube`
      } else if (destUrl.includes('linkedin.com') || destUrl.includes('github.com') || destUrl.includes('twitter.com') || destUrl.includes('x.com')) {
        // These sites aggressively block bots and iframe proxying
        window.open(destUrl, '_blank')
        return // keep current tab unchanged
      }

      navigateSafariTab(destUrl)
    }
  }, [navigateSafariTab])

  useEffect(() => {
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [handleMessage])

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
