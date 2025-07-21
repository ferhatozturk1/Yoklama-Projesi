/**
 * Error Reporter
 * 
 * This module provides utilities for tracking and reporting errors.
 */

// Configuration
const config = {
  enabled: true,
  logToConsole: true,
  captureUnhandledErrors: true,
  captureUnhandledRejections: true,
  captureNetworkErrors: true,
  maxErrorsStored: 50,
  reportEndpoint: null,
  reportBatchSize: 10,
  reportInterval: 30000, // 30 seconds
  includeContext: true,
  sanitizeData: true,
  debug: false
}

// Error storage
const errorStore = []

// Initialize error reporter
export const initErrorReporter = (options = {}) => {
  // Update configuration
  Object.assign(config, options)
  
  if (!config.enabled) {
    return
  }
  
  // Set up global error handlers
  if (config.captureUnhandledErrors) {
    window.addEventListener('error', handleGlobalError)
  }
  
  if (config.captureUnhandledRejections) {
    window.addEventListener('unhandledrejection', handleUnhandledRejection)
  }
  
  if (config.captureNetworkErrors) {
    setupNetworkErrorCapture()
  }
  
  // Set up periodic reporting
  if (config.reportEndpoint) {
    setInterval(reportErrors, config.reportInterval)
  }
  
  if (config.debug) {
    console.log('Error reporter initialized with config:', config)
  }
}

/**
 * Report an error
 * @param {Error|string} error - Error object or message
 * @param {Object} context - Error context
 * @param {string} type - Error type
 */
export const reportError = (error, context = {}, type = 'manual') => {
  if (!config.enabled) {
    return
  }
  
  // Create error object
  const errorObject = createErrorObject(error, context, type)
  
  // Store error
  storeError(errorObject)
  
  // Log to console if enabled
  if (config.logToConsole) {
    logErrorToConsole(errorObject)
  }
  
  // Report immediately if endpoint is configured
  if (config.reportEndpoint && type !== 'network') {
    sendErrorReport([errorObject])
  }
  
  return errorObject.id
}

/**
 * Create error object
 * @param {Error|string} error - Error object or message
 * @param {Object} context - Error context
 * @param {string} type - Error type
 * @returns {Object} - Error object
 * @private
 */
function createErrorObject(error, context = {}, type = 'manual') {
  // Generate error ID
  const errorId = generateErrorId()
  
  // Get error details
  const errorDetails = getErrorDetails(error)
  
  // Get application context
  const appContext = config.includeContext ? getApplicationContext() : {}
  
  // Create error object
  const errorObject = {
    id: errorId,
    timestamp: new Date().toISOString(),
    type,
    message: errorDetails.message,
    stack: errorDetails.stack,
    context: {
      ...appContext,
      ...context
    }
  }
  
  // Sanitize data if enabled
  if (config.sanitizeData) {
    sanitizeErrorData(errorObject)
  }
  
  return errorObject
}

/**
 * Get error details
 * @param {Error|string} error - Error object or message
 * @returns {Object} - Error details
 * @private
 */
function getErrorDetails(error) {
  if (error instanceof Error) {
    return {
      message: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code
    }
  }
  
  if (typeof error === 'string') {
    return {
      message: error,
      stack: new Error().stack
    }
  }
  
  if (typeof error === 'object') {
    return {
      message: error.message || 'Unknown error',
      stack: error.stack || new Error().stack,
      name: error.name,
      code: error.code
    }
  }
  
  return {
    message: 'Unknown error',
    stack: new Error().stack
  }
}

/**
 * Get application context
 * @returns {Object} - Application context
 * @private
 */
function getApplicationContext() {
  return {
    url: window.location.href,
    userAgent: navigator.userAgent,
    screenSize: `${window.innerWidth}x${window.innerHeight}`,
    timestamp: new Date().toISOString(),
    language: navigator.language,
    referrer: document.referrer,
    sessionId: getSessionId()
  }
}

/**
 * Get session ID
 * @returns {string} - Session ID
 * @private
 */
function getSessionId() {
  let sessionId = sessionStorage.getItem('errorReporterSessionId')
  
  if (!sessionId) {
    sessionId = generateErrorId()
    sessionStorage.setItem('errorReporterSessionId', sessionId)
  }
  
  return sessionId
}

/**
 * Generate error ID
 * @returns {string} - Error ID
 * @private
 */
function generateErrorId() {
  return 'err_' + Math.random().toString(36).substr(2, 9)
}

/**
 * Sanitize error data
 * @param {Object} errorObject - Error object
 * @private
 */
