import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { showSuccess } from '../common/ToastNotification';
import logo from '../../assets/logo.svg';
import './Navbar.css';

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    showSuccess('Başarıyla çıkış yaptınız');
    navigate('/login');
    setIsProfileOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const isActiveLink = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { 
      path: '/dashboard', 
      label: 'Ana Sayfa', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9,22 9,12 15,12 15,22"/>
        </svg>
      )
    },
    { 
      path: '/courses', 
      label: 'Derslerim', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
        </svg>
      )
    },
    { 
      path: '/schedule', 
      label: 'Program', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      )
    },
    { 
      path: '/reports', 
      label: 'Raporlar', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="20" x2="18" y2="10"/>
          <line x1="12" y1="20" x2="12" y2="4"/>
          <line x1="6" y1="20" x2="6" y2="14"/>
        </svg>
      )
    },
    { 
      path: '/calendar-settings', 
      label: 'Ayarlar', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3"/>
          <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1"/>
        </svg>
      )
    }
  ];

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar-container">
        {/* Logo and Brand */}
        <div className="navbar-brand-section">
          {/* Mobile menu button */}
          {onMenuClick && (
            <button
              onClick={onMenuClick}
              className="mobile-sidebar-toggle"
              aria-label="Toggle sidebar"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6"/>
                <line x1="3" y1="12" x2="21" y2="12"/>
                <line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>
          )}
          
          <Link to="/dashboard" className="navbar-brand">
            <div className="brand-logo">
              <img src={logo} alt="EduTrack Logo" />
            </div>
            <div className="brand-text">
              <span className="brand-title">EduTrack</span>
              <span className="brand-subtitle">Akıllı Yoklama Sistemi</span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="navbar-nav">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link ${isActiveLink(link.path) ? 'nav-link--active' : ''}`}
            >
              <span className="nav-icon">{link.icon}</span>
              <span className="nav-label">{link.label}</span>
            </Link>
          ))}
        </div>

        {/* Right Side Actions */}
        <div className="navbar-actions">
          {/* Theme Toggle */}
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            )}
          </button>

          {/* Notifications */}
          <button className="notification-button" aria-label="Notifications">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            <span className="notification-badge">3</span>
          </button>

          {/* User Profile Dropdown */}
          <div className="profile-dropdown">
            <button
              className="profile-trigger"
              onClick={toggleProfile}
              aria-expanded={isProfileOpen}
            >
              <div className="profile-avatar">
                {user?.profilePhoto ? (
                  <img src={user.profilePhoto} alt="Profile" />
                ) : (
                  <span className="avatar-initials">
                    {getInitials(user?.firstName, user?.lastName)}
                  </span>
                )}
              </div>
              <div className="profile-info">
                <span className="profile-name">
                  {user?.firstName} {user?.lastName}
                </span>
                <span className="profile-role">{user?.title || 'Öğretmen'}</span>
              </div>
              <svg 
                className={`dropdown-arrow ${isProfileOpen ? 'dropdown-arrow--open' : ''}`}
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
              >
                <polyline points="6,9 12,15 18,9"/>
              </svg>
            </button>

            {isProfileOpen && (
              <div className="profile-menu">
                <div className="profile-menu-header">
                  <div className="profile-avatar profile-avatar--large">
                    {user?.profilePhoto ? (
                      <img src={user.profilePhoto} alt="Profile" />
                    ) : (
                      <span className="avatar-initials">
                        {getInitials(user?.firstName, user?.lastName)}
                      </span>
                    )}
                  </div>
                  <div className="profile-details">
                    <div className="profile-name">
                      {user?.title} {user?.firstName} {user?.lastName}
                    </div>
                    <div className="profile-email">{user?.email}</div>
                  </div>
                </div>
                
                <div className="profile-menu-divider"></div>
                
                <Link 
                  to="/profile" 
                  className="profile-menu-item"
                  onClick={() => setIsProfileOpen(false)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  Profil Ayarları
                </Link>
                
                <Link 
                  to="/settings" 
                  className="profile-menu-item"
                  onClick={() => setIsProfileOpen(false)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1"/>
                  </svg>
                  Sistem Ayarları
                </Link>
                
                <div className="profile-menu-divider"></div>
                
                <button 
                  className="profile-menu-item profile-menu-item--danger"
                  onClick={handleLogout}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16,17 21,12 16,7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                  Çıkış Yap
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="mobile-menu-toggle"
            onClick={toggleMenu}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            <span className={`hamburger ${isMenuOpen ? 'hamburger--open' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={`mobile-nav ${isMenuOpen ? 'mobile-nav--open' : ''}`}>
        <div className="mobile-nav-content">
          <div className="mobile-nav-header">
            <div className="mobile-profile">
              <div className="profile-avatar">
                {user?.profilePhoto ? (
                  <img src={user.profilePhoto} alt="Profile" />
                ) : (
                  <span className="avatar-initials">
                    {getInitials(user?.firstName, user?.lastName)}
                  </span>
                )}
              </div>
              <div className="profile-info">
                <div className="profile-name">
                  {user?.title} {user?.firstName} {user?.lastName}
                </div>
                <div className="profile-email">{user?.email}</div>
              </div>
            </div>
          </div>
          
          <div className="mobile-nav-links">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`mobile-nav-link ${isActiveLink(link.path) ? 'mobile-nav-link--active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="nav-icon">{link.icon}</span>
                <span className="nav-label">{link.label}</span>
              </Link>
            ))}
          </div>
          
          <div className="mobile-nav-footer">
            <Link 
              to="/profile" 
              className="mobile-nav-link"
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="nav-icon">👤</span>
              <span className="nav-label">Profil Ayarları</span>
            </Link>
            
            <button 
              className="mobile-nav-link mobile-nav-link--danger"
              onClick={() => {
                handleLogout();
                setIsMenuOpen(false);
              }}
            >
              <span className="nav-icon">🚪</span>
              <span className="nav-label">Çıkış Yap</span>
            </button>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {(isMenuOpen || isProfileOpen) && (
        <div 
          className="navbar-overlay"
          onClick={() => {
            setIsMenuOpen(false);
            setIsProfileOpen(false);
          }}
        />
      )}
    </nav>
  );
};

export default Navbar;