import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import ErrorBoundary, { withErrorBoundary, useErrorHandler } from '../ErrorBoundary'
import ConfirmDialog, { useConfirmDialog } from '../ConfirmDialog'
import ErrorDisplay, { NetworkError, ValidationError, EmptyState } from '../ErrorDisplay'
import ProgressIndicator, { CircularProgress, StepProgress } from '../ProgressIndicator'

// Mock toast notifications
jest.mock('../ToastNotification', () => ({
  showError: jest.fn(),
  showSuccess: jest.fn(),
  showWarning: jest.fn(),
  showInfo: jest.fn()
}))

describe('Error Handling Components', () => {
  describe('ErrorBoundary', () => {
    // Component that throws an error
    const ThrowError = ({ shouldThrow = false }) => {
      if (shouldThrow) {
        throw new Error('Test error')
      }
      return <div>No error</div>
    }

    test('should render children when no error', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      )
      
      expect(screen.getByText('No error')).toBeInTheDocument()
    })

    test('should render error UI when error occurs', () => {
      // Suppress console.error for this test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
      
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow />
        </ErrorBoundary>
      )
      
      expect(screen.getByText('Bir Hata Oluştu')).toBeInTheDocument()
      expect(screen.getByText('Tekrar Dene')).toBeInTheDocument()
      expect(screen.getByText('Sayfayı Yenile')).toBeInTheDocument()
      
      consoleSpy.mockRestore()
    })

    test('should call retry handler', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
      
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow />
        </ErrorBoundary>
      )
      
      const retryButton = screen.getByText('Tekrar Dene')
      fireEvent.click(retryButton)
      
      // After retry, should show the component without error
      expect(screen.getByText('No error')).toBeInTheDocument()
      
      consoleSpy.mockRestore()
    })

    test('should render custom fallback', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
      const customFallback = (error, retry) => (
        <div>
          <p>Custom error: {error.message}</p>
          <button onClick={retry}>Custom Retry</button>
        </div>
      )
      
      render(
        <ErrorBoundary fallback={customFallback}>
          <ThrowError shouldThrow />
        </ErrorBoundary>
      )
      
      expect(screen.getByText('Custom error: Test error')).toBeInTheDocument()
      expect(screen.getByText('Custom Retry')).toBeInTheDocument()
      
      consoleSpy.mockRestore()
    })
  })

  describe('withErrorBoundary HOC', () => {
    test('should wrap component with error boundary', () => {
      const TestComponent = () => <div>Test Component</div>
      const WrappedComponent = withErrorBoundary(TestComponent)
      
      render(<WrappedComponent />)
      
      expect(screen.getByText('Test Component')).toBeInTheDocument()
    })
  })

  describe('ConfirmDialog', () => {
    test('should not render when closed', () => {
      render(
        <ConfirmDialog
          isOpen={false}
          onClose={() => {}}
          onConfirm={() => {}}
        />
      )
      
      expect(screen.queryByText('Onay Gerekli')).not.toBeInTheDocument()
    })

    test('should render when open', () => {
      render(
        <ConfirmDialog
          isOpen={true}
          onClose={() => {}}
          onConfirm={() => {}}
          title="Test Title"
          message="Test Message"
        />
      )
      
      expect(screen.getByText('Test Title')).toBeInTheDocument()
      expect(screen.getByText('Test Message')).toBeInTheDocument()
      expect(screen.getByText('Onayla')).toBeInTheDocument()
      expect(screen.getByText('İptal')).toBeInTheDocument()
    })

    test('should call onConfirm when confirm button clicked', () => {
      const onConfirm = jest.fn()
      
      render(
        <ConfirmDialog
          isOpen={true}
          onClose={() => {}}
          onConfirm={onConfirm}
        />
      )
      
      fireEvent.click(screen.getByText('Onayla'))
      expect(onConfirm).toHaveBeenCalled()
    })

    test('should call onClose when cancel button clicked', () => {
      const onClose = jest.fn()
      
      render(
        <ConfirmDialog
          isOpen={true}
          onClose={onClose}
          onConfirm={() => {}}
        />
      )
      
      fireEvent.click(screen.getByText('İptal'))
      expect(onClose).toHaveBeenCalled()
    })

    test('should show loading state', () => {
      render(
        <ConfirmDialog
          isOpen={true}
          onClose={() => {}}
          onConfirm={() => {}}
          loading={true}
        />
      )
      
      expect(screen.getByText('İşleniyor...')).toBeInTheDocument()
    })
  })

  describe('ErrorDisplay', () => {
    test('should render error message', () => {
      render(<ErrorDisplay error="Test error message" />)
      
      expect(screen.getByText('Test error message')).toBeInTheDocument()
    })

    test('should render with title', () => {
      render(
        <ErrorDisplay 
          error="Test error" 
          title="Error Title"
        />
      )
      
      expect(screen.getByText('Error Title')).toBeInTheDocument()
      expect(screen.getByText('Test error')).toBeInTheDocument()
    })

    test('should show retry button', () => {
      const onRetry = jest.fn()
      
      render(
        <ErrorDisplay 
          error="Test error" 
          onRetry={onRetry}
        />
      )
      
      const retryButton = screen.getByText('Tekrar Dene')
      expect(retryButton).toBeInTheDocument()
      
      fireEvent.click(retryButton)
      expect(onRetry).toHaveBeenCalled()
    })

    test('should render different types', () => {
      const { rerender } = render(
        <ErrorDisplay error="Test error" type="warning" />
      )
      
      // Warning type should have yellow styling
      expect(screen.getByText('Test error')).toBeInTheDocument()
      
      rerender(<ErrorDisplay error="Test error" type="info" />)
      expect(screen.getByText('Test error')).toBeInTheDocument()
    })
  })

  describe('NetworkError', () => {
    test('should render network error message', () => {
      render(<NetworkError />)
      
      expect(screen.getByText('Bağlantı Hatası')).toBeInTheDocument()
      expect(screen.getByText('İnternet bağlantınızı kontrol edin ve tekrar deneyin.')).toBeInTheDocument()
    })
  })

  describe('ValidationError', () => {
    test('should render validation errors', () => {
      const errors = ['Error 1', 'Error 2', 'Error 3']
      
      render(<ValidationError errors={errors} />)
      
      expect(screen.getByText('Doğrulama Hataları')).toBeInTheDocument()
      expect(screen.getByText('Error 1')).toBeInTheDocument()
      expect(screen.getByText('Error 2')).toBeInTheDocument()
      expect(screen.getByText('Error 3')).toBeInTheDocument()
    })

    test('should not render when no errors', () => {
      render(<ValidationError errors={[]} />)
      
      expect(screen.queryByText('Doğrulama Hataları')).not.toBeInTheDocument()
    })
  })

  describe('EmptyState', () => {
    test('should render empty state', () => {
      render(<EmptyState />)
      
      expect(screen.getByText('Veri Bulunamadı')).toBeInTheDocument()
      expect(screen.getByText('Henüz herhangi bir veri bulunmuyor.')).toBeInTheDocument()
    })

    test('should render with custom content', () => {
      const action = <button>Add Item</button>
      
      render(
        <EmptyState
          title="No Items"
          message="No items found"
          action={action}
        />
      )
      
      expect(screen.getByText('No Items')).toBeInTheDocument()
      expect(screen.getByText('No items found')).toBeInTheDocument()
      expect(screen.getByText('Add Item')).toBeInTheDocument()
    })
  })

  describe('ProgressIndicator', () => {
    test('should render progress bar', () => {
      render(<ProgressIndicator value={50} />)
      
      // Progress bar should be rendered
      const progressBar = screen.getByRole('progressbar', { hidden: true })
      expect(progressBar).toBeInTheDocument()
    })

    test('should show percentage when enabled', () => {
      render(<ProgressIndicator value={75} showPercentage />)
      
      expect(screen.getByText('75%')).toBeInTheDocument()
    })

    test('should show label', () => {
      render(<ProgressIndicator value={50} label="Loading..." />)
      
      expect(screen.getByText('Loading...')).toBeInTheDocument()
    })
  })

  describe('CircularProgress', () => {
    test('should render circular progress', () => {
      render(<CircularProgress value={60} />)
      
      expect(screen.getByText('60%')).toBeInTheDocument()
    })

    test('should hide percentage when disabled', () => {
      render(<CircularProgress value={60} showPercentage={false} />)
      
      expect(screen.queryByText('60%')).not.toBeInTheDocument()
    })
  })

  describe('StepProgress', () => {
    test('should render step progress', () => {
      const steps = ['Step 1', 'Step 2', 'Step 3']
      
      render(<StepProgress steps={steps} currentStep={1} />)
      
      expect(screen.getByText('Step 1')).toBeInTheDocument()
      expect(screen.getByText('Step 2')).toBeInTheDocument()
      expect(screen.getByText('Step 3')).toBeInTheDocument()
    })

    test('should show completed steps', () => {
      const steps = ['Step 1', 'Step 2', 'Step 3']
      
      render(<StepProgress steps={steps} currentStep={2} />)
      
      // First step should show checkmark (completed)
      // Second step should show number (current)
      // Third step should show number (pending)
      expect(screen.getByText('3')).toBeInTheDocument() // Third step number
    })
  })
})

// Hook tests would require more complex setup with renderHook from @testing-library/react-hooks
describe('useConfirmDialog hook', () => {
  test('should be defined', () => {
    expect(useConfirmDialog).toBeDefined()
  })
})

describe('useErrorHandler hook', () => {
  test('should be defined', () => {
    expect(useErrorHandler).toBeDefined()
  })
})