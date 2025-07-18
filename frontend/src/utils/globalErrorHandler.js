import { showError } from '../components/common/ToastNotification'

/**
 * Global error handler for unhandled errors and promise rejections
 */
class GlobalErrorHandler {
  constructor() {
    this.errorQueue = []
    this.isInitialized = false
    this.maxQueueSize = 50
    this.errorReportingUrl = null
    this.onError = null
  }

  /**
   * Initialize global error handling
   * @param {Object} options - Configuration options
   */
  init(options = {}) {
    if (this.isInitialized) return

    const {
      showNotifications = true,
      logToConsole = true,
      reportToService = false,
      errorReportingUrl = null,
      onError = null,
      maxQueueSize = 50
    } = options

    this.showNotifications = showNotifications
    this.logToConsole = logToConsole
    this.reportToService = reportToService
    this.errorReportingUrl = errorReportingUrl
    this.onError = onError
    this.maxQueueSize = maxQueueSize

    // Handle unhandled JavaScript errors
    window.addEventListener('error', this.handleError.bind(this))

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', this.handlePromiseRejection.bind(this))

    // Handle React errors (if using error boundaries)
    if (window.React) {
      const originalConsoleError = console.error
      console.error = (...args) => {
        // Check if this is a React error
        if (args[0] && args[0].includes && args[0].includes('React')) {
          this.handleReactError(args)
        }
        originalConsoleError.apply(console, args)
      }
    }

    this.isInitialized = true
  }

  /**
   * Handle JavaScript errors
   * @param {ErrorEvent} event - Error event
   */
  handleError(event) {
    const errorInfo = {
      type: 'javascript',
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      error: event.error,
      stack: event.error?.stack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    }

    this.processError(errorInfo)
  }

  /**
   * Handle unhandled promise rejections
   * @param {PromiseRejectionEvent} event - Promise rejection event
   */
  handlePromiseRejection(event) {
    const errorInfo = {
      type: 'promise_rejection',
      message: event.reason?.message || 'Unhandled promise rejection',
      error: event.reason,
      stack: event.reason?.stack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    }

    this.processError(errorInfo)
    
    // Prevent the default browser behavior
    event.preventDefault()
  }

  /**
   * Handle React errors
   * @param {Array} args - Console error arguments
   */
  handleReactError(args) {
    const errorInfo = {
      type: 'react',
      message: args[0] || 'React error',
      args: args,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    }

    this.processError(errorInfo)
  }

  /**
   * Process and handle error
   * @param {Object} errorInfo - Error information
   */
  processError(errorInfo) {
    // Add to error queue
    this.addToQueue(errorInfo)

    // Log to console if enabled
    if (this.logToConsole) {
      console.error('Global Error Handler:', errorInfo)
    }

    // Show notification if enabled
    if (this.showNotifications) {
      this.showErrorNotification(errorInfo)
    }

    // Report to external service if enabled
    if (this.reportToService && this.errorReportingUrl) {
      this.reportError(errorInfo)
    }

    // Call custom error handler if provided
    if (this.onError && typeof this.onError === 'function') {
      try {
        this.onError(errorInfo)
      } catch (handlerError) {
        console.error('Error in custom error handler:', handlerError)
      }
    }
  }

  /**
   * Add error to queue
   * @param {Object} errorInfo - Error information
   */
  addToQueue(errorInfo) {
    this.errorQueue.push(errorInfo)

    // Limit queue size
    if (this.errorQueue.length > this.maxQueueSize) {
      this.errorQueue.shift()
    }
  }

  /**
   * Show error notification to user
   * @param {Object} errorInfo - Error information
   */
  showErrorNotification(errorInfo) {
    let message = 'Beklenmeyen bir hata oluştu'

    // Customize message based on error type
    switch (errorInfo.type) {
      case 'javascript':
        message = 'Sayfa hatası oluştu. Sayfa yenilenerek düzeltilebilir.'
        break
      case 'promise_rejection':
        message = 'İşlem tamamlanamadı. Lütfen tekrar deneyin.'
        break
      case 'react':
        message = 'Uygulama hatası oluştu. Sayfa yenilenerek düzeltilebilir.'
        break
      case 'network':
        message = 'Bağlantı hatası. İnternet bağlantınızı kontrol edin.'
        break
    }

    // Don't show too many notifications
    if (this.shouldShowNotification(errorInfo)) {
      showError(message)
    }
  }

