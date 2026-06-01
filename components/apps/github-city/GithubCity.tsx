'use client'

import { Suspense, useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import * as THREE from 'three'

interface ContributionDay {
  color: string
  contributionCount: number
  contributionLevel: string
  date: string
}

export function GithubCity() {
  const [data, setData] = useState<ContributionDay[][] | null>(null)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('https://github-contributions-api.deno.dev/sayan049.json')
        const json = await res.json()
        setData(json.contributions)
        setTotal(json.totalContributions)
      } catch (e) {
        console.error('Failed to fetch github data:', e)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-[#09090C] text-emerald-400 font-mono">
        <div className="animate-pulse flex space-x-2">
          <div className="w-4 h-4 bg-emerald-500 rounded-sm"></div>
          <div className="w-4 h-4 bg-emerald-500 rounded-sm animation-delay-200"></div>
          <div className="w-4 h-4 bg-emerald-500 rounded-sm animation-delay-400"></div>
        </div>
        <p className="mt-4 text-sm tracking-widest uppercase">Fetching Commits...</p>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#09090C] text-red-500 font-mono">
        Failed to load GitHub data.
      </div>
    )
  }

  return (
    <div className="w-full h-full bg-[#050508] relative overflow-hidden flex flex-col">
      <div className="absolute top-6 left-6 z-10 pointer-events-none">
        <h2 className="text-3xl font-black text-white drop-shadow-lg tracking-tighter">COMMIT.CITY</h2>
        <p className="text-emerald-400 font-mono text-sm mt-1 bg-black/50 px-2 py-1 inline-block rounded">
          {total} Contributions // Past Year
        </p>
      </div>

      <div className="absolute bottom-6 right-6 z-10 pointer-events-none bg-black/50 px-3 py-2 rounded-lg border border-white/10 backdrop-blur-md">
        <p className="text-white/60 font-mono text-xs">Drag to Rotate • Scroll to Zoom</p>
      </div>

      <Canvas
        camera={{ position: [40, 40, 40], fov: 35 }}
        gl={{ antialias: true }}
      >
        <color attach="background" args={['#050508']} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 20, 10]} intensity={1.5} castShadow />
        <spotLight position={[-10, 20, 20]} angle={0.3} penumbra={1} intensity={1} color="#00f2fe" />
        <spotLight position={[20, 20, -10]} angle={0.3} penumbra={1} intensity={1} color="#ff0055" />
        
        <Suspense fallback={null}>
          <CityGrid data={data} />
          <Environment preset="city" />
        </Suspense>

        <OrbitControls 
          enablePan={false} 
          maxPolarAngle={Math.PI / 2 - 0.1}
          minDistance={20}
          maxDistance={100}
        />
      </Canvas>
    </div>
  )
}

function CityGrid({ data }: { data: ContributionDay[][] }) {
  const weeks = data.length
  const days = 7
  const spacing = 1.2
  
  // Center the city
  const offsetX = (weeks * spacing) / 2
  const offsetZ = (days * spacing) / 2

  // Pre-calculate instances for performance, or just render boxes
  // Since it's ~365 boxes, we can just render individual meshes without instancing for simplicity,
  // but let's use a nice glowing material.

  return (
    <group position={[-offsetX, 0, -offsetZ]}>
      {/* Base Platform */}
      <mesh position={[offsetX, -1, offsetZ]} receiveShadow>
        <boxGeometry args={[weeks * spacing + 2, 2, days * spacing + 2]} />
        <meshStandardMaterial color="#0a0a12" roughness={0.8} />
      </mesh>

      {/* Grid of Buildings */}
      {data.map((week, wIdx) => 
        week.map((day, dIdx) => {
          if (day.contributionCount === 0) {
            // Empty plot (very short, dark box)
            return (
              <mesh key={`${wIdx}-${dIdx}`} position={[wIdx * spacing, 0.1, dIdx * spacing]}>
                <boxGeometry args={[1, 0.2, 1]} />
                <meshStandardMaterial color="#111116" roughness={0.9} />
              </mesh>
            )
          }

          // Active building
          const height = Math.min(Math.max(day.contributionCount * 0.8, 1), 12)
          // Map standard github colors to neon cyberpunk colors
          const colorMap: Record<string, string> = {
            '#9be9a8': '#0f4b33', // level 1
            '#40c463': '#1d9354', // level 2
            '#30a14e': '#2be079', // level 3
            '#216e39': '#4fffa5', // level 4
          }
          const baseColor = colorMap[day.color] || '#4fffa5'

          return (
            <mesh key={`${wIdx}-${dIdx}`} position={[wIdx * spacing, height / 2, dIdx * spacing]} castShadow receiveShadow>
              <boxGeometry args={[0.9, height, 0.9]} />
              <meshStandardMaterial 
                color={baseColor} 
                emissive={baseColor}
                emissiveIntensity={height > 4 ? 0.8 : 0.2}
                roughness={0.2}
                metalness={0.8}
              />
            </mesh>
          )
        })
      )}
    </group>
  )
}
