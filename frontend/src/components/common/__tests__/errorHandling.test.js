import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { 
  ErrorBoundary, 
  ErrorDisplay, 
  FormValidationSummary,
  ValidationMessage,
  ConfirmDialog
} from '../index'
import { ToastContainer } from 'react-toastify'
import { showError, showSuccess } from '../ToastNotification'

// Mock react-toastify
jest.mock('react-toastify', () => {
  const actual = jest.requireActual('react-toastify')
  return {
    ...actual,
    toast: {
      success: jest.fn(),
      error: jest.fn(),
      warning: jest.fn(),
      info: jest.fn()
    }
  }
})

// Mock Formik context for FormValidationSummary
jest.mock('formik', () => ({
  useFormikContext: jest.fn()
}))

describe('Error Handling Components', () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('ErrorBoundary', () => {
    // Create a component that throws an error
    const ErrorThrowingComponent = () => {
      throw new Error('Test error')
      return <div>This will not render</div>
    }

    it('renders fallback UI when an error occurs', () => {
      // Suppress console.error for this test
      const originalConsoleError = console.error
      console.error = jest.fn()

      render(
        <ErrorBoundary>
          <ErrorThrowingComponent />
        </ErrorBoundary>
      )

      expect(screen.getByText('Bir Hata Oluştu')).toBeInTheDocument()
      expect(screen.getByText(/Beklenmeyen bir hata oluştu/i)).toBeInTheDocument()
      
      // Restore console.error
      console.error = originalConsoleError
    })

    it('renders custom fallback UI when provided', () => {
      // Suppress console.error for this test
      const originalConsoleError = console.error
      console.error = jest.fn()

      const customFallback = (error, retry) => (
        <div>
          <h2>Custom Error UI</h2>
          <button onClick={retry}>Custom Retry</button>
        </div>
      )

      render(
        <ErrorBoundary fallback={customFallback}>
          <ErrorThrowingComponent />
        </ErrorBoundary>
      )

      expect(screen.getByText('Custom Error UI')).toBeInTheDocument()
      expect(screen.getByText('Custom Retry')).toBeInTheDocument()
      
      // Restore console.error
      console.error = originalConsoleError
    })
  })

  describe('ErrorDisplay', () => {
    it('renders error message correctly', () => {
      render(<ErrorDisplay error="Test error message" />)
      expect(screen.getByText('Test error message')).toBeInTheDocument()
    })

    it('renders error object message correctly', () => {
      const error = new Error('Error object message')
      render(<ErrorDisplay error={error} />)
      expect(screen.getByText('Error object message')).toBeInTheDocument()
    })

    it('renders with retry button when onRetry is provided', () => {
      const handleRetry = jest.fn()
      render(<ErrorDisplay error="Test error" onRetry={handleRetry} />)
      
      const retryButton = screen.getByText('Tekrar Dene')
      expect(retryButton).toBeInTheDocument()
      
      fireEvent.click(retryButton)
      expect(handleRetry).toHaveBeenCalledTimes(1)
    })

    it('renders with dismiss button when onDismiss is provided', () => {
      const handleDismiss = jest.fn()
      render(<ErrorDisplay error="Test error" onDismiss={handleDismiss} />)
      
      const dismissButton = screen.getByText('Kapat')
      expect(dismissButton).toBeInTheDocument()
      
      fireEvent.click(dismissButton)
      expect(handleDismiss).toHaveBeenCalledTimes(1)
    })

    it('renders error details when showDetails is true', () => {
      const error = new Error('Test error')
      error.stack = 'Error: Test error\\n    at Component'
      
      render(<ErrorDisplay error={error} showDetails={true} />)
      
      expect(screen.getByText('Hata Detayları')).toBeInTheDocument()
    })
  })

  describe('ValidationMessage', () => {
    it('renders single message correctly', () => {
      render(<ValidationMessage messages="Test validation message" type="error" />)
      expect(screen.getByText('Test validation message')).toBeInTheDocument()
    })

    it('renders multiple messages correctly', () => {
      render(
        <ValidationMessage 
          messages={['First message', 'Second message']} 
          type="warning" 
        />
      )
      expect(screen.getByText('First message')).toBeInTheDocument()
      expect(screen.getByText('Second message')).toBeInTheDocument()
    })

    it('renders different types with correct styling', () => {
      const { rerender } = render(<ValidationMessage messages="Test" type="error" />)
      expect(screen.getByText('Test').closest('.validation-message')).toHaveClass('text-red-800')
      
      rerender(<ValidationMessage messages="Test" type="warning" />)
      expect(screen.getByText('Test').closest('.validation-message')).toHaveClass('text-yellow-800')
      
      rerender(<ValidationMessage messages="Test" type="info" />)
      expect(screen.getByText('Test').closest('.validation-message')).toHaveClass('text-blue-800')
      
      rerender(<ValidationMessage messages="Test" type="success" />)
      expect(screen.getByText('Test').closest('.validation-message')).toHaveClass('text-green-800')
    })
  })

  describe('FormValidationSummary', () => {
    it('renders validation errors correctly', () => {
      // Mock Formik context
      const { useFormikContext } = require('formik')
      useFormikContext.mockReturnValue({
        errors: { name: 'Name is required', email: 'Invalid email' },
        touched: { name: true, email: true },
        submitCount: 1
      })
      
      render(<FormValidationSummary />)
      
      expect(screen.getByText('Lütfen aşağıdaki hataları düzeltin:')).toBeInTheDocument()
      expect(screen.getByText('Name is required')).toBeInTheDocument()
      expect(screen.getByText('Invalid email')).toBeInTheDocument()
    })

    it('does not render when submitCount is 0 and showOnlyIfSubmitted is true', () => {
      // Mock Formik context
      const { useFormikContext } = require('formik')
      useFormikContext.mockReturnValue({
        errors: { name: 'Name is required' },
        touched: { name: true },
        submitCount: 0
      })
      
      const { container } = render(<FormValidationSummary />)
      expect(container.firstChild).toBeNull()
    })

    it('handles nested errors correctly', () => {
      // Mock Formik context with nested errors
      const { useFormikContext } = require('formik')
      useFormikContext.mockReturnValue({
        errors: { 
          user: { 
            name: 'Name is required',
            address: { city: 'City is required' }
          }
        },
        touched: { 
          user: { 
            name: true,
            address: { city: true }
          }
        },
        submitCount: 1
      })
      
      render(<FormValidationSummary />)
      
      expect(screen.getByText('Name is required')).toBeInTheDocument()
      expect(screen.getByText('City is required')).toBeInTheDocument()
    })
  })

  describe('Toast Notifications', () => {
    it('shows success notification', () => {
      const { toast } = require('react-toastify')
      
      showSuccess('Success message')
      
      expect(toast.success).toHaveBeenCalledWith(
        'Success message',
        expect.objectContaining({
          position: "top-right",
          autoClose: 3000
        })
      )
    })

    it('shows error notification', () => {
      const { toast } = require('react-toastify')
      
      showError('Error message')
      
      expect(toast.error).toHaveBeenCalledWith(
        'Error message',
        expect.objectContaining({
          position: "top-right",
          autoClose: 5000
        })
      )
    })
  })

  describe('ConfirmDialog', () => {
    it('renders dialog with correct content when open', () => {
      render(
        <ConfirmDialog
          isOpen={true}
          onClose={jest.fn()}
          onConfirm={jest.fn()}
          title="Test Title"
          message="Test Message"
        />
      )
      
      expect(screen.getByText('Test Title')).toBeInTheDocument()
      expect(screen.getByText('Test Message')).toBeInTheDocument()
      expect(screen.getByText('Onayla')).toBeInTheDocument()
      expect(screen.getByText('İptal')).toBeInTheDocument()
    })

    it('calls onConfirm when confirm button is clicked', () => {
      const handleConfirm = jest.fn()
      
      render(
        <ConfirmDialog
          isOpen={true}
          onClose={jest.fn()}
          onConfirm={handleConfirm}
        />
      )
      
      fireEvent.click(screen.getByText('Onayla'))
      expect(handleConfirm).toHaveBeenCalledTimes(1)
    })

    it('calls onClose when cancel button is clicked', () => {
      const handleClose = jest.fn()
      
      render(
        <ConfirmDialog
          isOpen={true}
          onClose={handleClose}
          onConfirm={jest.fn()}
        />
      )
      
      fireEvent.click(screen.getByText('İptal'))
      expect(handleClose).toHaveBeenCalledTimes(1)
    })
  })
})