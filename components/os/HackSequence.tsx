'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function HackSequence() {
  const [active, setActive] = useState(false)

  useEffect(() => {
    const handleHack = () => {
      setActive(true)
      
      // Auto-recover after 8 seconds
      setTimeout(() => {
        setActive(false)
      }, 8000)
    }

    window.addEventListener('SYSTEM_HACK', handleHack)
    return () => window.removeEventListener('SYSTEM_HACK', handleHack)
  }, [])

  if (!active) return null

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-auto overflow-hidden">
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          >
            {/* Melting screen bars */}
            <div className="absolute inset-0 flex flex-col melting-container">
              {Array.from({ length: 20 }).map((_, i) => (
                <div 
                  key={i} 
                  className="flex-1 bg-black/60 w-full glitch-bar"
                  style={{ 
                    animationDelay: `${Math.random() * 0.5}s`,
                    height: `${Math.random() * 10 + 2}%`
                  }} 
                />
              ))}
            </div>

            {/* Kernel Panic Overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none mix-blend-screen">
              <div className="text-red-500 font-mono text-center glitch-text">
                <h1 className="text-5xl md:text-8xl font-black mb-4 tracking-tighter uppercase">FATAL ERROR</h1>
                <p className="text-xl md:text-2xl opacity-80">KERNEL PANIC - NOT SYNCING</p>
                <p className="text-sm opacity-50 mt-2">VFS: Unable to mount root fs on unknown-block(0,0)</p>
              </div>
            </div>

            {/* Scanlines */}
            <div className="absolute inset-0 pointer-events-none bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAEklEQVQImWP4////fwYA4+PjA34N3wwAAAAASUVORK5CYII=')] opacity-20" />
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        body {
          animation: global-glitch 0.2s linear infinite;
        }
        .melting-container {
          filter: contrast(20) blur(2px);
          animation: melt-down 4s ease-in forwards;
        }
        .glitch-bar {
          animation: slide-glitch 0.1s linear infinite;
          transform-origin: left;
        }
        .glitch-text {
          animation: rgb-split 0.1s steps(2) infinite;
          text-shadow: 2px 0 blue, -2px 0 red;
        }
        @keyframes melt-down {
          0% { transform: translateY(0) scaleY(1); opacity: 1; }
          20% { transform: translateY(2%) scaleY(1.1); }
          50% { transform: translateY(10%) scaleY(1.5); filter: blur(5px); }
          100% { transform: translateY(100%) scaleY(3); filter: blur(10px); opacity: 0; }
        }
        @keyframes slide-glitch {
          0% { transform: translateX(-1%) skewX(10deg); }
          50% { transform: translateX(1%) skewX(-10deg); background-color: rgba(255,0,0,0.2); }
          100% { transform: translateX(-1%) skewX(10deg); }
        }
        @keyframes rgb-split {
          0% { text-shadow: 4px 0 #0ff, -4px 0 #f00; transform: translate(1px, 1px); }
          50% { text-shadow: -4px 0 #0ff, 4px 0 #f00; transform: translate(-1px, -1px); }
          100% { text-shadow: 4px 0 #0ff, -4px 0 #f00; transform: translate(1px, 1px); }
        }
        @keyframes global-glitch {
          0% { filter: hue-rotate(0deg) saturate(100%); }
          50% { filter: hue-rotate(90deg) saturate(200%); }
          100% { filter: hue-rotate(0deg) saturate(100%); }
        }
      `}</style>
    </div>
  )
}
