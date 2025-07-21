import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import useApiCancel from '../useApiCancel'
import axios from 'axios'

// Mock axios
vi.mock('axios', () => ({
  default: {
    isCancel: vi.fn(error => error.name === 'CanceledError')
  }
}))

describe('useApiCancel', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })
  
  it('should create a new AbortController', () => {
    const { result } = renderHook(() => useApiCancel())
    
    const controller = result.current.createController()
    
    expect(controller).toBeDefined()
    expect(controller.signal).toBeDefined()
  })
  
  it('should cancel previous controller when creating a new one', () => {
    const { result } = renderHook(() => useApiCancel())
    
    // Create first controller
    const controller1 = result.current.createController()
    const abortSpy1 = vi.spyOn(controller1, 'abort')
    
    // Create second controller
    const controller2 = result.current.createController()
    
    // First controller should be aborted
    expect(abortSpy1).toHaveBeenCalled()
    
    // Second controller should be different
    expect(controller2).not.toBe(controller1)
  })
  
  it('should get signal from current controller', () => {
    const { result } = renderHook(() => useApiCancel())
    
    const signal = result.current.getSignal()
    
    expect(signal).toBeDefined()
    expect(signal.aborted).toBe(false)
  })
  
  it('should cancel current request', () => {
    const { result } = renderHook(() => useApiCancel())
    
    // Create controller
    const controller = result.current.createController()
    const abortSpy = vi.spyOn(controller, 'abort')
    
    // Cancel request
    act(() => {
      result.current.cancelRequest()
    })
    
    // Controller should be aborted
    expect(abortSpy).toHaveBeenCalled()
  })
  
  it('should create cancellable API request config', () => {
    const { result } = renderHook(() => useApiCancel())
    
    const config = { url: '/test', method: 'get' }
    const cancellableConfig = result.current.withCancelToken(config)
    
    expect(cancellableConfig.url).toBe('/test')
    expect(cancellableConfig.method).toBe('get')
    expect(cancellableConfig.signal).toBeDefined()
  })
  
  it('should execute cancellable API request', async () => {
    const { result } = renderHook(() => useApiCancel())
    
    const mockData = { id: 1, name: 'Test' }
    const apiFn = vi.fn().mockResolvedValue(mockData)
    
    // Execute cancellable request
    const data = await result.current.executeCancellable(apiFn, { id: 1 })
    
    // Check result
    expect(data).toEqual(mockData)
    
    // Check API function call
    expect(apiFn).toHaveBeenCalledWith({ id: 1, signal: expect.any(Object) })
  })
  
  it('should add signal to last argument if it is an object', async () => {
    const { result } = renderHook(() => useApiCancel())
    
    const mockData = { id: 1, name: 'Test' }
    const apiFn = vi.fn().mockResolvedValue(mockData)
    
    // Execute cancellable request with multiple arguments
    await result.current.executeCancellable(apiFn, 'arg1', { headers: { 'Content-Type': 'application/json' } })
    
    // Check API function call
    expect(apiFn).toHaveBeenCalledWith('arg1', {
      headers: { 'Content-Type': 'application/json' },
      signal: expect.any(Object)
    })
  })
  
  it('should add signal as new argument if last argument is not an object', async () => {
    const { result } = renderHook(() => useApiCancel())
    
    const mockData = { id: 1, name: 'Test' }
    const apiFn = vi.fn().mockResolvedValue(mockData)
    
    // Execute cancellable request with non-object arguments
    await result.current.executeCancellable(apiFn, 'arg1', 123)
    
    // Check API function call
    expect(apiFn).toHaveBeenCalledWith('arg1', 123, { signal: expect.any(Object) })
  })
  
  it('should handle cancellation errors', async () => {
    const { result } = renderHook(() => useApiCancel())
    
    // Create a cancellation error
    const cancelError = new Error('Request canceled')
    cancelError.name = 'CanceledError'
    
    const apiFn = vi.fn().mockRejectedValue(cancelError)
    
    // Mock console.log
    const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    
    // Execute cancellable request that will be cancelled
    try {
      await result.current.executeCancellable(apiFn)
      fail('Should have thrown an error')
    } catch (error) {
      // Error should be the cancel error
      expect(error).toBe(cancelError)
      
      // isCancel should have been called
      expect(axios.isCancel).toHaveBeenCalledWith(cancelError)
      
      // Console log should have been called
      expect(consoleLogSpy).toHaveBeenCalled()
    }
    
    // Restore console.log
    consoleLogSpy.mockRestore()
  })
  
  it('should cancel request on unmount', () => {
    const { result, unmount } = renderHook(() => useApiCancel())
    
    // Create controller
    const controller = result.current.createController()
    const abortSpy = vi.spyOn(controller, 'abort')
    
    // Unmount hook
    unmount()
    
    // Controller should be aborted
    expect(abortSpy).toHaveBeenCalled()
  })
})