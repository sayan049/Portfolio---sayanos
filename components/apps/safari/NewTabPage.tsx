import { useOSStore } from '@/stores/os.store'
import { Plus } from 'lucide-react'

/* eslint-disable @next/next/no-img-element */

export function NewTabPage() {
  const hour = new Date().getHours()
  let greeting = 'Good evening'
  if (hour < 12) greeting = 'Good morning'
  else if (hour < 17) greeting = 'Good afternoon'

  const favorites = [
    { name: 'GitHub', url: 'https://github.com/sayan049', icon: 'https://github.githubassets.com/favicons/favicon.png' },
    { name: 'LinkedIn', url: 'https://linkedin.com/in/sayan-patra-426833193', icon: 'https://static.licdn.com/aero-v1/sc/h/al2o9zrvru7aqj8e1x2rzsrca' },
    { name: 'Curalink', url: 'https://curalink-2-0.vercel.app', icon: 'https://curalink-2-0.vercel.app/favicon.ico' },
    { name: 'Messmate', url: 'https://messmate.co.in', icon: 'https://messmate.co.in/favicon.ico' },
  ]

  const handleNavigate = (url: string) => {
    const state = useOSStore.getState()
    state.setSafariUrl(url)
    const updatedTabs = state.safariTabs.map(t => 
      t.id === state.activeSafariTabId ? { ...t, url, title: url } : t
    )
    useOSStore.setState({ safariTabs: updatedTabs })
  }

  return (
    <div className="w-full h-full bg-[#1A1A21] flex flex-col items-center pt-24 overflow-y-auto relative">
      <div className="absolute inset-0 noise-grain pointer-events-none" />
      
      <h1 className="text-3xl font-medium text-white/90 mb-12 relative z-10">
        {greeting}, Sayan
      </h1>

      <div className="w-full max-w-2xl px-8 relative z-10">
        <h2 className="text-lg font-medium text-white/60 mb-4 px-2">Favorites</h2>
        <div className="grid grid-cols-4 gap-4">
          {favorites.map((fav, i) => (
            <button
              key={i}
              onClick={() => handleNavigate(fav.url)}
              className="flex flex-col items-center gap-3 p-4 rounded-xl hover:bg-white/5 transition-colors group"
            >
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform shadow-lg border border-white/10 overflow-hidden">
                <img src={fav.icon} alt="" className="w-8 h-8 object-contain" onError={(e) => e.currentTarget.style.display = 'none'} />
              </div>
              <span className="text-sm text-white/70 group-hover:text-white/90">{fav.name}</span>
            </button>
          ))}
          <button className="flex flex-col items-center gap-3 p-4 rounded-xl hover:bg-white/5 transition-colors group">
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform border border-white/10 border-dashed">
              <Plus className="text-white/30" />
            </div>
            <span className="text-sm text-white/50">Add</span>
          </button>
        </div>
      </div>
    </div>
  )
}
