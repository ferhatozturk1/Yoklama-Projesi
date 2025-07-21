import React, { useRef, useState, useEffect } from 'react'
import { useBreakpoint } from '../../utils/responsiveUtils'

/**
 * Horizontal scrolling table component optimized for mobile
 * 
 * @param {Object} props - Component props
 * @param {Array} props.columns - Table column definitions
 * @param {Array} props.data - Table data
 * @param {boolean} props.showScrollIndicators - Whether to show scroll indicators
 * @param {boolean} props.fixedFirstColumn - Whether to fix the first column
 * @param {boolean} props.striped - Whether to use striped rows
 * @param {boolean} props.bordered - Whether to add borders
 * @param {boolean} props.hover - Whether to add hover effect
 * @param {string} props.className - Additional CSS classes
 */
const HorizontalScrollTable = ({
  columns = [],
  data = [],
  showScrollIndicators = true,
  fixedFirstColumn = false,
  striped = false,
  bordered = false,
  hover = true,
  className = '',
  ...props
}) => {
  const { isMobile } = useBreakpoint()
  const scrollRef = useRef(null)
  const [showLeftIndicator, setShowLeftIndicator] = useState(false)
  const [showRightIndicator, setShowRightIndicator] = useState(false)
  
  // Update scroll indicators
  const updateScrollIndicators = () => {
    if (!scrollRef.current || !showScrollIndicators) return
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
    
    setShowLeftIndicator(scrollLeft > 0)
    setShowRightIndicator(scrollLeft < scrollWidth - clientWidth - 1) // -1 for rounding errors
  }
  
  // Initialize and update scroll indicators
  useEffect(() => {
    updateScrollIndicators()
    
    const handleScroll = () => {
      updateScrollIndicators()
    }
    
    const scrollElement = scrollRef.current
    if (scrollElement) {
      scrollElement.addEventListener('scroll', handleScroll)
    }
    
    return () => {
      if (scrollElement) {
        scrollElement.removeEventListener('scroll', handleScroll)
      }
    }
  }, [showScrollIndicators, data, columns])
  
  // Generate CSS classes
  const tableClasses = [
    'min-w-full',
    striped ? 'table-striped' : '',
    bordered ? 'table-bordered' : '',
    hover ? 'table-hover' : '',
    className
  ].filter(Boolean).join(' ')
  
  // Determine container classes
  const containerClasses = [
    fixedFirstColumn ? 'table-fixed-column' : 'table-scroll',
    'relative'
  ].join(' ')
  
  return (
    <div className={containerClasses}>
      {/* Scroll indicators */}
      {showScrollIndicators && isMobile && (
        <>
          {showLeftIndicator && (
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          )}
          {showRightIndicator && (
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
          )}
        </>
      )}
      
      {/* Scrollable table */}
      <div 
        ref={scrollRef}
        className="overflow-x-auto -webkit-overflow-scrolling-touch"
      >
        <table className={tableClasses} {...props}>
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th 
                  key={index}
                  className={`${fixedFirstColumn && index === 0 ? 'sticky left-0 bg-white z-10' : ''}`}
                  style={column.width ? { width: column.width } : {}}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className={striped && rowIndex % 2 === 1 ? 'bg-gray-50' : ''}>
                {columns.map((column, colIndex) => (
                  <td 
                    key={colIndex}
                    className={`${fixedFirstColumn && colIndex === 0 ? 'sticky left-0 bg-white z-10' : ''} ${
                      striped && rowIndex % 2 === 1 && fixedFirstColumn && colIndex === 0 ? 'bg-gray-50' : ''
                    }`}
                  >
                    {column.render ? column.render(row[column.accessor], row) : row[column.accessor]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Mobile scroll hint */}
      {isMobile && showRightIndicator && (
        <div className="text-xs text-center text-gray-500 mt-2">
          Daha fazla görmek için sağa kaydırın
        </div>
      )}
    </div>
  )
}

/**
 * Card-based table alternative for mobile
 */
export const CardTable = ({
  columns = [],
  data = [],
  keyField = 'id',
  onRowClick,
  className = '',
  ...props
}) => {
  return (
    <div className={`card-table ${className}`} {...props}>
      {data.map((row, rowIndex) => (
        <div 
          key={row[keyField] || rowIndex}
          className={`bg-white rounded-lg shadow mb-4 overflow-hidden ${onRowClick ? 'cursor-pointer' : ''}`}
          onClick={() => onRowClick && onRowClick(row)}
        >
          {columns.map((column, colIndex) => (
            <div 
              key={colIndex}
              className="flex items-center p-3 border-b last:border-b-0"
            >
              <div className="font-medium text-gray-500 w-1/3">
                {column.header}
              </div>
              <div className="flex-1">
                {column.render ? column.render(row[column.accessor], row) : row[column.accessor]}
              </div>
            </div>
          ))}
        </div>
      ))}
      
      {data.length === 0 && (
        <div className="text-center py-8 bg-white rounded-lg shadow">
          <p className="text-gray-500">Veri bulunamadı</p>
        </div>
      )}
    </div>
  )
}

export default HorizontalScrollTable