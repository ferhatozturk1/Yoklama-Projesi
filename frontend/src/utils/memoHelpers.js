/**
 * Memoization Helpers
 * 
 * Utilities for optimizing React component rendering with memoization.
 */
import { memo, useCallback, useMemo, useRef } from 'react'
import { isEqual } from 'lodash-es'

/**
 * Enhanced memo HOC with custom comparison
 * @param {React.Component} Component - Component to memoize
 * @param {Function} propsAreEqual - Custom props comparison function
 * @returns {React.Component} - Memoized component
 */
export const memoWithCompare = (Component, propsAreEqual = isEqual) => {
  return memo(Component, propsAreEqual)
}

/**
 * Deep memo HOC with deep comparison of props
 * @param {React.Component} Component - Component to memoize
 * @returns {React.Component} - Memoized component with deep comparison
 */
export const deepMemo = (Component) => {
  return memo(Component, isEqual)
}

/**
 * Create a stable callback that only changes when dependencies change
 * @param {Function} callback - Callback function
 * @param {Array} dependencies - Dependencies array
 * @returns {Function} - Stable callback
 */
export const useStableCallback = (callback, dependencies = []) => {
  return useCallback(callback, dependencies)
}

/**
 * Create a stable object reference that only changes when dependencies change
 * @param {Function} factory - Factory function that creates the object
 * @param {Array} dependencies - Dependencies array
 * @returns {Object} - Stable object reference
 */
export const useStableObject = (factory, dependencies = []) => {
  return useMemo(factory, dependencies)
}

/**
 * Hook to prevent unnecessary re-renders by comparing values
 * @param {any} value - Value to compare
 * @param {Function} isEqual - Comparison function
 * @returns {any} - Memoized value
 */
export const useMemoizedValue = (value, isEqual = Object.is) => {
  const ref = useRef(value)
  
  if (!isEqual(value, ref.current)) {
    ref.current = value
  }
  
  return ref.current
}

/**
 * Hook to create a stable array reference
 * @param {Array} array - Array to memoize
 * @returns {Array} - Stable array reference
 */
export const useStableArray = (array) => {
  const ref = useRef([])
  
  if (!array || !Array.isArray(array)) {
    return ref.current
  }
  
  if (array.length !== ref.current.length || 
      array.some((item, index) => item !== ref.current[index])) {
    ref.current = array
  }
  
  return ref.current
}

/**
 * Hook to create a stable object that only changes when specific properties change
 * @param {Object} object - Object to memoize
 * @param {Array} watchProps - Properties to watch for changes
 * @returns {Object} - Stable object reference
 */
export const useStableProps = (object, watchProps = []) => {
  const ref = useRef(object || {})
  
  if (!object) {
    return ref.current
  }
  
  const hasChanged = watchProps.length === 0
    ? !isEqual(object, ref.current)
    : watchProps.some(prop => !isEqual(object[prop], ref.current[prop]))
  
  if (hasChanged) {
    ref.current = object
  }
  
  return ref.current
}

export default {
  memoWithCompare,
  deepMemo,
  useStableCallback,
  useStableObject,
  useMemoizedValue,
  useStableArray,
  useStableProps
}