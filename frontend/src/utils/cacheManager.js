/**
 * Cache Manager
 * 
 * Advanced caching utility for API responses with TTL, size limits,
 * and intelligent cache invalidation strategies.
 */

// Cache storage with metadata
const cacheStore = new Map()

// Cache configuration
const config = {
  maxSize: 100, // Maximum number of items in cache
  defaultTTL: 5 * 60 * 1000, // Default TTL: 5 minutes
  cleanupInterval: 60 * 1000, // Cleanup interval: 1 minute
  persistToStorage: true, // Whether to persist cache to localStorage
  storageKey: 'app_api_cache', // localStorage key for persisted cache
  debug: false // Debug mode
}

// Cache statistics
const stats = {
  hits: 0,
  misses: 0,
  sets: 0,
  evictions: 0,
  expirations: 0
}

/**
 * Initialize cache manager
 * @param {Object} options - Cache configuration options
 */
export const initCache = (options = {}) => {
  // Update configuration
  Object.assign(config, options)
  
  // Load cache from localStorage if enabled
  if (config.persistToStorage) {
    loadFromStorage()
  }
  
  // Start cleanup interval
  startCleanupInterval()
  
  if (config.debug) {
    console.log('Cache manager initialized with config:', config)
  }
}

/**
 * Set item in cache
 * @param {string} key - Cache key
 * @param {any} value - Value to cache
 * @param {Object} options - Cache options
 * @param {number} options.ttl - Time to live in milliseconds
 * @param {string} options.group - Cache group for bulk invalidation
 * @param {Array} options.tags - Tags for selective invalidation
 * @param {boolean} options.persist - Whether to persist this item
 * @returns {boolean} - Whether the item was successfully cached
 */
export const setCache = (key, value, options = {}) => {
  if (!key) return false
  
  // Check cache size limit
  if (cacheStore.size >= config.maxSize) {
    evictOldest()
  }
  
  const ttl = options.ttl || config.defaultTTL
  const expiresAt = Date.now() + ttl
  
  // Store item with metadata
  cacheStore.set(key, {
    value,
    expiresAt,
    group: options.group || 'default',
    tags: options.tags || [],
    persist: options.persist !== undefined ? options.persist : config.persistToStorage,
    createdAt: Date.now(),
    lastAccessed: Date.now()
  })
  
  stats.sets++
  
  // Persist to localStorage if enabled
  if (options.persist !== false && config.persistToStorage) {
    persistToStorage()
  }
  
  if (config.debug) {
    console.log(`Cache set: ${key}`, { ttl, expiresAt, group: options.group, tags: options.tags })
  }
  
  return true
}

/**
 * Get item from cache
 * @param {string} key - Cache key
 * @returns {any|null} - Cached value or null if not found or expired
 */
export const getCache = (key) => {
  if (!key || !cacheStore.has(key)) {
    stats.misses++
    return null
  }
  
  const item = cacheStore.get(key)
  
  // Check if expired
  if (item.expiresAt < Date.now()) {
    cacheStore.delete(key)
    stats.expirations++
    if (config.debug) {
      console.log(`Cache expired: ${key}`)
    }
    return null
  }
  
  // Update last accessed time
  item.lastAccessed = Date.now()
  
  stats.hits++
  
  if (config.debug) {
    console.log(`Cache hit: ${key}`)
  }
  
  return item.value
}

/**
 * Check if key exists in cache and is not expired
 * @param {string} key - Cache key
 * @returns {boolean} - Whether the key exists and is not expired
 */
export const hasCache = (key) => {
  if (!key || !cacheStore.has(key)) {
    return false
  }
  
  const item = cacheStore.get(key)
  
  // Check if expired
  if (item.expiresAt < Date.now()) {
    cacheStore.delete(key)
    stats.expirations++
    return false
  }
  
  return true
}

/**
 * Remove item from cache
 * @param {string} key - Cache key
 * @returns {boolean} - Whether the item was removed
 */
export const removeCache = (key) => {
  if (!key || !cacheStore.has(key)) {
    return false
  }
  
  cacheStore.delete(key)
  
  if (config.persistToStorage) {
    persistToStorage()
  }
  
  if (config.debug) {
    console.log(`Cache removed: ${key}`)
  }
  
  return true
}

/**
 * Clear all items from cache
 */
export const clearCache = () => {
  cacheStore.clear()
  
  if (config.persistToStorage) {
    localStorage.removeItem(config.storageKey)
  }
  
  if (config.debug) {
    console.log('Cache cleared')
  }
}

/**
 * Invalidate cache items by group
 * @param {string} group - Cache group
 * @returns {number} - Number of items invalidated
 */
