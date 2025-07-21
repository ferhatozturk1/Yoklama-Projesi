import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '../../../utils/__tests__/testUtils'
import { mockFile } from '../../../utils/__tests__/testUtils'
import FileUploadField from '../FileUploadField'

describe('FileUploadField Component', () => {
  it('should render correctly with label', () => {
    render(
      <FileUploadField
        label="Upload File"
        name="file"
        accept=".jpg,.png"
      />
    )
    
    expect(screen.getByText('Upload File')).toBeInTheDocument()
    expect(screen.getByLabelText(/Upload File/i)).toHaveAttribute('type', 'file')
    expect(screen.getByLabelText(/Upload File/i)).toHaveAttribute('accept', '.jpg,.png')
  })
  
  it('should show placeholder text', () => {
    render(
      <FileUploadField
        label="Upload File"
        name="file"
        placeholder="Choose a file to upload"
      />
    )
    
    expect(screen.getByText('Choose a file to upload')).toBeInTheDocument()
  })
  
  it('should handle file selection', () => {
    const handleChange = vi.fn()
    
    render(
      <FileUploadField
        label="Upload File"
        name="file"
        onChange={handleChange}
      />
    )
    
    const file = mockFile('test.jpg', 'image/jpeg')
    const input = screen.getByLabelText(/Upload File/i)
    
    Object.defineProperty(input, 'files', {
      value: [file]
    })
    
    fireEvent.change(input)
    
    expect(handleChange).toHaveBeenCalled()
  })
  
  it('should show error message when error is provided', () => {
    render(
      <FileUploadField
        label="Upload File"
        name="file"
        error="Invalid file type"
      />
    )
    
    expect(screen.getByText('Invalid file type')).toBeInTheDocument()
  })
  
  it('should show selected file name', () => {
    render(
      <FileUploadField
        label="Upload File"
        name="file"
        value={{ name: 'test.jpg' }}
      />
    )
    
    expect(screen.getByText('test.jpg')).toBeInTheDocument()
  })
  
  it('should be disabled when disabled prop is true', () => {
    render(
      <FileUploadField
        label="Upload File"
        name="file"
        disabled
      />
    )
    
    expect(screen.getByLabelText(/Upload File/i)).toBeDisabled()
  })
  
  it('should show required indicator when required prop is true', () => {
    render(
      <FileUploadField
        label="Upload File"
        name="file"
        required
      />
    )
    
    expect(screen.getByText('*')).toBeInTheDocument()
  })
  
  it('should show help text when provided', () => {
    render(
      <FileUploadField
        label="Upload File"
        name="file"
        helpText="Maximum file size: 2MB"
      />
    )
    
    expect(screen.getByText('Maximum file size: 2MB')).toBeInTheDocument()
  })
  
  it('should allow multiple file selection when multiple prop is true', () => {
    render(
      <FileUploadField
        label="Upload Files"
        name="files"
        multiple
      />
    )
    
    expect(screen.getByLabelText(/Upload Files/i)).toHaveAttribute('multiple')
  })
  
  it('should show drag and drop area when dragDrop prop is true', () => {
    render(
      <FileUploadField
        label="Upload File"
        name="file"
        dragDrop
      />
    )
    
    expect(screen.getByText(/Drag and drop/i)).toBeInTheDocument()
  })
  
  it('should handle drag and drop events', () => {
    const handleChange = vi.fn()
    
    render(
      <FileUploadField
        label="Upload File"
        name="file"
        dragDrop
        onChange={handleChange}
      />
    )
    
    const dropzone = screen.getByTestId('dropzone')
    
    // Mock drag events
    fireEvent.dragEnter(dropzone)
    expect(dropzone).toHaveClass('dragover')
    
    fireEvent.dragLeave(dropzone)
    expect(dropzone).not.toHaveClass('dragover')
  })
})