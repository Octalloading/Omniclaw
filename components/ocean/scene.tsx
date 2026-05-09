'use client'

import { useRef, useState, useEffect, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Sky, Cloud, Float } from '@react-three/drei'
import * as THREE from 'three'
import { Ocean } from './ocean'
import { CrabCursor } from './crab-cursor'
import {
  HeroBillboard,
  AIRecruitsBillboard,
  ReputationBillboard,
  PaymentBillboard,
  SkillNFTBillboard,
  PersonalCenterBillboard,
} from './floating-billboard'

// Coral Reef cluster - pink/green colors scattered on sea surface
function CoralReef({ position, color, scale = 1 }: { position: [number, number, number]; color: string; scale?: number }) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle swaying motion
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5 + position[0]) * 0.05
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.8 + position[2]) * 0.05
    }
  })

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Main coral branches */}
      <mesh position={[0, 0.2, 0]}>
        <coneGeometry args={[0.15, 0.6, 5]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      <mesh position={[0.2, 0.15, 0.1]} rotation={[0, 0, 0.3]}>
        <coneGeometry args={[0.1, 0.4, 5]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      <mesh position={[-0.15, 0.1, -0.1]} rotation={[0, 0, -0.2]}>
        <coneGeometry args={[0.08, 0.35, 5]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      {/* Coral base */}
      <mesh position={[0, -0.05, 0]}>
        <cylinderGeometry args={[0.25, 0.3, 0.15, 8]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
      {/* Small decorative spheres */}
      <mesh position={[0.1, 0.45, 0.05]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.2} />
      </mesh>
      <mesh position={[-0.08, 0.35, -0.05]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.2} />
      </mesh>
    </group>
  )
}

// Scattered coral reefs across the ocean
function CoralReefs() {
  const corals = [
    // Pink corals
    { position: [-8, -0.3, 2] as [number, number, number], color: '#FFB6C1', scale: 1.2 },
    { position: [5, -0.25, 3] as [number, number, number], color: '#FF69B4', scale: 0.9 },
    { position: [18, -0.3, -2] as [number, number, number], color: '#FFB6C1', scale: 1.1 },
    { position: [28, -0.28, 4] as [number, number, number], color: '#FFC0CB', scale: 1.0 },
    { position: [42, -0.32, 2] as [number, number, number], color: '#FF69B4', scale: 1.3 },
    { position: [55, -0.25, -3] as [number, number, number], color: '#FFB6C1', scale: 0.8 },
    { position: [68, -0.3, 3] as [number, number, number], color: '#FFC0CB', scale: 1.1 },
    // Green corals
    { position: [-5, -0.28, -3] as [number, number, number], color: '#90EE90', scale: 1.0 },
    { position: [8, -0.3, -2] as [number, number, number], color: '#98FB98', scale: 1.2 },
    { position: [22, -0.25, 3] as [number, number, number], color: '#90EE90', scale: 0.9 },
    { position: [35, -0.32, -4] as [number, number, number], color: '#98FB98', scale: 1.1 },
    { position: [48, -0.28, 1] as [number, number, number], color: '#90EE90', scale: 1.0 },
    { position: [62, -0.3, -2] as [number, number, number], color: '#98FB98', scale: 1.2 },
    { position: [75, -0.25, 4] as [number, number, number], color: '#90EE90', scale: 0.85 },
    // Mixed additional corals for density
    { position: [12, -0.27, 5] as [number, number, number], color: '#FFB6C1', scale: 0.7 },
    { position: [38, -0.29, -1] as [number, number, number], color: '#98FB98', scale: 0.75 },
    { position: [52, -0.31, 5] as [number, number, number], color: '#FF69B4', scale: 0.65 },
    { position: [65, -0.26, 0] as [number, number, number], color: '#90EE90', scale: 0.8 },
  ]

  return (
    <>
      {corals.map((coral, i) => (
        <CoralReef key={i} position={coral.position} color={coral.color} scale={coral.scale} />
      ))}
    </>
  )
}

// Camera controller for horizontal scroll
function CameraController({ scrollProgress }: { scrollProgress: number }) {
  const { camera } = useThree()
  const targetX = useRef(0)

  useFrame(() => {
    // Map scroll to camera position (0 to 100 scroll = 0 to 75 x position)
    targetX.current = scrollProgress * 75
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX.current, 0.05)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, 3 + Math.sin(scrollProgress * Math.PI * 2) * 0.3, 0.05)
    camera.position.z = 10
    camera.lookAt(camera.position.x, 0, 0)
  })

  return null
}

