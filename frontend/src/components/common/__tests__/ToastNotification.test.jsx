import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '../../../utils/__tests__/testUtils'
import { toast } from 'react-toastify'
import { 
  showSuccess, 
  showError, 
  showWarning, 
  showInfo,
  ToastNotification
} from '../ToastNotification'

// Mock react-toastify
vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn()
  },
  ToastContainer: vi.fn(() => <div data-testid="toast-container" />)
}))

describe('ToastNotification Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })
  
  it('should render ToastContainer', () => {
    render(<ToastNotification />)
    
    expect(screen.getByTestId('toast-container')).toBeInTheDocument()
  })
  
  it('should show success notification', () => {
    showSuccess('Operation successful')
    
    expect(toast.success).toHaveBeenCalledWith(
      'Operation successful',
      expect.objectContaining({
        position: expect.any(String),
        autoClose: expect.any(Number)
      })
    )
  })
  
  it('should show error notification', () => {
    showError('An error occurred')
    
    expect(toast.error).toHaveBeenCalledWith(
      'An error occurred',
      expect.objectContaining({
        position: expect.any(String),
        autoClose: expect.any(Number)
      })
    )
  })
  
  it('should show warning notification', () => {
    showWarning('Warning message')
    
    expect(toast.warning).toHaveBeenCalledWith(
      'Warning message',
      expect.objectContaining({
        position: expect.any(String),
        autoClose: expect.any(Number)
      })
    )
  })
  
  it('should show info notification', () => {
    showInfo('Information message')
    
    expect(toast.info).toHaveBeenCalledWith(
      'Information message',
      expect.objectContaining({
        position: expect.any(String),
        autoClose: expect.any(Number)
      })
    )
  })
  
  it('should use custom options when provided', () => {
    const customOptions = {
      position: 'bottom-left',
      autoClose: 1000,
      hideProgressBar: true
    }
    
    showSuccess('Custom success', customOptions)
    
    expect(toast.success).toHaveBeenCalledWith(
      'Custom success',
      expect.objectContaining(customOptions)
    )
  })
  
  it('should handle undefined message', () => {
    showError(undefined)
    
    expect(toast.error).toHaveBeenCalledWith(
      'An error occurred',
      expect.any(Object)
    )
  })
  
  it('should handle null message', () => {
    showWarning(null)
    
    expect(toast.warning).toHaveBeenCalledWith(
      'Warning',
      expect.any(Object)
    )
  })
  
  it('should handle object message', () => {
    const errorObj = { message: 'Error details' }
    showError(errorObj)
    
    expect(toast.error).toHaveBeenCalledWith(
      'Error details',
      expect.any(Object)
    )
  })
})