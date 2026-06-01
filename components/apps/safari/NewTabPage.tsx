// import { useOSStore } from '@/stores/os.store'
// import { Plus } from 'lucide-react'

// /* eslint-disable @next/next/no-img-element */

// export function NewTabPage() {
//   const hour = new Date().getHours()
//   let greeting = 'Good evening'
//   if (hour < 12) greeting = 'Good morning'
//   else if (hour < 17) greeting = 'Good afternoon'

//   const favorites = [
//     { name: 'GitHub', url: 'https://github.com/sayan049', icon: 'https://github.githubassets.com/favicons/favicon.png' },
//     { name: 'LinkedIn', url: 'https://linkedin.com/in/sayan-patra-426833193', icon: 'https://static.licdn.com/aero-v1/sc/h/al2o9zrvru7aqj8e1x2rzsrca' },
//     { name: 'Curalink', url: 'https://curalink-2-0.vercel.app', icon: 'https://curalink-2-0.vercel.app/favicon.ico' },
//     { name: 'Messmate', url: 'https://messmate.co.in', icon: 'https://messmate.co.in/favicon.ico' },
//   ]

//   const handleNavigate = (url: string) => {
//     const state = useOSStore.getState()
//     state.setSafariUrl(url)
//     const updatedTabs = state.safariTabs.map(t => 
//       t.id === state.activeSafariTabId ? { ...t, url, title: url } : t
//     )
//     useOSStore.setState({ safariTabs: updatedTabs })
//   }

//   return (
//     <div className="w-full h-full bg-[#1A1A21] flex flex-col items-center pt-24 overflow-y-auto relative">
//       <div className="absolute inset-0 noise-grain pointer-events-none" />

//       <h1 className="text-3xl font-medium text-white/90 mb-12 relative z-10">
//         {greeting}, Sayan
//       </h1>

//       <div className="w-full max-w-2xl px-8 relative z-10">
//         <h2 className="text-lg font-medium text-white/60 mb-4 px-2">Favorites</h2>
//         <div className="grid grid-cols-4 gap-4">
//           {favorites.map((fav, i) => (
//             <button
//               key={i}
//               onClick={() => handleNavigate(fav.url)}
//               className="flex flex-col items-center gap-3 p-4 rounded-xl hover:bg-white/5 transition-colors group"
//             >
//               <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform shadow-lg border border-white/10 overflow-hidden">
//                 <img src={fav.icon} alt="" className="w-8 h-8 object-contain" onError={(e) => e.currentTarget.style.display = 'none'} />
//               </div>
//               <span className="text-sm text-white/70 group-hover:text-white/90">{fav.name}</span>
//             </button>
//           ))}
//           <button className="flex flex-col items-center gap-3 p-4 rounded-xl hover:bg-white/5 transition-colors group">
//             <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform border border-white/10 border-dashed">
//               <Plus className="text-white/30" />
//             </div>
//             <span className="text-sm text-white/50">Add</span>
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }
import { useState } from 'react'
import { useOSStore, resolveInput } from '@/stores/os.store'
import { Search, Plus } from 'lucide-react'

/* eslint-disable @next/next/no-img-element */

const FAVORITES = [
  {
    name: 'GitHub',
    url: 'https://github.com/sayan049',
    icon: 'https://github.githubassets.com/favicons/favicon.png',
  },
  {
    name: 'LinkedIn',
    url: 'https://linkedin.com/in/sayan-patra-426833193',
    icon: 'https://static.licdn.com/aero-v1/sc/h/al2o9zrvru7aqj8e1x2rzsrca',
  },
  {
    name: 'Curalink',
    url: 'https://curalink-2-0.vercel.app',
    icon: 'https://curalink-2-0.vercel.app/favicon.ico',
  },
  {
    name: 'Messmate',
    url: 'https://messmate.co.in',
    icon: 'https://messmate.co.in/favicon.ico',
  },
]

export function NewTabPage() {
  const navigateSafariTab = useOSStore(s => s.navigateSafariTab)
  const [query, setQuery] = useState('')

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  const go = (raw: string) => {
    const { iframeUrl, displayUrl } = resolveInput(raw)
    if (iframeUrl) navigateSafariTab(iframeUrl, displayUrl)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) go(query)
  }

  return (
    <div className="w-full h-full bg-[#1A1A21] flex flex-col items-center pt-16 overflow-y-auto relative select-none">

      {/* Subtle noise overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.15]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Greeting */}
      <h1 className="text-3xl font-medium text-white/90 mb-8 relative z-10 tracking-tight">
        {greeting}, Sayan
      </h1>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="w-full max-w-lg px-8 mb-12 relative z-10">
        <div className="flex items-center bg-white/[0.06] border border-white/[0.12] rounded-2xl px-4 py-3 focus-within:border-[#4FC3F7]/50 transition-colors shadow-xl">
          <Search size={16} className="text-white/40 mr-3 flex-shrink-0" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search anything or enter a URL…"
            className="bg-transparent outline-none w-full text-sm text-white/90 placeholder:text-white/30"
            autoFocus
            spellCheck={false}
            autoComplete="off"
          />
        </div>
      </form>

      {/* Favorites grid */}
      <div className="w-full max-w-2xl px-8 relative z-10">
        <h2 className="text-[11px] font-semibold text-white/35 uppercase tracking-widest mb-4 px-1">
          Favorites
        </h2>
        <div className="grid grid-cols-4 gap-3">
          {FAVORITES.map((fav, i) => (
            <button
              key={i}
              onClick={() => go(fav.url)}
              className="flex flex-col items-center gap-2.5 p-4 rounded-2xl hover:bg-white/[0.06] active:scale-95 transition-all group"
            >
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg border border-white/10 overflow-hidden">
                <img
                  src={fav.icon}
                  alt={fav.name}
                  className="w-8 h-8 object-contain"
                  onError={e => { e.currentTarget.style.display = 'none' }}
                />
              </div>
              <span className="text-xs text-white/55 group-hover:text-white/85 transition-colors">
                {fav.name}
              </span>
            </button>
          ))}

          {/* Add button */}
          <button className="flex flex-col items-center gap-2.5 p-4 rounded-2xl hover:bg-white/[0.06] transition-all group">
            <div className="w-14 h-14 bg-white/[0.04] rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform border border-white/10 border-dashed">
              <Plus size={18} className="text-white/25" />
            </div>
            <span className="text-xs text-white/35">Add</span>
          </button>
        </div>
      </div>
    </div>
  )
}