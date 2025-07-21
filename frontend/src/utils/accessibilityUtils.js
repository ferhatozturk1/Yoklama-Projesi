/**
 * Accessibility Utilities
 * 
 * This module provides utilities for improving application accessibility.
 */

/**
 * Generate ARIA attributes for a component
 * @param {Object} options - ARIA options
 * @returns {Object} - ARIA attributes
 */
export const ariaAttributes = (options = {}) => {
  const attributes = {}
  
  if (options.label) {
    attributes['aria-label'] = options.label
  }
  
  if (options.labelledBy) {
    attributes['aria-labelledby'] = options.labelledBy
  }
  
  if (options.describedBy) {
    attributes['aria-describedby'] = options.describedBy
  }
  
  if (options.expanded !== undefined) {
    attributes['aria-expanded'] = options.expanded
  }
  
  if (options.controls) {
    attributes['aria-controls'] = options.controls
  }
  
  if (options.selected !== undefined) {
    attributes['aria-selected'] = options.selected
  }
  
  if (options.checked !== undefined) {
    attributes['aria-checked'] = options.checked
  }
  
  if (options.disabled !== undefined) {
    attributes['aria-disabled'] = options.disabled
  }
  
  if (options.hidden !== undefined) {
    attributes['aria-hidden'] = options.hidden
  }
  
  if (options.required !== undefined) {
    attributes['aria-required'] = options.required
  }
  
  if (options.invalid !== undefined) {
    attributes['aria-invalid'] = options.invalid
  }
  
  if (options.live) {
    attributes['aria-live'] = options.live
  }
  
  if (options.atomic !== undefined) {
    attributes['aria-atomic'] = options.atomic
  }
  
  if (options.busy !== undefined) {
    attributes['aria-busy'] = options.busy
  }
  
  if (options.current) {
    attributes['aria-current'] = options.current
  }
  
  if (options.haspopup !== undefined) {
    attributes['aria-haspopup'] = options.haspopup
  }
  
  if (options.role) {
    attributes.role = options.role
  }
  
  return attributes
}

/**
 * Generate ARIA attributes for a form field
 * @param {Object} field - Form field properties
 * @returns {Object} - ARIA attributes
 */
export const formFieldAttributes = (field = {}) => {
  const attributes = {}
  
  if (field.id) {
    attributes.id = field.id
  }
  
  if (field.label && field.id) {
    attributes['aria-labelledby'] = `${field.id}-label`
  }
  
  if (field.description && field.id) {
    attributes['aria-describedby'] = `${field.id}-description`
  }
  
  if (field.error && field.id) {
    attributes['aria-describedby'] = field.description
      ? `${field.id}-description ${field.id}-error`
      : `${field.id}-error`
    attributes['aria-invalid'] = true
  }
  
  if (field.required) {
    attributes['aria-required'] = true
  }
  
  if (field.disabled) {
    attributes['aria-disabled'] = true
  }
  
  if (field.readonly) {
    attributes['aria-readonly'] = true
  }
  
  return attributes
}

/**
 * Generate ARIA attributes for a button
 * @param {Object} options - Button options
 * @returns {Object} - ARIA attributes
 */
export const buttonAttributes = (options = {}) => {
  const attributes = {
    role: 'button'
  }
  
  if (options.label) {
    attributes['aria-label'] = options.label
  }
  
  if (options.expanded !== undefined) {
    attributes['aria-expanded'] = options.expanded
  }
  
  if (options.controls) {
    attributes['aria-controls'] = options.controls
  }
  
  if (options.pressed !== undefined) {
    attributes['aria-pressed'] = options.pressed
  }
  
  if (options.disabled) {
    attributes['aria-disabled'] = true
    attributes.tabIndex = -1
  } else {
    attributes.tabIndex = 0
  }
  
  return attributes
}

/**
 * Generate ARIA attributes for a modal dialog
 * @param {Object} options - Modal options
 * @returns {Object} - ARIA attributes
 */
export const modalAttributes = (options = {}) => {
  return {
    role: 'dialog',
    'aria-modal': true,
    'aria-labelledby': options.titleId || 'modal-title',
    'aria-describedby': options.descriptionId || 'modal-description'
  }
}

/**
 * Generate ARIA attributes for a tab
 * @param {Object} options - Tab options
 * @returns {Object} - ARIA attributes
 */
export const tabAttributes = (options = {}) => {
  return {
    role: 'tab',
    'aria-selected': options.selected || false,
    'aria-controls': options.panelId,
    id: options.id,
    tabIndex: options.selected ? 0 : -1
  }
}

/**
 * Generate ARIA attributes for a tab panel
 * @param {Object} options - Tab panel options
 * @returns {Object} - ARIA attributes
 */
