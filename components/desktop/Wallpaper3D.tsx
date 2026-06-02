'use client'

import React, { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import * as THREE from 'three'
import { useOSStore } from '@/stores/os.store'

const PARTICLE_COUNT = 15000

function MorphingParticles({ progress }: { progress: any }) {
  const pointsRef = useRef<THREE.Points>(null)
  
  // Track global mouse because canvas might be covered by desktop UI layers
  const globalMouse = useRef({ x: 0, y: 0 })
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      globalMouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
      globalMouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // We need to keep track of current positions and velocities
  const [isReady, setIsReady] = useState(false)
  
  const { positions, velocities, prm } = useMemo(() => {
    if (typeof window === 'undefined') return { positions: null, velocities: null, prm: null }

    const pos = new Float32Array(PARTICLE_COUNT * 3)
    const vel = new Float32Array(PARTICLE_COUNT * 3)
    
    const textCoords = new Float32Array(PARTICLE_COUNT * 3)
    const waveXZ = new Float32Array(PARTICLE_COUNT * 2)
    const lineX = new Float32Array(PARTICLE_COUNT)
    const bhPolar = new Float32Array(PARTICLE_COUNT * 3)
    const laptopCoords = new Float32Array(PARTICLE_COUNT * 3)

    // --- 1. Text Generation ---
    const canvas = document.createElement('canvas')
    canvas.width = 800
    canvas.height = 200
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.fillStyle = 'black'
      ctx.fillRect(0, 0, 800, 200)
      ctx.fillStyle = 'white'
      // Use futuristic font, slightly smaller
      ctx.font = '900 90px "Oxanium", sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('SAYANOS', 400, 100)
      const imgData = ctx.getImageData(0, 0, 800, 200).data
      const validPixels = []
      for (let y = 0; y < 200; y+=2) {
        for (let x = 0; x < 800; x+=2) {
          const idx = (y * 800 + x) * 4
          if (imgData[idx] > 128) {
            // Smaller spread multiplier (0.04 instead of 0.05)
            validPixels.push({ x: (x - 400) * 0.04, y: -(y - 100) * 0.04 })
          }
        }
      }
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const p = validPixels[i % validPixels.length]
        const idx = i * 3
        textCoords[idx] = p.x + (Math.random() - 0.5) * 0.1
        textCoords[idx+1] = p.y + (Math.random() - 0.5) * 0.1
        textCoords[idx+2] = (Math.random() - 0.5) * 0.5
        
        pos[idx] = textCoords[idx]
        pos[idx+1] = textCoords[idx+1]
        pos[idx+2] = textCoords[idx+2]
      }
    }

    // --- 2. Wave Grid ---
    const gridCols = Math.ceil(Math.sqrt(PARTICLE_COUNT * 2))
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const col = i % gridCols
      const row = Math.floor(i / gridCols)
      waveXZ[i * 2] = (col / gridCols - 0.5) * 40
      waveXZ[i * 2 + 1] = (row / gridCols - 0.5) * 40
    }

    // --- 3. Line Flow (Wide beam) ---
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      lineX[i] = (Math.random() - 0.5) * 120 // Spread across huge X
    }

    // --- 4. Blackhole (Prominent Spiral Galaxy) ---
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const idx = i * 3
      const r = Math.pow(Math.random(), 1.5) * 25 // extended radius
      const arms = 3
      const armOffset = Math.floor(Math.random() * arms) * (Math.PI * 2 / arms)
      const theta = r * 0.6 + armOffset + (Math.random() - 0.5) * 0.4 // spiral
      const yOffset = (Math.random() - 0.5) * (6 / (r + 0.2)) // dense center vertical
      bhPolar[idx] = r
      bhPolar[idx+1] = theta
      bhPolar[idx+2] = yOffset
    }

    // --- 5. DNA Double Helix (Custom Shape) ---
    const generateDNAPoints = () => {
      const points = []
      const length = 40
      const radius = 5
      const turns = 3
      
      for (let i=0; i<3000; i++) {
        const t = (i / 3000) * length - length / 2
        const angle = t * turns * 0.3
        
        // Strand 1
        points.push({ x: Math.cos(angle) * radius, y: t, z: Math.sin(angle) * radius })
        // Strand 2
        points.push({ x: Math.cos(angle + Math.PI) * radius, y: t, z: Math.sin(angle + Math.PI) * radius })
        
        // Base pairs
        if (i % 40 === 0) {
          for(let j=0; j<=15; j++) {
            const bt = j/15
            points.push({
              x: Math.cos(angle) * radius * bt + Math.cos(angle + Math.PI) * radius * (1 - bt),
              y: t,
              z: Math.sin(angle) * radius * bt + Math.sin(angle + Math.PI) * radius * (1 - bt)
            })
          }
        }
      }
      return points
    }
    
    const dnaPoints = generateDNAPoints()
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = dnaPoints[i % dnaPoints.length]
      const idx = i * 3
      laptopCoords[idx] = p.x + (Math.random() - 0.5) * 0.2
      laptopCoords[idx+1] = p.y + (Math.random() - 0.5) * 0.2
      laptopCoords[idx+2] = p.z + (Math.random() - 0.5) * 0.2
    }

    return { positions: pos, velocities: vel, prm: { textCoords, waveXZ, lineX, bhPolar, laptopCoords } }
  }, [])

  useEffect(() => {
    if (positions) setIsReady(true)
  }, [positions])

  const { pointer } = useThree()

  useFrame((state) => {
    if (!pointsRef.current || !isReady || !positions || !prm || !velocities) return
    const posAttribute = pointsRef.current.geometry.attributes.position
    
    const time = state.clock.elapsedTime
    const p = Math.max(0, Math.min(4, progress.get()))
    const stage = Math.floor(p)
    let t = p % 1
    // Smooth easing for transition
    const easeT = t * t * (3 - 2 * t)

    // Smoothly apply mesh rotations based on stage interpolation
    let rotX = 0;
    let rotY = 0;
    let rotZ = 0;

    if (p >= 2 && p < 3) {
      // Morphing from Line (2) to Blackhole (3)
      const t = p - 2;
      const smooth = t * t * (3 - 2 * t);
      rotX = (Math.PI / 3) * smooth;
      rotY = (time * 0.1) * smooth;
    } else if (p >= 3 && p < 4) {
      // Morphing from Blackhole (3) to DNA (4)
      const t = p - 3;
      const smooth = t * t * (3 - 2 * t);
      rotX = (Math.PI / 3) * (1 - smooth) + (Math.PI / 8) * smooth;
      rotY = (time * 0.1) * (1 - smooth) + (time * 0.2) * smooth;
      rotZ = (time * 0.1) * smooth;
    } else if (p >= 4) {
      rotX = Math.PI / 8;
      rotY = time * 0.2;
      rotZ = time * 0.1;
    }

    pointsRef.current.rotation.x = rotX;
    pointsRef.current.rotation.y = rotY;
    pointsRef.current.rotation.z = rotZ;

    // Mouse position mapped to 3D space using global mouse
    const mouseX = (globalMouse.current.x * state.viewport.width) / 2
    const mouseY = (globalMouse.current.y * state.viewport.height) / 2
    
    const mouseVector = new THREE.Vector3(mouseX, mouseY, 0)
    mouseVector.applyEuler(new THREE.Euler(-pointsRef.current.rotation.x, -pointsRef.current.rotation.y, 0))

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const idx = i * 3
      
      // Calculate LIVE targets for each shape
      // 1. Text
      const textX = prm.textCoords[idx]
      const textY = prm.textCoords[idx+1] + Math.sin(time * 2 + textX) * 0.1
      const textZ = prm.textCoords[idx+2] + Math.sin(time * 3 + textY) * 0.2

      // 2. Wave
      const wX = prm.waveXZ[i*2]
      const wZ = prm.waveXZ[i*2+1]
      const wY = Math.sin(wX * 0.5 + time * 2) * 2 + Math.cos(wZ * 0.5 + time * 1.5) * 2

      // 3. Line Flow (Horizontal thick beam)
      let lX = (prm.lineX[i] + time * 30) % 120
      if (lX < 0) lX += 120
      lX -= 60
      const lY = (Math.random() - 0.5) * 2 // spread height slightly
      const lZ = Math.cos(lX * 0.2 + time * 5) * 1.5 // gentle organic curve

      // 4. Blackhole
      const bhRBase = prm.bhPolar[idx]
      let bhR = bhRBase - (time * 3) % 25 // move inward faster
      if (bhR < 0) bhR += 25
      const bhTheta = prm.bhPolar[idx+1] + time * (8 / (bhR + 0.1))
      const bhX = bhR * Math.cos(bhTheta)
      const bhZ = bhR * Math.sin(bhTheta)
      const bhY = prm.bhPolar[idx+2] * Math.sin(time * 2 + bhR) // pulsing thickness

      // 5. DNA Double Helix
      const lpX = prm.laptopCoords[idx]
      const lpY = prm.laptopCoords[idx+1]
      const lpZ = prm.laptopCoords[idx+2]

      // Select targets to interpolate
      let t1X, t1Y, t1Z, t2X, t2Y, t2Z

      if (stage === 0) {
        t1X = textX; t1Y = textY; t1Z = textZ;
        t2X = wX; t2Y = wY; t2Z = wZ;
      } else if (stage === 1) {
        t1X = wX; t1Y = wY; t1Z = wZ;
        t2X = lX; t2Y = lY; t2Z = lZ;
      } else if (stage === 2) {
        t1X = lX; t1Y = lY; t1Z = lZ;
        t2X = bhX; t2Y = bhY; t2Z = bhZ;
      } else if (stage === 3) {
        t1X = bhX; t1Y = bhY; t1Z = bhZ;
        t2X = lpX; t2Y = lpY; t2Z = lpZ; 
      } else {
        // stage === 4
        t1X = lpX; t1Y = lpY; t1Z = lpZ;
        t2X = lpX; t2Y = lpY; t2Z = lpZ; 
      }

      // Interpolate
      const targetX = t1X + (t2X - t1X) * easeT
      const targetY = t1Y + (t2Y - t1Y) * easeT
      const targetZ = t1Z + (t2Z - t1Z) * easeT

      let cx = posAttribute.array[idx]
      let cy = posAttribute.array[idx + 1]
      let cz = posAttribute.array[idx + 2]
      
      let vx = velocities[idx]
      let vy = velocities[idx + 1]
      let vz = velocities[idx + 2]

      // Interactive Mouse Repulsion
      const dx = cx - mouseVector.x
      const dy = cy - mouseVector.y
      const dz = cz - mouseVector.z
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)
      
      // Make the expansion small and localized
      const isTextStage = p < 0.5;
      const hoverRadius = isTextStage ? 2.5 : 2.0;
      const hoverForce = isTextStage ? 0.03 : 0.02;
      
      if (dist < hoverRadius) {
        const force = (hoverRadius - dist) * hoverForce
        vx += (dx / dist) * force
        vy += (dy / dist) * force
        vz += (dz / dist) * force
      }

      // Spring towards target
      vx += (targetX - cx) * 0.05
      vy += (targetY - cy) * 0.05
      vz += (targetZ - cz) * 0.05
      
      // Damping
      vx *= 0.88
      vy *= 0.88
      vz *= 0.88

      velocities[idx] = vx
      velocities[idx + 1] = vy
      velocities[idx + 2] = vz

      posAttribute.array[idx] = cx + vx
      posAttribute.array[idx + 1] = cy + vy
      posAttribute.array[idx + 2] = cz + vz
    }
    
    posAttribute.needsUpdate = true
  })

  if (!isReady || !positions) return null

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={PARTICLE_COUNT} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial 
        size={0.06} 
        color="#ffffff" 
        transparent 
        opacity={0.8} 
        blending={THREE.AdditiveBlending} 
        depthWrite={false} 
      />
    </points>
  )
}

