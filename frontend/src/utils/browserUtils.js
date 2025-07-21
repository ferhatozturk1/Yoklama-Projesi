/**
 * Browser Utilities
 * 
 * This module provides utilities for handling cross-browser compatibility issues.
 */

/**
 * Detect browser and version
 * @returns {Object} - Browser information
 */
export const detectBrowser = () => {
  const userAgent = window.navigator.userAgent
  let browser = 'unknown'
  let version = 'unknown'
  let os = 'unknown'
  let mobile = false
  
  // Detect browser
  if (userAgent.indexOf('Firefox') > -1) {
    browser = 'firefox'
    version = userAgent.match(/Firefox\/([0-9.]+)/)[1]
  } else if (userAgent.indexOf('Edge') > -1 || userAgent.indexOf('Edg/') > -1) {
    browser = 'edge'
    version = userAgent.match(/Edge\/([0-9.]+)/) || userAgent.match(/Edg\/([0-9.]+)/)
    version = version ? version[1] : 'unknown'
  } else if (userAgent.indexOf('Chrome') > -1) {
    browser = 'chrome'
    version = userAgent.match(/Chrome\/([0-9.]+)/)[1]
  } else if (userAgent.indexOf('Safari') > -1) {
    browser = 'safari'
    version = userAgent.match(/Version\/([0-9.]+)/)[1]
  } else if (userAgent.indexOf('MSIE') > -1 || userAgent.indexOf('Trident/') > -1) {
    browser = 'ie'
    version = userAgent.match(/MSIE ([0-9.]+)/) || userAgent.match(/rv:([0-9.]+)/)
    version = version ? version[1] : 'unknown'
  } else if (userAgent.indexOf('Opera') > -1 || userAgent.indexOf('OPR/') > -1) {
    browser = 'opera'
    version = userAgent.match(/Opera\/([0-9.]+)/) || userAgent.match(/OPR\/([0-9.]+)/)
    version = version ? version[1] : 'unknown'
  }
  
  // Detect OS
  if (userAgent.indexOf('Windows') > -1) {
    os = 'windows'
  } else if (userAgent.indexOf('Mac') > -1) {
    os = 'mac'
  } else if (userAgent.indexOf('Linux') > -1) {
    os = 'linux'
  } else if (userAgent.indexOf('Android') > -1) {
    os = 'android'
    mobile = true
  } else if (userAgent.indexOf('iOS') > -1 || userAgent.indexOf('iPhone') > -1 || userAgent.indexOf('iPad') > -1) {
    os = 'ios'
    mobile = true
  }
  
  // Detect if mobile
  if (!mobile) {
    mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
  }
  
  return {
    browser,
    version,
    os,
    mobile,
    userAgent
  }
}

/**
 * Check if browser supports a specific feature
 * @param {string} feature - Feature to check
 * @returns {boolean} - Whether the feature is supported
 */
