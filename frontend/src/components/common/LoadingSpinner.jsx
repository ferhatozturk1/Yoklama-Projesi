import React from 'react'

/**
 * Loading spinner component with various sizes and styles
 * 
 * @param {Object} props - Component props
 * @param {string} props.size - Spinner size (small, medium, large, xlarge)
 * @param {string} props.variant - Spinner variant (default, dots, pulse, bars)
 * @param {string} props.color - Spinner color (primary, secondary, white, gray)
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.text - Loading text to display
 * @param {boolean} props.overlay - Whether to show as overlay
 * @param {boolean} props.fullScreen - Whether to show as full screen overlay
 */
const LoadingSpinner = ({ 
  size = 'medium', 
  variant = 'default',
  color = 'primary',
  className = '',
  text = '',
  overlay = false,
  fullScreen = false
}) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
    xlarge: 'w-16 h-16'
  }

  const colorClasses = {
    primary: 'text-blue-600',
    secondary: 'text-gray-600',
    white: 'text-white',
    gray: 'text-gray-400'
  }

  const renderSpinner = () => {
    const baseClasses = `${sizeClasses[size]} ${colorClasses[color]} ${className}`

    switch (variant) {
      case 'dots':
        return (
          <div className={`flex space-x-1 ${className}`}>
            <div className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-bounce`} style={{ animationDelay: '0ms' }}></div>
            <div className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-bounce`} style={{ animationDelay: '150ms' }}></div>
            <div className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-bounce`} style={{ animationDelay: '300ms' }}></div>
          </div>
        )

      case 'pulse':
        return (
          <div className={`${baseClasses} rounded-full animate-pulse bg-current opacity-75`}></div>
        )

      case 'bars':
        return (
          <div className={`flex space-x-1 ${className}`}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`w-1 ${sizeClasses[size].split(' ')[1]} ${colorClasses[color]} bg-current animate-pulse`}
                style={{ animationDelay: `${i * 150}ms` }}
              ></div>
            ))}
          </div>
        )

      default:
        return (
          <svg
            className={`${baseClasses} animate-spin`}
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )
    }
  }

  const content = (
    <div className="flex flex-col items-center justify-center space-y-2">
      {renderSpinner()}
      {text && (
        <p className={`text-sm ${colorClasses[color]} animate-pulse`}>
          {text}
        </p>
      )}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-90">
        {content}
      </div>
    )
  }

  if (overlay) {
    return (
      <div className="absolute inset-0 z-10 flex items-center justify-center bg-white bg-opacity-75 rounded">
        {content}
      </div>
    )
  }

  return content
}

/**
 * Page loading component
 */
export const PageLoader = ({ text = 'Yükleniyor...' }) => (
  <LoadingSpinner
    size="large"
    text={text}
    fullScreen
    color="primary"
  />
)

/**
 * Button loading component
 */
export const ButtonLoader = ({ size = 'small', color = 'white' }) => (
  <LoadingSpinner
    size={size}
    color={color}
    className="mr-2"
  />
)

/**
 * Section loading component
 */
export const SectionLoader = ({ text = 'Yükleniyor...', className = '' }) => (
  <div className={`flex items-center justify-center py-8 ${className}`}>
    <LoadingSpinner
      size="medium"
      text={text}
      color="primary"
    />
  </div>
)

/**
 * Table loading component
 */
export const TableLoader = ({ rows = 5, columns = 4 }) => (
  <div className="animate-pulse">
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} className="flex space-x-4 py-3 border-b border-gray-200">
        {Array.from({ length: columns }).map((_, colIndex) => (
          <div
            key={colIndex}
            className="h-4 bg-gray-200 rounded flex-1"
          ></div>
        ))}
      </div>
    ))}
  </div>
)

export default LoadingSpinner