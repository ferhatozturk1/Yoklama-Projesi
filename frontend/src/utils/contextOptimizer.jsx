/**
 * Context Optimizer
 * 
 * Utilities for optimizing React Context performance by splitting contexts
 * and implementing selector patterns.
 */
import React, { createContext, useContext, useReducer, useMemo, useCallback } from 'react'

/**
 * Create an optimized context with selector pattern
 * @param {Object} initialState - Initial state
 * @param {Function} reducer - Reducer function
 * @returns {Object} - Context provider and hooks
 */
export const createOptimizedContext = (initialState, reducer) => {
  // Create contexts for state and dispatch
  const StateContext = createContext(initialState)
  const DispatchContext = createContext(() => {
    throw new Error('Dispatch function not available')
  })
  
  // Provider component
  const Provider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState)
    
    return (
      <StateContext.Provider value={state}>
        <DispatchContext.Provider value={dispatch}>
          {children}
        </DispatchContext.Provider>
      </StateContext.Provider>
    )
  }
  
  // Hook to use the entire state (avoid using this directly)
  const useStateContext = () => {
    const context = useContext(StateContext)
    if (context === undefined) {
      throw new Error('useStateContext must be used within a Provider')
    }
    return context
  }
  
  // Hook to use dispatch
  const useDispatch = () => {
    const dispatch = useContext(DispatchContext)
    if (dispatch === undefined) {
      throw new Error('useDispatch must be used within a Provider')
    }
    return dispatch
  }
  
  // Hook to select specific state slice
  const useSelector = (selector) => {
    const state = useStateContext()
    return selector(state)
  }
  
  // Hook to create memoized actions
  const useActions = (actions) => {
    const dispatch = useDispatch()
    
    return useMemo(() => {
      if (typeof actions === 'function') {
        return actions(dispatch)
      }
      
      const boundActions = {}
      
      for (const key in actions) {
        boundActions[key] = (...args) => dispatch(actions[key](...args))
      }
      
      return boundActions
    }, [dispatch, actions])
  }
  
  return {
    Provider,
    useSelector,
    useDispatch,
    useActions
  }
}

/**
 * Create a context with state splitting for better performance
 * @param {Object} initialState - Initial state
 * @returns {Object} - Context provider and hooks
 */
export const createSplitContext = (initialState) => {
  // Create a context for each top-level state property
  const contexts = {}
  const allContext = createContext(initialState)
  
  // Create individual contexts for each top-level state property
  for (const key in initialState) {
    contexts[key] = createContext(initialState[key])
  }
  
  // Provider component
  const Provider = ({ children }) => {
    const [state, setState] = React.useState(initialState)
    
    // Create update function
    const updateState = useCallback((key, value) => {
      setState(prevState => ({
        ...prevState,
        [key]: typeof value === 'function' ? value(prevState[key]) : value
      }))
    }, [])
    
    // Create individual update functions for each key
    const updateFunctions = useMemo(() => {
      const functions = {}
      
      for (const key in initialState) {
        functions[key] = (value) => updateState(key, value)
      }
      
      return functions
    }, [updateState])
    
    // Create context value with state and update functions
    const contextValue = useMemo(() => ({
      state,
      setState,
      ...updateFunctions
    }), [state, updateFunctions])
    
    // Create individual context providers for each key
    const providers = Object.keys(contexts).reduce((acc, key) => {
      const Provider = contexts[key].Provider
      const value = {
        value: state[key],
        setValue: updateFunctions[key]
      }
      
      return (
        <Provider value={value}>
          {acc}
        </Provider>
      )
    }, children)
    
    return (
      <allContext.Provider value={contextValue}>
        {providers}
      </allContext.Provider>
    )
  }
  
  // Hook to use the entire state
  const useAllState = () => {
    const context = useContext(allContext)
    if (context === undefined) {
      throw new Error('useAllState must be used within a Provider')
    }
    return context
  }
  
  // Create hooks for each state property
  const hooks = {}
  
  for (const key in contexts) {
    hooks[`use${key.charAt(0).toUpperCase() + key.slice(1)}`] = () => {
      const context = useContext(contexts[key])
      if (context === undefined) {
        throw new Error(`use${key} must be used within a Provider`)
      }
      return context
    }
  }
  
  return {
    Provider,
    useAllState,
    ...hooks
  }
}

export default {
  createOptimizedContext,
  createSplitContext
}