// Main scene content
function SceneContent({ scrollProgress }: { scrollProgress: number }) {
  return (
    <>
      <CameraController scrollProgress={scrollProgress} />
      
      {/* Lighting */}
      <ambientLight intensity={0.7} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1.2}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <pointLight position={[0, 5, 0]} intensity={0.5} color="#87ceeb" />
      <pointLight position={[30, 4, 0]} intensity={0.4} color="#87ceeb" />
      <pointLight position={[60, 4, 0]} intensity={0.4} color="#87ceeb" />

      {/* Environment */}
      <Sky
        sunPosition={[100, 20, 100]}
        turbidity={0.1}
        rayleigh={0.5}
        mieCoefficient={0.005}
        mieDirectionalG={0.8}
      />
      <fog attach="fog" args={['#f0f8ff', 15, 60]} />

      {/* Clouds */}
      <Cloud position={[-5, 8, -10]} speed={0.2} opacity={0.4} />
      <Cloud position={[15, 10, -15]} speed={0.1} opacity={0.35} />
      <Cloud position={[35, 9, -12]} speed={0.15} opacity={0.4} />
      <Cloud position={[55, 11, -10]} speed={0.12} opacity={0.45} />
      <Cloud position={[75, 10, -14]} speed={0.1} opacity={0.4} />

      {/* Ocean */}
      <Ocean />
      
      {/* Scattered Coral Reefs */}
      <CoralReefs />

      {/* Crab cursor */}
      <CrabCursor />

      {/* Section 1: Hero (x: 0) */}
      <Float speed={1.5} rotationIntensity={0.05} floatIntensity={0.2}>
        <HeroBillboard position={[0, 3, -2]} />
      </Float>

      {/* Section 2: AI Recruits AI (x: 15) */}
      <Float speed={1.8} rotationIntensity={0.05} floatIntensity={0.25}>
        <AIRecruitsBillboard position={[15, 3.5, -2]} />
      </Float>

      {/* Section 3: Reputation & Staking (x: 30) */}
      <Float speed={1.6} rotationIntensity={0.05} floatIntensity={0.2}>
        <ReputationBillboard position={[30, 3, -2]} />
      </Float>

      {/* Section 4: SOL/SPL Payment (x: 45) */}
      <Float speed={2} rotationIntensity={0.05} floatIntensity={0.25}>
        <PaymentBillboard position={[45, 3.5, -2]} />
      </Float>

      {/* Section 5: Skill NFT Display (x: 60) */}
      <Float speed={1.7} rotationIntensity={0.05} floatIntensity={0.2}>
        <SkillNFTBillboard position={[60, 3, -2]} />
      </Float>

      {/* Section 6: Personal Center (x: 75) */}
      <Float speed={1.5} rotationIntensity={0.05} floatIntensity={0.2}>
        <PersonalCenterBillboard position={[75, 3.5, -2]} />
      </Float>
    </>
  )
}

// Loading component
function LoadingScreen() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-background">
      <div className="space-y-4 text-center">
        <div className="mx-auto h-16 w-16 animate-pulse rounded-full bg-primary/20" />
        <p className="text-muted-foreground">Loading the White Sea...</p>
      </div>
    </div>
  )
}

// Pulsing Blue Sapphire Email Icon
function SapphireEmailIcon() {
  return (
    <a
      href="mailto:suigeneris447@gmail.com"
      className="group fixed bottom-8 right-8 z-50"
      aria-label="Contact us via email"
    >
      <div className="relative">
        {/* Pulsing glow effect */}
        <div className="absolute inset-0 animate-ping rounded-full bg-blue-400/30" style={{ animationDuration: '2s' }} />
        <div className="absolute inset-0 animate-pulse rounded-full bg-blue-500/20 blur-md" style={{ animationDuration: '1.5s' }} />
        
        {/* Sapphire gem */}
        <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 via-blue-500 to-blue-700 shadow-lg shadow-blue-500/50 transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-blue-400/60">
          {/* Inner shine */}
          <div className="absolute inset-1 rounded-full bg-gradient-to-br from-white/40 via-transparent to-transparent" />
          
          {/* Email icon */}
          <svg
            className="relative h-6 w-6 text-white drop-shadow-sm"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>
      </div>
    </a>
  )
}

export function OceanScene() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Add custom cursor class to body
    document.body.classList.add('custom-cursor-active')

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      const delta = e.deltaY * 0.0004
      setScrollProgress((prev) => Math.max(0, Math.min(1, prev + delta)))
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        setScrollProgress((prev) => Math.min(1, prev + 0.04))
      } else if (e.key === 'ArrowLeft') {
        setScrollProgress((prev) => Math.max(0, prev - 0.04))
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.classList.remove('custom-cursor-active')
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const sections = ['Home', 'AI Recruits', 'Reputation', 'Payments', 'Skill NFTs', 'Profile']

  return (
    <div ref={containerRef} className="h-screen w-full overflow-hidden">
      <Suspense fallback={<LoadingScreen />}>
        <Canvas
          camera={{ position: [0, 3, 10], fov: 60 }}
          gl={{ antialias: true, alpha: true }}
          dpr={[1, 2]}
        >
          <SceneContent scrollProgress={scrollProgress} />
        </Canvas>
      </Suspense>

      {/* Scroll indicator */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2">
        <div className="glass rounded-full px-6 py-3">
          <div className="flex items-center gap-4">
            <span className="text-sm text-foreground/70">Scroll to explore</span>
            <div className="h-1 w-32 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all duration-300"
                style={{ width: `${scrollProgress * 100}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground">{Math.round(scrollProgress * 100)}%</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="glass fixed left-1/2 top-6 z-50 -translate-x-1/2 rounded-full px-6 py-3">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <svg
                className="h-4 w-4 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <span className="font-bold text-foreground">OmniClaw</span>
          </div>
          <div className="hidden items-center gap-5 md:flex">
            {sections.map((section, i) => (
              <button
                key={section}
                onClick={() => setScrollProgress(i / (sections.length - 1))}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {section}
              </button>
            ))}
          </div>
          <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
            Connect
          </button>
        </div>
      </nav>

      {/* Section indicators */}
      <div className="fixed right-8 top-1/2 z-50 -translate-y-1/2">
        <div className="flex flex-col gap-3">
          {sections.map((section, i) => {
            const progress = i / (sections.length - 1)
            return (
              <button
                key={section}
                onClick={() => setScrollProgress(progress)}
                className={`h-2 w-2 rounded-full transition-all ${
                  Math.abs(scrollProgress - progress) < 0.08
                    ? 'scale-150 bg-primary'
                    : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
                title={section}
              />
            )
          })}
        </div>
      </div>

      {/* Blue Sapphire Email Icon */}
      <SapphireEmailIcon />
    </div>
  )
}
