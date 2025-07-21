import React from 'react'
import { accessibilityUtils } from '../../utils'

/**
 * Higher-order component that adds accessibility features to a component
 * @param {React.Component} Component - Component to enhance
 * @param {Object} options - Accessibility options
 * @returns {React.Component} - Enhanced component with accessibility features
 */
const withAccessibility = (Component, options = {}) => {
  const EnhancedComponent = React.forwardRef((props, ref) => {
    // Generate ARIA attributes based on component type
    const getAriaAttributes = () => {
      const { type = 'default', ...ariaOptions } = options
      
      // Merge options with props
      const mergedOptions = {
        ...ariaOptions,
        ...props.ariaOptions
      }
      
      // Generate attributes based on component type
      switch (type) {
        case 'button':
          return accessibilityUtils.buttonAttributes(mergedOptions)
        case 'form':
        case 'input':
          return accessibilityUtils.formFieldAttributes({
            ...mergedOptions,
            id: props.id,
            error: props.error,
            required: props.required,
            disabled: props.disabled
          })
        case 'modal':
          return accessibilityUtils.modalAttributes(mergedOptions)
        case 'tab':
          return accessibilityUtils.tabAttributes(mergedOptions)
        case 'tabPanel':
          return accessibilityUtils.tabPanelAttributes(mergedOptions)
        case 'menu':
          return accessibilityUtils.menuAttributes(mergedOptions)
        case 'menuItem':
          return accessibilityUtils.menuItemAttributes(mergedOptions)
        case 'alert':
          return accessibilityUtils.alertAttributes(mergedOptions)
        case 'tooltip':
          return accessibilityUtils.tooltipAttributes(mergedOptions)
        case 'progress':
          return accessibilityUtils.progressAttributes(mergedOptions)
        case 'table':
          return accessibilityUtils.tableAttributes(mergedOptions)
        case 'tableRow':
          return accessibilityUtils.tableRowAttributes(mergedOptions)
        case 'tableCell':
          return accessibilityUtils.tableCellAttributes(mergedOptions)
        case 'list':
          return accessibilityUtils.listAttributes(mergedOptions)
        case 'listItem':
          return accessibilityUtils.listItemAttributes(mergedOptions)
        case 'combobox':
          return accessibilityUtils.comboboxAttributes(mergedOptions)
        default:
          return accessibilityUtils.ariaAttributes(mergedOptions)
      }
    }
    
    // Add keyboard navigation handlers
    const addKeyboardHandlers = () => {
      const handlers = {}
      
      // Only add keyboard handlers if the component is interactive
      if (['button', 'input', 'tab', 'menuItem'].includes(options.type)) {
        handlers.onKeyDown = (event) => {
          // Call the original onKeyDown handler if it exists
          if (props.onKeyDown) {
            props.onKeyDown(event)
          }
          
          // Add default keyboard behavior
          if (event.key === 'Enter' || event.key === ' ') {
            // Prevent default space behavior (scrolling)
            if (event.key === ' ') {
              event.preventDefault()
            }
            
            // Trigger click handler if it exists
            if (props.onClick) {
              props.onClick(event)
            }
          }
        }
      }
      
      return handlers
    }
    
    // Generate enhanced props
    const enhancedProps = {
      ...props,
      ...getAriaAttributes(),
      ...addKeyboardHandlers(),
      ref
    }
    
    return <Component {...enhancedProps} />
  })
  
  // Set display name
  EnhancedComponent.displayName = `withAccessibility(${Component.displayName || Component.name || 'Component'})`
  
  return EnhancedComponent
}

export default withAccessibility