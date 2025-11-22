import { PhotoData } from '@/hooks/usePhotoData'

export interface NodePosition {
  x: number
  y: number
  z: number
  clusterId?: number
}

export interface Cluster {
  id: number
  center: NodePosition
  radius: number
  photoIds: number[]
}

// Generate 3D positions for photo nodes using spherical distribution
export function generateNodePositions(
  photos: PhotoData[],
  options: {
    minRadius?: number
    maxRadius?: number
    heightRange?: number
    enableClustering?: boolean
    clusterCount?: number
  } = {}
): NodePosition[] {
  const {
    minRadius = 12,
    maxRadius = 25,
    heightRange = 20,
    enableClustering = true,
    clusterCount = Math.min(4, Math.ceil(photos.length / 3))
  } = options

  if (enableClustering && photos.length > 6) {
    return generateClusteredPositions(photos, {
      minRadius,
      maxRadius,
      heightRange,
      clusterCount
    })
  } else {
    return generateSphericalPositions(photos, {
      minRadius,
      maxRadius,
      heightRange
    })
  }
}

// Simple spherical distribution
function generateSphericalPositions(
  photos: PhotoData[],
  options: {
    minRadius: number
    maxRadius: number
    heightRange: number
  }
): NodePosition[] {
  const { minRadius, maxRadius, heightRange } = options

  return photos.map((photo, index) => {
    const angle = (index / photos.length) * Math.PI * 2
    const radius = minRadius + (Math.random() * (maxRadius - minRadius))
    const height = (Math.random() - 0.5) * heightRange

    // Add some variation to prevent perfect alignment
    const angleVariation = (Math.random() - 0.5) * 0.5
    const adjustedAngle = angle + angleVariation

    return {
      x: Math.cos(adjustedAngle) * radius,
      y: height,
      z: Math.sin(adjustedAngle) * radius
    }
  })
}

// Clustered positioning for better organization
function generateClusteredPositions(
  photos: PhotoData[],
  options: {
    minRadius: number
    maxRadius: number
    heightRange: number
    clusterCount: number
  }
): NodePosition[] {
  const { minRadius, maxRadius, heightRange, clusterCount } = options

  // Create clusters
  const clusters: Cluster[] = []
  const photosPerCluster = Math.ceil(photos.length / clusterCount)

  for (let i = 0; i < clusterCount; i++) {
    const clusterAngle = (i / clusterCount) * Math.PI * 2
    const clusterRadius = minRadius + (maxRadius - minRadius) * 0.7
    const clusterHeight = (Math.random() - 0.5) * heightRange * 0.8

    clusters.push({
      id: i,
      center: {
        x: Math.cos(clusterAngle) * clusterRadius,
        y: clusterHeight,
        z: Math.sin(clusterAngle) * clusterRadius
      },
      radius: 6 + Math.random() * 4,
      photoIds: []
    })
  }

  // Assign photos to clusters
  photos.forEach((photo, index) => {
    const clusterIndex = index % clusterCount
    clusters[clusterIndex].photoIds.push(photo.id)
  })

  // Generate positions within each cluster
  const positions: NodePosition[] = []

  clusters.forEach((cluster) => {
    cluster.photoIds.forEach((photoId, index) => {
      // Local spherical coordinates within cluster
      const localAngle = (index / cluster.photoIds.length) * Math.PI * 2
      const localRadius = (cluster.radius * 0.6) + (Math.random() * cluster.radius * 0.4)
      const localHeight = (Math.random() - 0.5) * cluster.radius

      // Convert to world coordinates
      const position: NodePosition = {
        x: cluster.center.x + Math.cos(localAngle) * localRadius,
        y: cluster.center.y + localHeight,
        z: cluster.center.z + Math.sin(localAngle) * localRadius,
        clusterId: cluster.id
      }

      positions.push(position)
    })
  })

  return positions
}

// Calculate optimal connection lines between nearby nodes
export function calculateConnections(
  positions: NodePosition[],
  maxDistance: number = 20,
  maxConnections: number = 3
): Array<{ start: NodePosition; end: NodePosition; distance: number }> {
  const connections: Array<{ start: NodePosition; end: NodePosition; distance: number }> = []

  for (let i = 0; i < positions.length; i++) {
    const distances: Array<{ index: number; distance: number }> = []

    for (let j = i + 1; j < positions.length; j++) {
      const distance = calculateDistance(positions[i], positions[j])

      if (distance < maxDistance) {
        distances.push({ index: j, distance })
      }
    }

    // Sort by distance and take the closest connections
    distances.sort((a, b) => a.distance - b.distance)
    const closestConnections = distances.slice(0, maxConnections)

    closestConnections.forEach(({ index, distance }) => {
      connections.push({
        start: positions[i],
        end: positions[index],
        distance
      })
    })
  }

  return connections
}

function calculateDistance(pos1: NodePosition, pos2: NodePosition): number {
  return Math.sqrt(
    Math.pow(pos1.x - pos2.x, 2) +
    Math.pow(pos1.y - pos2.y, 2) +
    Math.pow(pos1.z - pos2.z, 2)
  )
}

// Get connections for a specific cluster (creates tighter networks)
export function getClusterConnections(
  positions: NodePosition[],
  clusterId: number,
  maxDistance: number = 15
): Array<{ start: NodePosition; end: NodePosition }> {
  const clusterPositions = positions.filter(pos => pos.clusterId === clusterId)
  const connections: Array<{ start: NodePosition; end: NodePosition }> = []

  for (let i = 0; i < clusterPositions.length; i++) {
    for (let j = i + 1; j < clusterPositions.length; j++) {
      const distance = calculateDistance(clusterPositions[i], clusterPositions[j])

      if (distance < maxDistance) {
        connections.push({
          start: clusterPositions[i],
          end: clusterPositions[j]
        })
      }
    }
  }

  return connections
}

// Animate node positions over time for organic movement
export function animateNodePositions(
  positions: NodePosition[],
  time: number,
  options: {
    amplitude?: number
    frequency?: number
    enableVerticalMovement?: boolean
  } = {}
): NodePosition[] {
  const {
    amplitude = 0.3,
    frequency = 0.5,
    enableVerticalMovement = true
  } = options

  return positions.map((position, index) => {
    const phase = index * 0.5 + time * frequency

    return {
      x: position.x + Math.sin(phase) * amplitude,
      y: enableVerticalMovement
        ? position.y + Math.sin(phase * 1.5) * amplitude * 0.5
        : position.y,
      z: position.z + Math.cos(phase) * amplitude,
      clusterId: position.clusterId
    }
  })
}