'use client'

import { Suspense, useEffect, useState, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import * as THREE from 'three'

interface ContributionDay {
  color: string
  contributionCount: number
  contributionLevel: string
  date: string
}

// ----------------------------------------------------------------------------
// Procedural Utilities
// ----------------------------------------------------------------------------
function generateWindowTexture(baseColor: string, isActive: boolean) {
  const canvas = document.createElement('canvas')
  canvas.width = 128
  canvas.height = 256
  const ctx = canvas.getContext('2d')
  if (!ctx) return new THREE.Texture()

  // Base building color
  ctx.fillStyle = '#0a0a0c'
  ctx.fillRect(0, 0, 128, 256)

  if (isActive) {
    const rows = 12
    const cols = 6
    const windowWidth = 10
    const windowHeight = 12
    const gapX = (128 - (cols * windowWidth)) / (cols + 1)
    const gapY = (256 - (rows * windowHeight)) / (rows + 1)

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        // Only some windows are lit
        if (Math.random() > 0.5) {
          ctx.fillStyle = baseColor
          ctx.shadowColor = baseColor
          ctx.shadowBlur = 8
        } else {
          ctx.fillStyle = '#111'
          ctx.shadowBlur = 0
        }
        ctx.fillRect(
          gapX + c * (windowWidth + gapX),
          gapY + r * (windowHeight + gapY),
          windowWidth,
          windowHeight
        )
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  // Apply a slight pixelated filter for a cyberpunk vibe
  texture.magFilter = THREE.NearestFilter 
  return texture
}

// ----------------------------------------------------------------------------
// Components
// ----------------------------------------------------------------------------

function TrafficSystem({ boundsX, boundsZ }: { boundsX: number, boundsZ: number }) {
  const trafficCount = 150
  const instances = useMemo(() => {
    return Array.from({ length: trafficCount }).map(() => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * boundsX,
        Math.random() * 2 + 0.2, // Float slightly above ground
        (Math.random() - 0.5) * boundsZ
      ),
      speed: Math.random() * 0.3 + 0.1,
      axis: Math.random() > 0.5 ? 'x' : 'z',
      dir: Math.random() > 0.5 ? 1 : -1,
      color: Math.random() > 0.5 ? '#00f2fe' : '#ff0055'
    }))
  }, [boundsX, boundsZ])

  const meshRef = useRef<THREE.InstancedMesh>(null)

  useFrame(() => {
    if (!meshRef.current) return
    const dummy = new THREE.Object3D()
    
    instances.forEach((inst, i) => {
      // Move traffic
      if (inst.axis === 'x') {
        inst.position.x += inst.speed * inst.dir
        if (inst.position.x > boundsX / 2) inst.position.x = -boundsX / 2
        if (inst.position.x < -boundsX / 2) inst.position.x = boundsX / 2
      } else {
        inst.position.z += inst.speed * inst.dir
        if (inst.position.z > boundsZ / 2) inst.position.z = -boundsZ / 2
        if (inst.position.z < -boundsZ / 2) inst.position.z = boundsZ / 2
      }

      dummy.position.copy(inst.position)
      // Make them thin and long like light streaks (cyberpunk trails)
      if (inst.axis === 'x') {
        dummy.scale.set(1.5, 0.05, 0.05)
      } else {
        dummy.scale.set(0.05, 0.05, 1.5)
      }
      dummy.updateMatrix()
      meshRef.current!.setMatrixAt(i, dummy.matrix)
    })
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  // Setup instance colors
  useEffect(() => {
    if (!meshRef.current) return
    const color = new THREE.Color()
    const colorArray = new Float32Array(trafficCount * 3)
    instances.forEach((inst, i) => {
      color.set(inst.color)
      // Boost intensity for bloom
      color.multiplyScalar(2) 
      color.toArray(colorArray, i * 3)
    })
    meshRef.current.geometry.setAttribute('color', new THREE.InstancedBufferAttribute(colorArray, 3))
  }, [instances])

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, trafficCount]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial vertexColors toneMapped={false} />
    </instancedMesh>
  )
}

