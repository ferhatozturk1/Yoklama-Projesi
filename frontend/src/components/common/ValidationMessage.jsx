import React from 'react'

/**
 * Component for displaying validation messages
 * 
 * @param {Object} props - Component props
 * @param {string} props.type - Message type (error, warning, info, success)
 * @param {Array|string} props.messages - Messages to display
 * @param {boolean} props.showIcon - Whether to show icon
 * @param {string} props.className - Additional CSS classes
 */
const ValidationMessage = ({
  type = 'error',
  messages = [],
  showIcon = true,
  className = ''
}) => {
  if (!messages || (Array.isArray(messages) && messages.length === 0)) {
    return null
  }

  const messageArray = Array.isArray(messages) ? messages : [messages]

  const getTypeStyles = () => {
    switch (type) {
      case 'warning':
        return {
          container: 'text-yellow-800',
          icon: 'text-yellow-500',
          border: 'border-yellow-400'
        }
      case 'info':
        return {
          container: 'text-blue-800',
          icon: 'text-blue-500',
          border: 'border-blue-400'
        }
      case 'success':
        return {
          container: 'text-green-800',
          icon: 'text-green-500',
          border: 'border-green-400'
        }
      default: // error
        return {
          container: 'text-red-800',
          icon: 'text-red-500',
          border: 'border-red-400'
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
      case 'success':
        return (
          <svg className={`w-5 h-5 ${styles.icon}`} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        )
      default: // error
        return (
          <svg className={`w-5 h-5 ${styles.icon}`} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        )
    }
  }

  return (
    <div className={`validation-message ${styles.container} ${className}`}>
      <div className={`p-4 border-l-4 ${styles.border} bg-opacity-10 rounded`}>
        {messageArray.map((message, index) => (
          <div key={index} className="flex items-start">
            {showIcon && index === 0 && (
              <div className="flex-shrink-0 mr-2">
                {getIcon()}
              </div>
            )}
            <div className={`${showIcon && index === 0 ? '' : 'ml-7'}`}>
              <p className="text-sm">{message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ValidationMessage