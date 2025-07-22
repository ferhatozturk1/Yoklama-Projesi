import { lazy, memo, useState, useEffect, useRef } from 'react'

/**
 * Enhanced lazy loading utility with error boundary and retry mechanism
 * @param {Function} importFn - Dynamic import function
 * @param {Object} options - Lazy loading options
 * @returns {React.Component} - Lazy loaded component
 */
export const lazyLoad = (importFn, options = {}) => {
  const {
    fallback = null,
    retries = 3,
    retryDelay = 1000,
    chunkName = 'chunk'
  } = options

  let retryCount = 0

  const loadComponent = async () => {
    try {
      const module = await importFn()
      retryCount = 0 // Reset retry count on success
      return module
    } catch (error) {
      if (retryCount < retries) {
        retryCount++
        console.warn(`Failed to load component, retrying... (${retryCount}/${retries})`)
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, retryDelay))
        
        // Retry loading
        return loadComponent()
      } else {
        console.error('Failed to load component after maximum retries:', error)
        throw error
      }
    }
  }

  return lazy(loadComponent)
}

/**
 * Preload a lazy component
 * @param {Function} importFn - Dynamic import function
 * @returns {Promise} - Promise that resolves when component is loaded
 */
export const preloadComponent = (importFn) => {
  return importFn()
}

/**
 * Create a lazy component with memoization
 * @param {Function} importFn - Dynamic import function
 * @param {Object} options - Options
 * @returns {React.Component} - Memoized lazy component
 */
export const lazyMemo = (importFn, options = {}) => {
  const LazyComponent = lazyLoad(importFn, options)
  return memo(LazyComponent)
}

/**
 * Batch preload multiple components
 * @param {Array} importFunctions - Array of import functions
 * @returns {Promise} - Promise that resolves when all components are loaded
 */
export const preloadComponents = (importFunctions) => {
  return Promise.all(importFunctions.map(fn => preloadComponent(fn)))
}

/**
 * Preload components on user interaction (hover, focus)
 * @param {Function} importFn - Dynamic import function
 * @returns {Object} - Event handlers for preloading
 */
export const createPreloadHandlers = (importFn) => {
  let isPreloaded = false

  const preload = () => {
    if (!isPreloaded) {
      isPreloaded = true
      preloadComponent(importFn).catch(error => {
        console.warn('Failed to preload component:', error)
        isPreloaded = false // Allow retry
      })
    }
  }

  return {
    onMouseEnter: preload,
    onFocus: preload
  }
}

/**
 * Create a lazy component with intersection observer for viewport-based loading
 * @param {Function} importFn - Dynamic import function
 * @param {Object} options - Intersection observer options
 * @returns {React.Component} - Lazy component that loads when in viewport
 */
export const lazyLoadOnVisible = (importFn, options = {}) => {
  const {
    rootMargin = '50px',
    threshold = 0.1,
    ...lazyOptions
  } = options

  const LazyComponent = lazyLoad(importFn, lazyOptions)

  return memo((props) => {
    const [isVisible, setIsVisible] = useState(false)
    const ref = useRef()

    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            observer.disconnect()
          }
        },
        { rootMargin, threshold }
      )

      if (ref.current) {
        observer.observe(ref.current)
      }

      return () => observer.disconnect()
    }, [rootMargin, threshold])

    if (!isVisible) {
      return <div ref={ref} style={{ minHeight: '100px' }} />
    }

    return <LazyComponent {...props} />
  })
}

export default {
  lazyLoad,
  preloadComponent,
  lazyMemo,
  preloadComponents,
  createPreloadHandlers,
  lazyLoadOnVisible
}