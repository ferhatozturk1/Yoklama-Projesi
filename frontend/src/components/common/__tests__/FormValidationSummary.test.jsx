import { describe, it, expect } from 'vitest'
import { render, screen } from '../../../utils/__tests__/testUtils'
import FormValidationSummary from '../FormValidationSummary'

describe('FormValidationSummary Component', () => {
  it('should not render when there are no errors', () => {
    const { container } = render(
      <FormValidationSummary errors={{}} />
    )
    
    expect(container.firstChild).toBeNull()
  })
  
  it('should render with single error message', () => {
    render(
      <FormValidationSummary 
        errors={{ 
          name: 'Name is required' 
        }} 
      />
    )
    
    expect(screen.getByText('Please correct the following errors:')).toBeInTheDocument()
    expect(screen.getByText('Name is required')).toBeInTheDocument()
  })
  
  it('should render with multiple error messages', () => {
    render(
      <FormValidationSummary 
        errors={{ 
          name: 'Name is required',
          email: 'Email is invalid' 
        }} 
      />
    )
    
    expect(screen.getByText('Please correct the following errors:')).toBeInTheDocument()
    expect(screen.getByText('Name is required')).toBeInTheDocument()
    expect(screen.getByText('Email is invalid')).toBeInTheDocument()
  })
  
  it('should render with array of error messages', () => {
    render(
      <FormValidationSummary 
        errors={{ 
          name: ['Name is required', 'Name is too short'],
          email: ['Email is invalid'] 
        }} 
      />
    )
    
    expect(screen.getByText('Please correct the following errors:')).toBeInTheDocument()
    expect(screen.getByText('Name is required')).toBeInTheDocument()
    expect(screen.getByText('Name is too short')).toBeInTheDocument()
    expect(screen.getByText('Email is invalid')).toBeInTheDocument()
  })
  
  it('should render with custom title', () => {
    render(
      <FormValidationSummary 
        errors={{ name: 'Name is required' }}
        title="Form has errors:"
      />
    )
    
    expect(screen.getByText('Form has errors:')).toBeInTheDocument()
  })
  
  it('should apply custom className', () => {
    render(
      <FormValidationSummary 
        errors={{ name: 'Name is required' }}
        className="custom-error-summary"
      />
    )
    
    const summary = screen.getByRole('alert')
    expect(summary).toHaveClass('custom-error-summary')
  })
  
  it('should handle empty error values', () => {
    render(
      <FormValidationSummary 
        errors={{ 
          name: '',
          email: null,
          phone: undefined 
        }} 
      />
    )
    
    // Should not render any error messages
    const summary = screen.queryByRole('alert')
    expect(summary).toBeNull()
  })
  
  it('should handle non-object errors prop', () => {
    render(
      <FormValidationSummary 
        errors="Something went wrong"
      />
    )
    
    expect(screen.getByText('Please correct the following errors:')).toBeInTheDocument()
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
  })
})