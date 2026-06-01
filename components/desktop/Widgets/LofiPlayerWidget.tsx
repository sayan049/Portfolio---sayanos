'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

export function LofiPlayerWidget() {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null)

  const togglePlay = () => {
    if (!audioRef.current) return
    
    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play()
      setIsPlaying(true)

      // Initialize Web Audio API on first play
      if (!audioCtxRef.current) {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
        const analyser = ctx.createAnalyser()
        const source = ctx.createMediaElementSource(audioRef.current)
        
        source.connect(analyser)
        analyser.connect(ctx.destination)
        
        analyser.fftSize = 64
        
        audioCtxRef.current = ctx
        analyserRef.current = analyser
        sourceRef.current = source
      }
    }
  }

  useEffect(() => {
    let animationId: number
    
    const draw = () => {
      animationId = requestAnimationFrame(draw)
      const canvas = canvasRef.current
      const analyser = analyserRef.current
      if (!canvas || !analyser) return

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const bufferLength = analyser.frequencyBinCount
      const dataArray = new Uint8Array(bufferLength)
      analyser.getByteFrequencyData(dataArray)

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      const barWidth = (canvas.width / bufferLength) * 2.5
      let x = 0

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height
        
        // Gradient color
        const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0)
        gradient.addColorStop(0, '#4fc3f7')
        gradient.addColorStop(1, '#ff0055')
        
        ctx.fillStyle = gradient
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight)
        
        x += barWidth + 2
      }
    }

    if (isPlaying) draw()
    
    return () => {
      if (animationId) cancelAnimationFrame(animationId)
    }
  }, [isPlaying])

  return (
    <motion.div 
      drag
      dragMomentum={false}
      className="absolute top-12 right-6 w-72 rounded-2xl overflow-hidden shadow-2xl cursor-grab active:cursor-grabbing border border-white/10"
      style={{
        background: 'rgba(20, 20, 30, 0.65)',
        backdropFilter: 'blur(40px) saturate(200%)',
        WebkitBackdropFilter: 'blur(40px) saturate(200%)',
      }}
    >
      {/* Invisible Audio Element */}
      {/* Using a reliable royalty-free lofi track from Pixabay for demo purposes */}
      <audio 
        ref={audioRef} 
        src="https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3" 
        loop
        crossOrigin="anonymous"
      />

      <div className="p-4 flex items-center gap-4">
        {/* Spinning Vinyl */}
        <div 
          className="w-16 h-16 rounded-full border-4 border-gray-900 flex items-center justify-center relative shadow-lg overflow-hidden shrink-0"
          style={{
            background: 'conic-gradient(from 0deg, #111, #333, #111, #333, #111)',
            animation: isPlaying ? 'spin 4s linear infinite' : 'none'
          }}
        >
          {/* Label */}
          <div className="w-6 h-6 rounded-full bg-[#ff0055] border-2 border-gray-900 z-10" />
          {/* Shine */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 pointer-events-none" />
        </div>

        {/* Info & Controls */}
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-bold truncate text-sm">Coding Beats</h3>
          <p className="text-[#4fc3f7] text-xs font-mono truncate mb-2">Lofi Hip Hop</p>
          
          <button 
            onClick={togglePlay}
            className="bg-white/10 hover:bg-white/20 text-white rounded-full px-4 py-1.5 text-xs font-bold tracking-widest transition-colors flex items-center gap-2"
          >
            {isPlaying ? (
              <>
                <div className="w-2 h-2 bg-[#ff0055] rounded-sm" /> PAUSE
              </>
            ) : (
              <>
                <div className="w-0 h-0 border-t-4 border-t-transparent border-l-6 border-l-[#00e676] border-b-4 border-b-transparent" /> PLAY
              </>
            )}
          </button>
        </div>
      </div>

      {/* Visualizer Canvas */}
      <div className="h-12 bg-black/20 w-full relative">
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 w-full h-full"
          width={288}
          height={48}
        />
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-[10px] text-white/30 font-mono tracking-widest">VISUALIZER OFF</span>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </motion.div>
  )
}
