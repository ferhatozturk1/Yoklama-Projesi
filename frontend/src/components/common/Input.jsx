import React, { useState, forwardRef } from 'react';
import './Input.css';

const Input = forwardRef(({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  onFocus,
  error,
  helperText,
  required = false,
  disabled = false,
  readOnly = false,
  size = 'md',
  variant = 'default',
  icon,
  iconPosition = 'left',
  clearable = false,
  maxLength,
  className = '',
  id,
  name,
  autoComplete,
  autoFocus = false,
  ...props
}, ref) => {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  const containerClasses = [
    'input-container',
    `input-container--${size}`,
    `input-container--${variant}`,
    focused && 'input-container--focused',
    error && 'input-container--error',
    disabled && 'input-container--disabled',
    readOnly && 'input-container--readonly',
    className
  ].filter(Boolean).join(' ');

  const handleFocus = (e) => {
    setFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e) => {
    setFocused(false);
    onBlur?.(e);
  };

  const handleClear = () => {
    onChange?.({ target: { value: '', name } });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const inputType = type === 'password' && showPassword ? 'text' : type;

  return (
    <div className={containerClasses}>
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
          {required && <span className="input-label__required">*</span>}
        </label>
      )}
      
      <div className="input-wrapper">
        {icon && iconPosition === 'left' && (
          <span className="input-icon input-icon--left">
            {icon}
          </span>
        )}
        
        <input
          ref={ref}
          id={inputId}
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          maxLength={maxLength}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          className="input-field"
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          {...props}
        />
        
        {type === 'password' && (
          <button
            type="button"
            className="input-icon input-icon--right input-icon--clickable"
            onClick={togglePasswordVisibility}
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            )}
          </button>
        )}
        
        {clearable && value && !disabled && !readOnly && (
          <button
            type="button"
            className="input-icon input-icon--right input-icon--clickable"
            onClick={handleClear}
            tabIndex={-1}
            aria-label="Clear input"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        )}
        
        {icon && iconPosition === 'right' && type !== 'password' && !clearable && (
          <span className="input-icon input-icon--right">
            {icon}
          </span>
        )}
      </div>
      
      {error && (
        <div id={`${inputId}-error`} className="input-error" role="alert">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {error}
        </div>
      )}
      
      {helperText && !error && (
        <div id={`${inputId}-helper`} className="input-helper">
          {helperText}
        </div>
      )}
      
      {maxLength && (
        <div className="input-counter">
          {value?.length || 0}/{maxLength}
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;