function Building({ height, baseColor, position, day, isSelected, onSelectDay }: { height: number, baseColor: string, position: [number, number, number], day: ContributionDay, isSelected: boolean, onSelectDay: (day: ContributionDay, pos: THREE.Vector3) => void }) {
  const [hovered, setHovered] = useState(false)
  const isActive = height > 0.5
  const isTall = height > 5
  const hasAntenna = height > 8 && Math.random() > 0.5
  
  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto'
    return () => { document.body.style.cursor = 'auto' }
  }, [hovered])
  
  // Memoize texture so we don't recreate canvas on every render
  const texture = useMemo(() => {
    const tex = generateWindowTexture(baseColor, isActive)
    tex.repeat.set(1, Math.max(1, height / 2)) // Repeat vertically based on height
    return tex
  }, [baseColor, height, isActive])

  return (
    <group 
      position={position}
      onClick={(e) => {
        e.stopPropagation()
        const worldPos = new THREE.Vector3()
        e.object.getWorldPosition(worldPos)
        // Add a slight vertical offset to the target so we look slightly above the base
        worldPos.y += height / 2
        onSelectDay(day, worldPos)
      }}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHovered(true)
      }}
      onPointerOut={() => setHovered(false)}
    >
      {/* Main Building Body */}
      <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[1, height, 1]} />
        <meshStandardMaterial 
          map={texture}
          emissiveMap={texture}
          emissive={isActive || isSelected ? new THREE.Color(baseColor) : new THREE.Color('#000')}
          emissiveIntensity={isSelected ? 10 : (isActive ? (hovered ? 4 : (height > 6 ? 2 : 1)) : (hovered ? 0.5 : 0))}
          roughness={0.4}
          metalness={0.6}
        />
      </mesh>

      {/* Roof Structure */}
      {isTall && (
        <mesh position={[0, height + 0.2, 0]} castShadow>
          <boxGeometry args={[0.6, 0.4, 0.6]} />
          <meshStandardMaterial color="#111" roughness={0.9} />
        </mesh>
      )}

      {/* Antenna */}
      {hasAntenna && (
        <mesh position={[0, height + 1.5, 0]}>
          <cylinderGeometry args={[0.02, 0.05, 2]} />
          <meshStandardMaterial color="#333" metalness={1} />
          {/* Antenna glowing tip */}
          <mesh position={[0, 1, 0]}>
            <sphereGeometry args={[0.1]} />
            <meshBasicMaterial color="#ff0055" toneMapped={false} />
          </mesh>
        </mesh>
      )}
    </group>
  )
}

function CityGrid({ data, selectedDate, onSelectDay }: { data: ContributionDay[][], selectedDate: string | null, onSelectDay: (day: ContributionDay, pos: THREE.Vector3) => void }) {
  const weeks = data.length
  const days = 7
  const spacing = 1.5 // wider streets for traffic
  
  const offsetX = (weeks * spacing) / 2
  const offsetZ = (days * spacing) / 2

  return (
    <group position={[-offsetX, 0, -offsetZ]}>
      {/* Base Platform */}
      <mesh position={[offsetX, -0.5, offsetZ]} receiveShadow>
        <boxGeometry args={[weeks * spacing + 10, 1, days * spacing + 10]} />
        <meshStandardMaterial color="#050508" roughness={1} metalness={0.2} />
      </mesh>
      
      {/* City Grid overlay */}
      <gridHelper 
        args={[weeks * spacing + 10, weeks, '#111111', '#111111']} 
        position={[offsetX, 0.01, offsetZ]} 
      />

      {/* Grid of Buildings */}
      {data.map((week, wIdx) => 
        week.map((day, dIdx) => {
          if (day.contributionCount === 0) {
            return (
              <Building 
                key={`${wIdx}-${dIdx}`} 
                height={0.2} 
                baseColor="#111" 
                position={[wIdx * spacing, 0, dIdx * spacing]} 
                day={day}
                isSelected={selectedDate === day.date}
                onSelectDay={onSelectDay}
              />
            )
          }

          const height = Math.min(Math.max(day.contributionCount * 0.8, 1), 14)
          const colorMap: Record<string, string> = {
            '#9be9a8': '#0f4b33', // level 1
            '#40c463': '#1d9354', // level 2
            '#30a14e': '#2be079', // level 3
            '#216e39': '#4fffa5', // level 4
          }
          const baseColor = colorMap[day.color] || '#4fffa5'

          return (
            <Building 
              key={`${wIdx}-${dIdx}`} 
              height={height} 
              baseColor={baseColor} 
              position={[wIdx * spacing, 0, dIdx * spacing]} 
              day={day}
              isSelected={selectedDate === day.date}
              onSelectDay={onSelectDay}
            />
          )
        })
      )}

      {/* Traffic System overlaying the city */}
      <group position={[offsetX, 0, offsetZ]}>
        <TrafficSystem boundsX={weeks * spacing + 5} boundsZ={days * spacing + 5} />
      </group>
    </group>
  )
}

function CameraController({ targetPosition }: { targetPosition: THREE.Vector3 | null }) {
  const controlsRef = useRef<any>(null)
  
  useFrame((state) => {
    if (controlsRef.current) {
      const target = targetPosition || new THREE.Vector3(0, 0, 0)
      controlsRef.current.target.lerp(target, 0.05)
      controlsRef.current.update()
    }
  })

  return (
    <OrbitControls 
      ref={controlsRef}
      enablePan={true} 
      maxPolarAngle={Math.PI / 2 - 0.05} 
      minDistance={5}
      maxDistance={150}
      autoRotate={!targetPosition}
      autoRotateSpeed={0.5}
      makeDefault
    />
  )
}

