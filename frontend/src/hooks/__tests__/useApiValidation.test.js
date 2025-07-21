import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import useApiValidation from '../useApiValidation'
import { getValidationErrors } from '../../utils/apiErrorHandler'

// Mock apiErrorHandler
vi.mock('../../utils/apiErrorHandler', () => ({
  getValidationErrors: vi.fn()
}))

describe('useApiValidation', () => {
  it('should initialize with empty validation errors', () => {
    const { result } = renderHook(() => useApiValidation())
    
    expect(result.current.validationErrors).toEqual({})
  })
  
  it('should handle validation errors', () => {
    const error = new Error('Validation Error')
    const validationErrors = {
      name: ['Name is required'],
      email: ['Email is invalid']
    }
    
    getValidationErrors.mockReturnValue(validationErrors)
    
    const { result } = renderHook(() => useApiValidation())
    
    act(() => {
      result.current.handleValidationError(error)
    })
    
    expect(result.current.validationErrors).toEqual(validationErrors)
    expect(getValidationErrors).toHaveBeenCalledWith(error)
  })
  
  it('should call onValidationError callback', () => {
    const error = new Error('Validation Error')
    const validationErrors = {
      name: ['Name is required']
    }
    
    getValidationErrors.mockReturnValue(validationErrors)
    
    const onValidationError = vi.fn()
    
    const { result } = renderHook(() => useApiValidation({ onValidationError }))
    
    act(() => {
      result.current.handleValidationError(error)
    })
    
    expect(onValidationError).toHaveBeenCalledWith(validationErrors, error)
  })
  
  it('should clear validation errors', () => {
    const error = new Error('Validation Error')
    const validationErrors = {
      name: ['Name is required']
    }
    
    getValidationErrors.mockReturnValue(validationErrors)
    
    const { result } = renderHook(() => useApiValidation())
    
    // Set validation errors
    act(() => {
      result.current.handleValidationError(error)
    })
    
    expect(result.current.validationErrors).toEqual(validationErrors)
    
    // Clear validation errors
    act(() => {
      result.current.clearValidationErrors()
    })
    
    expect(result.current.validationErrors).toEqual({})
  })
  
  it('should check if field has error', () => {
    const error = new Error('Validation Error')
    const validationErrors = {
      name: ['Name is required'],
      email: ['Email is invalid']
    }
    
    getValidationErrors.mockReturnValue(validationErrors)
    
    const { result } = renderHook(() => useApiValidation())
    
    // Set validation errors
    act(() => {
      result.current.handleValidationError(error)
    })
    
    // Check hasError
    expect(result.current.hasError('name')).toBe(true)
    expect(result.current.hasError('email')).toBe(true)
    expect(result.current.hasError('password')).toBe(false)
  })
  
  it('should get error message for field', () => {
    const error = new Error('Validation Error')
    const validationErrors = {
      name: ['Name is required', 'Name is too short'],
      email: 'Email is invalid'
    }
    
    getValidationErrors.mockReturnValue(validationErrors)
    
    const { result } = renderHook(() => useApiValidation())
    
    // Set validation errors
    act(() => {
      result.current.handleValidationError(error)
    })
    
    // Check getError
    expect(result.current.getError('name')).toBe('Name is required')
    expect(result.current.getError('email')).toBe('Email is invalid')
    expect(result.current.getError('password')).toBeNull()
  })
  
  it('should get all error messages for field', () => {
    const error = new Error('Validation Error')
    const validationErrors = {
      name: ['Name is required', 'Name is too short'],
      email: 'Email is invalid'
    }
    
    getValidationErrors.mockReturnValue(validationErrors)
    
    const { result } = renderHook(() => useApiValidation())
    
    // Set validation errors
    act(() => {
      result.current.handleValidationError(error)
    })
    
    // Check getErrors
    expect(result.current.getErrors('name')).toEqual(['Name is required', 'Name is too short'])
    expect(result.current.getErrors('email')).toEqual(['Email is invalid'])
    expect(result.current.getErrors('password')).toEqual([])
  })
  
  it('should return null if getValidationErrors returns null', () => {
    const error = new Error('Not a validation error')
    
    getValidationErrors.mockReturnValue(null)
    
    const { result } = renderHook(() => useApiValidation())
    
    const returnValue = result.current.handleValidationError(error)
    
    expect(returnValue).toBeNull()
    expect(result.current.validationErrors).toEqual({})
  })
})