export const supportsFeature = (feature) => {
  switch (feature) {
    case 'flexbox':
      return typeof document.createElement('div').style.flexBasis !== 'undefined'
    case 'grid':
      return typeof document.createElement('div').style.grid !== 'undefined'
    case 'customProperties':
      return window.CSS && CSS.supports('(--a: 0)')
    case 'intersectionObserver':
      return 'IntersectionObserver' in window
    case 'mutationObserver':
      return 'MutationObserver' in window
    case 'resizeObserver':
      return 'ResizeObserver' in window
    case 'webp':
      // This is async, so it's not a perfect check
      const canvas = document.createElement('canvas')
      if (canvas.getContext && canvas.getContext('2d')) {
        return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0
      }
      return false
    case 'webgl':
      try {
        const canvas = document.createElement('canvas')
        return !!(window.WebGLRenderingContext && 
          (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')))
      } catch (e) {
        return false
      }
    case 'webworkers':
      return 'Worker' in window
    case 'serviceWorkers':
      return 'serviceWorker' in navigator
    case 'localStorage':
      try {
        return 'localStorage' in window && window.localStorage !== null
      } catch (e) {
        return false
      }
    case 'sessionStorage':
      try {
        return 'sessionStorage' in window && window.sessionStorage !== null
      } catch (e) {
        return false
      }
    case 'geolocation':
      return 'geolocation' in navigator
    case 'history':
      return !!(window.history && window.history.pushState)
    case 'webSockets':
      return 'WebSocket' in window
    case 'fetch':
      return 'fetch' in window
    case 'promises':
      return 'Promise' in window
    case 'async':
      try {
        eval('async function test() {}')
        return true
      } catch (e) {
        return false
      }
    case 'objectFit':
      return 'objectFit' in document.createElement('img').style
    case 'passiveEvents':
      let supportsPassive = false
      try {
        const opts = Object.defineProperty({}, 'passive', {
          get: function() {
            supportsPassive = true
            return true
          }
        })
        window.addEventListener('testPassive', null, opts)
        window.removeEventListener('testPassive', null, opts)
      } catch (e) {}
      return supportsPassive
    default:
      return false
  }
}

/**
 * Apply browser-specific CSS fixes
 */
export const applyBrowserFixes = () => {
  const { browser, version } = detectBrowser()
  
  // Create a style element
  const style = document.createElement('style')
  style.type = 'text/css'
  
  let css = ''
  
  // Safari flexbox fixes
  if (browser === 'safari') {
    css += `
      /* Safari flexbox gap fix */
      .flex-gap {
        display: flex;
        flex-wrap: wrap;
        margin: -8px;
      }
      .flex-gap > * {
        margin: 8px;
      }
    `
  }
  
  // IE fixes
  if (browser === 'ie') {
    css += `
      /* IE flexbox fix */
      .flex-container {
        display: -ms-flexbox;
        display: flex;
      }
      /* IE grid fix */
      .grid-container {
        display: -ms-grid;
        display: grid;
      }
    `
  }
  
  // Firefox scrollbar fix
  if (browser === 'firefox') {
    css += `
      /* Firefox scrollbar fix */
      * {
        scrollbar-width: thin;
        scrollbar-color: #888 #f1f1f1;
      }
    `
  }
  
  // Add CSS to the style element
  if (style.styleSheet) {
    style.styleSheet.cssText = css
  } else {
    style.appendChild(document.createTextNode(css))
  }
  
  // Add the style element to the head
  document.head.appendChild(style)
  
  // Add browser-specific classes to the html element
  document.documentElement.classList.add(`browser-${browser}`)
  document.documentElement.classList.add(`os-${detectBrowser().os}`)
  
  if (detectBrowser().mobile) {
    document.documentElement.classList.add('mobile')
  }
}

/**
 * Add passive event listener with fallback
 * @param {Element} element - DOM element
 * @param {string} eventName - Event name
 * @param {Function} handler - Event handler
 * @param {boolean|Object} options - Event options
 */
export const addPassiveEventListener = (element, eventName, handler, options = false) => {
  try {
    // Try to use passive option
    const passiveOptions = typeof options === 'object' 
      ? { ...options, passive: true } 
      : { passive: true }
    
    element.addEventListener(eventName, handler, passiveOptions)
  } catch (err) {
    // Fallback to standard options
    element.addEventListener(eventName, handler, options)
  }
}

/**
 * Get vendor prefixed property name
 * @param {string} property - CSS property name
 * @returns {string} - Vendor prefixed property name
 */
export const getPrefixedProperty = (property) => {
  const element = document.createElement('div')
  const capitalizedProperty = property.charAt(0).toUpperCase() + property.slice(1)
  const vendors = ['', 'webkit', 'moz', 'ms', 'o']
  
  for (const vendor of vendors) {
    const vendorProperty = vendor 
      ? vendor + capitalizedProperty 
      : property
    
    if (vendorProperty in element.style) {
      return vendorProperty
    }
  }
  
  return property
}

export default {
  detectBrowser,
  supportsFeature,
  applyBrowserFixes,
  addPassiveEventListener,
  getPrefixedProperty
}