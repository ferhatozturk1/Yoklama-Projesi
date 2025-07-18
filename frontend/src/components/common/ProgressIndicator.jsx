import React from 'react'

/**
 * Progress indicator component for showing progress of operations
 * 
 * @param {Object} props - Component props
 * @param {number} props.value - Progress value (0-100)
 * @param {number} props.max - Maximum value (default: 100)
 * @param {string} props.size - Size (small, medium, large)
 * @param {string} props.color - Color theme (primary, success, warning, danger)
 * @param {boolean} props.showPercentage - Whether to show percentage text
 * @param {string} props.label - Progress label
 * @param {boolean} props.animated - Whether to animate the progress
 * @param {boolean} props.striped - Whether to show striped pattern
 * @param {string} props.className - Additional CSS classes
 */
const ProgressIndicator = ({
  value = 0,
  max = 100,
  size = 'medium',
  color = 'primary',
  showPercentage = false,
  label = '',
  animated = false,
  striped = false,
  className = ''
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

  const sizeClasses = {
    small: 'h-2',
    medium: 'h-4',
    large: 'h-6'
  }

  const colorClasses = {
    primary: 'bg-blue-600',
    success: 'bg-green-600',
    warning: 'bg-yellow-600',
    danger: 'bg-red-600'
  }

  const backgroundColorClasses = {
    primary: 'bg-blue-100',
    success: 'bg-green-100',
    warning: 'bg-yellow-100',
    danger: 'bg-red-100'
  }

  return (
    <div className={`progress-indicator ${className}`}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-2">
          {label && (
            <span className="text-sm font-medium text-gray-700">
              {label}
            </span>
          )}
          {showPercentage && (
            <span className="text-sm text-gray-500">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      
      <div className={`w-full ${backgroundColorClasses[color]} rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <div
          className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full transition-all duration-300 ease-out ${
            striped ? 'bg-stripes' : ''
          } ${animated ? 'animate-pulse' : ''}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

/**
 * Circular progress indicator
 */
export const CircularProgress = ({
  value = 0,
  max = 100,
  size = 'medium',
  color = 'primary',
  showPercentage = true,
  strokeWidth = 4,
  className = ''
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
  
  const sizeMap = {
    small: 40,
    medium: 60,
    large: 80,
    xlarge: 120
  }
  
  const radius = (sizeMap[size] - strokeWidth * 2) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  const colorClasses = {
    primary: 'text-blue-600',
    success: 'text-green-600',
    warning: 'text-yellow-600',
    danger: 'text-red-600'
  }

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg
        width={sizeMap[size]}
        height={sizeMap[size]}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={sizeMap[size] / 2}
          cy={sizeMap[size] / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-gray-200"
        />
        
        {/* Progress circle */}
        <circle
          cx={sizeMap[size] / 2}
          cy={sizeMap[size] / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={`${colorClasses[color]} transition-all duration-300 ease-out`}
        />
      </svg>
      
      {showPercentage && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-sm font-medium ${colorClasses[color]}`}>
            {Math.round(percentage)}%
          </span>
        </div>
      )}
    </div>
  )
}

/**
 * Step progress indicator
 */
export const StepProgress = ({
  steps = [],
  currentStep = 0,
  color = 'primary',
  className = ''
}) => {
  const colorClasses = {
    primary: {
      active: 'bg-blue-600 text-white',
      completed: 'bg-blue-600 text-white',
      pending: 'bg-gray-200 text-gray-600',
      line: 'bg-blue-600'
    },
    success: {
      active: 'bg-green-600 text-white',
      completed: 'bg-green-600 text-white',
      pending: 'bg-gray-200 text-gray-600',
      line: 'bg-green-600'
    }
  }

  const colors = colorClasses[color]

  return (
    <div className={`step-progress ${className}`}>
      <div className="flex items-center">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  index < currentStep
                    ? colors.completed
                    : index === currentStep
                    ? colors.active
                    : colors.pending
                }`}
              >
                {index < currentStep ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              
              <span className="mt-2 text-xs text-center text-gray-600 max-w-20">
                {step.title || step}
              </span>
            </div>
            
            {index < steps.length - 1 && (
              <div className="flex-1 mx-4">
                <div className="h-0.5 bg-gray-200 relative">
                  <div
                    className={`h-full transition-all duration-300 ${
                      index < currentStep ? colors.line : 'bg-gray-200'
                    }`}
                    style={{
                      width: index < currentStep ? '100%' : '0%'
                    }}
                  />
                </div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

/**
 * Upload progress component
 */
export const UploadProgress = ({
  files = [],
  className = ''
}) => {
  if (!files.length) return null

  return (
    <div className={`upload-progress space-y-3 ${className}`}>
      {files.map((file, index) => (
        <div key={index} className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 truncate">
              {file.name}
            </span>
            <span className="text-xs text-gray-500">
              {file.status === 'completed' ? 'Tamamlandı' : 
               file.status === 'error' ? 'Hata' : 
               `${Math.round(file.progress || 0)}%`}
            </span>
          </div>
          
          <ProgressIndicator
            value={file.progress || 0}
            color={
              file.status === 'completed' ? 'success' :
              file.status === 'error' ? 'danger' : 'primary'
            }
            size="small"
            animated={file.status === 'uploading'}
          />
          
          {file.error && (
            <p className="text-xs text-red-600 mt-1">
              {file.error}
            </p>
          )}
        </div>
      ))}
    </div>
  )
}

export default ProgressIndicator