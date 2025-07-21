/**
 * Bundle optimization utilities
 */

/**
 * Dynamic import with error handling and retry
 * @param {string} modulePath - Path to the module
 * @param {Object} options - Import options
 * @returns {Promise} - Promise that resolves with the module
 */
export const dynamicImport = async (modulePath, options = {}) => {
  const { retries = 3, retryDelay = 1000 } = options
  
  let attempt = 0
  
  while (attempt < retries) {
    try {
      const module = await import(modulePath)
      return module
    } catch (error) {
      attempt++
      
      if (attempt >= retries) {
        console.error(`Failed to import ${modulePath} after ${retries} attempts:`, error)
        throw error
      }
      
      console.warn(`Import attempt ${attempt} failed for ${modulePath}, retrying...`)
      await new Promise(resolve => setTimeout(resolve, retryDelay))
    }
  }
}

/**
 * Tree-shakable utility imports
 */
export const importUtils = {
  // Date utilities
  formatDate: () => import('date-fns/format'),
  parseDate: () => import('date-fns/parse'),
  isValid: () => import('date-fns/isValid'),
  
  // Lodash utilities (tree-shakable)
  debounce: () => import('lodash-es/debounce'),
  throttle: () => import('lodash-es/throttle'),
  cloneDeep: () => import('lodash-es/cloneDeep'),
  
  // Chart libraries (lazy loaded)
  Chart: () => import('chart.js/auto'),
  
  // PDF generation (lazy loaded)
  jsPDF: () => import('jspdf'),
  
  // Excel utilities (lazy loaded)
  XLSX: () => import('xlsx')
}

/**
 * Preload critical resources
 */
export const preloadCriticalResources = () => {
  // Preload commonly used utilities
  const criticalImports = [
    importUtils.formatDate(),
    importUtils.debounce()
  ]
  
  return Promise.allSettled(criticalImports)
}

/**
 * Remove unused CSS classes (for production builds)
 * @param {string} css - CSS string
 * @param {Array} usedClasses - Array of used class names
 * @returns {string} - Optimized CSS
 */
export const removeUnusedCSS = (css, usedClasses) => {
  if (process.env.NODE_ENV !== 'production') {
    return css
  }
  
  // Simple CSS purging (in production, use PurgeCSS or similar)
  const lines = css.split('\n')
  const optimizedLines = []
  let inUnusedRule = false
  
  for (const line of lines) {
    if (line.includes('{')) {
      const className = line.split('{')[0].trim()
      inUnusedRule = !usedClasses.some(used => className.includes(used))
    }
    
    if (!inUnusedRule) {
      optimizedLines.push(line)
    }
    
    if (line.includes('}')) {
      inUnusedRule = false
    }
  }
  
  return optimizedLines.join('\n')
}

/**
 * Optimize images for web
 * @param {File} file - Image file
 * @param {Object} options - Optimization options
 * @returns {Promise<Blob>} - Optimized image blob
 */
export const optimizeImage = async (file, options = {}) => {
  const {
    maxWidth = 1920,
    maxHeight = 1080,
    quality = 0.8,
    format = 'webp'
  } = options
  
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img
      
      if (width > maxWidth) {
        height = (height * maxWidth) / width
        width = maxWidth
      }
      
      if (height > maxHeight) {
        width = (width * maxHeight) / height
        height = maxHeight
      }
      
      // Set canvas dimensions
      canvas.width = width
      canvas.height = height
      
      // Draw and compress image
      ctx.drawImage(img, 0, 0, width, height)
      
      canvas.toBlob(resolve, `image/${format}`, quality)
    }
    
    img.onerror = reject
    img.src = URL.createObjectURL(file)
  })
}

/**
 * Memory usage monitoring
 */
export const memoryMonitor = {
  getUsage: () => {
    if (performance.memory) {
      return {
        used: Math.round(performance.memory.usedJSHeapSize / 1048576),
        total: Math.round(performance.memory.totalJSHeapSize / 1048576),
        limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576)
      }
    }
    return null
  },
  
  logUsage: () => {
    const usage = memoryMonitor.getUsage()
    if (usage) {
      console.log(`Memory Usage: ${usage.used}MB / ${usage.total}MB (Limit: ${usage.limit}MB)`)
    }
  },
  
  startMonitoring: (interval = 30000) => {
    return setInterval(() => {
      memoryMonitor.logUsage()
    }, interval)
  }
}

/**
 * Performance metrics collection
 */
export const performanceMetrics = {
  measureRender: (componentName, renderFn) => {
    const start = performance.now()
    const result = renderFn()
    const end = performance.now()
    
    console.log(`${componentName} render time: ${(end - start).toFixed(2)}ms`)
    return result
  },
  
  measureAsync: async (operationName, asyncFn) => {
    const start = performance.now()
    const result = await asyncFn()
    const end = performance.now()
    
    console.log(`${operationName} execution time: ${(end - start).toFixed(2)}ms`)
    return result
  },
  
  getNavigationTiming: () => {
    const navigation = performance.getEntriesByType('navigation')[0]
    if (navigation) {
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 0,
        firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0
      }
    }
    return null
  }
}

export default {
  dynamicImport,
  importUtils,
  preloadCriticalResources,
  removeUnusedCSS,
  optimizeImage,
  memoryMonitor,
  performanceMetrics
}