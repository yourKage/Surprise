'use client'

import { useState, useEffect } from 'react'

interface PhotoData {
  id: number
  title: string
  description: string
  image_url: string
  created_at: string
  updated_at: string
}

export function usePhotoData() {
  const [photos, setPhotos] = useState<PhotoData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoData | null>(null)

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        setLoading(true)
        setError(null)

        // In development, we'll use a fallback URL
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
        const response = await fetch(`${apiUrl}/api/photos/`)

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        setPhotos(data)
      } catch (err) {
        console.error('Failed to fetch photos:', err)
        setError(err instanceof Error ? err.message : 'Failed to load photos')

        // For development, provide mock data
        const mockPhotos: PhotoData[] = [
          {
            id: 1,
            title: "Sample Photo 1",
            description: "A beautiful sample photo for testing the 3D museum",
            image_url: "https://via.placeholder.com/400x300/1a1a2e/16213e?text=Photo+1",
            created_at: "2024-01-01T00:00:00Z",
            updated_at: "2024-01-01T00:00:00Z"
          },
          {
            id: 2,
            title: "Sample Photo 2",
            description: "Another amazing photo floating in the nano universe",
            image_url: "https://via.placeholder.com/400x300/16213e/e94560?text=Photo+2",
            created_at: "2024-01-02T00:00:00Z",
            updated_at: "2024-01-02T00:00:00Z"
          },
          {
            id: 3,
            title: "Sample Photo 3",
            description: "Captured moments in our digital museum space",
            image_url: "https://via.placeholder.com/400x300/e94560/0f3460?text=Photo+3",
            created_at: "2024-01-03T00:00:00Z",
            updated_at: "2024-01-03T00:00:00Z"
          }
        ]
        setPhotos(mockPhotos)
      } finally {
        setLoading(false)
      }
    }

    fetchPhotos()
  }, [])

  // Refetch photos (useful after adding new photos via admin)
  const refetchPhotos = async () => {
    try {
      setError(null)
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const response = await fetch(`${apiUrl}/api/photos/`)

      if (response.ok) {
        const data = await response.json()
        setPhotos(data)
      }
    } catch (err) {
      console.error('Failed to refetch photos:', err)
    }
  }

  return {
    photos,
    loading,
    error,
    selectedPhoto,
    setSelectedPhoto,
    refetchPhotos
  }
}

export type { PhotoData }