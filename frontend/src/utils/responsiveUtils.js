/**
 * Responsive utility functions for the Teacher Attendance Frontend
 */

// Breakpoint values (should match CSS variables in responsive.css)
export const breakpoints = {
  sm: 320,
  md: 768,
  lg: 1024,
  xl: 1280
}

/**
 * Check if the current window width is within a specific breakpoint range
 * @param {string} breakpoint - Breakpoint name (sm, md, lg, xl)
 * @returns {boolean} - Whether the current window width matches the breakpoint
 */
export const isBreakpoint = (breakpoint) => {
  if (typeof window === 'undefined') return false
  
  const width = window.innerWidth
  
  switch (breakpoint) {
    case 'sm':
      return width >= breakpoints.sm && width < breakpoints.md
    case 'md':
      return width >= breakpoints.md && width < breakpoints.lg
    case 'lg':
      return width >= breakpoints.lg && width < breakpoints.xl
    case 'xl':
      return width >= breakpoints.xl
    default:
      return false
  }
}

/**
 * Check if the current window width is at least a specific breakpoint
 * @param {string} breakpoint - Breakpoint name (sm, md, lg, xl)
 * @returns {boolean} - Whether the current window width is at least the breakpoint
 */
export const isMinBreakpoint = (breakpoint) => {
  if (typeof window === 'undefined') return false
  
  const width = window.innerWidth
  
  switch (breakpoint) {
    case 'sm':
      return width >= breakpoints.sm
    case 'md':
      return width >= breakpoints.md
    case 'lg':
      return width >= breakpoints.lg
    case 'xl':
      return width >= breakpoints.xl
    default:
      return false
  }
}

/**
 * Check if the current window width is at most a specific breakpoint
 * @param {string} breakpoint - Breakpoint name (sm, md, lg, xl)
 * @returns {boolean} - Whether the current window width is at most the breakpoint
 */
export const isMaxBreakpoint = (breakpoint) => {
  if (typeof window === 'undefined') return false
  
  const width = window.innerWidth
  
  switch (breakpoint) {
    case 'sm':
      return width < breakpoints.md
    case 'md':
      return width < breakpoints.lg
    case 'lg':
      return width < breakpoints.xl
    case 'xl':
      return true
    default:
      return false
  }
}

/**
 * React hook to get the current breakpoint
 * @returns {Object} - Current breakpoint information
 */