  /**
   * Check if notification should be shown
   * @param {Object} errorInfo - Error information
   * @returns {boolean} - Whether to show notification
   */
  shouldShowNotification(errorInfo) {
    // Don't show notification for the same error multiple times in a short period
    const recentErrors = this.errorQueue.filter(err => 
      Date.now() - new Date(err.timestamp).getTime() < 5000 // Last 5 seconds
    )

    const sameErrors = recentErrors.filter(err => 
      err.message === errorInfo.message && err.type === errorInfo.type
    )

    return sameErrors.length <= 1
  }

  /**
   * Report error to external service
   * @param {Object} errorInfo - Error information
   */
  async reportError(errorInfo) {
    try {
      await fetch(this.errorReportingUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...errorInfo,
          sessionId: this.getSessionId(),
          userId: this.getUserId()
        })
      })
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError)
    }
  }

  /**
   * Get session ID for error reporting
   * @returns {string} - Session ID
   */
  getSessionId() {
    let sessionId = sessionStorage.getItem('errorSessionId')
    if (!sessionId) {
      sessionId = Date.now().toString() + Math.random().toString(36).substr(2, 9)
      sessionStorage.setItem('errorSessionId', sessionId)
    }
    return sessionId
  }

  /**
   * Get user ID for error reporting
   * @returns {string|null} - User ID
   */
  getUserId() {
    // Try to get user ID from various sources
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        return payload.userId || payload.sub || null
      } catch {
        return null
      }
    }
    return null
  }

  /**
   * Get error statistics
   * @returns {Object} - Error statistics
   */
  getErrorStats() {
    const now = Date.now()
    const last24Hours = this.errorQueue.filter(err => 
      now - new Date(err.timestamp).getTime() < 24 * 60 * 60 * 1000
    )

    const byType = this.errorQueue.reduce((acc, err) => {
      acc[err.type] = (acc[err.type] || 0) + 1
      return acc
    }, {})

    const byMessage = this.errorQueue.reduce((acc, err) => {
      const key = err.message.substring(0, 50) // Truncate long messages
      acc[key] = (acc[key] || 0) + 1
      return acc
    }, {})

    return {
      total: this.errorQueue.length,
      last24Hours: last24Hours.length,
      byType,
      byMessage,
      mostRecent: this.errorQueue[this.errorQueue.length - 1]?.timestamp
    }
  }

  /**
   * Clear error queue
   */
  clearErrors() {
    this.errorQueue = []
  }

  /**
   * Get all errors
   * @returns {Array} - All errors
   */
  getAllErrors() {
    return [...this.errorQueue]
  }

  /**
   * Manually report an error
   * @param {Error|string} error - Error to report
   * @param {Object} context - Additional context
   */
  reportManualError(error, context = {}) {
    const errorInfo = {
      type: 'manual',
      message: typeof error === 'string' ? error : error.message,
      error: error,
      stack: error?.stack,
      context,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    }

    this.processError(errorInfo)
  }

  /**
   * Destroy global error handler
   */
  destroy() {
    if (!this.isInitialized) return

    window.removeEventListener('error', this.handleError.bind(this))
    window.removeEventListener('unhandledrejection', this.handlePromiseRejection.bind(this))

    this.isInitialized = false
    this.clearErrors()
  }
}

// Create singleton instance
const globalErrorHandler = new GlobalErrorHandler()

export default globalErrorHandler

// Export utility functions
export const initGlobalErrorHandler = (options) => globalErrorHandler.init(options)
export const reportError = (error, context) => globalErrorHandler.reportManualError(error, context)
export const getErrorStats = () => globalErrorHandler.getErrorStats()
export const clearErrors = () => globalErrorHandler.clearErrors()
export const getAllErrors = () => globalErrorHandler.getAllErrors()