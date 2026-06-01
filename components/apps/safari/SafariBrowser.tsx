// 'use client'

// import { useEffect, useRef, useCallback } from 'react'
// import { useOSStore } from '@/stores/os.store'

// export function SafariBrowser() {
//   const safariUrl    = useOSStore(s => s.safariUrl)
//   const setSafariUrl = useOSStore(s => s.setSafariUrl)
//   const iframeRef    = useRef<HTMLIFrameElement>(null)

//   // Full sandbox — scripts needed for proxy intercept to work
//   const sandboxRules = 'allow-same-origin allow-scripts allow-forms allow-popups allow-top-navigation-by-user-activation'

//   // We directly use the safariUrl in the iframe.
//   // Google search works because we appended &igu=1 in SafariToolbar.
//   // YouTube works because we rewrite to embed in SafariToolbar.
//   const proxySrc = safariUrl
//   const navigateSafariTab = useOSStore(s => s.navigateSafariTab)

//   useEffect(() => {
//     const handleMessage = (e: MessageEvent) => {
//       if (e.data?.type === 'safari-navigate' && e.data.url) {
//         navigateSafariTab(e.data.url)
//       }
//     }
//     window.addEventListener('message', handleMessage)
//     return () => window.removeEventListener('message', handleMessage)
//   }, [navigateSafariTab])

//   const handleLoad = () => {
//     try {
//       const title = iframeRef.current?.contentDocument?.title
//       if (title) {
//         const state = useOSStore.getState()
//         useOSStore.setState({
//           safariTabs: state.safariTabs.map(t =>
//             t.id === state.activeSafariTabId ? { ...t, title, isLoading: false } : t
//           ),
//         })
//       } else {
//         const state = useOSStore.getState()
//         useOSStore.setState({
//           safariTabs: state.safariTabs.map(t =>
//             t.id === state.activeSafariTabId ? { ...t, isLoading: false } : t
//           ),
//         })
//       }
//     } catch {
//       const state = useOSStore.getState()
//       useOSStore.setState({
//         safariTabs: state.safariTabs.map(t =>
//           t.id === state.activeSafariTabId ? { ...t, isLoading: false } : t
//         ),
//       })
//     }
//   }

//   return (
//     <div className="w-full h-full relative bg-white">
//       <iframe
//         ref={iframeRef}
//         key={proxySrc}          /* force remount on URL change */
//         src={proxySrc}
//         className="w-full h-full border-none"
//         sandbox={sandboxRules}
//         allowFullScreen
//         title="Safari Browser"
//         onLoad={handleLoad}
//       />
//     </div>
//   )
// }
'use client'

import { useEffect, useRef } from 'react'
import { useOSStore, iframeUrlToDisplay } from '@/stores/os.store'

export function SafariBrowser() {
  const tabs = useOSStore(s => s.safariTabs)
  const activeSafariTabId = useOSStore(s => s.activeSafariTabId)
  const navigateSafariTab = useOSStore(s => s.navigateSafariTab)
  const setTabLoaded = useOSStore(s => s.setTabLoaded)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const activeTab = tabs.find(t => t.id === activeSafariTabId)
  const src = activeTab?.url ?? ''
  const isLoading = activeTab?.isLoading ?? false
  const isEmbed = src.includes('youtube.com/embed/')

  // Receive postMessage from proxied pages → navigate
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === 'safari-navigate' && typeof e.data.url === 'string') {
        // url from proxy is already /api/proxy?url=... or a youtube embed
        navigateSafariTab(e.data.url)
      }
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [navigateSafariTab])

  const handleLoad = () => {
    // Try to get title from iframe document (works for same-origin / proxy pages)
    let title = ''
    try {
      title = iframeRef.current?.contentDocument?.title ?? ''
    } catch {
      // cross-origin — derive from displayUrl
    }

    if (!title) {
      try {
        const display = activeTab?.displayUrl ?? ''
        title = display ? new URL(display).hostname : ''
      } catch {
        title = activeTab?.displayUrl ?? ''
      }
    }

    setTabLoaded(activeSafariTabId, title)
  }

  return (
    <div className="w-full h-full relative bg-[#111118]">

      {/* Thin loading bar at top */}
      {isLoading && (
        <div className="absolute top-0 left-0 right-0 h-[2px] z-10 overflow-hidden">
          <div className="h-full bg-[#4FC3F7] w-full origin-left animate-[proxyload_1.6s_ease-in-out_infinite]" />
        </div>
      )}

      <iframe
        ref={iframeRef}
        key={`${activeSafariTabId}::${src}`}   // remount on real navigation
        src={src}
        className="w-full h-full border-none block"
        sandbox={
          isEmbed
            ? 'allow-scripts allow-same-origin allow-presentation'
            : [
              'allow-scripts',
              'allow-same-origin',
              'allow-forms',
              'allow-popups',
              'allow-top-navigation-by-user-activation',
              'allow-presentation',
              'allow-downloads',
            ].join(' ')
        }
        allow={
          isEmbed
            ? 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen'
            : 'autoplay; fullscreen; picture-in-picture'
        }
        referrerPolicy="no-referrer"
        title="Safari Browser"
        onLoad={handleLoad}
      />

      <style>{`
        @keyframes proxyload {
          0%   { transform: scaleX(0);    transform-origin: left;  }
          50%  { transform: scaleX(0.7);  transform-origin: left;  }
          100% { transform: scaleX(0);    transform-origin: right; }
        }
      `}</style>
    </div>
  )
}