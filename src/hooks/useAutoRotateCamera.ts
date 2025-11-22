'use client'

import { useRef, useEffect, useState } from 'react'
import * as THREE from 'three'

export function useAutoRotateCamera() {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null)
  const [isAutoRotating, setIsAutoRotating] = useState(true)
  const frameRef = useRef<number>(0)
  const rotationSpeed = 3.0 // As specified in requirements
  const targetPositionRef = useRef<THREE.Vector3 | null>(null)
  const currentPositionRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 30))
  const isTransitioningRef = useRef<boolean>(false)

  // Auto-rotation effect
  useEffect(() => {
    if (!isAutoRotating || isTransitioningRef.current) {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
      }
      return
    }

    const animate = () => {
      if (cameraRef.current && !isTransitioningRef.current) {
        const time = Date.now() * 0.001 // Convert to seconds
        const radius = 30

        // Create smooth circular motion at speed 3.0
        const angle = time * (rotationSpeed / 10) // Scale down for smooth motion

        // Update camera position for circular motion
        cameraRef.current.position.x = Math.cos(angle) * radius
        cameraRef.current.position.z = Math.sin(angle) * radius
        cameraRef.current.position.y = Math.sin(time * 0.5) * 5 // Subtle vertical movement

        // Always look at the center
        cameraRef.current.lookAt(0, 0, 0)

        // Update current position reference
        currentPositionRef.current.copy(cameraRef.current.position)
      }

      frameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
      }
    }
  }, [isAutoRotating])

  // Smooth transition to a specific photo
  const transitionToPhoto = (targetPosition: [number, number, number]) => {
    if (!cameraRef.current) return

    isTransitioningRef.current = true
    targetPositionRef.current = new THREE.Vector3(...targetPosition)

    const startPosition = currentPositionRef.current.clone()
    const targetCameraPosition = new THREE.Vector3(
      targetPosition[0] + 8, // Offset to view the photo properly
      targetPosition[1] + 2,
      targetPosition[2] + 8
    )

    const duration = 2000 // 2 seconds for smooth transition
    const startTime = Date.now()

    const animateTransition = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Ease in-out function for smooth motion
      const easeProgress = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2

      if (cameraRef.current) {
        // Interpolate camera position
        cameraRef.current.position.lerpVectors(
          startPosition,
          targetCameraPosition,
          easeProgress
        )

        // Always look at the target photo position
        cameraRef.current.lookAt(targetPositionRef.current)

        // Update current position
        currentPositionRef.current.copy(cameraRef.current.position)
      }

      if (progress < 1) {
        requestAnimationFrame(animateTransition)
      } else {
        isTransitioningRef.current = false
      }
    }

    animateTransition()
  }

  // Resume auto-rotation (returns to circular path)
  const resumeAutoRotation = () => {
    if (!cameraRef.current) return

    isTransitioningRef.current = true

    const startPosition = currentPositionRef.current.clone()
    const radius = 30
    const time = Date.now() * 0.001
    const angle = time * (rotationSpeed / 10)

    const targetPosition = new THREE.Vector3(
      Math.cos(angle) * radius,
      Math.sin(time * 0.5) * 5,
      Math.sin(angle) * radius
    )

    const duration = 1500 // 1.5 seconds to return to orbit
    const startTime = Date.now()

    const animateReturn = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)

      const easeProgress = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2

      if (cameraRef.current) {
        cameraRef.current.position.lerpVectors(
          startPosition,
          targetPosition,
          easeProgress
        )

        cameraRef.current.lookAt(0, 0, 0)
        currentPositionRef.current.copy(cameraRef.current.position)
      }

      if (progress < 1) {
        requestAnimationFrame(animateReturn)
      } else {
        isTransitioningRef.current = false
        setIsAutoRotating(true)
      }
    }

    animateReturn()
  }

  return {
    cameraRef,
    isAutoRotating,
    setIsAutoRotating,
    transitionToPhoto,
    resumeAutoRotation
  }
}