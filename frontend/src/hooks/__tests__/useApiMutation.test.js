import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import useApiMutation from '../useApiMutation'
import { handleApiError } from '../../utils/apiErrorHandler'
import { showSuccess } from '../../components/common/ToastNotification'

// Mock dependencies
vi.mock('../../utils/apiErrorHandler', () => ({
  handleApiError: vi.fn()
}))

vi.mock('../../components/common/ToastNotification', () => ({
  showSuccess: vi.fn(),
  showError: vi.fn(),
  showWarning: vi.fn()
}))

describe('useApiMutation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })
  
  it('should initialize with correct default values', () => {
    const mutationFn = vi.fn()
    
    const { result } = renderHook(() => useApiMutation(mutationFn))
    
    expect(result.current.data).toBeNull()
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
  })
  
  it('should execute mutation function and update state', async () => {
    const mockData = { id: 1, name: 'Test' }
    const mutationFn = vi.fn().mockResolvedValue(mockData)
    
    const { result } = renderHook(() => useApiMutation(mutationFn))
    
    // Initial state
    expect(result.current.loading).toBe(false)
    expect(result.current.data).toBeNull()
    
    // Execute mutation function
    let returnedData
    await act(async () => {
      returnedData = await result.current.mutate({ name: 'Test' })
    })
    
    // Check returned data
    expect(returnedData).toEqual(mockData)
    
    // Updated state
    expect(result.current.loading).toBe(false)
    expect(result.current.data).toEqual(mockData)
    expect(mutationFn).toHaveBeenCalledWith({ name: 'Test' })
  })
  
  it('should pass arguments to mutation function', async () => {
    const mutationFn = vi.fn().mockResolvedValue({ result: 'success' })
    
    const { result } = renderHook(() => useApiMutation(mutationFn))
    
    // Execute mutation function with arguments
    await act(async () => {
      await result.current.mutate('arg1', { key: 'value' })
    })
    
    // Check arguments
    expect(mutationFn).toHaveBeenCalledWith('arg1', { key: 'value' })
  })
  
  it('should handle mutation errors', async () => {
    const error = new Error('API Error')
    const mutationFn = vi.fn().mockRejectedValue(error)
    
    const { result } = renderHook(() => useApiMutation(mutationFn))
    
    // Execute mutation function
    await act(async () => {
      try {
        await result.current.mutate()
      } catch (e) {
        // Ignore error
      }
    })
    
    // Updated state
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeDefined()
    expect(handleApiError).toHaveBeenCalledWith(error, expect.any(Object))
  })
  
  it('should show success message when specified', async () => {
    const mockData = { id: 1, name: 'Test' }
    const mutationFn = vi.fn().mockResolvedValue(mockData)
    
    const { result } = renderHook(() => useApiMutation(mutationFn, {
      showSuccessMessage: true,
      successMessage: 'Success!'
    }))
    
    // Execute mutation function
    await act(async () => {
      await result.current.mutate()
    })
    
    // Check success message
    expect(showSuccess).toHaveBeenCalledWith('Success!')
  })
  
  it('should call onSuccess callback on success', async () => {
    const mockData = { id: 1, name: 'Test' }
    const mutationFn = vi.fn().mockResolvedValue(mockData)
    const onSuccess = vi.fn()
    
    const { result } = renderHook(() => useApiMutation(mutationFn, { onSuccess }))
    
    // Execute mutation function
    await act(async () => {
      await result.current.mutate({ name: 'Test' })
    })
    
    // Check callback
    expect(onSuccess).toHaveBeenCalledWith(mockData, { name: 'Test' })
  })
  
  it('should call onError callback on error', async () => {
    const error = new Error('API Error')
    const mutationFn = vi.fn().mockRejectedValue(error)
    const onError = vi.fn()
    
    const { result } = renderHook(() => useApiMutation(mutationFn, { onError }))
    
    // Execute mutation function
    await act(async () => {
      try {
        await result.current.mutate({ name: 'Test' })
      } catch (e) {
        // Ignore error
      }
    })
    
    // Check callback
    expect(onError).toHaveBeenCalled()
    expect(onError.mock.calls[0][1]).toEqual({ name: 'Test' })
  })
  
  it('should call onSettled callback on success or error', async () => {
    // Test success case
    const mockData = { id: 1, name: 'Test' }
    const successFn = vi.fn().mockResolvedValue(mockData)
    const onSettled = vi.fn()
    
    const { result: successResult } = renderHook(() => 
      useApiMutation(successFn, { onSettled })
    )
    
    // Execute mutation function
    await act(async () => {
      await successResult.current.mutate({ name: 'Test' })
    })
    
    // Check callback
    expect(onSettled).toHaveBeenCalledWith(mockData, null, { name: 'Test' })
    
    // Reset mock
    onSettled.mockReset()
    
    // Test error case
    const error = new Error('API Error')
    const errorFn = vi.fn().mockRejectedValue(error)
    
    const { result: errorResult } = renderHook(() => 
      useApiMutation(errorFn, { onSettled })
    )
    
    // Execute mutation function
    await act(async () => {
      try {
        await errorResult.current.mutate({ name: 'Test' })
      } catch (e) {
        // Ignore error
      }
    })
    
    // Check callback
    expect(onSettled).toHaveBeenCalled()
    expect(onSettled.mock.calls[0][0]).toBeNull()
    expect(onSettled.mock.calls[0][1]).toBeDefined() // Error details
    expect(onSettled.mock.calls[0][2]).toEqual({ name: 'Test' })
  })
  
  it('should reset state', async () => {
    const mockData = { id: 1, name: 'Test' }
    const mutationFn = vi.fn().mockResolvedValue(mockData)
    
    const { result } = renderHook(() => useApiMutation(mutationFn))
    
    // Execute mutation function
    await act(async () => {
      await result.current.mutate()
    })
    
    // Updated state
    expect(result.current.data).toEqual(mockData)
    
    // Reset state
    act(() => {
      result.current.reset()
    })
    
    // Check reset state
    expect(result.current.data).toBeNull()
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
  })
})