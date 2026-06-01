'use client'

import { useEffect, useRef, useState } from 'react'
import Webcam from 'react-webcam'
import * as tf from '@tensorflow/tfjs'
import * as handpose from '@tensorflow-models/handpose'
import { useOSStore } from '@/stores/os.store'
import { Loader2 } from 'lucide-react'

export function VisionControl() {
  const webcamRef = useRef<Webcam>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  const [isLoaded, setIsLoaded] = useState(false)
  const [isActive, setIsActive] = useState(false)
  const [model, setModel] = useState<handpose.HandPose | null>(null)

  // Track the previous window position to calculate deltas
  const lastPos = useRef<{x: number, y: number} | null>(null)

  // Gesture debouncing
  const gestureFrames = useRef({
    rock: 0,
    fist: 0,
    peace: 0
  })

  useEffect(() => {
    async function loadModel() {
      await tf.ready()
      const loadedModel = await handpose.load()
      setModel(loadedModel)
      setIsLoaded(true)
    }
    loadModel()
  }, [])

  useEffect(() => {
    if (!isActive || !model) return

    let animationId: number

    const dist = (p1: number[], p2: number[]) => Math.sqrt(Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2))

    async function detect() {
      if (
        typeof webcamRef.current !== 'undefined' &&
        webcamRef.current !== null &&
        webcamRef.current.video?.readyState === 4
      ) {
        const video = webcamRef.current.video
        const videoWidth = video.videoWidth
        const videoHeight = video.videoHeight

        webcamRef.current.video.width = videoWidth
        webcamRef.current.video.height = videoHeight
        
        if (canvasRef.current) {
          canvasRef.current.width = videoWidth
          canvasRef.current.height = videoHeight
        }

        const hand = await model!.estimateHands(video)

        if (canvasRef.current) {
          const ctx = canvasRef.current.getContext('2d')
          if (ctx) {
            ctx.clearRect(0, 0, videoWidth, videoHeight)
            
            if (hand.length > 0) {
              const landmarks = hand[0].landmarks

              // Draw landmarks
              ctx.fillStyle = '#00f2fe'
              for (let i = 0; i < landmarks.length; i++) {
                const [x, y] = landmarks[i]
                ctx.beginPath()
                ctx.arc(x, y, 5, 0, 3 * Math.PI)
                ctx.fill()
              }

              const wrist = landmarks[0]
              
              // Finger Tips
              const thumbTip = landmarks[4]
              const indexTip = landmarks[8]
              const middleTip = landmarks[12]
              const ringTip = landmarks[16]
              const pinkyTip = landmarks[20]

              // Finger Bases (MCP)
              const thumbBase = landmarks[2]
              const indexBase = landmarks[5]
              const middleBase = landmarks[9]
              const ringBase = landmarks[13]
              const pinkyBase = landmarks[17]

              // Check extensions
              const isExtended = (tip: number[], base: number[]) => dist(tip, wrist) > dist(base, wrist) * 1.3
              
              const indexExt = isExtended(indexTip, indexBase)
              const middleExt = isExtended(middleTip, middleBase)
              const ringExt = isExtended(ringTip, ringBase)
              const pinkyExt = isExtended(pinkyTip, pinkyBase)

              // Grab (Fist) logic
              const isGrabbing = !indexExt && !middleExt && !ringExt && !pinkyExt

              // Highlight grab status around the knuckle
              ctx.beginPath()
              ctx.arc(indexBase[0], indexBase[1], 15, 0, 2 * Math.PI)
              ctx.strokeStyle = isGrabbing ? '#ff0055' : '#00f2fe'
              ctx.lineWidth = 2
              ctx.stroke()

              // Determine Gesture
              let gesture = 'none'
              
              if (!isGrabbing) {
                if (indexExt && !middleExt && !ringExt && pinkyExt) {
                  gesture = 'rock' // Maximize (Rock / Spiderman)
                } else if (indexExt && middleExt && !ringExt && !pinkyExt) {
                  gesture = 'peace' // Close (Peace)
                }
              }

              // Update counters
              gestureFrames.current.rock = gesture === 'rock' ? gestureFrames.current.rock + 1 : 0
              gestureFrames.current.peace = gesture === 'peace' ? gestureFrames.current.peace + 1 : 0

              const store = useOSStore.getState()
              const activeEntry = Object.entries(store.windows).find(([_, w]) => w.isFocused && !w.isMinimized)
              
              if (activeEntry) {
                const [appId, win] = activeEntry

                // Dragging Logic
                if (isGrabbing) {
                  const targetX = (window.innerWidth / videoWidth) * indexBase[0]
                  const targetY = (window.innerHeight / videoHeight) * indexBase[1]

                  if (lastPos.current) {
                    // LERP (Linear Interpolation) for buttery smooth window dragging
                    const smoothX = lastPos.current.x + (targetX - lastPos.current.x) * 0.4
                    const smoothY = lastPos.current.y + (targetY - lastPos.current.y) * 0.4

                    const dx = smoothX - lastPos.current.x
                    const dy = smoothY - lastPos.current.y
                    
                    if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
                      store.moveWindow(appId as any, {
                        x: win.position.x - dx, // inverted X because webcam is mirrored
                        y: win.position.y + dy
                      })
                      lastPos.current = { x: smoothX, y: smoothY }
                    }
                  } else {
                    lastPos.current = { x: targetX, y: targetY }
                  }
                } else {
                  lastPos.current = null
                }

                // Trigger Gestures (Reduced from 20 to 10 for faster response)
                if (gestureFrames.current.rock === 10) {
                  store.toggleMaximizeApp(appId as any)
                  gestureFrames.current.rock = 0 // reset
                }

                if (gestureFrames.current.peace === 10) {
                  store.closeApp(appId as any)
                  gestureFrames.current.peace = 0 // reset
                }
              }

              // Draw Current Gesture Text
              ctx.fillStyle = '#ff0055'
              ctx.font = '24px monospace'
              ctx.fillText(`Gesture: ${gesture}`, 10, 30)

            } else {
              lastPos.current = null
            }
          }
        }
      }
      animationId = setTimeout(detect, 50) as any
    }

    detect()

    return () => clearTimeout(animationId)
  }, [isActive, model])

  return (
    <div className="flex flex-col h-full bg-[#111] text-white overflow-hidden font-mono">
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#1a1a1a]">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span className="text-[#00f2fe]">AI</span> Vision Control
          </h2>
          <p className="text-xs text-white/50 mt-1">Minority Report Style Window Dragging</p>
        </div>
        <button
          disabled={!isLoaded}
          onClick={() => setIsActive(!isActive)}
          className={`px-4 py-2 rounded font-bold transition-all flex items-center gap-2 ${
            !isLoaded ? 'bg-white/10 text-white/40' :
            isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-[#00f2fe] text-black hover:bg-[#4facfe]'
          }`}
        >
          {!isLoaded ? (
            <><Loader2 size={16} className="animate-spin" /> Loading AI Model...</>
          ) : isActive ? 'Stop Tracking' : 'Start Tracking'}
        </button>
      </div>

      <div className="flex-1 relative flex flex-col items-center justify-center p-4">
        {!isActive && isLoaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 z-10 bg-[#111]">
            <div className="w-24 h-24 mb-6 text-white/20">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"/><path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2"/><path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/></svg>
            </div>
            <h3 className="text-2xl font-bold mb-2">Air Gestures (Active Window)</h3>
            <div className="text-left bg-white/5 p-4 rounded-xl border border-white/10 inline-block">
              <p className="text-white/80 mb-2">✊ <strong>Closed Fist & Move:</strong> Drag Window</p>
              <p className="text-white/80 mb-2">🤘 <strong>Rock On (Hold):</strong> Full Screen</p>
              <p className="text-white/80">✌️ <strong>Peace Sign (Hold):</strong> Close App</p>
            </div>
            <p className="mt-6 text-[#00f2fe] animate-pulse">Click Start Tracking to begin.</p>
          </div>
        )}

        {isActive && (
          <div className="relative w-full max-w-[800px] aspect-video bg-black rounded-lg overflow-hidden border border-white/20 shadow-[0_0_30px_rgba(0,242,254,0.1)]">
            <Webcam
              ref={webcamRef}
              videoConstraints={{
                width: 640,
                height: 480,
                facingMode: "user"
              }}
              className="absolute inset-0 w-full h-full object-cover transform -scale-x-100 opacity-50"
            />
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full object-cover transform -scale-x-100"
            />
          </div>
        )}
      </div>
    </div>
  )
}
