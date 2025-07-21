import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useBreakpoint } from '../../utils/responsiveUtils'

/**
 * Mobile-optimized layout component
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Page content
 * @param {React.ReactNode} props.header - Header content
 * @param {React.ReactNode} props.footer - Footer content
 * @param {Array} props.navItems - Navigation items for bottom navigation
 * @param {boolean} props.hideNavOnScroll - Whether to hide navigation on scroll
 * @param {boolean} props.fullHeight - Whether to make the layout full height
 * @param {string} props.className - Additional CSS classes
 */
const MobileLayout = ({
  children,
  header,
  footer,
  navItems = [],
  hideNavOnScroll = true,
  fullHeight = false,
  className = '',
  ...props
}) => {
  const [isNavVisible, setIsNavVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const { isMobile } = useBreakpoint()
  const location = useLocation()
  
  // Handle scroll to hide/show navigation
  useEffect(() => {
    if (!isMobile || !hideNavOnScroll) return
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down
        setIsNavVisible(false)
      } else {
        // Scrolling up
        setIsNavVisible(true)
      }
      
      setLastScrollY(currentScrollY)
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isMobile, hideNavOnScroll, lastScrollY])
  
  // Reset scroll position on route change
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])
  
  // Don't apply mobile optimizations on non-mobile devices
  if (!isMobile) {
    return <div className={className}>{children}</div>
  }
  
  return (
    <div 
      className={`mobile-layout ${fullHeight ? 'h-full' : ''} ${className}`}
      {...props}
    >
      {/* Fixed Header */}
      {header && (
        <header className="fixed top-0 left-0 right-0 z-10 bg-white shadow">
          {header}
        </header>
      )}
      
      {/* Main Content */}
      <main className={`${header ? 'pt-16' : ''} ${footer || navItems.length > 0 ? 'pb-16' : ''}`}>
        {children}
      </main>
      
      {/* Bottom Navigation */}
      {navItems.length > 0 && (
        <nav 
          className={`fixed bottom-0 left-0 right-0 z-10 bg-white border-t border-gray-200 transition-transform duration-300 ${
            isNavVisible ? 'translate-y-0' : 'translate-y-full'
          }`}
        >
          <div className="flex justify-around">
            {navItems.map((item, index) => (
              <a
                key={index}
                href={item.path}
                className={`flex flex-col items-center py-2 px-4 ${
                  location.pathname === item.path ? 'text-blue-600' : 'text-gray-600'
                }`}
                onClick={(e) => {
                  if (item.onClick) {
                    e.preventDefault()
                    item.onClick()
                  }
                }}
              >
                {item.icon}
                <span className="text-xs mt-1">{item.label}</span>
              </a>
            ))}
          </div>
        </nav>
      )}
      
      {/* Fixed Footer */}
      {footer && !navItems.length && (
        <footer 
          className={`fixed bottom-0 left-0 right-0 z-10 bg-white border-t border-gray-200 transition-transform duration-300 ${
            isNavVisible ? 'translate-y-0' : 'translate-y-full'
          }`}
        >
          {footer}
        </footer>
      )}
    </div>
  )
}

/**
 * Mobile page component with proper spacing and scroll behavior
 */
export const MobilePage = ({
  children,
  title,
  backButton,
  actions,
  padding = true,
  className = '',
  ...props
}) => {
  return (
    <div 
      className={`mobile-page ${padding ? 'p-4' : ''} ${className}`}
      {...props}
    >
      {(title || backButton || actions) && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            {backButton}
            {title && (
              <h1 className="text-xl font-semibold">{title}</h1>
            )}
          </div>
          {actions && (
            <div className="flex items-center space-x-2">
              {actions}
            </div>
          )}
        </div>
      )}
      {children}
    </div>
  )
}

/**
 * Mobile section component for grouping content
 */
export const MobileSection = ({
  children,
  title,
  subtitle,
  actions,
  className = '',
  ...props
}) => {
  return (
    <section 
      className={`mobile-section mb-6 ${className}`}
      {...props}
    >
      {(title || actions) && (
        <div className="flex items-center justify-between mb-2">
          <div>
            {title && (
              <h2 className="text-lg font-medium">{title}</h2>
            )}
            {subtitle && (
              <p className="text-sm text-gray-500">{subtitle}</p>
            )}
          </div>
          {actions && (
            <div className="flex items-center space-x-2">
              {actions}
            </div>
          )}
        </div>
      )}
      {children}
    </section>
  )
}

/**
 * Mobile card component optimized for touch
 */
export const MobileCard = ({
  children,
  title,
  subtitle,
  icon,
  onClick,
  className = '',
  ...props
}) => {
  return (
    <div 
      className={`mobile-card bg-white rounded-lg shadow p-4 ${onClick ? 'active:bg-gray-50 cursor-pointer' : ''} ${className}`}
      onClick={onClick}
      {...props}
    >
      {(title || subtitle || icon) && (
        <div className="flex items-center mb-2">
          {icon && (
            <div className="mr-3 text-gray-500">
              {icon}
            </div>
          )}
          <div>
            {title && (
              <h3 className="font-medium">{title}</h3>
            )}
            {subtitle && (
              <p className="text-sm text-gray-500">{subtitle}</p>
            )}
          </div>
        </div>
      )}
      {children}
    </div>
  )
}

export default MobileLayout