export const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = React.useState(() => {
    if (typeof window === 'undefined') {
      return {
        sm: false,
        md: false,
        lg: false,
        xl: false,
        isMobile: false,
        isTablet: false,
        isDesktop: false
      }
    }
    
    const width = window.innerWidth
    
    return {
      sm: width >= breakpoints.sm && width < breakpoints.md,
      md: width >= breakpoints.md && width < breakpoints.lg,
      lg: width >= breakpoints.lg && width < breakpoints.xl,
      xl: width >= breakpoints.xl,
      isMobile: width < breakpoints.md,
      isTablet: width >= breakpoints.md && width < breakpoints.lg,
      isDesktop: width >= breakpoints.lg
    }
  })
  
  React.useEffect(() => {
    if (typeof window === 'undefined') return
    
    const handleResize = () => {
      const width = window.innerWidth
      
      setBreakpoint({
        sm: width >= breakpoints.sm && width < breakpoints.md,
        md: width >= breakpoints.md && width < breakpoints.lg,
        lg: width >= breakpoints.lg && width < breakpoints.xl,
        xl: width >= breakpoints.xl,
        isMobile: width < breakpoints.md,
        isTablet: width >= breakpoints.md && width < breakpoints.lg,
        isDesktop: width >= breakpoints.lg
      })
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  
  return breakpoint
}

/**
 * React hook to detect touch devices
 * @returns {boolean} - Whether the device supports touch
 */
export const useIsTouchDevice = () => {
  const [isTouch, setIsTouch] = React.useState(() => {
    if (typeof window === 'undefined') return false
    
    return 'ontouchstart' in window || 
      navigator.maxTouchPoints > 0 || 
      navigator.msMaxTouchPoints > 0
  })
  
  return isTouch
}

/**
 * React hook to detect device orientation
 * @returns {string} - Current orientation ('portrait' or 'landscape')
 */
export const useOrientation = () => {
  const [orientation, setOrientation] = React.useState(() => {
    if (typeof window === 'undefined') return 'portrait'
    
    return window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
  })
  
  React.useEffect(() => {
    if (typeof window === 'undefined') return
    
    const handleResize = () => {
      setOrientation(window.innerWidth > window.innerHeight ? 'landscape' : 'portrait')
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  
  return orientation
}

/**
 * Get appropriate column count for a grid based on screen size
 * @param {Object} options - Column count options
 * @param {number} options.sm - Columns for small screens (default: 1)
 * @param {number} options.md - Columns for medium screens (default: 2)
 * @param {number} options.lg - Columns for large screens (default: 3)
 * @param {number} options.xl - Columns for extra large screens (default: 4)
 * @returns {number} - Appropriate column count
 */
export const getResponsiveColumns = (options = {}) => {
  const { sm = 1, md = 2, lg = 3, xl = 4 } = options
  
  if (typeof window === 'undefined') return sm
  
  const width = window.innerWidth
  
  if (width >= breakpoints.xl) return xl
  if (width >= breakpoints.lg) return lg
  if (width >= breakpoints.md) return md
  return sm
}

/**
 * Get appropriate gap size based on screen size
 * @param {Object} options - Gap size options
 * @param {string|number} options.sm - Gap for small screens (default: '0.5rem')
 * @param {string|number} options.md - Gap for medium screens (default: '1rem')
 * @param {string|number} options.lg - Gap for large screens (default: '1.5rem')
 * @param {string|number} options.xl - Gap for extra large screens (default: '2rem')
 * @returns {string|number} - Appropriate gap size
 */
export const getResponsiveGap = (options = {}) => {
  const { sm = '0.5rem', md = '1rem', lg = '1.5rem', xl = '2rem' } = options
  
  if (typeof window === 'undefined') return sm
  
  const width = window.innerWidth
  
  if (width >= breakpoints.xl) return xl
  if (width >= breakpoints.lg) return lg
  if (width >= breakpoints.md) return md
  return sm
}

/**
 * Check if the device is in landscape orientation
 * @returns {boolean} - Whether the device is in landscape orientation
 */
export const isLandscape = () => {
  if (typeof window === 'undefined') return false
  
  return window.innerWidth > window.innerHeight
}

/**
 * Check if the device is in portrait orientation
 * @returns {boolean} - Whether the device is in portrait orientation
 */
export const isPortrait = () => {
  if (typeof window === 'undefined') return true
  
  return window.innerWidth <= window.innerHeight
}

/**
 * Get appropriate font size based on screen size
 * @param {Object} options - Font size options
 * @param {string|number} options.sm - Font size for small screens
 * @param {string|number} options.md - Font size for medium screens
 * @param {string|number} options.lg - Font size for large screens
 * @param {string|number} options.xl - Font size for extra large screens
 * @returns {string|number} - Appropriate font size
 */
export const getResponsiveFontSize = (options = {}) => {
  const { sm = '0.875rem', md = '1rem', lg = '1.125rem', xl = '1.25rem' } = options
  
  if (typeof window === 'undefined') return sm
  
  const width = window.innerWidth
  
  if (width >= breakpoints.xl) return xl
  if (width >= breakpoints.lg) return lg
  if (width >= breakpoints.md) return md
  return sm
}

export default {
  breakpoints,
  isBreakpoint,
  isMinBreakpoint,
  isMaxBreakpoint,
  useBreakpoint,
  useIsTouchDevice,
  useOrientation,
  getResponsiveColumns,
  getResponsiveGap,
  isLandscape,
  isPortrait,
  getResponsiveFontSize
}