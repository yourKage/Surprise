// Performance monitoring and optimization utilities

export interface PerformanceMetrics {
  fps: number
  memoryUsage?: number
  renderTime: number
  frameTime: number
}

export class PerformanceMonitor {
  private frameCount = 0
  private lastTime = performance.now()
  private fps = 0
  private frameTime = 0
  private renderTime = 0

  constructor() {
    this.startMonitoring()
  }

  startMonitoring() {
    const measurePerformance = (currentTime: number) => {
      this.frameCount++

      // Calculate FPS every second
      if (currentTime >= this.lastTime + 1000) {
        this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime))
        this.frameCount = 0
        this.lastTime = currentTime
      }

      this.frameTime = currentTime - this.lastTime
      requestAnimationFrame(measurePerformance)
    }

    requestAnimationFrame(measurePerformance)
  }

  getMetrics(): PerformanceMetrics {
    return {
      fps: this.fps,
      renderTime: this.renderTime,
      frameTime: this.frameTime,
      memoryUsage: this.getMemoryUsage()
    }
  }

  private getMemoryUsage(): number | undefined {
    if ('memory' in performance) {
      return (performance as any).memory.usedJSHeapSize / 1024 / 1024 // Convert to MB
    }
    return undefined
  }

  // Optimize based on current performance
  suggestOptimizations(metrics: PerformanceMetrics): string[] {
    const suggestions: string[] = []

    if (metrics.fps < 30) {
      suggestions.push('Reduce particle count')
      suggestions.push('Lower shadow quality')
      suggestions.push('Disable antialiasing on mobile')
    }

    if (metrics.memoryUsage && metrics.memoryUsage > 100) {
      suggestions.push('Dispose unused textures')
      suggestions.push('Implement LOD for distant objects')
    }

    if (metrics.frameTime > 16.67) { // 60fps threshold
      suggestions.push('Reduce particle effects')
      suggestions.push('Simplify connection lines')
    }

    return suggestions
  }
}

// Level of Detail (LOD) manager
export class LODManager {
  private distances: { [key: string]: number } = {}

  calculateLOD(cameraPosition: [number, number, number], objectPosition: [number, number, number]): number {
    const distance = Math.sqrt(
      Math.pow(cameraPosition[0] - objectPosition[0], 2) +
      Math.pow(cameraPosition[1] - objectPosition[1], 2) +
      Math.pow(cameraPosition[2] - objectPosition[2], 2)
    )

    // LOD levels: 0 (high), 1 (medium), 2 (low)
    if (distance < 20) return 0 // High detail
    if (distance < 40) return 1 // Medium detail
    return 2 // Low detail
  }

  shouldRenderObject(distance: number, maxRenderDistance: number = 100): boolean {
    return distance < maxRenderDistance
  }
}

// Device capability detection
export const deviceCapabilities = {
  isMobile: () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  },

  isLowEndDevice: () => {
    // Basic heuristics for low-end device detection
    const isMobile = deviceCapabilities.isMobile()
    const cores = navigator.hardwareConcurrency || 4
    const memory = 'deviceMemory' in navigator ? (navigator as any).deviceMemory : 4

    return isMobile && cores <= 4 && memory <= 4
  },

  getOptimalSettings: () => {
    const isLowEnd = deviceCapabilities.isLowEndDevice()
    const isMobile = deviceCapabilities.isMobile()

    return {
      particleCount: isLowEnd ? 300 : isMobile ? 600 : 1000,
      enableShadows: !isLowEnd,
      enableAntialiasing: !isMobile,
      maxConnectionLines: isLowEnd ? 50 : 100,
      renderDistance: isLowEnd ? 60 : 100,
      textureQuality: isLowEnd ? 'low' : isMobile ? 'medium' : 'high'
    }
  }
}

// FPS-based quality adjustment
export class AdaptiveQuality {
  private currentQuality = 'high'
  private qualityLevels = ['low', 'medium', 'high'] as const
  private fpsHistory: number[] = []
  private maxHistorySize = 60 // Store last 60 frames

  recordFrame(fps: number) {
    this.fpsHistory.push(fps)
    if (this.fpsHistory.length > this.maxHistorySize) {
      this.fpsHistory.shift()
    }

    this.adjustQuality()
  }

  private adjustQuality() {
    if (this.fpsHistory.length < 30) return // Need enough data

    const avgFps = this.fpsHistory.reduce((a, b) => a + b, 0) / this.fpsHistory.length

    if (avgFps < 25 && this.currentQuality !== 'low') {
      this.downgradeQuality()
    } else if (avgFps > 50 && this.currentQuality !== 'high') {
      this.upgradeQuality()
    }
  }

  private downgradeQuality() {
    const currentIndex = this.qualityLevels.indexOf(this.currentQuality)
    if (currentIndex > 0) {
      this.currentQuality = this.qualityLevels[currentIndex - 1]
      console.log(`Downgrading quality to ${this.currentQuality}`)
    }
  }

  private upgradeQuality() {
    const currentIndex = this.qualityLevels.indexOf(this.currentQuality)
    if (currentIndex < this.qualityLevels.length - 1) {
      this.currentQuality = this.qualityLevels[currentIndex + 1]
      console.log(`Upgrading quality to ${this.currentQuality}`)
    }
  }

  getQualitySettings() {
    const settings = {
      low: {
        particleCount: 200,
        enableShadows: false,
        enableAntialiasing: false,
        maxConnectionLines: 30
      },
      medium: {
        particleCount: 600,
        enableShadows: false,
        enableAntialiasing: true,
        maxConnectionLines: 70
      },
      high: {
        particleCount: 1000,
        enableShadows: true,
        enableAntialiasing: true,
        maxConnectionLines: 100
      }
    }

    return settings[this.currentQuality as keyof typeof settings]
  }
}