'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Line } from '@react-three/drei'
import * as THREE from 'three'

interface PhotoData {
  id: number
  title: string
  description: string
  image_url: string
  created_at: string
  updated_at: string
}

interface ConnectionLinesProps {
  photos: PhotoData[]
}

export default function ConnectionLines({ photos }: ConnectionLinesProps) {
  const linesRef = useRef<THREE.Group>(null)

  // Calculate connections between nearby nodes
  const connections = useMemo(() => {
    const lines: Array<{
      start: [number, number, number]
      end: [number, number, number]
      distance: number
    }> = []

    // Generate positions for each photo (same logic as in NanoMuseum)
    const positions: Array<[number, number, number]> = photos.map((photo, index) => {
      const angle = (index / photos.length) * Math.PI * 2
      const radius = 15 + Math.random() * 10
      const height = (Math.random() - 0.5) * 20

      return [
        Math.cos(angle) * radius,
        height,
        Math.sin(angle) * radius
      ]
    })

    // Create connections between nodes that are within a certain distance
    const connectionDistance = 20

    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        const distance = Math.sqrt(
          Math.pow(positions[i][0] - positions[j][0], 2) +
          Math.pow(positions[i][1] - positions[j][1], 2) +
          Math.pow(positions[i][2] - positions[j][2], 2)
        )

        if (distance < connectionDistance) {
          lines.push({
            start: positions[i],
            end: positions[j],
            distance
          })
        }
      }
    }

    return lines
  }, [photos])

  // Animated effect for lines
  useFrame((state) => {
    if (linesRef.current) {
      linesRef.current.children.forEach((child, index) => {
        // Pulsing effect
        const scale = 1 + Math.sin(state.clock.elapsedTime * 2 + index * 0.5) * 0.1
        child.scale.setScalar(scale)
      })
    }
  })

  if (connections.length === 0) return null

  return (
    <group ref={linesRef}>
      {connections.map((connection, index) => {
        // Create a gradient color based on distance
        const intensity = Math.max(0, 1 - connection.distance / 20)
        const color = new THREE.Color()
        color.setHSL(0.6 - intensity * 0.2, 0.8, 0.3 + intensity * 0.3)

        return (
          <Line
            key={`${index}-${connection.distance}`}
            points={[connection.start, connection.end]}
            color={color}
            lineWidth={intensity * 2}
            transparent={true}
            opacity={0.3 + intensity * 0.4}
            dashed={true}
            dashScale={10}
            dashSize={0.5}
            gapSize={0.5}
          />
        )
      })}
    </group>
  )
}