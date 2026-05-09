'use client'

import { useRef, useState, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

interface Particle {
  position: THREE.Vector3
  velocity: THREE.Vector3
  life: number
  maxLife: number
  size: number
  color: string
}

export function CrabCursor() {
  const groupRef = useRef<THREE.Group>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [particles, setParticles] = useState<Particle[]>([])
  const targetPosition = useRef(new THREE.Vector3())
  const currentPosition = useRef(new THREE.Vector3())
  const velocity = useRef(new THREE.Vector3())
  const { camera } = useThree()

  // Crab colors matching watercolor reference
  const bodyColor = '#a8d8d8' // Pastel teal/cyan
  const bodyHighlight = '#c5e8e8'
  const clawColor = '#e8a87c' // Coral/orange
  const clawTip = '#d4876c'
  const legColors = ['#b8a9c9', '#9b8bb4', '#c9a9b8'] // Purple/blue/pink tones
  const eyeColor = '#4a4a6a'

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      })
    }

    const handleClick = () => {
      // Add ripple particles on click - blue water splash
      const newParticles: Particle[] = []
      for (let i = 0; i < 25; i++) {
        const angle = (Math.PI * 2 * i) / 25
        const speed = 0.04 + Math.random() * 0.03
        const colors = ['#87ceeb', '#a8d8d8', '#b8d4e8', '#c5e8e8']
        newParticles.push({
          position: currentPosition.current.clone(),
          velocity: new THREE.Vector3(
            Math.cos(angle) * speed,
            0.03 + Math.random() * 0.03,
            Math.sin(angle) * speed
          ),
          life: 1,
          maxLife: 1,
          size: 0.025 + Math.random() * 0.02,
          color: colors[Math.floor(Math.random() * colors.length)],
        })
      }
      setParticles((prev) => [...prev, ...newParticles])
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('click', handleClick)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('click', handleClick)
    }
  }, [])

  useFrame((state, delta) => {
    if (!groupRef.current) return

    // Calculate 3D position from mouse
    const vector = new THREE.Vector3(mousePosition.x, mousePosition.y, 0.5)
    vector.unproject(camera)
    const dir = vector.sub(camera.position).normalize()
    const distance = (0.5 - camera.position.y) / dir.y
    targetPosition.current.copy(camera.position).add(dir.multiplyScalar(distance))

    // Physics-based smooth follow with inertia
    const acceleration = targetPosition.current.clone().sub(currentPosition.current).multiplyScalar(3)
    velocity.current.add(acceleration.multiplyScalar(delta))
    velocity.current.multiplyScalar(0.92) // Damping
    currentPosition.current.add(velocity.current.clone().multiplyScalar(delta * 10))
    
    groupRef.current.position.copy(currentPosition.current)

    // Cute wobble animation
    groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 2) * 0.08
    groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 1.5) * 0.05

    // Animate legs with walking motion
    groupRef.current.children.forEach((child, i) => {
      if (child.name.includes('leg')) {
        const legIndex = parseInt(child.name.split('-')[2]) || 0
        const side = child.name.includes('right') ? 1 : -1
        const phase = state.clock.elapsedTime * 10 + legIndex * 0.8 + (side > 0 ? Math.PI : 0)
        child.rotation.z = side * (0.4 + Math.sin(phase) * 0.25)
        child.rotation.y = Math.sin(phase * 0.5) * 0.15
      }
      if (child.name.includes('claw')) {
        // Pinching animation
        const pinch = Math.sin(state.clock.elapsedTime * 3) * 0.1 + 0.1
        if (child.name.includes('upper')) {
          child.rotation.z = child.name.includes('right') ? -pinch : pinch
        }
      }
      if (child.name.includes('eye')) {
        // Eye tracking - look towards movement direction
        const lookDir = velocity.current.clone().normalize()
        child.rotation.x = lookDir.z * 0.2
        child.rotation.z = lookDir.x * 0.2 * (child.name.includes('right') ? 1 : -1)
      }
    })

    // Create trail particles - soft blue bubbles
    if (Math.random() > 0.75 && velocity.current.length() > 0.001) {
      const trailColors = ['#87ceeb', '#a8d8d8', '#b8d4e8']
      setParticles((prev) => [
        ...prev.slice(-40),
        {
          position: currentPosition.current.clone().add(new THREE.Vector3(
            (Math.random() - 0.5) * 0.08,
            -0.02,
            (Math.random() - 0.5) * 0.08
          )),
          velocity: new THREE.Vector3(
            (Math.random() - 0.5) * 0.005,
            0.008 + Math.random() * 0.005,
            (Math.random() - 0.5) * 0.005
          ),
          life: 1,
          maxLife: 1,
          size: 0.015 + Math.random() * 0.015,
          color: trailColors[Math.floor(Math.random() * trailColors.length)],
        },
      ])
    }

    // Update particles
    setParticles((prev) =>
      prev
        .map((p) => ({
          ...p,
          position: p.position.clone().add(p.velocity),
          velocity: p.velocity.clone().multiplyScalar(0.97),
          life: p.life - delta * 1.2,
        }))
        .filter((p) => p.life > 0)
    )
  })

  return (
    <>
      {/* Cute cartoon crab body */}
      <group ref={groupRef}>
        {/* Main body shell - oval shape */}
        <mesh scale={[1.2, 0.7, 1]}>
          <sphereGeometry args={[0.1, 24, 24]} />
          <meshStandardMaterial
            color={bodyColor}
            roughness={0.4}
            metalness={0.1}
          />
        </mesh>
        
        {/* Body highlight/pattern */}
        <mesh position={[0, 0.02, 0.02]} scale={[0.9, 0.5, 0.7]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial
            color={bodyHighlight}
            roughness={0.5}
            transparent
            opacity={0.7}
          />
        </mesh>

        {/* Eye stalks */}
        <group position={[0.035, 0.06, 0.06]} name="eye-right">
          <mesh>
            <cylinderGeometry args={[0.012, 0.015, 0.04, 8]} />
            <meshStandardMaterial color={bodyColor} roughness={0.5} />
          </mesh>
          {/* Eyeball */}
          <mesh position={[0, 0.025, 0]}>
            <sphereGeometry args={[0.018, 12, 12]} />
            <meshStandardMaterial color="#f5f5f0" roughness={0.3} />
          </mesh>
          {/* Pupil */}
          <mesh position={[0, 0.028, 0.012]}>
            <sphereGeometry args={[0.008, 8, 8]} />
            <meshStandardMaterial color={eyeColor} roughness={0.2} />
          </mesh>
          {/* Eye shine */}
          <mesh position={[0.004, 0.032, 0.014]}>
            <sphereGeometry args={[0.003, 6, 6]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
          </mesh>
        </group>
        
        <group position={[-0.035, 0.06, 0.06]} name="eye-left">
          <mesh>
            <cylinderGeometry args={[0.012, 0.015, 0.04, 8]} />
            <meshStandardMaterial color={bodyColor} roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.025, 0]}>
            <sphereGeometry args={[0.018, 12, 12]} />
            <meshStandardMaterial color="#f5f5f0" roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.028, 0.012]}>
            <sphereGeometry args={[0.008, 8, 8]} />
            <meshStandardMaterial color={eyeColor} roughness={0.2} />
          </mesh>
          <mesh position={[-0.004, 0.032, 0.014]}>
            <sphereGeometry args={[0.003, 6, 6]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
          </mesh>
        </group>

        {/* Right claw arm */}
        <group position={[0.12, 0.01, 0.04]}>
          {/* Arm segment */}
          <mesh rotation={[0, 0, -0.4]}>
            <boxGeometry args={[0.06, 0.025, 0.02]} />
            <meshStandardMaterial color={clawColor} roughness={0.5} />
          </mesh>
          {/* Claw base */}
          <mesh position={[0.05, -0.01, 0]} rotation={[0, 0, -0.2]}>
            <boxGeometry args={[0.045, 0.035, 0.025]} />
            <meshStandardMaterial color={clawColor} roughness={0.4} />
          </mesh>
          {/* Upper claw pincer */}
          <mesh position={[0.08, 0.005, 0]} rotation={[0, 0, 0.1]} name="claw-right-upper">
            <boxGeometry args={[0.035, 0.015, 0.018]} />
            <meshStandardMaterial color={clawTip} roughness={0.4} />
          </mesh>
          {/* Lower claw pincer */}
          <mesh position={[0.08, -0.02, 0]} rotation={[0, 0, -0.15]}>
            <boxGeometry args={[0.03, 0.012, 0.016]} />
            <meshStandardMaterial color={clawTip} roughness={0.4} />
          </mesh>
        </group>

        {/* Left claw arm */}
        <group position={[-0.12, 0.01, 0.04]}>
          <mesh rotation={[0, 0, 0.4]}>
            <boxGeometry args={[0.06, 0.025, 0.02]} />
            <meshStandardMaterial color={clawColor} roughness={0.5} />
          </mesh>
          <mesh position={[-0.05, -0.01, 0]} rotation={[0, 0, 0.2]}>
            <boxGeometry args={[0.045, 0.035, 0.025]} />
            <meshStandardMaterial color={clawColor} roughness={0.4} />
          </mesh>
          <mesh position={[-0.08, 0.005, 0]} rotation={[0, 0, -0.1]} name="claw-left-upper">
            <boxGeometry args={[0.035, 0.015, 0.018]} />
            <meshStandardMaterial color={clawTip} roughness={0.4} />
          </mesh>
          <mesh position={[-0.08, -0.02, 0]} rotation={[0, 0, 0.15]}>
            <boxGeometry args={[0.03, 0.012, 0.016]} />
            <meshStandardMaterial color={clawTip} roughness={0.4} />
          </mesh>
        </group>

        {/* Right legs (4 legs) */}
        {[0, 1, 2, 3].map((i) => (
          <group 
            key={`leg-right-${i}`} 
            position={[0.08 - i * 0.01, -0.02, -0.03 + i * 0.025]}
            name={`leg-right-${i}`}
          >
            {/* Upper leg segment */}
            <mesh rotation={[0.2, 0, -0.5 - i * 0.1]}>
              <boxGeometry args={[0.05, 0.012, 0.01]} />
              <meshStandardMaterial color={legColors[i % 3]} roughness={0.5} />
            </mesh>
            {/* Lower leg segment */}
            <mesh position={[0.04, -0.015, 0]} rotation={[0.1, 0, -0.8]}>
              <boxGeometry args={[0.04, 0.008, 0.008]} />
              <meshStandardMaterial color={legColors[(i + 1) % 3]} roughness={0.5} />
            </mesh>
          </group>
        ))}

        {/* Left legs (4 legs) */}
        {[0, 1, 2, 3].map((i) => (
          <group 
            key={`leg-left-${i}`} 
            position={[-0.08 + i * 0.01, -0.02, -0.03 + i * 0.025]}
            name={`leg-left-${i}`}
          >
            <mesh rotation={[0.2, 0, 0.5 + i * 0.1]}>
              <boxGeometry args={[0.05, 0.012, 0.01]} />
              <meshStandardMaterial color={legColors[i % 3]} roughness={0.5} />
            </mesh>
            <mesh position={[-0.04, -0.015, 0]} rotation={[0.1, 0, 0.8]}>
              <boxGeometry args={[0.04, 0.008, 0.008]} />
              <meshStandardMaterial color={legColors[(i + 1) % 3]} roughness={0.5} />
            </mesh>
          </group>
        ))}

        {/* Cute mouth/smile */}
        <mesh position={[0, 0, 0.095]} rotation={[0, 0, 0]}>
          <torusGeometry args={[0.015, 0.004, 8, 16, Math.PI]} />
          <meshStandardMaterial color="#d4876c" roughness={0.5} />
        </mesh>
      </group>

      {/* Trail and splash particles */}
      {particles.map((particle, i) => (
        <mesh key={i} position={particle.position}>
          <sphereGeometry args={[particle.size * particle.life, 8, 8]} />
          <meshStandardMaterial
            color={particle.color}
            transparent
            opacity={particle.life * 0.7}
            emissive={particle.color}
            emissiveIntensity={0.2}
          />
        </mesh>
      ))}
    </>
  )
}