export function GithubCity() {
  const [data, setData] = useState<ContributionDay[][] | null>(null)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [selectedDay, setSelectedDay] = useState<{day: ContributionDay, position: THREE.Vector3} | null>(null)

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
      <div className="w-full h-full flex flex-col items-center justify-center bg-[#050508] text-emerald-400 font-mono">
        <div className="animate-pulse flex space-x-2">
          <div className="w-4 h-4 bg-emerald-500 rounded-sm"></div>
          <div className="w-4 h-4 bg-emerald-500 rounded-sm animation-delay-200"></div>
          <div className="w-4 h-4 bg-emerald-500 rounded-sm animation-delay-400"></div>
        </div>
        <p className="mt-4 text-sm tracking-widest uppercase">Initializing City Protocol...</p>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#050508] text-red-500 font-mono">
        Failed to load GitHub data.
      </div>
    )
  }

  return (
    <div className="w-full h-full bg-[#030305] relative overflow-hidden flex flex-col">
      <div className="absolute top-6 left-6 z-10 pointer-events-none">
        <h2 className="text-3xl font-black text-white drop-shadow-[0_0_10px_rgba(0,255,150,0.5)] tracking-tighter">COMMIT.CITY</h2>
        <p className="text-emerald-400 font-mono text-sm mt-1 bg-black/80 px-2 py-1 inline-block rounded border border-emerald-500/20 backdrop-blur-md">
          {total} Contributions // Past Year
        </p>
      </div>

      <div className="absolute bottom-6 right-6 z-10 pointer-events-none bg-black/80 px-3 py-2 rounded-lg border border-white/10 backdrop-blur-md">
        <p className="text-white/60 font-mono text-xs tracking-widest uppercase">Drag: Orbit • Scroll: Zoom</p>
      </div>

      {/* Selected Day Info Panel */}
      {selectedDay && (
        <div className="absolute top-6 right-6 z-10 w-[280px] bg-black/40 backdrop-blur-xl border border-[#00f2fe]/50 p-5 rounded-lg shadow-[0_0_30px_rgba(0,242,254,0.2)] overflow-hidden">
          {/* Cyberpunk decorative lines */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00f2fe] to-transparent animate-pulse" />
          <div className="absolute bottom-0 right-0 w-[50px] h-[2px] bg-[#ff0055]" />
          <div className="absolute top-0 left-0 w-[2px] h-[50px] bg-[#00f2fe]" />
          
          <div className="flex justify-between items-start mb-4 relative z-10">
            <h3 className="text-[#00f2fe] font-mono text-xs tracking-widest uppercase flex items-center gap-2">
              <span className="w-2 h-2 bg-[#ff0055] animate-ping rounded-full inline-block"></span>
              Sector Data
            </h3>
            <button 
              onClick={() => setSelectedDay(null)}
              className="text-white/40 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
          <div className="space-y-4 relative z-10">
            <div className="grid grid-cols-2 gap-2 border-b border-white/10 pb-3">
              <div>
                <p className="text-[#00f2fe]/60 text-[9px] uppercase font-mono tracking-widest">Date Cycle</p>
                <p className="text-white font-mono text-xs">{new Date(selectedDay.day.date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}</p>
              </div>
              <div>
                <p className="text-[#00f2fe]/60 text-[9px] uppercase font-mono tracking-widest">Time (Sim)</p>
                <p className="text-white font-mono text-xs">23:59:59 EOD</p>
              </div>
            </div>
            
            <div>
              <p className="text-[#00f2fe]/60 text-[9px] uppercase font-mono tracking-widest mb-1">Energy Output</p>
              <div className="flex items-end gap-2">
                <p className="text-emerald-400 font-black text-4xl leading-none drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]">
                  {selectedDay.day.contributionCount}
                </p>
                <span className="text-xs font-mono text-white/50 mb-1 uppercase tracking-wider">Commits</span>
              </div>
            </div>

            <div className="w-full h-1.5 bg-black/50 rounded-full overflow-hidden border border-white/5">
              <div 
                className="h-full bg-gradient-to-r from-[#00f2fe] via-emerald-400 to-[#ff0055] relative" 
                style={{ width: `${Math.min(100, (selectedDay.day.contributionCount / 15) * 100)}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
              </div>
            </div>
            
            <p className="text-[9px] font-mono text-white/30 tracking-widest text-right uppercase">
              Target Locked // ID: {Math.random().toString(16).slice(2, 8).toUpperCase()}
            </p>
          </div>
        </div>
      )}

      <Canvas
        camera={{ position: [30, 25, 40], fov: 35 }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
      >
        <color attach="background" args={['#030305']} />
        
        {/* Cyberpunk Fog */}
        <fogExp2 attach="fog" color="#030305" density={0.015} />

        {/* Ambient & Directed Lights */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 30, 10]} intensity={1} castShadow />
        
        {/* Neon City Spotlights */}
        <spotLight position={[-20, 20, 20]} angle={0.5} penumbra={1} intensity={500} color="#00f2fe" distance={100} />
        <spotLight position={[20, 20, -20]} angle={0.5} penumbra={1} intensity={500} color="#ff0055" distance={100} />
        <spotLight position={[0, -10, 0]} angle={1} penumbra={1} intensity={100} color="#4fffa5" distance={50} />
        
        <Suspense fallback={null}>
          <CityGrid 
            data={data} 
            selectedDate={selectedDay?.day.date || null}
            onSelectDay={(day, pos) => setSelectedDay({ day, position: pos })} 
          />
          <Environment preset="city" />
        </Suspense>

        <CameraController targetPosition={selectedDay?.position || null} />
      </Canvas>
    </div>
  )
}
