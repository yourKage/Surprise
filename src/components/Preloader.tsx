'use client'

import { useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import NanoParticles from './NanoParticles'

export default function Preloader() {
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [loadingComplete, setLoadingComplete] = useState(false)

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => setLoadingComplete(true), 500)
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 200)

    return () => clearInterval(interval)
  }, [])

  const LoadingScene = () => (
    <>
      <Stars
        radius={200}
        depth={30}
        count={2000}
        factor={5}
        saturation={0}
        fade={true}
        speed={2}
      />
      <NanoParticles count={500} />
    </>
  )

  if (loadingComplete) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black">
      {/* 3D Background */}
      <div className="absolute inset-0">
        <Canvas
          camera={{ position: [0, 0, 20], fov: 60 }}
          gl={{ alpha: false }}
        >
          <LoadingScene />
        </Canvas>
      </div>

      {/* Loading Content */}
      <div className="relative z-10 flex flex-col items-center space-y-8">
        {/* Logo/Title */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-wider">
            Nano Museum
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-md mx-auto">
            Initializing your immersive 3D experience...
          </p>
        </div>

        {/* Loading Bar */}
        <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-e94560 to-0f3460 transition-all duration-300 ease-out"
            style={{ width: `${Math.min(loadingProgress, 100)}%` }}
          ></div>
        </div>

        {/* Percentage */}
        <div className="text-2xl font-mono text-e94560">
          {Math.round(Math.min(loadingProgress, 100))}%
        </div>

        {/* Loading Details */}
        <div className="grid grid-cols-3 gap-8 mt-8">
          <div className="text-center">
            <div className="w-3 h-3 bg-e94560 rounded-full mx-auto mb-2 animate-pulse"></div>
            <p className="text-xs text-gray-500 uppercase tracking-wider">Loading 3D Assets</p>
          </div>
          <div className="text-center">
            <div className="w-3 h-3 bg-0f3460 rounded-full mx-auto mb-2 animate-pulse delay-75"></div>
            <p className="text-xs text-gray-500 uppercase tracking-wider">Rendering Scene</p>
          </div>
          <div className="text-center">
            <div className="w-3 h-3 bg-16213e rounded-full mx-auto mb-2 animate-pulse delay-150"></div>
            <p className="text-xs text-gray-500 uppercase tracking-wider">Initializing Camera</p>
          </div>
        </div>

        {/* Tech-style rotating border */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-4 left-4 w-16 h-16 border-t-2 border-l-2 border-e94560 animate-pulse"></div>
          <div className="absolute top-4 right-4 w-16 h-16 border-t-2 border-r-2 border-0f3460 animate-pulse delay-75"></div>
          <div className="absolute bottom-4 left-4 w-16 h-16 border-b-2 border-l-2 border-16213e animate-pulse delay-150"></div>
          <div className="absolute bottom-4 right-4 w-16 h-16 border-b-2 border-r-2 border-e94560 animate-pulse"></div>
        </div>
      </div>
    </div>
  )
}