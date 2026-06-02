const fs = require('fs');
const jsx = fs.readFileSync('scratch/output.jsx', 'utf8');

const head = `
'use client'

import React, { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import * as THREE from 'three'

const PARTICLE_COUNT = 8000

function MorphingParticles({ progress }) {
  const pointsRef = useRef(null)
  
  const { positions, targets, velocities } = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3)
    const vel = new Float32Array(PARTICLE_COUNT * 3)
    
    const torus = new Float32Array(PARTICLE_COUNT * 3)
    const noise = new Float32Array(PARTICLE_COUNT * 3)
    const line = new Float32Array(PARTICLE_COUNT * 3)
    const helix = new Float32Array(PARTICLE_COUNT * 3)

    // Helix params
    const totalRotations = 5
    const startRadius = 6
    const endRadius = 1
    const tubeThickness = 0.5
    const height = 15
    const verticalOffset = -5

    for (let l = 0; l < PARTICLE_COUNT; l++) {
      let u = 3 * l
      
      // 1. Torus
      let cT = Math.random() * Math.PI * 2
      let hT = Math.random() * Math.PI * 2
      let dT = (6 + 0.7 * Math.cos(cT)) * Math.cos(hT)
      let pT = (6 + 0.7 * Math.cos(cT)) * Math.sin(hT)
      let fT = 0.7 * Math.sin(cT)
      torus[u] = dT
      torus[u+1] = pT
      torus[u+2] = fT
      
      // 2. Noise Box
      noise[u] = (Math.random() - 0.5) * 25
      noise[u+1] = (Math.random() - 0.5) * 25
      noise[u+2] = (Math.random() - 0.5) * 25
      
      // 3. Flat Line
      let mLine = (l / PARTICLE_COUNT) * 2 - 1
      line[u] = 15 * mLine
      line[u+1] = 0
      line[u+2] = 0
      
      // 4. Helix
      let cH = l / PARTICLE_COUNT
      let hH = cH * totalRotations * Math.PI * 2
      let dH = startRadius - (startRadius - endRadius) * cH
      let pH = (height / 2) * (1 - cH) + verticalOffset
      let fH = Math.random() * Math.PI * 2
      let mH = Math.random() * tubeThickness
      helix[u] = (dH + mH * Math.cos(fH)) * Math.cos(hH)
      helix[u+1] = pH
      helix[u+2] = (dH + mH * Math.sin(fH)) * Math.sin(hH)

      // Start position = Torus
      pos[u] = torus[u]
      pos[u+1] = torus[u+1]
      pos[u+2] = torus[u+2]
    }
    
    return { positions: pos, targets: [torus, noise, line, helix, helix], velocities: vel }
  }, [])

  const { pointer } = useThree()

  useFrame((state) => {
    if (!pointsRef.current) return
    const posAttribute = pointsRef.current.geometry.attributes.position
    
    const p = Math.max(0, Math.min(4, progress.get()))
    
    // Slight ambient rotation
    pointsRef.current.rotation.x = state.clock.elapsedTime * 0.05
    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.05
    
    const stage = Math.floor(p)
    const t = p % 1
    const easeT = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t

    let currentTarget = targets[Math.min(stage, 4)]
    let nextTarget = targets[Math.min(stage + 1, 4)]

    const mouseX = (pointer.x * state.viewport.width) / 2
    const mouseY = (pointer.y * state.viewport.height) / 2
    
    // Un-rotate mouse vector
    const mouseVector = new THREE.Vector3(mouseX, mouseY, 0)
    mouseVector.applyEuler(new THREE.Euler(-pointsRef.current.rotation.x, -pointsRef.current.rotation.y, 0))

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const idx = i * 3

      let tx = currentTarget[idx] + (nextTarget[idx] - currentTarget[idx]) * easeT
      let ty = currentTarget[idx + 1] + (nextTarget[idx + 1] - currentTarget[idx + 1]) * easeT
      let tz = currentTarget[idx + 2] + (nextTarget[idx + 2] - currentTarget[idx + 2]) * easeT

      let cx = posAttribute.array[idx]
      let cy = posAttribute.array[idx + 1]
      let cz = posAttribute.array[idx + 2]
      
      let vx = velocities[idx]
      let vy = velocities[idx + 1]
      let vz = velocities[idx + 2]

      const dx = cx - mouseVector.x
      const dy = cy - mouseVector.y
      const dz = cz - mouseVector.z
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)
      
      if (dist < 3.0) {
        const force = (3.0 - dist) * 0.02
        vx += (dx / dist) * force
        vy += (dy / dist) * force
        vz += (dz / dist) * force
      }

      vx += (tx - cx) * 0.04
      vy += (ty - cy) * 0.04
      vz += (tz - cz) * 0.04
      
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

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={PARTICLE_COUNT} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#ffffff" transparent opacity={0.8} blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  )
}
`

// We will reconstruct the exact component with framer-motion linked to scroll container
const tail = `
export function Wallpaper3D() {
  const rawProgress = useMotionValue(0)
  const progress = useSpring(rawProgress, { damping: 30, stiffness: 60, mass: 1 })
  const scrollRef = useRef<HTMLDivElement>(null)

  const handleScroll = (e) => {
    const t = e.target;
    const maxScroll = t.scrollHeight - t.clientHeight;
    if (maxScroll > 0) {
      const scrollProgress = (t.scrollTop / maxScroll) * 4;
      rawProgress.set(scrollProgress);
    }
  }

  // To make Framer Motion values compatible with JSX style prop without error, we need to extract the raw HTML body that we generated
  return (
    <div className="absolute inset-0 z-0 bg-[#030303] text-white">
      ` + jsx.replace('<canvas style={{display: \'block\'}}></canvas>', `
      <Canvas camera={{ position: [0, 0, 15], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <MorphingParticles progress={progress} />
      </Canvas>
      `).replace('className="h-full w-full overflow-y-scroll overflow-x-hidden snap-y snap-mandatory custom-scrollbar"', 
                 'className="h-full w-full overflow-y-scroll overflow-x-hidden snap-y snap-mandatory custom-scrollbar" onScroll={handleScroll} ref={scrollRef}') + `
    </div>
  )
}
`

fs.writeFileSync('components/desktop/Wallpaper3D.tsx', head + tail);
