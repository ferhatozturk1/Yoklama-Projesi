import { useEffect, useRef, useState, useCallback } from 'react'

/**
 * Hook for monitoring component performance
 * @param {string} componentName - Name of the component
 * @param {Object} options - Performance monitoring options
 * @returns {Object} - Performance metrics and utilities
 */
export const usePerformance = (componentName, options = {}) => {
  const {
    logRenders = false,
    logProps = false,
    trackMemory = false
  } = options
  
  const renderCount = useRef(0)
  const lastRenderTime = useRef(0)
  const [metrics, setMetrics] = useState({
    renderCount: 0,
    averageRenderTime: 0,
    lastRenderTime: 0
  })
  
  // Track render performance
  useEffect(() => {
    const renderStart = performance.now()
    
    return () => {
      const renderEnd = performance.now()
      const renderTime = renderEnd - renderStart
      
      renderCount.current++
      lastRenderTime.current = renderTime
      
      setMetrics(prev => ({
        renderCount: renderCount.current,
        averageRenderTime: (prev.averageRenderTime * (renderCount.current - 1) + renderTime) / renderCount.current,
        lastRenderTime: renderTime
      }))
      
      if (logRenders) {
        console.log(`${componentName} render #${renderCount.current}: ${renderTime.toFixed(2)}ms`)
      }
    }
  })
  
  // Track memory usage
  useEffect(() => {
    if (trackMemory && performance.memory) {
      const logMemory = () => {
        const memory = performance.memory
        console.log(`${componentName} memory usage:`, {
          used: Math.round(memory.usedJSHeapSize / 1048576),
          total: Math.round(memory.totalJSHeapSize / 1048576)
        })
      }
      
      logMemory()
      return logMemory
    }
  }, [componentName, trackMemory])
  
  const measureOperation = useCallback((operationName, operation) => {
    const start = performance.now()
    const result = operation()
    const end = performance.now()
    
    console.log(`${componentName} - ${operationName}: ${(end - start).toFixed(2)}ms`)
    return result
  }, [componentName])
  
  const measureAsyncOperation = useCallback(async (operationName, operation) => {
    const start = performance.now()
    const result = await operation()
    const end = performance.now()
    
    console.log(`${componentName} - ${operationName}: ${(end - start).toFixed(2)}ms`)
    return result
  }, [componentName])
  
  return {
    metrics,
    measureOperation,
    measureAsyncOperation
  }
}

/**
 * Hook for tracking component re-renders and their causes
 * @param {Object} props - Component props
 * @param {string} componentName - Name of the component
 * @returns {Object} - Render tracking utilities
 */
export const useRenderTracker = (props, componentName) => {
  const prevProps = useRef()
  const renderCount = useRef(0)
  
  useEffect(() => {
    renderCount.current++
    
    if (prevProps.current) {
      const changedProps = Object.keys(props).filter(
        key => prevProps.current[key] !== props[key]
      )
      
      if (changedProps.length > 0) {
        console.log(`${componentName} re-rendered due to props:`, changedProps)
      }
    }
    
    prevProps.current = props
  })
  
  return {
    renderCount: renderCount.current
  }
}

/**
 * Hook for measuring component mount/unmount times
 * @param {string} componentName - Name of the component
 * @returns {Object} - Mount timing metrics
 */
export const useMountTime = (componentName) => {
  const mountStart = useRef(performance.now())
  const [mountTime, setMountTime] = useState(0)
  
  useEffect(() => {
    const mountEnd = performance.now()
    const time = mountEnd - mountStart.current
    setMountTime(time)
    
    console.log(`${componentName} mount time: ${time.toFixed(2)}ms`)
    
    return () => {
      const unmountTime = performance.now()
      console.log(`${componentName} was mounted for: ${(unmountTime - mountEnd).toFixed(2)}ms`)
    }
  }, [componentName])
  
  return { mountTime }
}

/**
 * Hook for tracking expensive operations
 * @param {Function} operation - Expensive operation to track
 * @param {Array} dependencies - Dependencies that trigger the operation
 * @param {string} operationName - Name of the operation
 * @returns {any} - Result of the operation
 */
export const useExpensiveOperation = (operation, dependencies, operationName) => {
  const [result, setResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [executionTime, setExecutionTime] = useState(0)
  
  useEffect(() => {
    const executeOperation = async () => {
      setIsLoading(true)
      const start = performance.now()
      
      try {
        const operationResult = await operation()
        const end = performance.now()
        const time = end - start
        
        setResult(operationResult)
        setExecutionTime(time)
        
        console.log(`${operationName} execution time: ${time.toFixed(2)}ms`)
      } catch (error) {
        console.error(`${operationName} failed:`, error)
      } finally {
        setIsLoading(false)
      }
    }
    
    executeOperation()
  }, dependencies) // eslint-disable-line react-hooks/exhaustive-deps
  
  return { result, isLoading, executionTime }
}

/**
 * Hook for debouncing expensive operations
 * @param {Function} callback - Callback to debounce
 * @param {number} delay - Debounce delay
 * @param {Array} dependencies - Dependencies
 * @returns {Function} - Debounced callback
 */
export const useDebounceCallback = (callback, delay, dependencies) => {
  const timeoutRef = useRef()
  
  const debouncedCallback = useCallback((...args) => {
    clearTimeout(timeoutRef.current)
    
    timeoutRef.current = setTimeout(() => {
      callback(...args)
    }, delay)
  }, [callback, delay, ...dependencies]) // eslint-disable-line react-hooks/exhaustive-deps
  
  useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current)
    }
  }, [])
  
  return debouncedCallback
}

export default {
  usePerformance,
  useRenderTracker,
  useMountTime,
  useExpensiveOperation,
  useDebounceCallback
}