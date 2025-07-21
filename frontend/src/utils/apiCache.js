/**
 * API request caching utility
 * 
 * This module provides utilities for caching API responses.
 */

// Cache storage
const cache = new Map()

// Default cache options
const DEFAULT_OPTIONS = {
  ttl: 5 * 60 * 1000, // 5 minutes
  maxSize: 100, // Maximum number of cached items
  enabled: true
}

/**
 * Generate cache key from request config
 * @param {Object} config - Axios request config
 * @returns {string} - Cache key
 */
export const generateCacheKey = (config) => {
  const { method, url, params, data } = config
  
  // Create key components
  const components = [
    method.toLowerCase(),
    url,
    params ? JSON.stringify(params) : '',
    data ? JSON.stringify(data) : ''
  ]
  
  // Join components and create hash
  return components.join('|')
}

/**
 * Set cached response
 * @param {string} key - Cache key
 * @param {Object} response - Response data
 * @param {Object} options - Cache options
 */
export const setCachedResponse = (key, response, options = {}) => {
  const { ttl, enabled } = { ...DEFAULT_OPTIONS, ...options }
  
  if (!enabled) return
  
  // Create cache entry
  const entry = {
    data: response,
    timestamp: Date.now(),
    expires: Date.now() + ttl
  }
  
  // Add to cache
  cache.set(key, entry)
  
  // Enforce cache size limit
  if (cache.size > DEFAULT_OPTIONS.maxSize) {
    // Remove oldest entry
    const oldestKey = Array.from(cache.keys()).reduce((oldest, key) => {
      const entry = cache.get(key)
      const oldestEntry = cache.get(oldest)
      
      return entry.timestamp < oldestEntry.timestamp ? key : oldest
    })
    
    cache.delete(oldestKey)
  }
}

/**
 * Get cached response
 * @param {string} key - Cache key
 * @param {Object} options - Cache options
 * @returns {Object|null} - Cached response or null
 */
export const getCachedResponse = (key, options = {}) => {
  const { enabled } = { ...DEFAULT_OPTIONS, ...options }
  
  if (!enabled) return null
  
  // Get cache entry
  const entry = cache.get(key)
  
  // Check if entry exists and is not expired
  if (entry && entry.expires > Date.now()) {
    return entry.data
  }
  
  // Remove expired entry
  if (entry) {
    cache.delete(key)
  }
  
  return null
}

/**
 * Clear cache
 * @param {string} keyPattern - Key pattern to match (optional)
 */
export const clearCache = (keyPattern = null) => {
  if (!keyPattern) {
    cache.clear()
    return
  }
  
  // Clear matching entries
  for (const key of cache.keys()) {
    if (key.includes(keyPattern)) {
      cache.delete(key)
    }
  }
}

/**
 * Get cache statistics
 * @returns {Object} - Cache statistics
 */
export const getCacheStats = () => {
  const now = Date.now()
  const entries = Array.from(cache.entries())
  
  const stats = {
    size: cache.size,
    activeEntries: 0,
    expiredEntries: 0,
    averageAge: 0,
    oldestEntry: null,
    newestEntry: null,
    byMethod: {},
    byUrl: {}
  }
  
  if (entries.length === 0) {
    return stats
  }
  
  // Calculate statistics
  let totalAge = 0
  let oldestTimestamp = Infinity
  let newestTimestamp = 0
  
  for (const [key, entry] of entries) {
    const isExpired = entry.expires <= now
    const age = now - entry.timestamp
    
    // Update counts
    if (isExpired) {
      stats.expiredEntries++
    } else {
      stats.activeEntries++
    }
    
    // Update age statistics
    totalAge += age
    
    if (entry.timestamp < oldestTimestamp) {
      oldestTimestamp = entry.timestamp
      stats.oldestEntry = {
        key,
        age: Math.round(age / 1000) + 's'
      }
    }
    
    if (entry.timestamp > newestTimestamp) {
      newestTimestamp = entry.timestamp
      stats.newestEntry = {
        key,
        age: Math.round(age / 1000) + 's'
      }
    }
    
    // Update method statistics
    const [method] = key.split('|')
    stats.byMethod[method] = (stats.byMethod[method] || 0) + 1
    
    // Update URL statistics
    const [, url] = key.split('|')
    const baseUrl = url.split('?')[0]
    stats.byUrl[baseUrl] = (stats.byUrl[baseUrl] || 0) + 1
  }
  
  // Calculate average age
  stats.averageAge = Math.round(totalAge / entries.length / 1000) + 's'
  
  return stats
}

/**
 * Create request interceptor for caching
 * @param {Object} options - Cache options
 * @returns {Function} - Request interceptor
 */
export const createCacheInterceptor = (options = {}) => {
  const mergedOptions = { ...DEFAULT_OPTIONS, ...options }
  
  return async (config) => {
    // Skip caching for non-GET requests
    if (config.method.toLowerCase() !== 'get' || config.noCache) {
      return config
    }
    
    // Generate cache key
    const key = generateCacheKey(config)
    
    // Check cache
    const cachedResponse = getCachedResponse(key, mergedOptions)
    
    if (cachedResponse) {
      // Return cached response
      config.adapter = () => {
        return Promise.resolve({
          data: cachedResponse,
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
          cached: true
        })
      }
    }
    
    return config
  }
}

/**
 * Create response interceptor for caching
 * @param {Object} options - Cache options
 * @returns {Function} - Response interceptor
 */
export const createCacheResponseInterceptor = (options = {}) => {
  const mergedOptions = { ...DEFAULT_OPTIONS, ...options }
  
  return (response) => {
    // Skip caching for non-GET requests or already cached responses
    if (
      response.config.method.toLowerCase() !== 'get' ||
      response.cached ||
      response.config.noCache
    ) {
      return response
    }
    
    // Generate cache key
    const key = generateCacheKey(response.config)
    
    // Cache response
    setCachedResponse(key, response.data, mergedOptions)
    
    return response
  }
}

export default {
  generateCacheKey,
  setCachedResponse,
  getCachedResponse,
  clearCache,
  getCacheStats,
  createCacheInterceptor,
  createCacheResponseInterceptor
}