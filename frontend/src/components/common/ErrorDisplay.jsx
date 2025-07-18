import React from 'react'

/**
 * Error display component for showing various types of errors
 * 
 * @param {Object} props - Component props
 * @param {string|Error} props.error - Error to display
 * @param {string} props.type - Error type (error, warning, info)
 * @param {string} props.title - Error title
 * @param {boolean} props.showDetails - Whether to show error details
 * @param {Function} props.onRetry - Retry callback
 * @param {Function} props.onDismiss - Dismiss callback
 * @param {string} props.className - Additional CSS classes
 * @param {React.ReactNode} props.children - Custom content
 */
const ErrorDisplay = ({
  error,
  type = 'error',
  title,
  showDetails = false,
  onRetry,
  onDismiss,
  className = '',
  children
}) => {
  if (!error && !children) return null

  const getErrorMessage = () => {
    if (typeof error === 'string') return error
    if (error?.message) return error.message
    if (error?.response?.data?.message) return error.response.data.message
    return 'Bilinmeyen bir hata oluştu'
  }

  const getErrorDetails = () => {
    if (typeof error === 'string') return null
    if (error?.stack) return error.stack
    if (error?.response?.data) return JSON.stringify(error.response.data, null, 2)
    return null
  }

  const getTypeStyles = () => {
    switch (type) {
      case 'warning':
        return {
          container: 'bg-yellow-50 border-yellow-200',
          icon: 'text-yellow-400',
          title: 'text-yellow-800',
          message: 'text-yellow-700',
          button: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
        }
      case 'info':
        return {
          container: 'bg-blue-50 border-blue-200',
          icon: 'text-blue-400',
          title: 'text-blue-800',
          message: 'text-blue-700',
          button: 'bg-blue-100 text-blue-800 hover:bg-blue-200'
        }
      default: // error
        return {
          container: 'bg-red-50 border-red-200',
          icon: 'text-red-400',
          title: 'text-red-800',
          message: 'text-red-700',
          button: 'bg-red-100 text-red-800 hover:bg-red-200'
        }
    }
  }

  const styles = getTypeStyles()

  const getIcon = () => {
    switch (type) {
      case 'warning':
        return (
          <svg className={`w-5 h-5 ${styles.icon}`} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        )
      case 'info':
        return (
          <svg className={`w-5 h-5 ${styles.icon}`} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        )
      default:
        return (
          <svg className={`w-5 h-5 ${styles.icon}`} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        )
    }
  }

  return (
    <div className={`rounded-md border p-4 ${styles.container} ${className}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        
        <div className="ml-3 flex-1">
          {title && (
            <h3 className={`text-sm font-medium ${styles.title} mb-1`}>
              {title}
            </h3>
          )}
          
          <div className={`text-sm ${styles.message}`}>
            {children || (
              <p>{getErrorMessage()}</p>
            )}
          </div>

          {showDetails && getErrorDetails() && (
            <details className="mt-2">
              <summary className={`cursor-pointer text-xs ${styles.title} hover:underline`}>
                Hata Detayları
              </summary>
              <pre className={`mt-2 text-xs ${styles.message} bg-white bg-opacity-50 p-2 rounded overflow-auto max-h-32`}>
                {getErrorDetails()}
              </pre>
            </details>
          )}

          {(onRetry || onDismiss) && (
            <div className="mt-3 flex space-x-2">
              {onRetry && (
                <button
                  type="button"
                  onClick={onRetry}
                  className={`inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded ${styles.button} focus:outline-none focus:ring-2 focus:ring-offset-2`}
                >
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Tekrar Dene
                </button>
              )}
              
              {onDismiss && (
                <button
                  type="button"
                  onClick={onDismiss}
                  className={`inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded ${styles.button} focus:outline-none focus:ring-2 focus:ring-offset-2`}
                >
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Kapat
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/**
 * Network error component
 */
export const NetworkError = ({ onRetry, className = '' }) => (
  <ErrorDisplay
    type="error"
    title="Bağlantı Hatası"
    error="İnternet bağlantınızı kontrol edin ve tekrar deneyin."
    onRetry={onRetry}
    className={className}
  />
)

/**
 * Not found error component
 */
export const NotFoundError = ({ message = 'Aradığınız sayfa bulunamadı.', className = '' }) => (
  <ErrorDisplay
    type="warning"
    title="Sayfa Bulunamadı"
    error={message}
    className={className}
  />
)

/**
 * Permission error component
 */
export const PermissionError = ({ message = 'Bu işlem için yetkiniz bulunmuyor.', className = '' }) => (
  <ErrorDisplay
    type="warning"
    title="Yetki Hatası"
    error={message}
    className={className}
  />
)

/**
 * Validation error component
 */
export const ValidationError = ({ errors = [], className = '' }) => {
  if (!errors.length) return null

  return (
    <ErrorDisplay
      type="error"
      title="Doğrulama Hataları"
      className={className}
    >
      <ul className="list-disc list-inside space-y-1">
        {errors.map((error, index) => (
          <li key={index} className="text-sm">
            {typeof error === 'string' ? error : error.message}
          </li>
        ))}
      </ul>
    </ErrorDisplay>
  )
}

/**
 * Empty state component
 */
export const EmptyState = ({ 
  title = 'Veri Bulunamadı',
  message = 'Henüz herhangi bir veri bulunmuyor.',
  icon,
  action,
  className = ''
}) => (
  <div className={`text-center py-12 ${className}`}>
    <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
      {icon || (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      )}
    </div>
    
    <h3 className="text-lg font-medium text-gray-900 mb-2">
      {title}
    </h3>
    
    <p className="text-gray-500 mb-6">
      {message}
    </p>
    
    {action}
  </div>
)

export default ErrorDisplay