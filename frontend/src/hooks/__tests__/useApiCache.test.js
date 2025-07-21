import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import useApiCache from '../useApiCache'

describe('useApiCache', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useApiCache.clearAll()
  })
  
  it('should initialize with correct default values', () => {
    const fetchFn = vi.fn()
    
    const { result } = renderHook(() => useApiCache('test', fetchFn))
    
    expect(result.current.data).toBeNull()
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
  })
  
  it('should fetch data on mount when enabled', async () => {
    const mockData = { id: 1, name: 'Test' }
    const fetchFn = vi.fn().mockResolvedValue(mockData)
    
    const { result, waitForNextUpdate } = renderHook(() => 
      useApiCache('test', fetchFn, { enabled: true })
    )
    
    // Initial state
    expect(result.current.loading).toBe(true)
    
    // Wait for update
    await waitForNextUpdate()
    
    // Updated state
    expect(result.current.loading).toBe(false)
    expect(result.current.data).toEqual(mockData)
    expect(fetchFn).toHaveBeenCalledTimes(1)
  })
  
  it('should not fetch data on mount when disabled', () => {
    const fetchFn = vi.fn()
    
    renderHook(() => useApiCache('test', fetchFn, { enabled: false }))
    
    expect(fetchFn).not.toHaveBeenCalled()
  })
  
  it('should use cached data if available', async () => {
    const mockData = { id: 1, name: 'Test' }
    const fetchFn = vi.fn().mockResolvedValue(mockData)
    
    // First render to cache data
    const { result: result1, waitForNextUpdate: wait1 } = renderHook(() => 
      useApiCache('test', fetchFn, { enabled: true })
    )
    
    await wait1()
    
    expect(fetchFn).toHaveBeenCalledTimes(1)
    expect(result1.current.data).toEqual(mockData)
    
    // Reset mock
    fetchFn.mockClear()
    
    // Second render should use cached data
    const { result: result2 } = renderHook(() => 
      useApiCache('test', fetchFn, { enabled: true })
    )
    
    expect(fetchFn).not.toHaveBeenCalled()
    expect(result2.current.data).toEqual(mockData)
  })
  
  it('should refetch data when cache expires', async () => {
    const mockData1 = { id: 1, name: 'Test 1' }
    const mockData2 = { id: 1, name: 'Test 2' }
    
    const fetchFn = vi.fn()
      .mockResolvedValueOnce(mockData1)
      .mockResolvedValueOnce(mockData2)
    
    // First render to cache data
    const { result: result1, waitForNextUpdate: wait1 } = renderHook(() => 
      useApiCache('test', fetchFn, { enabled: true, cacheTime: 100 }) // 100ms cache time
    )
    
    await wait1()
    
    expect(fetchFn).toHaveBeenCalledTimes(1)
    expect(result1.current.data).toEqual(mockData1)
    
    // Wait for cache to expire
    await new Promise(resolve => setTimeout(resolve, 200))
    
    // Second render should refetch
    const { result: result2, waitForNextUpdate: wait2 } = renderHook(() => 
      useApiCache('test', fetchFn, { enabled: true, cacheTime: 100 })
    )
    
    await wait2()
    
    expect(fetchFn).toHaveBeenCalledTimes(2)
    expect(result2.current.data).toEqual(mockData2)
  })
  
  it('should use different cache keys for different params', async () => {
    const mockData1 = { id: 1, name: 'Test 1' }
    const mockData2 = { id: 2, name: 'Test 2' }
    
    const fetchFn = vi.fn()
      .mockImplementation(params => {
        return Promise.resolve(params.id === 1 ? mockData1 : mockData2)
      })
    
    // First render with params.id = 1
    const { result: result1, waitForNextUpdate: wait1 } = renderHook(() => 
      useApiCache('test', fetchFn, { enabled: true, params: { id: 1 } })
    )
    
    await wait1()
    
    expect(fetchFn).toHaveBeenCalledWith({ id: 1 })
    expect(result1.current.data).toEqual(mockData1)
    
    // Reset mock
    fetchFn.mockClear()
    
    // Second render with params.id = 2
    const { result: result2, waitForNextUpdate: wait2 } = renderHook(() => 
      useApiCache('test', fetchFn, { enabled: true, params: { id: 2 } })
    )
    
    await wait2()
    
    expect(fetchFn).toHaveBeenCalledWith({ id: 2 })
    expect(result2.current.data).toEqual(mockData2)
    
    // Reset mock
    fetchFn.mockClear()
    
    // Third render with params.id = 1 again (should use cache)
    const { result: result3 } = renderHook(() => 
      useApiCache('test', fetchFn, { enabled: true, params: { id: 1 } })
    )
    
    expect(fetchFn).not.toHaveBeenCalled()
    expect(result3.current.data).toEqual(mockData1)
  })
  
  it('should refetch data when dependencies change', async () => {
    const mockData1 = { id: 1, name: 'Test 1' }
    const mockData2 = { id: 1, name: 'Test 2' }
    
    const fetchFn = vi.fn()
      .mockResolvedValueOnce(mockData1)
      .mockResolvedValueOnce(mockData2)
    
    // First render
    const { result, rerender, waitForNextUpdate } = renderHook(
      ({ dependency }) => useApiCache('test', fetchFn, { 
        enabled: true, 
        dependencies: [dependency] 
      }),
      { initialProps: { dependency: 'initial' } }
    )
    
    await waitForNextUpdate()
    
    expect(fetchFn).toHaveBeenCalledTimes(1)
    expect(result.current.data).toEqual(mockData1)
    
    // Change dependency
    rerender({ dependency: 'changed' })
    
    // Wait for refetch
    await waitForNextUpdate()
    
    expect(fetchFn).toHaveBeenCalledTimes(2)
    expect(result.current.data).toEqual(mockData2)
  })
  
  it('should invalidate cache and refetch', async () => {
    const mockData1 = { id: 1, name: 'Test 1' }
    const mockData2 = { id: 1, name: 'Test 2' }
    
    const fetchFn = vi.fn()
      .mockResolvedValueOnce(mockData1)
      .mockResolvedValueOnce(mockData2)
    
    // First render to cache data
    const { result, waitForNextUpdate } = renderHook(() => 
      useApiCache('test', fetchFn, { enabled: true })
    )
    
    await waitForNextUpdate()
    
    expect(fetchFn).toHaveBeenCalledTimes(1)
    expect(result.current.data).toEqual(mockData1)
    
    // Invalidate cache and refetch
    await act(async () => {
      await result.current.invalidateCache()
    })
    
    expect(fetchFn).toHaveBeenCalledTimes(2)
    expect(result.current.data).toEqual(mockData2)
  })
  
  it('should update cache with new data', () => {
    const mockData = { id: 1, name: 'Test' }
    const newData = { id: 1, name: 'Updated Test' }
    const fetchFn = vi.fn().mockResolvedValue(mockData)
    
    // First render to cache data
    const { result, waitForNextUpdate } = renderHook(() => 
      useApiCache('test', fetchFn, { enabled: true })
    )
    
    await waitForNextUpdate()
    
    expect(result.current.data).toEqual(mockData)
    
    // Update cache
    act(() => {
      result.current.updateCache(newData)
    })
    
    expect(result.current.data).toEqual(newData)
    
    // Reset mock
    fetchFn.mockClear()
    
    // New render should use updated cache
    const { result: result2 } = renderHook(() => 
      useApiCache('test', fetchFn, { enabled: true })
    )
    
    expect(fetchFn).not.toHaveBeenCalled()
    expect(result2.current.data).toEqual(newData)
  })
  
  it('should update cache with update function', () => {
    const mockData = { id: 1, count: 1 }
    const fetchFn = vi.fn().mockResolvedValue(mockData)
    
    // First render to cache data
    const { result, waitForNextUpdate } = renderHook(() => 
      useApiCache('test', fetchFn, { enabled: true })
    )
    
    await waitForNextUpdate()
    
    expect(result.current.data).toEqual(mockData)
    
    // Update cache with function
    act(() => {
      result.current.updateCache(null, data => ({
        ...data,
        count: data.count + 1
      }))
    })
    
    expect(result.current.data).toEqual({ id: 1, count: 2 })
  })
  
  it('should clear all cached data', async () => {
    const mockData1 = { id: 1, name: 'Test 1' }
    const mockData2 = { id: 2, name: 'Test 2' }
    
    const fetchFn1 = vi.fn().mockResolvedValue(mockData1)
    const fetchFn2 = vi.fn().mockResolvedValue(mockData2)
    
    // Cache first data
    const { result: result1, waitForNextUpdate: wait1 } = renderHook(() => 
      useApiCache('test1', fetchFn1, { enabled: true })
    )
    
    await wait1()
    
    // Cache second data
    const { result: result2, waitForNextUpdate: wait2 } = renderHook(() => 
      useApiCache('test2', fetchFn2, { enabled: true })
    )
    
    await wait2()
    
    // Clear all caches
    act(() => {
      useApiCache.clearAll()
    })
    
    // Reset mocks
    fetchFn1.mockClear()
    fetchFn2.mockClear()
    
    // New renders should refetch
    const { waitForNextUpdate: wait3 } = renderHook(() => 
      useApiCache('test1', fetchFn1, { enabled: true })
    )
    
    await wait3()
    
    const { waitForNextUpdate: wait4 } = renderHook(() => 
      useApiCache('test2', fetchFn2, { enabled: true })
    )
    
    await wait4()
    
    expect(fetchFn1).toHaveBeenCalledTimes(1)
    expect(fetchFn2).toHaveBeenCalledTimes(1)
  })
  
  it('should clear cached data by pattern', async () => {
    const mockData1 = { id: 1, name: 'Test 1' }
    const mockData2 = { id: 2, name: 'Test 2' }
    
    const fetchFn1 = vi.fn().mockResolvedValue(mockData1)
    const fetchFn2 = vi.fn().mockResolvedValue(mockData2)
    
    // Cache first data
    const { result: result1, waitForNextUpdate: wait1 } = renderHook(() => 
      useApiCache('users:1', fetchFn1, { enabled: true })
    )
    
    await wait1()
    
    // Cache second data
    const { result: result2, waitForNextUpdate: wait2 } = renderHook(() => 
      useApiCache('posts:1', fetchFn2, { enabled: true })
    )
    
    await wait2()
    
    // Clear caches by pattern
    act(() => {
      useApiCache.clearByPattern('users')
    })
    
    // Reset mocks
    fetchFn1.mockClear()
    fetchFn2.mockClear()
    
    // Users cache should be cleared, posts cache should remain
    const { waitForNextUpdate: wait3 } = renderHook(() => 
      useApiCache('users:1', fetchFn1, { enabled: true })
    )
    
    await wait3()
    
    const { result: result4 } = renderHook(() => 
      useApiCache('posts:1', fetchFn2, { enabled: true })
    )
    
    expect(fetchFn1).toHaveBeenCalledTimes(1)
    expect(fetchFn2).not.toHaveBeenCalled()
    expect(result4.current.data).toEqual(mockData2)
  })
})