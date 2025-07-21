import React from 'react'
import { useBreakpoint } from '../../utils/responsiveUtils'

/**
 * Responsive table component that adapts to different screen sizes
 * 
 * @param {Object} props - Component props
 * @param {Array} props.columns - Table column definitions
 * @param {Array} props.data - Table data
 * @param {string} props.variant - Table variant (responsive, stack, cards)
 * @param {boolean} props.striped - Whether to use striped rows
 * @param {boolean} props.bordered - Whether to add borders
 * @param {boolean} props.hover - Whether to add hover effect
 * @param {boolean} props.compact - Whether to use compact spacing
 * @param {string} props.className - Additional CSS classes
 */
const ResponsiveTable = ({
  columns = [],
  data = [],
  variant = 'responsive',
  striped = false,
  bordered = false,
  hover = true,
  compact = false,
  className = '',
  ...props
}) => {
  const { isMobile } = useBreakpoint()
  
  // Default to stack variant on mobile unless explicitly set
  const tableVariant = isMobile && variant === 'responsive' ? 'stack' : variant
  
  // Generate CSS classes
  const tableClasses = [
    'table',
    `table-${tableVariant}`,
    striped ? 'table-striped' : '',
    bordered ? 'table-bordered' : '',
    hover ? 'table-hover' : '',
    compact ? 'table-compact' : '',
    className
  ].filter(Boolean).join(' ')
  
  // Render card-based layout for mobile
  if (tableVariant === 'cards') {
    return (
      <div className={`${tableClasses}`} {...props}>
        {data.map((row, rowIndex) => (
          <div key={rowIndex} className="table-card">
            {columns.map((column, colIndex) => (
              <div key={colIndex} className="table-card-item">
                <div className="table-card-label">{column.header}</div>
                <div className="table-card-value">
                  {column.render ? column.render(row[column.accessor], row) : row[column.accessor]}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    )
  }
  
  // Render standard table with responsive features
  return (
    <div className={tableVariant === 'responsive' ? 'table-responsive' : ''}>
      <table className={tableClasses} {...props}>
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index} style={column.width ? { width: column.width } : {}}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((column, colIndex) => (
                <td 
                  key={colIndex} 
                  data-label={tableVariant === 'stack' ? column.header : undefined}
                >
                  {column.render ? column.render(row[column.accessor], row) : row[column.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/**
 * Responsive table with horizontal scrolling
 */
export const ScrollableTable = ({ children, className = '', ...props }) => {
  return (
    <div className={`table-scroll ${className}`} {...props}>
      {children}
    </div>
  )
}

/**
 * Responsive table with fixed first column
 */
export const FixedColumnTable = ({ children, className = '', ...props }) => {
  return (
    <div className={`table-fixed-column ${className}`} {...props}>
      {children}
    </div>
  )
}

export default ResponsiveTable