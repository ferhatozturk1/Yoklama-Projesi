/**
 * Route Prefetcher Utility
 * 
 * This utility helps with intelligent prefetching of routes based on user navigation patterns
 * and current context to improve perceived performance.
 */

// Store for prefetched routes to avoid duplicate prefetching
const prefetchedRoutes = new Set()

/**
 * Prefetch a route component
 * @param {Object} component - Lazy loaded component with preload method
 * @returns {Promise} - Promise that resolves when prefetching is complete
 */
export const prefetchRoute = async (component) => {
  if (!component?.preload || prefetchedRoutes.has(component)) {
    return
  }
  
  try {
    await component.preload()
    prefetchedRoutes.add(component)
    return true
  } catch (error) {
    console.error('Failed to prefetch route:', error)
    return false
  }
}

/**
 * Prefetch multiple routes
 * @param {Array} components - Array of lazy loaded components
 * @returns {Promise} - Promise that resolves when all prefetching is complete
 */
export const prefetchRoutes = async (components) => {
  if (!components || !Array.isArray(components)) {
    return
  }
  
  return Promise.all(components.map(component => prefetchRoute(component)))
}

/**
 * Prefetch routes based on current route
 * @param {string} currentRoute - Current route path
 * @param {Object} routeMap - Map of route components
 */
export const prefetchRelatedRoutes = (currentRoute, routeMap) => {
  // Define related routes for intelligent prefetching
  const relatedRoutes = {
    '/dashboard': ['Courses', 'AttendanceManagement'],
    '/courses': ['CourseDetail', 'Dashboard'],
    '/course': ['AttendanceManagement', 'Reports'],
    '/attendance': ['Reports', 'Courses'],
    '/reports': ['Dashboard', 'Courses'],
    '/profile': ['CalendarSettings'],
    '/calendar-settings': ['Profile', 'ScheduleManagement'],
    '/schedule': ['CalendarSettings', 'Dashboard']
  }
  
  // Find matching route pattern
  const matchingRoute = Object.keys(relatedRoutes).find(route => 
    currentRoute.startsWith(route)
  )
  
  if (matchingRoute && relatedRoutes[matchingRoute]) {
    // Get components to prefetch
    const componentsToPrefetch = relatedRoutes[matchingRoute]
      .map(name => routeMap[name])
      .filter(Boolean)
    
    // Prefetch with slight delay to prioritize current route rendering
    setTimeout(() => {
      prefetchRoutes(componentsToPrefetch)
    }, 1000)
  }
}

/**
 * Reset prefetched routes cache
 */
export const resetPrefetchCache = () => {
  prefetchedRoutes.clear()
}

export default {
  prefetchRoute,
  prefetchRoutes,
  prefetchRelatedRoutes,
  resetPrefetchCache
}