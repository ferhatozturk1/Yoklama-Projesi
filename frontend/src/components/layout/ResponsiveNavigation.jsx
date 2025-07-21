import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useBreakpoint } from '../../utils/responsiveUtils'

/**
 * Responsive navigation component that adapts to different screen sizes
 * 
 * @param {Object} props - Component props
 * @param {string} props.logo - Logo URL or component
 * @param {string} props.title - App title
 * @param {Array} props.items - Navigation items
 * @param {Object} props.user - User object
 * @param {Function} props.onLogout - Logout callback
 * @param {string} props.className - Additional CSS classes
 */
const ResponsiveNavigation = ({
  logo,
  title,
  items = [],
  user,
  onLogout,
  className = '',
  ...props
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const { isMobile, isTablet } = useBreakpoint()
  
  // Close drawer when screen size changes
  useEffect(() => {
    setIsDrawerOpen(false)
  }, [isMobile, isTablet])
  
  // Close dropdown when clicking outside
  useEffect(() => {
    if (!isDropdownOpen) return
    
    const handleClickOutside = (e) => {
      if (!e.target.closest('.profile-dropdown')) {
        setIsDropdownOpen(false)
      }
    }
    
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [isDropdownOpen])
  
  // Toggle drawer
  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen)
  }
  
  // Toggle dropdown
  const toggleDropdown = (e) => {
    e.stopPropagation()
    setIsDropdownOpen(!isDropdownOpen)
  }
  
  return (
    <>
      {/* Main Navigation Bar */}
      <nav className={`bg-white shadow ${className}`} {...props}>
        <div className="container-responsive mx-auto px-4">
          <div className="flex justify-between h-16">
            {/* Logo and Title */}
            <div className="flex items-center">
              {isMobile && (
                <button
                  className="mr-2 hamburger-btn"
                  onClick={toggleDrawer}
                  aria-label="Menu"
                >
                  <span className={isDrawerOpen ? 'open' : ''}></span>
                  <span className={isDrawerOpen ? 'open' : ''}></span>
                  <span className={isDrawerOpen ? 'open' : ''}></span>
                </button>
              )}
              
              <Link to="/" className="flex items-center">
                {logo && (
                  <img
                    src={logo}
                    alt={title || 'Logo'}
                    className="h-8 w-auto mr-2"
                  />
                )}
                {title && (
                  <span className="text-lg font-semibold text-gray-900">
                    {title}
                  </span>
                )}
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            {!isMobile && (
              <div className="hidden md:flex items-center space-x-4">
                {items.map((item, index) => (
                  <Link
                    key={index}
                    to={item.path}
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                  >
                    {item.icon && (
                      <span className="mr-1">{item.icon}</span>
                    )}
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
            
            {/* User Profile */}
            <div className="flex items-center">
              {user && (
                <div className="relative profile-dropdown">
                  <button
                    className="flex items-center space-x-2 focus:outline-none"
                    onClick={toggleDropdown}
                  >
                    {user.profilePhoto ? (
                      <img
                        src={user.profilePhoto}
                        alt={user.name}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                        {user.name?.charAt(0) || 'U'}
                      </div>
                    )}
                    {!isMobile && (
                      <>
                        <span className="text-sm font-medium text-gray-700">
                          {user.name}
                        </span>
                        <svg
                          className="h-4 w-4 text-gray-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </>
                    )}
                  </button>
                  
                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Profil
                      </Link>
                      <button
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          setIsDropdownOpen(false)
                          onLogout?.()
                        }}
                      >
                        Çıkış Yap
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      
      {/* Mobile Drawer Navigation */}
      {isMobile && (
        <>
          <div
            className={`drawer-nav-overlay ${isDrawerOpen ? 'open' : ''}`}
            onClick={() => setIsDrawerOpen(false)}
          ></div>
          
          <div className={`drawer-nav ${isDrawerOpen ? 'open' : ''}`}>
            <div className="drawer-nav-header">
              <div className="flex items-center">
                {logo && (
                  <img
                    src={logo}
                    alt={title || 'Logo'}
                    className="h-8 w-auto mr-2"
                  />
                )}
                <span className="text-lg font-semibold text-gray-900">
                  {title}
                </span>
              </div>
              <button
                className="drawer-nav-close"
                onClick={() => setIsDrawerOpen(false)}
                aria-label="Close menu"
              >
                &times;
              </button>
            </div>
            
            <div className="drawer-nav-content">
              {user && (
                <div className="px-4 py-3 border-b border-gray-200">
                  <div className="flex items-center">
                    {user.profilePhoto ? (
                      <img
                        src={user.profilePhoto}
                        alt={user.name}
                        className="h-10 w-10 rounded-full object-cover mr-3"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white mr-3">
                        {user.name?.charAt(0) || 'U'}
                      </div>
                    )}
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {user.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {user.email}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {items.map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  className="drawer-nav-item"
                  onClick={() => setIsDrawerOpen(false)}
                >
                  {item.icon && (
                    <span className="drawer-nav-item-icon">{item.icon}</span>
                  )}
                  {item.label}
                </Link>
              ))}
              
              <div className="border-t border-gray-200 mt-2 pt-2">
                <Link
                  to="/profile"
                  className="drawer-nav-item"
                  onClick={() => setIsDrawerOpen(false)}
                >
                  <span className="drawer-nav-item-icon">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </span>
                  Profil
                </Link>
                
                <button
                  className="drawer-nav-item w-full text-left"
                  onClick={() => {
                    setIsDrawerOpen(false)
                    onLogout?.()
                  }}
                >
                  <span className="drawer-nav-item-icon">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </span>
                  Çıkış Yap
                </button>
              </div>
            </div>
          </div>
        </>
      )}
      
      {/* Bottom Navigation for Mobile */}
      {isMobile && items.length > 0 && (
        <div className="bottom-nav">
          {items.slice(0, 5).map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className="bottom-nav-item"
            >
              <span className="bottom-nav-item-icon">
                {item.icon || (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </span>
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      )}
    </>
  )
}

export default ResponsiveNavigation