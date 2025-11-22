'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import { Suspense, useRef, useEffect, useState } from 'react'
import * as THREE from 'three'
import PhotoNode from './PhotoNode'
import ConnectionLines from './ConnectionLines'
import NanoParticles from './NanoParticles'
import { useAutoRotateCamera } from '@/hooks/useAutoRotateCamera'
import { usePhotoData } from '@/hooks/usePhotoData'
import Preloader from './Preloader'
import PhotoDetailView from './PhotoDetailView'

interface PhotoData {
  id: number
  title: string
  description: string
  image_url: string
  created_at: string
  updated_at: string
}

export default function NanoMuseum() {
  const {
    photos,
    loading: photosLoading,
    error: photosError,
    selectedPhoto,
    setSelectedPhoto
  } = usePhotoData()

  const {
    cameraRef,
    isAutoRotating,
    setIsAutoRotating,
    transitionToPhoto
  } = useAutoRotateCamera()

  // Responsive state
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  if (photosLoading) {
    return <Preloader />
  }

  if (photosError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Error Loading Museum</h2>
          <p className="text-gray-400">{photosError}</p>
        </div>
      </div>
    )
  }

  const handlePhotoClick = (photo: PhotoData, position: [number, number, number]) => {
    setIsAutoRotating(false)
    setSelectedPhoto(photo)
    transitionToPhoto(position)
  }

  const handleCloseDetail = () => {
    setSelectedPhoto(null)
    setIsAutoRotating(true)
  }

  return (
    <div className="w-full h-screen bg-black relative">
      <Canvas
        camera={{
          position: [0, 0, isMobile ? 40 : 30],
          fov: isMobile ? 75 : 60,
          near: 0.1,
          far: 1000
        }}
        gl={{
          antialias: !isMobile,
          alpha: false,
          powerPreference: 'high-performance'
        }}
        shadows={!isMobile}
        onTouchStart={() => setIsAutoRotating(false)}
      >
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.3} />
          <pointLight position={[10, 10, 10]} intensity={1} castShadow />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4a90e2" />
          <spotLight
            position={[0, 20, 0]}
            angle={0.3}
            penumbra={1}
            intensity={0.8}
            castShadow
          />

          {/* Background stars for nano-universe effect */}
          <Stars
            radius={300}
            depth={50}
            count={5000}
            factor={7}
            saturation={0}
            fade={true}
            speed={1}
          />

          {/* Nano particles for atmosphere */}
          <NanoParticles count={1000} />

          {/* Photo nodes */}
          {photos.map((photo, index) => {
            // Generate spherical distribution for nodes
            const angle = (index / photos.length) * Math.PI * 2
            const radius = 15 + Math.random() * 10
            const height = (Math.random() - 0.5) * 20

            const position: [number, number, number] = [
              Math.cos(angle) * radius,
              height,
              Math.sin(angle) * radius
            ]

            return (
              <PhotoNode
                key={photo.id}
                photo={photo}
                position={position}
                onClick={() => handlePhotoClick(photo, position)}
              />
            )
          })}

          {/* Connection lines between nearby nodes */}
          <ConnectionLines photos={photos} />

          {/* Camera controls (disabled when auto-rotating) */}
          <OrbitControls
            enabled={!isAutoRotating}
            enableZoom={true}
            enablePan={false}
            maxPolarAngle={Math.PI * 0.8}
            minDistance={isMobile ? 20 : 10}
            maxDistance={isMobile ? 60 : 50}
            enableDamping={true}
            dampingFactor={0.05}
            touches={{
              ONE: isMobile ? THREE.TOUCH.ROTATE : undefined,
              TWO: isMobile ? THREE.TOUCH.DOLLY_PAN : undefined
            }}
          />
        </Suspense>
      </Canvas>

      {/* Photo detail view */}
      {selectedPhoto && (
        <PhotoDetailView
          photo={selectedPhoto}
          onClose={handleCloseDetail}
        />
      )}

      {/* Instructions overlay */}
      <div className="absolute top-4 left-4 text-white bg-black bg-opacity-50 p-4 rounded-lg max-w-sm">
        <h1 className="text-xl font-bold mb-2">Nano Museum</h1>
        <p className="text-sm text-gray-300">
          {isAutoRotating
            ? "Click on any photo node to explore • Camera auto-rotating at speed 3.0"
            : "Drag to rotate • Scroll to zoom • Click empty space to resume auto-rotation"
          }
        </p>
      </div>
    </div>
  )
}