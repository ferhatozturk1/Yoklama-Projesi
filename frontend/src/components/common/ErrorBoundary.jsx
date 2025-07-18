import React from 'react'
import { showError } from './ToastNotification'

/**
 * Error Boundary component to catch and handle React errors
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorId: null
    }
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { 
      hasError: true,
      errorId: Date.now().toString()
    }
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    this.setState({
      error,
      errorInfo
    })

    // Show user-friendly error notification
    if (this.props.showToast !== false) {
      showError(
        this.props.errorMessage || 
        'Bir hata oluştu. Sayfa yenilenerek tekrar denenebilir.'
      )
    }

    // Report error to monitoring service (if available)
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }
  }

  handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorId: null
    })
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.handleRetry)
      }

      // Default fallback UI
      return (
        <div className="error-boundary">
          <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
              <div className="text-center">
                <div className="mx-auto h-24 w-24 text-red-500 mb-4">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Bir Hata Oluştu
                </h2>
                
                <p className="text-gray-600 mb-6">
                  {this.props.userMessage || 
                   'Beklenmeyen bir hata oluştu. Lütfen sayfayı yenileyin veya tekrar deneyin.'}
                </p>

                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <details className="text-left bg-gray-100 p-4 rounded-lg mb-6">
                    <summary className="cursor-pointer font-medium text-gray-700 mb-2">
                      Hata Detayları (Geliştirici Modu)
                    </summary>
                    <pre className="text-xs text-red-600 overflow-auto">
                      {this.state.error.toString()}
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={this.handleRetry}
                    className="btn btn-primary"
                  >
                    Tekrar Dene
                  </button>
                  
                  <button
                    onClick={this.handleReload}
                    className="btn btn-secondary"
                  >
                    Sayfayı Yenile
                  </button>
                </div>

                {this.props.showReportButton && (
                  <div className="mt-4">
                    <button
                      onClick={() => this.props.onReportError?.(this.state.error, this.state.errorId)}
                      className="text-sm text-blue-600 hover:text-blue-800 underline"
                    >
                      Hatayı Bildir
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

/**
 * Higher-order component to wrap components with error boundary
 */
export const withErrorBoundary = (Component, errorBoundaryProps = {}) => {
  const WrappedComponent = (props) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  )
  
  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`
  
  return WrappedComponent
}

/**
 * Hook to handle errors in functional components
 */
export const useErrorHandler = () => {
  const handleError = React.useCallback((error, errorInfo = {}) => {
    console.error('Error caught by useErrorHandler:', error)
    
    // Show user notification
    showError(
      typeof error === 'string' 
        ? error 
        : error.message || 'Bir hata oluştu'
    )
    
    // Could also report to error tracking service here
  }, [])

  return handleError
}

export default ErrorBoundary