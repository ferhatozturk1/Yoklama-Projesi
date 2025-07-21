import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '../../../utils/__tests__/testUtils'
import FormField from '../FormField'

describe('FormField Component', () => {
  it('should render correctly with label', () => {
    render(
      <FormField
        label="Test Label"
        name="test"
        type="text"
      />
    )
    
    expect(screen.getByLabelText('Test Label')).toBeInTheDocument()
    expect(screen.getByRole('textbox')).toHaveAttribute('name', 'test')
  })
  
  it('should render with placeholder', () => {
    render(
      <FormField
        label="Test Label"
        name="test"
        type="text"
        placeholder="Enter test value"
      />
    )
    
    expect(screen.getByPlaceholderText('Enter test value')).toBeInTheDocument()
  })
  
  it('should handle value changes', () => {
    const handleChange = vi.fn()
    
    render(
      <FormField
        label="Test Label"
        name="test"
        type="text"
        value=""
        onChange={handleChange}
      />
    )
    
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'new value' } })
    
    expect(handleChange).toHaveBeenCalled()
  })
  
  it('should show error message when error is provided', () => {
    render(
      <FormField
        label="Test Label"
        name="test"
        type="text"
        error="This field is required"
      />
    )
    
    expect(screen.getByText('This field is required')).toBeInTheDocument()
    expect(screen.getByRole('textbox')).toHaveClass('error')
  })
  
  it('should render as disabled when disabled prop is true', () => {
    render(
      <FormField
        label="Test Label"
        name="test"
        type="text"
        disabled
      />
    )
    
    expect(screen.getByRole('textbox')).toBeDisabled()
  })
  
  it('should render as required when required prop is true', () => {
    render(
      <FormField
        label="Test Label"
        name="test"
        type="text"
        required
      />
    )
    
    expect(screen.getByRole('textbox')).toHaveAttribute('required')
    expect(screen.getByText('*')).toBeInTheDocument()
  })
  
  it('should render different input types', () => {
    const { rerender } = render(
      <FormField
        label="Email"
        name="email"
        type="email"
      />
    )
    
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email')
    
    rerender(
      <FormField
        label="Password"
        name="password"
        type="password"
      />
    )
    
    expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'password')
  })
  
  it('should apply custom className', () => {
    render(
      <FormField
        label="Test Label"
        name="test"
        type="text"
        className="custom-class"
      />
    )
    
    const fieldContainer = screen.getByTestId('form-field-container')
    expect(fieldContainer).toHaveClass('custom-class')
  })
  
  it('should render help text when provided', () => {
    render(
      <FormField
        label="Test Label"
        name="test"
        type="text"
        helpText="This is a help text"
      />
    )
    
    expect(screen.getByText('This is a help text')).toBeInTheDocument()
  })
})