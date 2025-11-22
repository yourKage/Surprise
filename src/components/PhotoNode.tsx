'use client'

import { useRef, useState, useEffect } from 'react'
import { Mesh, TextureLoader } from 'three'
import { useFrame, useLoader } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'

interface PhotoData {
  id: number
  title: string
  description: string
  image_url: string
  created_at: string
  updated_at: string
}

interface PhotoNodeProps {
  photo: PhotoData
  position: [number, number, number]
  onClick: () => void
}

export default function PhotoNode({ photo, position, onClick }: PhotoNodeProps) {
  const meshRef = useRef<Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const [imageTexture, setImageTexture] = useState<THREE.Texture | null>(null)

  // Load image texture
  useEffect(() => {
    const textureLoader = new TextureLoader()

    const loadTexture = () => {
      try {
        const texture = textureLoader.load(photo.image_url)
        setImageTexture(texture)
      } catch (error) {
        console.error(`Failed to load texture for ${photo.title}:`, error)
        // Create a fallback texture
        const canvas = document.createElement('canvas')
        canvas.width = 256
        canvas.height = 256
        const context = canvas.getContext('2d')!

        // Create gradient background
        const gradient = context.createLinearGradient(0, 0, 256, 256)
        gradient.addColorStop(0, '#1a1a2e')
        gradient.addColorStop(1, '#16213e')
        context.fillStyle = gradient
        context.fillRect(0, 0, 256, 256)

        // Add text
        context.fillStyle = '#e94560'
        context.font = '20px Arial'
        context.textAlign = 'center'
        context.fillText('Image', 128, 120)
        context.fillText('Not Found', 128, 150)

        const texture = new THREE.CanvasTexture(canvas)
        setImageTexture(texture)
      }
    }

    loadTexture()

    return () => {
      if (imageTexture) {
        imageTexture.dispose()
      }
    }
  }, [photo.image_url])

  // Floating animation and hover effects
  useFrame((state) => {
    if (meshRef.current) {
      // Subtle floating animation
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + photo.id) * 0.3

      // Gentle rotation
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5 + photo.id

      // Hover effect - scale up
      const targetScale = hovered ? 1.3 : 1.0
      meshRef.current.scale.x = THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, 0.1)
      meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, targetScale, 0.1)
      meshRef.current.scale.z = THREE.MathUtils.lerp(meshRef.current.scale.z, targetScale, 0.1)
    }
  })

  const handleClick = (e: any) => {
    e.stopPropagation()
    onClick()
  }

  const handlePointerOver = (e: any) => {
    e.stopPropagation()
    setHovered(true)
    document.body.style.cursor = 'pointer'
  }

  const handlePointerOut = (e: any) => {
    e.stopPropagation()
    setHovered(false)
    document.body.style.cursor = 'default'
  }

  return (
    <group position={position}>
      {/* Tech-style sphere */}
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshStandardMaterial
          color={hovered ? '#e94560' : '#16213e'}
          emissive={hovered ? '#e94560' : '#1a1a2e'}
          emissiveIntensity={hovered ? 0.3 : 0.1}
          wireframe={false}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Wireframe overlay for tech effect */}
      <mesh scale={[1.52, 1.52, 1.52]}>
        <sphereGeometry args={[1.5, 16, 16]} />
        <meshBasicMaterial
          color={hovered ? '#0f3460' : '#16213e'}
          wireframe={true}
          transparent={true}
          opacity={0.3}
        />
      </mesh>

      {/* Photo texture on the sphere */}
      {imageTexture && (
        <mesh scale={[1.4, 1.4, 1.4]}>
          <sphereGeometry args={[1.5, 32, 32]} />
          <meshStandardMaterial
            map={imageTexture}
            transparent={true}
            opacity={0.8}
            metalness={0.3}
            roughness={0.7}
          />
        </mesh>
      )}

      {/* Glowing edge effect when hovered */}
      {hovered && (
        <mesh scale={[1.7, 1.7, 1.7]}>
          <sphereGeometry args={[1.5, 32, 32]} />
          <meshBasicMaterial
            color="#e94560"
            transparent={true}
            opacity={0.1}
            side={THREE.BackSide}
          />
        </mesh>
      )}

      {/* Title text (appears on hover) */}
      {hovered && (
        <Text
          position={[0, -2.5, 0]}
          fontSize={0.5}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          material-transparent={true}
          material-opacity={0.9}
        >
          {photo.title}
        </Text>
      )}

      {/* Tech dots orbiting the sphere */}
      <group>
        {[0, 1, 2, 3].map((i) => {
          const angle = (i / 4) * Math.PI * 2
          const distance = 2.5
          return (
            <mesh
              key={i}
              position={[
                Math.cos(angle) * distance,
                Math.sin(angle) * distance * 0.5,
                Math.sin(angle) * distance
              ]}
            >
              <octahedronGeometry args={[0.1, 0]} />
              <meshBasicMaterial
                color={hovered ? '#e94560' : '#0f3460'}
                emissive={hovered ? '#e94560' : '#0f3460'}
                emissiveIntensity={0.5}
              />
            </mesh>
          )
        })}
      </group>
    </group>
  )
}