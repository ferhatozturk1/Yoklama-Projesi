import React from 'react'
import { render as rtlRender } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { vi } from 'vitest'

/**
 * Custom render function with common providers
 * @param {React.ReactElement} ui - Component to render
 * @param {Object} options - Render options
 * @returns {Object} - Rendered component
 */
export const render = (ui, options = {}) => {
  const {
    route = '/',
    history = {},
    ...renderOptions
  } = options
  
  // Set initial route
  window.history.pushState({}, 'Test page', route)
  
  // Mock history object
  Object.defineProperty(window, 'history', {
    value: {
      ...window.history,
      ...history
    }
  })
  
  const Wrapper = ({ children }) => (
    <BrowserRouter>
      {children}
      <ToastContainer />
    </BrowserRouter>
  )
  
  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions })
}

/**
 * Mock API response
 * @param {Object} data - Response data
 * @param {number} status - Response status
 * @param {Object} headers - Response headers
 * @returns {Object} - Mock response
 */
export const mockApiResponse = (data, status = 200, headers = {}) => {
  return {
    data,
    status,
    statusText: status === 200 ? 'OK' : 'Error',
    headers,
    config: {}
  }
}

/**
 * Mock API error
 * @param {string} message - Error message
 * @param {number} status - Error status
 * @param {Object} data - Error data
 * @returns {Object} - Mock error
 */
export const mockApiError = (message, status = 500, data = {}) => {
  const error = new Error(message)
  error.response = {
    data,
    status,
    statusText: 'Error',
    headers: {}
  }
  return error
}

/**
 * Mock validation error
 * @param {Object} errors - Validation errors
 * @returns {Object} - Mock error
 */
export const mockValidationError = (errors) => {
  return mockApiError(
    'Validation failed',
    422,
    { errors }
  )
}

/**
 * Mock network error
 * @param {string} message - Error message
 * @returns {Object} - Mock error
 */
export const mockNetworkError = (message = 'Network Error') => {
  const error = new Error(message)
  error.code = 'ECONNABORTED'
  return error
}

/**
 * Mock form event
 * @param {Object} values - Form values
 * @returns {Object} - Mock event
 */
export const mockFormEvent = (values = {}) => {
  return {
    preventDefault: vi.fn(),
    stopPropagation: vi.fn(),
    target: {
      elements: Object.keys(values).reduce((acc, key) => {
        acc[key] = { value: values[key] }
        return acc
      }, {})
    }
  }
}

/**
 * Mock file
 * @param {string} name - File name
 * @param {string} type - File type
 * @param {number} size - File size
 * @returns {Object} - Mock file
 */
export const mockFile = (name, type, size = 1024) => {
  const file = new File([''], name, { type })
  Object.defineProperty(file, 'size', {
    value: size
  })
  return file
}

/**
 * Wait for promises to resolve
 * @returns {Promise} - Promise that resolves after all promises
 */
export const flushPromises = () => new Promise(resolve => setTimeout(resolve, 0))

export * from '@testing-library/react'