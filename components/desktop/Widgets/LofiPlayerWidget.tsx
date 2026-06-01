'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Music, X } from 'lucide-react'

export function LofiPlayerWidget() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTrackId, setActiveTrackId] = useState<string | null>(null)

  const searchSpotify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    setLoading(true)
    try {
      const res = await fetch(`/api/spotify?q=${encodeURIComponent(query)}`)
      const data = await res.json()
      if (data.tracks?.items) {
        setResults(data.tracks.items)
      } else if (data.error) {
        alert("Spotify API Error: " + data.error + "\\nMake sure you added SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET to .env.local")
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div 
      drag
      dragMomentum={false}
      className="absolute top-16 left-6 w-80 rounded-2xl overflow-hidden shadow-2xl cursor-grab active:cursor-grabbing border border-white/10 flex flex-col"
      style={{
        background: 'rgba(20, 20, 30, 0.85)',
        backdropFilter: 'blur(40px) saturate(200%)',
        WebkitBackdropFilter: 'blur(40px) saturate(200%)',
        maxHeight: '400px'
      }}
    >
      {/* Header & Search */}
      <div className="p-4 border-b border-white/10 bg-black/20">
        <div className="flex items-center gap-2 mb-3">
          <Music size={16} className="text-[#1DB954]" />
          <h3 className="text-white font-bold text-sm tracking-wide pointer-events-none">Spotify Player</h3>
        </div>
        <form onSubmit={searchSpotify} className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onPointerDown={(e) => e.stopPropagation()} // Allow clicking/typing without dragging
            placeholder="Search songs..."
            className="w-full bg-white/10 border border-white/10 rounded-full py-1.5 pl-8 pr-4 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#1DB954]/50 transition-colors"
          />
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
        </form>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto min-h-[160px] custom-scrollbar" onPointerDown={(e) => e.stopPropagation()}>
        {activeTrackId ? (
          <div className="relative w-full h-full bg-black/50 p-2">
            <button 
              onClick={() => setActiveTrackId(null)}
              className="absolute -top-2 -right-2 z-10 bg-[#1A1A21] p-1.5 border border-white/10 rounded-full text-white/60 hover:text-white hover:bg-black transition-colors"
            >
              <X size={14} />
            </button>
            <iframe 
              src={`https://open.spotify.com/embed/track/${activeTrackId}?utm_source=generator&theme=0`} 
              width="100%" 
              height="152" 
              frameBorder="0" 
              allowFullScreen 
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
              loading="lazy"
              className="rounded-lg shadow-lg"
            />
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {loading && <p className="text-xs text-center text-white/50 py-4 animate-pulse">Searching...</p>}
            {!loading && results.length === 0 && (
              <p className="text-xs text-center text-white/30 py-6 font-mono">Search for a track to play</p>
            )}
            {results.map(track => (
              <button
                key={track.id}
                onClick={() => setActiveTrackId(track.id)}
                className="w-full text-left flex items-center gap-3 p-2 hover:bg-white/10 rounded-lg transition-colors group"
              >
                <img src={track.album.images[2]?.url || track.album.images[0]?.url} alt="" className="w-10 h-10 rounded shadow-md group-hover:scale-105 transition-transform" />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-semibold truncate">{track.name}</p>
                  <p className="text-white/50 text-xs truncate">{track.artists.map((a: any) => a.name).join(', ')}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}
