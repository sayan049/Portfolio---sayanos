'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { useOSStore } from '@/stores/os.store'

// Unsplash: "a close-up of a cell phone with a black background" by the user's choice
// Direct CDN URL from unsplash photo 7stSlxNAmfc
const WALLPAPER_URL =
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2560&auto=format&fit=crop'

export function Wallpaper() {
  const ref = useRef<HTMLDivElement>(null)
  const initWallpaper = useOSStore(s => s.initWallpaper)
  const customWallpaper = useOSStore(s => s.customWallpaper)

  useEffect(() => {
    initWallpaper()
    gsap.fromTo(ref.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.8, ease: 'power2.out' }
    )
  }, [initWallpaper])

  return (
    <div
      ref={ref}
      className="fixed inset-0 pointer-events-none"
      style={{ opacity: 0, zIndex: 0 }}
    >
      {/* Main wallpaper image */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url("${customWallpaper || WALLPAPER_URL}")`,
          backgroundSize:     'cover',
          backgroundPosition: 'center',
        }}
      />
      {/* Very subtle dark overlay for text readability */}
      <div
        className="absolute inset-0"
        style={{
          background: 'rgba(0,0,0,0.1)',
        }}
      />
    </div>
  )
}