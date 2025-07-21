import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useBreakpoint } from '../../utils/responsiveUtils'

/**
 * Mobile-optimized modal component
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Close callback
 * @param {string} props.title - Modal title
 * @param {React.ReactNode} props.children - Modal content
 * @param {React.ReactNode} props.footer - Modal footer
 * @param {string} props.variant - Modal variant (fullscreen, bottom-sheet, center)
 * @param {boolean} props.closeOnEscape - Whether to close on escape key
 * @param {boolean} props.closeOnOverlayClick - Whether to close on overlay click
 * @param {string} props.className - Additional CSS classes
 */
const MobileModal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  variant = 'fullscreen',
  closeOnEscape = true,
  closeOnOverlayClick = true,
  className = '',
  ...props
}) => {
  const { isMobile } = useBreakpoint()
  
  // Handle escape key
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return
    
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose()
    }
    
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose, closeOnEscape])
  
  // Handle body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])
  
  // Don't render if not open
  if (!isOpen) return null
  
  // Use desktop modal on non-mobile devices
  if (!isMobile && variant !== 'center') {
    return createPortal(
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
        onClick={closeOnOverlayClick ? onClose : undefined}
      >
        <div 
          className={`bg-white rounded-lg shadow-xl overflow-hidden max-w-lg w-full ${className}`}
          onClick={e => e.stopPropagation()}
          {...props}
        >
          {title && (
            <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">{title}</h3>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
                onClick={onClose}
                aria-label="Close"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
          
          <div className="p-4">
            {children}
          </div>
          
          {footer && (
            <div className="px-4 py-3 border-t border-gray-200 flex flex-wrap justify-end gap-2">
              {footer}
            </div>
          )}
        </div>
      </div>,
      document.body
    )
  }
  
  // Determine modal classes based on variant
  const getModalClasses = () => {
    switch (variant) {
      case 'bottom-sheet':
        return 'fixed inset-x-0 bottom-0 z-50 rounded-t-xl max-h-[90vh] overflow-auto'
      case 'center':
        return 'fixed inset-0 z-50 m-auto max-w-sm max-h-[90vh] overflow-auto rounded-xl'
      case 'fullscreen':
      default:
        return 'fixed inset-0 z-50 overflow-auto'
    }
  }
  
  // Handle overlay click
  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose()
    }
  }
  
  return createPortal(
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={handleOverlayClick}
      />
      
      {/* Modal */}
      <div 
        className={`${getModalClasses()} bg-white shadow-xl ${className}`}
        onClick={e => e.stopPropagation()}
        {...props}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between px-4 py-3">
            {variant === 'bottom-sheet' && (
              <div className="absolute left-0 right-0 top-1 flex justify-center">
                <div className="w-12 h-1 bg-gray-300 rounded-full" />
              </div>
            )}
            
            <h3 className="text-lg font-medium text-gray-900">
              {title}
            </h3>
            
            <button
              type="button"
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
              onClick={onClose}
              aria-label="Close"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-4">
          {children}
        </div>
        
        {/* Footer */}
        {footer && (
          <div className="sticky bottom-0 z-10 bg-white border-t border-gray-200 px-4 py-3">
            {footer}
          </div>
        )}
      </div>
    </>,
    document.body
  )
}

/**
 * Bottom sheet modal variant
 */
export const BottomSheetModal = (props) => (
  <MobileModal {...props} variant="bottom-sheet" />
)

/**
 * Full screen modal variant
 */
export const FullScreenModal = (props) => (
  <MobileModal {...props} variant="fullscreen" />
)

/**
 * Centered modal variant
 */
export const CenteredModal = (props) => (
  <MobileModal {...props} variant="center" />
)

export default MobileModal