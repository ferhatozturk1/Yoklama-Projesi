/**
 * Hooks index file
 * 
 * This file exports all custom hooks for easy importing.
 */

// API hooks
export { default as useApi } from './useApi'
export { default as useApiValidation } from './useApiValidation'
export { default as useNotification } from './useNotification'
export { default as useErrorHandler } from './useErrorHandler'

// Export all hooks as a single object
export default {
  useApi: require('./useApi').default,
  useApiValidation: require('./useApiValidation').default,
  useNotification: require('./useNotification').default,
  useErrorHandler: require('./useErrorHandler').default
}