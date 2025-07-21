/**
 * Advanced caching strategies for API responses
 */

// Cache storage implementations
class MemoryCache {
  constructor(maxSize = 100) {
    this.cache = new Map()
    this.maxSize = maxSize
    this.accessOrder = new Map() // Track access order for LRU
  }
  
  get(key) {
    if (this.cache.has(key)) {
      // Update access order
      this.accessOrder.set(key, Date.now())
      return this.cache.get(key)
    }
    return null
  }
  
  set(key, value, ttl = 300000) { // Default 5 minutes TTL
    // Remove oldest entries if cache is full
    if (this.cache.size >= this.maxSize) {
      this.evictLRU()
    }
    
    const entry = {
      value,
      timestamp: Date.now(),
      ttl,
      accessCount: 0
    }
    
    this.cache.set(key, entry)
    this.accessOrder.set(key, Date.now())
  }
  
  has(key) {
    const entry = this.cache.get(key)
    if (!entry) return false
    
    // Check if entry has expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.delete(key)
      return false
    }
    
    return true
  }
  
  delete(key) {
    this.cache.delete(key)
    this.accessOrder.delete(key)
  }
  
  clear() {
    this.cache.clear()
    this.accessOrder.clear()
  }
  
  evictLRU() {
    // Find least recently used entry
    let oldestKey = null
    let oldestTime = Infinity
    
    for (const [key, time] of this.accessOrder) {
      if (time < oldestTime) {
        oldestTime = time
        oldestKey = key
      }
    }
    
    if (oldestKey) {
      this.delete(oldestKey)
    }
  }
  
  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      entries: Array.from(this.cache.keys())
    }
  }
}

class PersistentCache {
  constructor(storageKey = 'api_cache', maxSize = 50) {
    this.storageKey = storageKey
    this.maxSize = maxSize
  }
  
  get(key) {
    try {
      const cache = this.getCache()
      const entry = cache[key]
      
      if (!entry) return null
      
      // Check if entry has expired
      if (Date.now() - entry.timestamp > entry.ttl) {
        this.delete(key)
        return null
      }
      
      // Update access time
      entry.lastAccess = Date.now()
      entry.accessCount = (entry.accessCount || 0) + 1
      this.setCache(cache)
      
      return entry.value
    } catch (error) {
      console.warn('Failed to get from persistent cache:', error)
      return null
    }
  }
  
  set(key, value, ttl = 300000) {
    try {
      const cache = this.getCache()
      
      // Remove oldest entries if cache is full
      if (Object.keys(cache).length >= this.maxSize) {
        this.evictOldest(cache)
      }
      
      cache[key] = {
        value,
        timestamp: Date.now(),
        lastAccess: Date.now(),
        ttl,
        accessCount: 0
      }
      
      this.setCache(cache)
    } catch (error) {
      console.warn('Failed to set persistent cache:', error)
    }
  }
  
  has(key) {
    const entry = this.get(key)
    return entry !== null
  }
  
  delete(key) {
    try {
      const cache = this.getCache()
      delete cache[key]
      this.setCache(cache)
    } catch (error) {
      console.warn('Failed to delete from persistent cache:', error)
    }
  }
  
  clear() {
    try {
      localStorage.removeItem(this.storageKey)
    } catch (error) {
      console.warn('Failed to clear persistent cache:', error)
    }
  }
  
  getCache() {
    try {
      const cached = localStorage.getItem(this.storageKey)
      return cached ? JSON.parse(cached) : {}
    } catch (error) {
      return {}
    }
  }
  
  setCache(cache) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(cache))
    } catch (error) {
      // Handle quota exceeded error
      if (error.name === 'QuotaExceededError') {
        this.clear()
        console.warn('LocalStorage quota exceeded, cache cleared')
      }
    }
  }
  
  evictOldest(cache) {
    const entries = Object.entries(cache)
    if (entries.length === 0) return
    
    // Sort by last access time
    entries.sort(([, a], [, b]) => a.lastAccess - b.lastAccess)
    
    // Remove oldest 25% of entries
    const toRemove = Math.ceil(entries.length * 0.25)
    for (let i = 0; i < toRemove; i++) {
      delete cache[entries[i][0]]
    }
  }
}

// Cache strategies
export const CacheStrategies = {
  // Cache first, then network
  CACHE_FIRST: 'cache-first',
  
  // Network first, fallback to cache
  NETWORK_FIRST: 'network-first',
  
  // Cache only
  CACHE_ONLY: 'cache-only',
  
  // Network only
  NETWORK_ONLY: 'network-only',
  
  // Stale while revalidate
  STALE_WHILE_REVALIDATE: 'stale-while-revalidate'
}

// Main cache manager
class CacheManager {
  constructor() {
    this.memoryCache = new MemoryCache(100)
    this.persistentCache = new PersistentCache('api_cache', 50)
    this.pendingRequests = new Map()
  }
  
  generateKey(url, params = {}, headers = {}) {
    const keyData = {
      url,
      params: Object.keys(params).sort().reduce((sorted, key) => {
        sorted[key] = params[key]
        return sorted
      }, {}),
      headers: Object.keys(headers).sort().reduce((sorted, key) => {
        if (key.toLowerCase() !== 'authorization') { // Exclude auth headers from cache key
          sorted[key] = headers[key]
        }
        return sorted
      }, {})
    }
    
    return btoa(JSON.stringify(keyData)).replace(/[+/=]/g, '')
  }
  
