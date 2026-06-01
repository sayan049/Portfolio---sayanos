'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function HackSequence() {
  const [active, setActive] = useState(false)
  const [showDossier, setShowDossier] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const handleHack = () => {
      setActive(true)
      
      // Start matrix rain
      setTimeout(() => {
        initMatrix()
      }, 500)

      // Show dossier after 4 seconds
      setTimeout(() => {
        setShowDossier(true)
      }, 4000)
    }

    window.addEventListener('SYSTEM_HACK', handleHack)
    return () => window.removeEventListener('SYSTEM_HACK', handleHack)
  }, [])

  const initMatrix = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const chars = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const fontSize = 16
    const columns = canvas.width / fontSize
    const drops: number[] = []
    
    for(let x = 0; x < columns; x++) {
      drops[x] = 1
    }

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      ctx.fillStyle = '#0F0'
      ctx.font = fontSize + 'px monospace'
      
      for(let i = 0; i < drops.length; i++) {
        const text = chars.charAt(Math.floor(Math.random() * chars.length))
        ctx.fillText(text, i * fontSize, drops[i] * fontSize)
        
        if(drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i]++
      }
    }

    const interval = setInterval(draw, 33)
    return () => clearInterval(interval)
  }

  const handleClose = () => {
    setActive(false)
    setShowDossier(false)
  }

  if (!active) return null

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-auto">
      {/* Glitch Overlay */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black"
      >
        <canvas ref={canvasRef} className="absolute inset-0" />
      </motion.div>

      <AnimatePresence>
        {showDossier && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: 'spring', damping: 15 }}
            className="absolute inset-0 flex items-center justify-center p-4"
          >
            <div className="max-w-2xl w-full bg-black/90 border border-green-500 shadow-[0_0_50px_rgba(0,255,0,0.2)] rounded-lg overflow-hidden backdrop-blur-xl">
              <div className="bg-green-500/20 px-4 py-2 border-b border-green-500/50 flex justify-between items-center">
                <span className="text-green-500 font-mono font-bold uppercase tracking-widest text-sm">Top Secret Dossier</span>
                <button onClick={handleClose} className="text-green-500 hover:text-white hover:bg-red-500 px-2 rounded font-mono">
                  [X] ABORT
                </button>
              </div>
              <div className="p-8 font-mono text-green-400 space-y-4">
                <h1 className="text-3xl font-black text-white mb-6 uppercase tracking-tighter">Why Sayan Patra?</h1>
                
                <div className="space-y-4">
                  <p>{'>'} SYSTEM SCAN COMPLETE.</p>
                  <p>{'>'} MATCH FOUND: HIGHLY SKILLED ENGINEER.</p>
                  
                  <div className="pl-4 border-l-2 border-green-500/50 space-y-2 mt-4 text-sm">
                    <p>1. Built this entire OS portfolio from scratch using Next.js.</p>
                    <p>2. Master of React, Framer Motion, and GSAP.</p>
                    <p>3. Excellent problem solver with a deep understanding of architecture.</p>
                    <p>4. Fun to work with, highly creative, and driven by passion.</p>
                  </div>

                  <p className="mt-8 animate-pulse text-white">{'>'} ACTION REQUIRED: INITIATE JOB OFFER PROTOCOL.</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        body {
          animation: ${active ? 'glitch-skew 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) both infinite' : 'none'};
        }
        @keyframes glitch-skew {
          0% { transform: skew(0deg); }
          20% { transform: skew(-5deg); }
          40% { transform: skew(5deg); }
          60% { transform: skew(-2deg); }
          80% { transform: skew(2deg); }
          100% { transform: skew(0deg); }
        }
      `}</style>
    </div>
  )
}
