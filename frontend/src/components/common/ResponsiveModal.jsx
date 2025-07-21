import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useBreakpoint } from '../../utils/responsiveUtils'

/**
 * Responsive modal component that adapts to different screen sizes
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Close callback
 * @param {string} props.title - Modal title
 * @param {React.ReactNode} props.children - Modal content
 * @param {React.ReactNode} props.footer - Modal footer
 * @param {string} props.size - Modal size (sm, md, lg, xl, full)
 * @param {string} props.mobileVariant - Mobile-specific variant (fullscreen, bottom-sheet)
 * @param {boolean} props.closeOnEscape - Whether to close on escape key
 * @param {boolean} props.closeOnOverlayClick - Whether to close on overlay click
 * @param {string} props.className - Additional CSS classes
 */
const ResponsiveModal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  mobileVariant = 'fullscreen',
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
  
  // Determine modal classes based on size and mobile variant
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full'
  }
  
  const modalClasses = [
    'modal',
    sizeClasses[size] || sizeClasses.md,
    isMobile && mobileVariant === 'fullscreen' ? 'modal-mobile-fullscreen' : '',
    isMobile && mobileVariant === 'bottom-sheet' ? 'modal-bottom-sheet open' : '',
    className
  ].filter(Boolean).join(' ')
  
  // Handle overlay click
  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose()
    }
  }
  
  return createPortal(
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
      onClick={handleOverlayClick}
    >
      <div className={modalClasses} {...props}>
        <div className="modal-content bg-white rounded-lg shadow-xl overflow-hidden">
          {title && (
            <div className="modal-header px-4 py-3 border-b border-gray-200 flex items-center justify-between">
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
          
          <div className="modal-body p-4">
            {children}
          </div>
          
          {footer && (
            <div className="modal-footer px-4 py-3 border-t border-gray-200 flex flex-wrap justify-end gap-2">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  )
}

/**
 * Bottom sheet modal variant (especially for mobile)
 */
export const BottomSheetModal = (props) => (
  <ResponsiveModal {...props} mobileVariant="bottom-sheet" />
)

/**
 * Full screen modal variant
 */
export const FullScreenModal = (props) => (
  <ResponsiveModal {...props} size="full" mobileVariant="fullscreen" />
)

export default ResponsiveModal