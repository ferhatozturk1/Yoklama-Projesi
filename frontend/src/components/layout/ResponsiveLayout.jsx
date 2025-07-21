import React from 'react'
import { useBreakpoint } from '../../utils/responsiveUtils'

/**
 * Responsive layout component that renders different content based on screen size
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Default content
 * @param {React.ReactNode} props.mobile - Content for mobile screens
 * @param {React.ReactNode} props.tablet - Content for tablet screens
 * @param {React.ReactNode} props.desktop - Content for desktop screens
 * @param {boolean} props.mobileOnly - Only render on mobile screens
 * @param {boolean} props.tabletOnly - Only render on tablet screens
 * @param {boolean} props.desktopOnly - Only render on desktop screens
 * @param {boolean} props.tabletUp - Render on tablet and larger screens
 * @param {boolean} props.desktopUp - Render on desktop and larger screens
 */
const ResponsiveLayout = ({
  children,
  mobile,
  tablet,
  desktop,
  mobileOnly,
  tabletOnly,
  desktopOnly,
  tabletUp,
  desktopUp
}) => {
  const { isMobile, isTablet, isDesktop } = useBreakpoint()
  
  // Handle exclusive rendering
  if (mobileOnly && !isMobile) return null
  if (tabletOnly && !isTablet) return null
  if (desktopOnly && !isDesktop) return null
  
  // Handle inclusive rendering
  if (tabletUp && isMobile) return null
  if (desktopUp && (isMobile || isTablet)) return null
  
  // Render appropriate content based on screen size
  if (isMobile && mobile) return mobile
  if (isTablet && tablet) return tablet
  if (isDesktop && desktop) return desktop
  
  // Default content
  return children
}

/**
 * Component that only renders on mobile screens
 */
export const Mobile = ({ children }) => {
  const { isMobile } = useBreakpoint()
  return isMobile ? children : null
}

/**
 * Component that only renders on tablet screens
 */
export const Tablet = ({ children }) => {
  const { isTablet } = useBreakpoint()
  return isTablet ? children : null
}

/**
 * Component that only renders on desktop screens
 */
export const Desktop = ({ children }) => {
  const { isDesktop } = useBreakpoint()
  return isDesktop ? children : null
}

/**
 * Component that renders on tablet and larger screens
 */
export const TabletUp = ({ children }) => {
  const { isMobile } = useBreakpoint()
  return !isMobile ? children : null
}

/**
 * Component that renders on desktop and larger screens
 */
export const DesktopUp = ({ children }) => {
  const { isMobile, isTablet } = useBreakpoint()
  return !isMobile && !isTablet ? children : null
}

/**
 * Component that renders on mobile and tablet screens
 */
export const MobileAndTablet = ({ children }) => {
  const { isDesktop } = useBreakpoint()
  return !isDesktop ? children : null
}

/**
 * Responsive grid component
 */
export const ResponsiveGrid = ({
  children,
  columns = { sm: 1, md: 2, lg: 3, xl: 4 },
  gap = { sm: '1rem', md: '1.5rem', lg: '2rem' },
  className = '',
  ...props
}) => {
  const { isMobile, isTablet, isDesktop } = useBreakpoint()
  
  let cols
  let gapSize
  
  if (isMobile) {
    cols = columns.sm || 1
    gapSize = gap.sm || '1rem'
  } else if (isTablet) {
    cols = columns.md || 2
    gapSize = gap.md || '1.5rem'
  } else {
    cols = isDesktop ? (columns.lg || 3) : (columns.xl || 4)
    gapSize = isDesktop ? (gap.lg || '2rem') : (gap.xl || '2rem')
  }
  
  return (
    <div
      className={`responsive-grid ${className}`}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gap: gapSize
      }}
      {...props}
    >
      {children}
    </div>
  )
}

export default ResponsiveLayout