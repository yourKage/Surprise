'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

interface PhotoData {
  id: number
  title: string
  description: string
  image_url: string
  created_at: string
  updated_at: string
}

interface PhotoDetailViewProps {
  photo: PhotoData
  onClose: () => void
}

export default function PhotoDetailView({ photo, onClose }: PhotoDetailViewProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleImageError = () => {
    setImageError(true)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-80 backdrop-blur-sm">
      <div className="relative max-w-4xl w-full max-h-[90vh] overflow-auto bg-gray-900 rounded-lg shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-all duration-200"
          aria-label="Close photo detail"
        >
          <X size={24} />
        </button>

        <div className="grid md:grid-cols-2 gap-6 p-6">
          {/* Image section */}
          <div className="flex items-center justify-center bg-black rounded-lg overflow-hidden">
            {!imageError ? (
              <div className="relative w-full h-full min-h-[300px] flex items-center justify-center">
                {!imageLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-e94560"></div>
                  </div>
                )}
                <img
                  src={photo.image_url}
                  alt={photo.title}
                  className={`max-w-full max-h-[60vh] object-contain transition-opacity duration-300 ${
                    imageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  onLoad={() => setImageLoaded(true)}
                  onError={handleImageError}
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 bg-gray-800 text-center">
                <div className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-gray-400">Image not available</p>
              </div>
            )}
          </div>

          {/* Details section */}
          <div className="flex flex-col justify-center space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">{photo.title}</h2>
              <div className="h-1 w-20 bg-e94560 rounded-full"></div>
            </div>

            {photo.description && (
              <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wider">Description</h3>
                <p className="text-gray-200 leading-relaxed">{photo.description}</p>
              </div>
            )}

            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-e94560 rounded-full"></div>
                <span className="text-sm text-gray-400">
                  Created: <span className="text-white font-medium">{formatDate(photo.created_at)}</span>
                </span>
              </div>

              {photo.updated_at !== photo.created_at && (
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-0f3460 rounded-full"></div>
                  <span className="text-sm text-gray-400">
                    Updated: <span className="text-white font-medium">{formatDate(photo.updated_at)}</span>
                  </span>
                </div>
              )}
            </div>

            {/* Tech-style decoration */}
            <div className="pt-4 border-t border-gray-700">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-e94560">#{photo.id}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider">Photo ID</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-0f3460">
                    {photo.description ? photo.description.length : 0}
                  </div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider">Characters</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-16213e">
                    {new Date(photo.created_at).getFullYear()}
                  </div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider">Year</div>
                </div>
              </div>
            </div>

            {/* Action button */}
            <div className="pt-4">
              <button
                onClick={onClose}
                className="w-full py-3 px-6 bg-e94560 hover:bg-ff6b6b text-white font-medium rounded-lg transition-colors duration-200 transform hover:scale-[1.02]"
              >
                Return to Museum
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}