function sanitizeErrorData(errorObject) {
  // Sanitize URL parameters
  if (errorObject.context && errorObject.context.url) {
    try {
      const url = new URL(errorObject.context.url)
      
      // Remove sensitive parameters
      const sensitiveParams = ['token', 'password', 'secret', 'auth', 'key', 'api']
      
      sensitiveParams.forEach(param => {
        if (url.searchParams.has(param)) {
          url.searchParams.set(param, '[REDACTED]')
        }
      })
      
      errorObject.context.url = url.toString()
    } catch (e) {
      // Ignore URL parsing errors
    }
  }
  
  // Sanitize stack trace
  if (errorObject.stack) {
    // Remove file paths that might contain username
    errorObject.stack = errorObject.stack.replace(/file:\/\/\/[^/]*\/([^)]*)/g, 'file:///[REDACTED]/$1')
  }
}

/**
 * Store error
 * @param {Object} errorObject - Error object
 * @private
 */
function storeError(errorObject) {
  // Add error to store
  errorStore.push(errorObject)
  
  // Limit store size
  if (errorStore.length > config.maxErrorsStored) {
    errorStore.shift()
  }
}

/**
 * Log error to console
 * @param {Object} errorObject - Error object
 * @private
 */
function logErrorToConsole(errorObject) {
  console.error(
    `[Error Reporter] ${errorObject.type} error: ${errorObject.message}`,
    errorObject
  )
}

/**
 * Handle global error
 * @param {ErrorEvent} event - Error event
 * @private
 */
function handleGlobalError(event) {
  // Prevent default browser error handling
  event.preventDefault()
  
  // Report error
  reportError(
    event.error || event.message,
    {
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno
    },
    'unhandled'
  )
}

/**
 * Handle unhandled rejection
 * @param {PromiseRejectionEvent} event - Promise rejection event
 * @private
 */
function handleUnhandledRejection(event) {
  // Prevent default browser error handling
  event.preventDefault()
  
  // Report error
  reportError(
    event.reason || 'Unhandled promise rejection',
    {},
    'unhandledRejection'
  )
}

/**
 * Set up network error capture
 * @private
 */
function setupNetworkErrorCapture() {
  // Capture fetch errors
  const originalFetch = window.fetch
  
  window.fetch = async function(input, init) {
    try {
      const response = await originalFetch.apply(this, arguments)
      
      // Report error responses
      if (!response.ok) {
        reportError(
          `Network error: ${response.status} ${response.statusText}`,
          {
            url: typeof input === 'string' ? input : input.url,
            method: init?.method || 'GET',
            status: response.status,
            statusText: response.statusText
          },
          'network'
        )
      }
      
      return response
    } catch (error) {
      // Report network errors
      reportError(
        error,
        {
          url: typeof input === 'string' ? input : input?.url,
          method: init?.method || 'GET'
        },
        'network'
      )
      
      throw error
    }
  }
  
  // Capture XMLHttpRequest errors
  const originalXhrOpen = XMLHttpRequest.prototype.open
  const originalXhrSend = XMLHttpRequest.prototype.send
  
  XMLHttpRequest.prototype.open = function(method, url) {
    this._errorReporterData = {
      method,
      url
    }
    
    return originalXhrOpen.apply(this, arguments)
  }
  
  XMLHttpRequest.prototype.send = function() {
    // Add load and error event listeners
    this.addEventListener('load', function() {
      if (this.status >= 400) {
        reportError(
          `Network error: ${this.status} ${this.statusText}`,
          {
            ...this._errorReporterData,
            status: this.status,
            statusText: this.statusText
          },
          'network'
        )
      }
    })
    
    this.addEventListener('error', function() {
      reportError(
        'Network request failed',
        this._errorReporterData,
        'network'
      )
    })
    
    return originalXhrSend.apply(this, arguments)
  }
}

/**
 * Report errors to server
 * @private
 */
function reportErrors() {
  if (!config.reportEndpoint || errorStore.length === 0) {
    return
  }
  
  // Get errors to report
  const errorsToReport = errorStore.slice(0, config.reportBatchSize)
  
  // Send error report
  sendErrorReport(errorsToReport)
    .then(() => {
      // Remove reported errors from store
      errorStore.splice(0, errorsToReport.length)
    })
    .catch(error => {
      if (config.debug) {
        console.error('Failed to report errors:', error)
      }
    })
}

/**
 * Send error report to server
 * @param {Array} errors - Errors to report
 * @returns {Promise} - Promise that resolves when report is sent
 * @private
 */
function sendErrorReport(errors) {
  return fetch(config.reportEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      errors,
      application: 'teacher-attendance-frontend',
      version: process.env.REACT_APP_VERSION || '1.0.0',
      environment: process.env.NODE_ENV || 'development'
    }),
    // Don't capture errors from error reporting
    mode: 'cors',
    credentials: 'omit'
  })
}

/**
 * Get all stored errors
 * @returns {Array} - Stored errors
 */
export const getStoredErrors = () => {
  return [...errorStore]
}

/**
 * Clear stored errors
 */
export const clearStoredErrors = () => {
  errorStore.length = 0
}

export default {
  initErrorReporter,
  reportError,
  getStoredErrors,
  clearStoredErrors
}