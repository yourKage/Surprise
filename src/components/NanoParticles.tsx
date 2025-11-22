'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface NanoParticlesProps {
  count?: number
}

export default function NanoParticles({ count = 1000 }: NanoParticlesProps) {
  const particlesRef = useRef<THREE.Points>(null)

  // Generate random particle positions
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const sizes = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      // Position particles in a sphere around the origin
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(Math.random() * 2 - 1)
      const radius = 30 + Math.random() * 50

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = radius * Math.cos(phi)

      // Color variations (blues and cyans for tech/nano effect)
      const colorChoice = Math.random()
      if (colorChoice < 0.33) {
        colors[i * 3] = 0.1     // R
        colors[i * 3 + 1] = 0.3 // G
        colors[i * 3 + 2] = 0.8 // B
      } else if (colorChoice < 0.66) {
        colors[i * 3] = 0.1     // R
        colors[i * 3 + 1] = 0.6 // G
        colors[i * 3 + 2] = 0.9 // B
      } else {
        colors[i * 3] = 0.6     // R
        colors[i * 3 + 1] = 0.1 // G
        colors[i * 3 + 2] = 0.8 // B
      }

      // Random sizes
      sizes[i] = Math.random() * 2 + 0.5
    }

    return { positions, colors, sizes }
  }, [count])

  // Animate particles
  useFrame((state) => {
    if (particlesRef.current) {
      // Slowly rotate all particles
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02
      particlesRef.current.rotation.x = state.clock.elapsedTime * 0.01

      // Animate individual particles
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array
      const time = state.clock.elapsedTime

      for (let i = 0; i < count; i++) {
        const i3 = i * 3

        // Gentle floating motion
        const offset = Math.sin(time + i * 0.1) * 0.1
        positions[i3 + 1] += offset * 0.01
      }

      particlesRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particles.positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[particles.colors, 3]}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[particles.sizes, 1]}
        />
      </bufferGeometry>

      {/* Custom shader for better particle rendering */}
      <pointsMaterial
        size={1}
        sizeAttenuation={true}
        vertexColors={true}
        transparent={true}
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}