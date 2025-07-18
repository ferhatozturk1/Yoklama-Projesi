import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'

/**
 * Confirmation dialog component for destructive actions
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether dialog is open
 * @param {Function} props.onClose - Close callback
 * @param {Function} props.onConfirm - Confirm callback
 * @param {string} props.title - Dialog title
 * @param {string} props.message - Dialog message
 * @param {string} props.confirmText - Confirm button text
 * @param {string} props.cancelText - Cancel button text
 * @param {string} props.type - Dialog type (danger, warning, info)
 * @param {boolean} props.loading - Whether confirm action is loading
 * @param {React.ReactNode} props.children - Custom content
 */
const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Onay Gerekli',
  message = 'Bu işlemi gerçekleştirmek istediğinizden emin misiniz?',
  confirmText = 'Onayla',
  cancelText = 'İptal',
  type = 'danger',
  loading = false,
  children
}) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
      // Delay hiding to allow exit animation
      const timer = setTimeout(() => setIsVisible(false), 150)
      return () => clearTimeout(timer)
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }

  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return {
          icon: (
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          ),
          iconBg: 'bg-red-100',
          confirmButton: 'btn-danger'
        }
      case 'warning':
        return {
          icon: (
            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          ),
          iconBg: 'bg-yellow-100',
          confirmButton: 'btn-warning'
        }
      case 'info':
        return {
          icon: (
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          iconBg: 'bg-blue-100',
          confirmButton: 'btn-primary'
        }
      default:
        return {
          icon: null,
          iconBg: 'bg-gray-100',
          confirmButton: 'btn-primary'
        }
    }
  }

  const typeStyles = getTypeStyles()

  if (!isVisible) return null

  return createPortal(
    <div
      className={`fixed inset-0 z-50 overflow-y-auto transition-opacity duration-150 ${
        isOpen ? 'opacity-100' : 'opacity-0'
      }`}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div
        className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
        onClick={handleBackdropClick}
      >
        {/* Background overlay */}
        <div
          className={`fixed inset-0 bg-gray-500 transition-opacity duration-150 ${
            isOpen ? 'bg-opacity-75' : 'bg-opacity-0'
          }`}
          aria-hidden="true"
        />

        {/* Center alignment trick */}
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>

        {/* Dialog panel */}
        <div
          className={`inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all duration-150 sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6 ${
            isOpen ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-95'
          }`}
        >
          <div className="sm:flex sm:items-start">
            {typeStyles.icon && (
              <div className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full ${typeStyles.iconBg} sm:mx-0 sm:h-10 sm:w-10`}>
                {typeStyles.icon}
              </div>
            )}
            
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left flex-1">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">
                {title}
              </h3>
              
              <div className="mt-2">
                {children ? (
                  children
                ) : (
                  <p className="text-sm text-gray-500">
                    {message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={onConfirm}
              disabled={loading}
              className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm ${typeStyles.confirmButton} ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  İşleniyor...
                </div>
              ) : (
                confirmText
              )}
            </button>
            
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
            >
              {cancelText}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}

/**
 * Hook for managing confirmation dialogs
 */
export const useConfirmDialog = () => {
  const [dialogState, setDialogState] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
    type: 'danger',
    confirmText: 'Onayla',
    cancelText: 'İptal'
  })

  const showConfirm = (options) => {
    return new Promise((resolve) => {
      setDialogState({
        isOpen: true,
        title: options.title || 'Onay Gerekli',
        message: options.message || 'Bu işlemi gerçekleştirmek istediğinizden emin misiniz?',
        type: options.type || 'danger',
        confirmText: options.confirmText || 'Onayla',
        cancelText: options.cancelText || 'İptal',
        onConfirm: () => {
          setDialogState(prev => ({ ...prev, isOpen: false }))
          resolve(true)
        }
      })
    })
  }

  const hideConfirm = () => {
    setDialogState(prev => ({ ...prev, isOpen: false }))
  }

  const ConfirmDialogComponent = () => (
    <ConfirmDialog
      isOpen={dialogState.isOpen}
      onClose={hideConfirm}
      onConfirm={dialogState.onConfirm}
      title={dialogState.title}
      message={dialogState.message}
      type={dialogState.type}
      confirmText={dialogState.confirmText}
      cancelText={dialogState.cancelText}
    />
  )

  return {
    showConfirm,
    hideConfirm,
    ConfirmDialog: ConfirmDialogComponent
  }
}

export default ConfirmDialog