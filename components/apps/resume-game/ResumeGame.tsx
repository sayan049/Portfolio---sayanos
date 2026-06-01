'use client'

import { useEffect, useRef, useState } from 'react'

export function ResumeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [message, setMessage] = useState('Press SPACE to Jump!')

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    let isRunning = true

    const player = {
      x: 100, y: 300, width: 30, height: 30,
      dy: 0, gravity: 0.8, jumpForce: -14, isJumping: false,
      color: '#00f2fe'
    }

    const obstacles: any[] = []
    const coins: any[] = []
    const particles: any[] = []
    
    let frameCount = 0
    let bgOffset = 0

    const TIMELINE_MESSAGES = [
      "Mastered Java & OOP!",
      "Built Full-Stack E-commerce!",
      "Launched Messmate to Production!",
      "Integrated AI & RAG Pipelines!",
      "Learned 3D & GSAP Animations!",
      "Sayan is ready to be hired!"
    ]

    function createExplosion(x: number, y: number, color: string) {
      for (let i = 0; i < 20; i++) {
        particles.push({
          x, y,
          vx: (Math.random() - 0.5) * 10,
          vy: (Math.random() - 0.5) * 10,
          life: 1,
          color
        })
      }
    }

    function spawnObstacle() {
      obstacles.push({
        x: canvas!.width,
        y: canvas!.height - 30 - 40,
        width: 30,
        height: 40 + Math.random() * 40,
        speed: 6 + (score * 0.2)
      })
    }

    function spawnCoin() {
      coins.push({
        x: canvas!.width + 100,
        y: canvas!.height - 150 - Math.random() * 100,
        width: 20, height: 20, speed: 6 + (score * 0.2),
        collected: false
      })
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.code === 'Space') {
        e.preventDefault()
        if (gameOver) {
          setGameOver(false)
          setScore(0)
          setMessage('Press SPACE to Jump!')
          player.y = 300
          player.dy = 0
          obstacles.length = 0
          coins.length = 0
          particles.length = 0
          frameCount = 0
          isRunning = true
          loop()
        } else if (!player.isJumping) {
          player.dy = player.jumpForce
          player.isJumping = true
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)

    function loop() {
      if (!isRunning) return
      
      // Cyberpunk Parallax Background
      ctx!.fillStyle = '#0a0a12'
      ctx!.fillRect(0, 0, canvas!.width, canvas!.height)

      // Draw Grid
      ctx!.save()
      ctx!.strokeStyle = 'rgba(0, 242, 254, 0.1)'
      ctx!.lineWidth = 1
      bgOffset = (bgOffset - 2) % 40
      for (let i = 0; i < canvas!.width; i += 40) {
        ctx!.beginPath()
        ctx!.moveTo(i + bgOffset, 0)
        ctx!.lineTo(i + bgOffset, canvas!.height)
        ctx!.stroke()
      }
      ctx!.restore()

      // Draw floor
      ctx!.fillStyle = '#111'
      ctx!.fillRect(0, canvas!.height - 30, canvas!.width, 30)
      ctx!.shadowBlur = 20
      ctx!.shadowColor = '#00f2fe'
      ctx!.fillStyle = '#00f2fe'
      ctx!.fillRect(0, canvas!.height - 30, canvas!.width, 2)
      ctx!.shadowBlur = 0

      // Player physics
      player.dy += player.gravity
      player.y += player.dy

      if (player.y + player.height >= canvas!.height - 30) {
        player.y = canvas!.height - 30 - player.height
        player.dy = 0
        player.isJumping = false
      }

      // Draw Player Trail
      if (player.isJumping) {
        particles.push({
          x: player.x + player.width/2,
          y: player.y + player.height,
          vx: -2, vy: 0, life: 0.5, color: 'rgba(0, 242, 254, 0.5)'
        })
      }

      // Draw Player
      ctx!.shadowBlur = 15
      ctx!.shadowColor = player.color
      ctx!.fillStyle = player.color
      ctx!.fillRect(player.x, player.y, player.width, player.height)
      ctx!.shadowBlur = 0

      // Spawning
      frameCount++
      if (frameCount % 90 === 0) spawnObstacle()
      if (frameCount % 130 === 0) spawnCoin()

      // Update & Draw Obstacles
      ctx!.shadowBlur = 20
      ctx!.shadowColor = '#ff0055'
      ctx!.fillStyle = '#ff0055'
      for (let i = 0; i < obstacles.length; i++) {
        let obs = obstacles[i]
        obs.x -= obs.speed
        ctx!.fillRect(obs.x, obs.y, obs.width, obs.height)

        if (
          player.x < obs.x + obs.width &&
          player.x + player.width > obs.x &&
          player.y < obs.y + obs.height &&
          player.y + player.height > obs.y
        ) {
          isRunning = false
          createExplosion(player.x, player.y, '#ff0055')
          setGameOver(true)
          setMessage('CRITICAL BUG DETECTED!')
        }
      }
      ctx!.shadowBlur = 0

      // Update & Draw Coins
      for (let i = 0; i < coins.length; i++) {
        let coin = coins[i]
        if (!coin.collected) {
          coin.x -= coin.speed
          
          ctx!.shadowBlur = 15
          ctx!.shadowColor = '#ffd700'
          ctx!.fillStyle = '#ffd700'
          ctx!.beginPath()
          ctx!.arc(coin.x + 10, coin.y + 10, 10, 0, Math.PI * 2)
          ctx!.fill()
          ctx!.shadowBlur = 0

          // Collection
          if (
            player.x < coin.x + coin.width &&
            player.x + player.width > coin.x &&
            player.y < coin.y + coin.height &&
            player.y + player.height > coin.y
          ) {
            coin.collected = true
            createExplosion(coin.x, coin.y, '#ffd700')
            const newScore = score + 1
            setScore(newScore)
            if (newScore <= TIMELINE_MESSAGES.length) {
              setMessage(TIMELINE_MESSAGES[newScore - 1])
            } else {
              setMessage("Over-engineered Excellence!")
            }
          }
        }
      }

      // Draw Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        let p = particles[i]
        p.x += p.vx
        p.y += p.vy
        p.life -= 0.05
        if (p.life <= 0) {
          particles.splice(i, 1)
        } else {
          ctx!.globalAlpha = p.life
          ctx!.fillStyle = p.color
          ctx!.fillRect(p.x, p.y, 4, 4)
          ctx!.globalAlpha = 1
        }
      }

      // Cleanup offscreen
      if (obstacles.length > 5) obstacles.shift()
      if (coins.length > 5) coins.shift()

      animationId = requestAnimationFrame(loop)
    }

    loop()

    return () => {
      isRunning = false
      cancelAnimationFrame(animationId)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [gameOver, score])

  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-[#050505] text-white p-4 font-mono select-none">
      <div className="mb-4 flex justify-between w-[800px] items-end">
        <div>
          <h2 className="text-3xl font-black italic tracking-tighter text-[#00f2fe] drop-shadow-[0_0_10px_rgba(0,242,254,0.5)]">CAREER.RUN //</h2>
          <p className="text-sm text-[#ffd700] drop-shadow-[0_0_5px_rgba(255,215,0,0.5)] font-bold">{message}</p>
        </div>
        <div className="text-2xl font-black text-white bg-white/10 px-4 py-1 rounded">XP <span className="text-[#00f2fe]">{score}</span></div>
      </div>
      
      <div className={`relative border border-white/20 rounded-xl overflow-hidden shadow-[0_0_50px_rgba(0,242,254,0.1)] ${gameOver ? 'animate-pulse' : ''}`}>
        <canvas 
          ref={canvasRef} 
          width={800} 
          height={400} 
          className={`bg-[#0a0a12] cursor-pointer ${gameOver ? 'sepia hue-rotate-180 contrast-200' : ''}`}
          onClick={() => {
            const spaceEvent = new KeyboardEvent('keydown', { code: 'Space' })
            window.dispatchEvent(spaceEvent)
          }}
        />
        {gameOver && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center border-4 border-[#ff0055] z-10">
            <h3 className="text-6xl font-black text-[#ff0055] mb-2 drop-shadow-[0_0_20px_rgba(255,0,85,0.8)] tracking-widest uppercase" style={{ textShadow: '2px 0 blue, -2px 0 red' }}>CRASHED</h3>
            <p className="text-white mb-8 text-xl font-bold bg-black/50 px-4 py-2">Total XP: <span className="text-[#00f2fe]">{score}</span></p>
            <button 
              className="px-8 py-3 bg-[#ff0055] text-white font-black uppercase tracking-widest hover:bg-white hover:text-[#ff0055] transition-all transform hover:scale-110 shadow-[0_0_20px_rgba(255,0,85,0.5)]"
              onClick={() => {
                const spaceEvent = new KeyboardEvent('keydown', { code: 'Space' })
                window.dispatchEvent(spaceEvent)
              }}
            >
              REBOOT_SYSTEM
            </button>
          </div>
        )}
      </div>
      
      <p className="mt-6 text-white/40 text-sm font-semibold tracking-widest uppercase flex items-center gap-4">
        <span className="px-2 py-1 bg-white/10 rounded">SPACE</span> TO JUMP
      </p>
    </div>
  )
}