export const tabPanelAttributes = (options = {}) => {
  return {
    role: 'tabpanel',
    'aria-labelledby': options.tabId,
    id: options.id,
    tabIndex: 0
  }
}

/**
 * Generate ARIA attributes for a menu
 * @param {Object} options - Menu options
 * @returns {Object} - ARIA attributes
 */
export const menuAttributes = (options = {}) => {
  return {
    role: 'menu',
    'aria-labelledby': options.triggerId,
    id: options.id
  }
}

/**
 * Generate ARIA attributes for a menu item
 * @param {Object} options - Menu item options
 * @returns {Object} - ARIA attributes
 */
export const menuItemAttributes = (options = {}) => {
  return {
    role: 'menuitem',
    tabIndex: options.focused ? 0 : -1
  }
}

/**
 * Generate ARIA attributes for an alert
 * @param {Object} options - Alert options
 * @returns {Object} - ARIA attributes
 */
export const alertAttributes = (options = {}) => {
  return {
    role: 'alert',
    'aria-live': options.assertive ? 'assertive' : 'polite',
    'aria-atomic': true
  }
}

/**
 * Generate ARIA attributes for a tooltip
 * @param {Object} options - Tooltip options
 * @returns {Object} - ARIA attributes
 */
export const tooltipAttributes = (options = {}) => {
  return {
    role: 'tooltip',
    id: options.id
  }
}

/**
 * Generate ARIA attributes for an element that triggers a tooltip
 * @param {Object} options - Trigger options
 * @returns {Object} - ARIA attributes
 */
export const tooltipTriggerAttributes = (options = {}) => {
  return {
    'aria-describedby': options.tooltipId
  }
}

/**
 * Generate ARIA attributes for a progress indicator
 * @param {Object} options - Progress options
 * @returns {Object} - ARIA attributes
 */
export const progressAttributes = (options = {}) => {
  const attributes = {
    role: 'progressbar',
    'aria-valuemin': options.min || 0,
    'aria-valuemax': options.max || 100
  }
  
  if (options.value !== undefined) {
    attributes['aria-valuenow'] = options.value
  }
  
  if (options.label) {
    attributes['aria-label'] = options.label
  }
  
  if (options.labelledBy) {
    attributes['aria-labelledby'] = options.labelledBy
  }
  
  return attributes
}

/**
 * Generate ARIA attributes for a table
 * @param {Object} options - Table options
 * @returns {Object} - ARIA attributes
 */
export const tableAttributes = (options = {}) => {
  const attributes = {
    role: 'table'
  }
  
  if (options.caption) {
    attributes['aria-labelledby'] = options.captionId
  }
  
  if (options.description) {
    attributes['aria-describedby'] = options.descriptionId
  }
  
  return attributes
}

/**
 * Generate ARIA attributes for a table row
 * @param {Object} options - Row options
 * @returns {Object} - ARIA attributes
 */
export const tableRowAttributes = (options = {}) => {
  const attributes = {
    role: 'row'
  }
  
  if (options.selected) {
    attributes['aria-selected'] = true
  }
  
  return attributes
}

/**
 * Generate ARIA attributes for a table cell
 * @param {Object} options - Cell options
 * @returns {Object} - ARIA attributes
 */
export const tableCellAttributes = (options = {}) => {
  const attributes = {
    role: options.header ? 'columnheader' : 'cell'
  }
  
  if (options.colSpan) {
    attributes['aria-colspan'] = options.colSpan
  }
  
  if (options.rowSpan) {
    attributes['aria-rowspan'] = options.rowSpan
  }
  
  return attributes
}

/**
 * Generate ARIA attributes for a list
 * @param {Object} options - List options
 * @returns {Object} - ARIA attributes
 */
export const listAttributes = (options = {}) => {
  return {
    role: 'list'
  }
}

/**
 * Generate ARIA attributes for a list item
 * @param {Object} options - List item options
 * @returns {Object} - ARIA attributes
 */
export const listItemAttributes = (options = {}) => {
  return {
    role: 'listitem'
  }
}

/**
 * Generate ARIA attributes for a combobox
 * @param {Object} options - Combobox options
 * @returns {Object} - ARIA attributes
 */
export const comboboxAttributes = (options = {}) => {
  return {
    role: 'combobox',
    'aria-expanded': options.expanded || false,
    'aria-owns': options.listId,
    'aria-haspopup': 'listbox',
    'aria-controls': options.listId
  }
}

export default {
  ariaAttributes,
  formFieldAttributes,
  buttonAttributes,
  modalAttributes,
  tabAttributes,
  tabPanelAttributes,
  menuAttributes,
  menuItemAttributes,
  alertAttributes,
  tooltipAttributes,
  tooltipTriggerAttributes,
  progressAttributes,
  tableAttributes,
  tableRowAttributes,
  tableCellAttributes,
  listAttributes,
  listItemAttributes,
  comboboxAttributes
}