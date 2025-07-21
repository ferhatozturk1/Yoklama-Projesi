import React from 'react'
import { useField } from 'formik'
import { hasFieldError, getFieldError } from '../../utils/validationUtils'

/**
 * Reusable form field component with built-in validation
 * 
 * @param {Object} props - Component props
 * @param {string} props.label - Field label
 * @param {string} props.type - Input type
 * @param {string} props.placeholder - Input placeholder
 * @param {string} props.helpText - Help text
 * @param {boolean} props.required - Whether field is required
 * @param {boolean} props.disabled - Whether field is disabled
 * @param {string} props.className - Additional CSS classes
 * @param {React.ReactNode} props.children - Custom input element
 */
const FormField = ({
  label,
  type = 'text',
  placeholder,
  helpText,
  required = false,
  disabled = false,
  className = '',
  children,
  ...props
}) => {
  const [field, meta] = useField(props)
  const hasError = meta.touched && meta.error
  const fieldId = `field-${props.name}`

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label 
          htmlFor={fieldId} 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {children ? (
          React.cloneElement(children, {
            id: fieldId,
            ...field,
            ...props,
            disabled,
            className: `block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
              hasError ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500' : ''
            } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`
          })
        ) : (
          <input
            id={fieldId}
            type={type}
            placeholder={placeholder}
            disabled={disabled}
            className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
              hasError ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500' : ''
            } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            {...field}
            {...props}
          />
        )}
        
        {hasError && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-red-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
      </div>
      
      {hasError ? (
        <p className="mt-2 text-sm text-red-600" id={`${fieldId}-error`}>
          {meta.error}
        </p>
      ) : helpText ? (
        <p className="mt-2 text-sm text-gray-500" id={`${fieldId}-description`}>
          {helpText}
        </p>
      ) : null}
    </div>
  )
}

/**
 * Text area form field
 */
export const TextAreaField = (props) => (
  <FormField {...props}>
    <textarea rows={props.rows || 3} />
  </FormField>
)

/**
 * Select form field
 */
export const SelectField = ({ options = [], ...props }) => (
  <FormField {...props}>
    <select>
      {props.placeholder && (
        <option value="" disabled>
          {props.placeholder}
        </option>
      )}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </FormField>
)

/**
 * Checkbox form field
 */
export const CheckboxField = ({ label, ...props }) => {
  const [field, meta] = useField({ ...props, type: 'checkbox' })
  const hasError = meta.touched && meta.error
  const fieldId = `field-${props.name}`

  return (
    <div className="relative flex items-start mb-4">
      <div className="flex items-center h-5">
        <input
          id={fieldId}
          type="checkbox"
          className={`h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 ${
            hasError ? 'border-red-300' : ''
          }`}
          {...field}
          {...props}
        />
      </div>
      <div className="ml-3 text-sm">
        <label htmlFor={fieldId} className="font-medium text-gray-700">
          {label}
        </label>
        {hasError && (
          <p className="text-red-600">{meta.error}</p>
        )}
      </div>
    </div>
  )
}

/**
 * Radio group form field
 */
export const RadioGroupField = ({ label, options = [], ...props }) => {
  const [field, meta] = useField(props)
  const hasError = meta.touched && meta.error
  const fieldId = `field-${props.name}`

  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="space-y-2">
        {options.map((option) => (
          <div key={option.value} className="flex items-center">
            <input
              id={`${fieldId}-${option.value}`}
              type="radio"
              name={field.name}
              value={option.value}
              checked={field.value === option.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              className={`h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500 ${
                hasError ? 'border-red-300' : ''
              }`}
            />
            <label
              htmlFor={`${fieldId}-${option.value}`}
              className="ml-3 block text-sm font-medium text-gray-700"
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>
      
      {hasError && (
        <p className="mt-2 text-sm text-red-600">{meta.error}</p>
      )}
    </div>
  )
}

/**
 * Date picker form field
 */
export const DatePickerField = (props) => (
  <FormField type="date" {...props} />
)

/**
 * Time picker form field
 */
export const TimePickerField = (props) => (
  <FormField type="time" {...props} />
)

export default FormField