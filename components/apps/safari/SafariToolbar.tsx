import { useState, useEffect } from 'react'
import { useOSStore } from '@/stores/os.store'
import { ChevronLeft, ChevronRight, RotateCw, Shield } from 'lucide-react'

export function SafariToolbar() {
  const safariUrl = useOSStore(s => s.safariUrl)
  const setSafariUrl = useOSStore(s => s.setSafariUrl)
  const addSafariTab = useOSStore(s => s.addSafariTab)
  
  const activeTabId = useOSStore(s => s.activeSafariTabId)
  const tabs = useOSStore(s => s.safariTabs)
  const activeTab = tabs.find(t => t.id === activeTabId)

  const canGoBack = activeTab ? activeTab.historyIndex > 0 : false
  const canGoForward = activeTab ? activeTab.historyIndex < activeTab.history.length - 1 : false

  const navigateSafariTab = useOSStore(s => s.navigateSafariTab)
  const goBackSafari = useOSStore(s => s.goBackSafari)
  const goForwardSafari = useOSStore(s => s.goForwardSafari)
  
  const [inputVal, setInputVal] = useState(safariUrl)

  useEffect(() => {
    setInputVal(safariUrl)
  }, [safariUrl])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    let finalUrl = inputVal.trim()
    if (!finalUrl) return

    const looksLikeUrl = !finalUrl.includes(' ')
      && (finalUrl.includes('.') || finalUrl.startsWith('http'))

    if (!looksLikeUrl) {
      // Search query → Bing (proxy-friendly, unlike DuckDuckGo which blocks server IPs)
      finalUrl = `https://www.bing.com/search?q=${encodeURIComponent(finalUrl)}`
    } else {
      if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
        finalUrl = 'https://' + finalUrl
      }

      // Check for youtube.com
      if (finalUrl.includes('youtube.com/watch') || finalUrl.includes('youtu.be/')) {
        try {
          const urlObj = new URL(finalUrl.replace('youtu.be/', 'youtube.com/watch?v='))
          const vid = urlObj.searchParams.get('v')
          if (vid) finalUrl = `https://www.youtube.com/embed/${vid}?autoplay=1`
        } catch {}
      } else if (finalUrl.includes('youtube.com') || finalUrl.includes('youtu.be')) {
        finalUrl = `https://www.bing.com/videos/search?q=youtube`
      } else if (finalUrl.includes('linkedin.com') || finalUrl.includes('github.com') || finalUrl.includes('twitter.com') || finalUrl.includes('x.com')) {
        window.open(finalUrl, '_blank')
        return
      }
    }
    navigateSafariTab(finalUrl)
  }

  const handleReload = () => {
    if (safariUrl) navigateSafariTab(safariUrl)
  }

  return (
    <div className="flex items-center gap-4 px-4 py-2 border-b border-white/5 bg-[#202028]">
      <div className="flex items-center gap-2 text-white/50">
        <button 
          className="p-1 rounded disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10"
          onClick={goBackSafari}
          disabled={!canGoBack}
        >
          <ChevronLeft size={16} />
        </button>
        <button 
          className="p-1 rounded disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10"
          onClick={goForwardSafari}
          disabled={!canGoForward}
        >
          <ChevronRight size={16} />
        </button>
        <button 
          className="p-1 hover:bg-white/10 rounded"
          onClick={handleReload}
        >
          <RotateCw size={14} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 max-w-2xl mx-auto flex items-center bg-[#141418] rounded-md px-3 py-1.5 border border-white/10">
        <Shield size={14} className="text-white/40 mr-2" />
        <input 
          type="text" 
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="Search or enter website name"
          className="bg-transparent border-none outline-none w-full text-sm text-white/90 placeholder:text-white/30"
        />
      </form>

      <div className="flex items-center gap-2">
        <button className="p-1 hover:bg-white/10 rounded text-white/50" onClick={() => addSafariTab('')}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
        </button>
      </div>
    </div>
  )
}