export const invalidateGroup = (group) => {
  if (!group) return 0
  
  let count = 0
  
  for (const [key, item] of cacheStore.entries()) {
    if (item.group === group) {
      cacheStore.delete(key)
      count++
    }
  }
  
  if (count > 0 && config.persistToStorage) {
    persistToStorage()
  }
  
  if (config.debug) {
    console.log(`Cache group invalidated: ${group}, ${count} items removed`)
  }
  
  return count
}

/**
 * Invalidate cache items by tag
 * @param {string} tag - Cache tag
 * @returns {number} - Number of items invalidated
 */
export const invalidateTag = (tag) => {
  if (!tag) return 0
  
  let count = 0
  
  for (const [key, item] of cacheStore.entries()) {
    if (item.tags.includes(tag)) {
      cacheStore.delete(key)
      count++
    }
  }
  
  if (count > 0 && config.persistToStorage) {
    persistToStorage()
  }
  
  if (config.debug) {
    console.log(`Cache tag invalidated: ${tag}, ${count} items removed`)
  }
  
  return count
}

/**
 * Invalidate cache items by pattern
 * @param {RegExp|string} pattern - Key pattern to match
 * @returns {number} - Number of items invalidated
 */
export const invalidatePattern = (pattern) => {
  if (!pattern) return 0
  
  const regex = typeof pattern === 'string' 
    ? new RegExp(pattern) 
    : pattern
  
  let count = 0
  
  for (const key of cacheStore.keys()) {
    if (regex.test(key)) {
      cacheStore.delete(key)
      count++
    }
  }
  
  if (count > 0 && config.persistToStorage) {
    persistToStorage()
  }
  
  if (config.debug) {
    console.log(`Cache pattern invalidated: ${pattern}, ${count} items removed`)
  }
  
  return count
}

/**
 * Get cache statistics
 * @returns {Object} - Cache statistics
 */
export const getCacheStats = () => {
  return {
    ...stats,
    size: cacheStore.size,
    hitRate: stats.hits / (stats.hits + stats.misses) || 0
  }
}

/**
 * Evict oldest cache item
 * @private
 */
function evictOldest() {
  let oldestKey = null
  let oldestTime = Infinity
  
  for (const [key, item] of cacheStore.entries()) {
    if (item.lastAccessed < oldestTime) {
      oldestTime = item.lastAccessed
      oldestKey = key
    }
  }
  
  if (oldestKey) {
    cacheStore.delete(oldestKey)
    stats.evictions++
    
    if (config.debug) {
      console.log(`Cache eviction: ${oldestKey}`)
    }
  }
}

/**
 * Start cleanup interval
 * @private
 */
function startCleanupInterval() {
  setInterval(() => {
    const now = Date.now()
    let expiredCount = 0
    
    for (const [key, item] of cacheStore.entries()) {
      if (item.expiresAt < now) {
        cacheStore.delete(key)
        expiredCount++
        stats.expirations++
      }
    }
    
    if (expiredCount > 0 && config.persistToStorage) {
      persistToStorage()
    }
    
    if (config.debug && expiredCount > 0) {
      console.log(`Cache cleanup: ${expiredCount} items expired`)
    }
  }, config.cleanupInterval)
}

/**
 * Persist cache to localStorage
 * @private
 */
function persistToStorage() {
  try {
    const persistItems = {}
    
    for (const [key, item] of cacheStore.entries()) {
      if (item.persist) {
        persistItems[key] = {
          value: item.value,
          expiresAt: item.expiresAt,
          group: item.group,
          tags: item.tags,
          createdAt: item.createdAt
        }
      }
    }
    
    localStorage.setItem(config.storageKey, JSON.stringify(persistItems))
  } catch (error) {
    console.error('Failed to persist cache to localStorage:', error)
  }
}

/**
 * Load cache from localStorage
 * @private
 */
function loadFromStorage() {
  try {
    const storedCache = localStorage.getItem(config.storageKey)
    
    if (storedCache) {
      const parsedCache = JSON.parse(storedCache)
      const now = Date.now()
      
      for (const [key, item] of Object.entries(parsedCache)) {
        // Skip expired items
        if (item.expiresAt < now) {
          continue
        }
        
        cacheStore.set(key, {
          ...item,
          lastAccessed: now,
          persist: true
        })
      }
      
      if (config.debug) {
        console.log(`Cache loaded from localStorage: ${cacheStore.size} items`)
      }
    }
  } catch (error) {
    console.error('Failed to load cache from localStorage:', error)
  }
}

export default {
  initCache,
  setCache,
  getCache,
  hasCache,
  removeCache,
  clearCache,
  invalidateGroup,
  invalidateTag,
  invalidatePattern,
  getCacheStats
}