  async get(key, strategy = CacheStrategies.CACHE_FIRST, networkFn, options = {}) {
    const {
      ttl = 300000, // 5 minutes
      persistent = false,
      forceRefresh = false
    } = options
    
    if (forceRefresh) {
      return this.fetchAndCache(key, networkFn, ttl, persistent)
    }
    
    switch (strategy) {
      case CacheStrategies.CACHE_FIRST:
        return this.cacheFirst(key, networkFn, ttl, persistent)
      
      case CacheStrategies.NETWORK_FIRST:
        return this.networkFirst(key, networkFn, ttl, persistent)
      
      case CacheStrategies.CACHE_ONLY:
        return this.cacheOnly(key)
      
      case CacheStrategies.NETWORK_ONLY:
        return this.networkOnly(networkFn)
      
      case CacheStrategies.STALE_WHILE_REVALIDATE:
        return this.staleWhileRevalidate(key, networkFn, ttl, persistent)
      
      default:
        return this.cacheFirst(key, networkFn, ttl, persistent)
    }
  }
  
  async cacheFirst(key, networkFn, ttl, persistent) {
    // Try memory cache first
    if (this.memoryCache.has(key)) {
      return this.memoryCache.get(key).value
    }
    
    // Try persistent cache if enabled
    if (persistent && this.persistentCache.has(key)) {
      const value = this.persistentCache.get(key)
      // Also store in memory cache for faster access
      this.memoryCache.set(key, value, ttl)
      return value
    }
    
    // Fetch from network
    return this.fetchAndCache(key, networkFn, ttl, persistent)
  }
  
  async networkFirst(key, networkFn, ttl, persistent) {
    try {
      return await this.fetchAndCache(key, networkFn, ttl, persistent)
    } catch (error) {
      // Fallback to cache
      if (this.memoryCache.has(key)) {
        console.warn('Network failed, using cached data:', error)
        return this.memoryCache.get(key).value
      }
      
      if (persistent && this.persistentCache.has(key)) {
        console.warn('Network failed, using persistent cached data:', error)
        return this.persistentCache.get(key)
      }
      
      throw error
    }
  }
  
  async cacheOnly(key) {
    if (this.memoryCache.has(key)) {
      return this.memoryCache.get(key).value
    }
    
    if (this.persistentCache.has(key)) {
      return this.persistentCache.get(key)
    }
    
    throw new Error('No cached data available')
  }
  
  async networkOnly(networkFn) {
    return await networkFn()
  }
  
  async staleWhileRevalidate(key, networkFn, ttl, persistent) {
    // Return cached data immediately if available
    let cachedData = null
    
    if (this.memoryCache.has(key)) {
      cachedData = this.memoryCache.get(key).value
    } else if (persistent && this.persistentCache.has(key)) {
      cachedData = this.persistentCache.get(key)
    }
    
    // Fetch fresh data in background
    this.fetchAndCache(key, networkFn, ttl, persistent).catch(error => {
      console.warn('Background refresh failed:', error)
    })
    
    if (cachedData) {
      return cachedData
    }
    
    // If no cached data, wait for network
    return this.fetchAndCache(key, networkFn, ttl, persistent)
  }
  
  async fetchAndCache(key, networkFn, ttl, persistent) {
    // Prevent duplicate requests
    if (this.pendingRequests.has(key)) {
      return this.pendingRequests.get(key)
    }
    
    const promise = networkFn()
    this.pendingRequests.set(key, promise)
    
    try {
      const data = await promise
      
      // Cache the result
      this.memoryCache.set(key, data, ttl)
      
      if (persistent) {
        this.persistentCache.set(key, data, ttl)
      }
      
      return data
    } finally {
      this.pendingRequests.delete(key)
    }
  }
  
  invalidate(pattern) {
    // Invalidate memory cache
    for (const key of this.memoryCache.cache.keys()) {
      if (key.includes(pattern)) {
        this.memoryCache.delete(key)
      }
    }
    
    // Invalidate persistent cache
    const cache = this.persistentCache.getCache()
    const updatedCache = {}
    
    for (const [key, value] of Object.entries(cache)) {
      if (!key.includes(pattern)) {
        updatedCache[key] = value
      }
    }
    
    this.persistentCache.setCache(updatedCache)
  }
  
  clear() {
    this.memoryCache.clear()
    this.persistentCache.clear()
  }
  
  getStats() {
    return {
      memory: this.memoryCache.getStats(),
      persistent: {
        size: Object.keys(this.persistentCache.getCache()).length,
        maxSize: this.persistentCache.maxSize
      },
      pendingRequests: this.pendingRequests.size
    }
  }
}

// Global cache instance
export const cacheManager = new CacheManager()

// Helper functions
export const createCachedApiCall = (apiCall, options = {}) => {
  const {
    strategy = CacheStrategies.CACHE_FIRST,
    ttl = 300000,
    persistent = false,
    keyGenerator
  } = options
  
  return async (...args) => {
    const key = keyGenerator ? keyGenerator(...args) : JSON.stringify(args)
    
    return cacheManager.get(
      key,
      strategy,
      () => apiCall(...args),
      { ttl, persistent }
    )
  }
}

export const invalidateCache = (pattern) => {
  cacheManager.invalidate(pattern)
}

export const clearAllCache = () => {
  cacheManager.clear()
}

export const getCacheStats = () => {
  return cacheManager.getStats()
}

export default {
  CacheStrategies,
  cacheManager,
  createCachedApiCall,
  invalidateCache,
  clearAllCache,
  getCacheStats
}