function SceneCamera({ progress }: { progress: any }) {
  const { camera } = useThree()
  
  useFrame(() => {
    const p = progress.get()
    
    // Zoom levels per stage
    let targetZ = 15
    if (p > 0.5 && p <= 1.5) targetZ = 20 // Wave
    if (p > 1.5 && p <= 2.5) targetZ = 30 // Line (needs far zoom to see length)
    if (p > 2.5 && p <= 3.5) targetZ = 35 // Blackhole (huge spiral)
    if (p > 3.5) targetZ = 25             // DNA
    
    camera.position.z += (targetZ - camera.position.z) * 0.05
  })
  
  return null
}

export function Wallpaper3D() {
  const customWallpaper = useOSStore(s => s.customWallpaper)
  const initWallpaper = useOSStore(s => s.initWallpaper)

  useEffect(() => {
    document.fonts.ready.then(() => {
      if (customWallpaper) {
        initWallpaper()
      } else {
        initWallpaper()
      }
    })
  }, [initWallpaper, customWallpaper])

  const rawProgress = useMotionValue(0)
  const progress = useSpring(rawProgress, { damping: 25, stiffness: 45, mass: 1 })
  const targetStageRef = useRef(0)
  const lastScrollTime = useRef(0)

  useEffect(() => {
    if (customWallpaper) return;

    const handleWheel = (e: WheelEvent) => {
      if ((e.target as Element).closest('.os-window, .os-dock, .menu-bar, .modal')) return;
      
      const now = Date.now()
      if (now - lastScrollTime.current > 800) { // 800ms debounce
        if (e.deltaY > 20) {
          targetStageRef.current = Math.min(4, targetStageRef.current + 1)
          rawProgress.set(targetStageRef.current)
          lastScrollTime.current = now
        } else if (e.deltaY < -20) {
          targetStageRef.current = Math.max(0, targetStageRef.current - 1)
          rawProgress.set(targetStageRef.current)
          lastScrollTime.current = now
        }
      }
    }
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [rawProgress, customWallpaper])

  const o1 = useTransform(progress, [0.5, 1, 1.5], [0, 1, 0])
  const o2 = useTransform(progress, [1.5, 2, 2.5], [0, 1, 0])
  const o3 = useTransform(progress, [2.5, 3, 3.5], [0, 1, 0])
  const o4 = useTransform(progress, [3.5, 4], [0, 1])

  if (customWallpaper) {
    return (
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("${customWallpaper}")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.1)' }} />
      </div>
    )
  }

  return (
    <div className="absolute inset-0 z-0 bg-[#030303] text-white overflow-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 15], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <SceneCamera progress={progress} />
          <MorphingParticles progress={progress} />
        </Canvas>
      </div>

      <div className="fixed inset-0 z-10 pointer-events-none flex items-center justify-center">
        
        <motion.div style={{ opacity: o1 }} className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <h2 className="text-8xl font-black font-oxanium tracking-widest text-white drop-shadow-2xl mb-4">FLUIDITY</h2>
          <p className="text-2xl text-white/60 font-mono tracking-[0.3em] uppercase">Unbound by limits</p>
        </motion.div>

        <motion.div style={{ opacity: o2 }} className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <h2 className="text-8xl font-black font-oxanium tracking-widest text-white drop-shadow-2xl mb-4">VELOCITY</h2>
          <p className="text-2xl text-white/60 font-mono tracking-[0.3em] uppercase">Speed of light</p>
        </motion.div>

        <motion.div style={{ opacity: o3 }} className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <h2 className="text-8xl font-black font-oxanium tracking-widest text-white drop-shadow-2xl mb-4">SINGULARITY</h2>
          <p className="text-2xl text-white/60 font-mono tracking-[0.3em] uppercase">Infinite depth</p>
        </motion.div>

        <motion.div style={{ opacity: o4 }} className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <h2 className="text-8xl font-black font-oxanium tracking-widest text-white drop-shadow-2xl mb-4">GENESIS</h2>
          <p className="text-2xl text-white/60 font-mono tracking-[0.3em] uppercase">The building blocks</p>
        </motion.div>
      </div>
    </div>
  )
}

