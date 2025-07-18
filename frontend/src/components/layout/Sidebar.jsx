import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import logo from '../../assets/logo.svg';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user } = useAuth();
  const { theme } = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const menuItems = [
    {
      name: 'Ana Panel',
      path: '/dashboard',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7"/>
          <rect x="14" y="3" width="7" height="7"/>
          <rect x="14" y="14" width="7" height="7"/>
          <rect x="3" y="14" width="7" height="7"/>
        </svg>
      ),
      badge: null
    },
    {
      name: 'Derslerim',
      path: '/courses',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
        </svg>
      ),
      badge: '3'
    },
    {
      name: 'Yoklama',
      path: '/attendance',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22,4 12,14.01 9,11.01"/>
        </svg>
      ),
      badge: null
    },
    {
      name: 'Program',
      path: '/schedule',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      ),
      badge: null
    },
    {
      name: 'Raporlar',
      path: '/reports',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="20" x2="18" y2="10"/>
          <line x1="12" y1="20" x2="12" y2="4"/>
          <line x1="6" y1="20" x2="6" y2="14"/>
        </svg>
      ),
      badge: null
    }
  ];

  const settingsItems = [
    {
      name: 'Takvim Ayarları',
      path: '/calendar-settings',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3"/>
          <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1"/>
        </svg>
      )
    },
    {
      name: 'Profil',
      path: '/profile',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      )
    }
  ];

  const isActiveRoute = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="sidebar-overlay"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? 'sidebar--open' : ''} ${isCollapsed ? 'sidebar--collapsed' : ''}`}>
        {/* Sidebar Header */}
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="brand-logo">
              <img src={logo} alt="EduTrack Logo" />
            </div>
            {!isCollapsed && (
              <div className="brand-info">
                <h2 className="brand-title">EduTrack</h2>
                <p className="brand-subtitle">Akıllı Yoklama</p>
              </div>
            )}
          </div>
          
          {/* Mobile Close Button */}
          <button className="sidebar-close-btn" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>

          {/* Desktop Collapse Button */}
          <button className="sidebar-collapse-btn" onClick={toggleCollapse}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15,18 9,12 15,6"/>
            </svg>
          </button>
        </div>

        {/* User Profile Section */}
        <div className="sidebar-user">
          <div className="user-avatar">
            {user?.profilePhoto ? (
              <img src={user.profilePhoto} alt="Profile" />
            ) : (
              <div className="avatar-placeholder">
                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
              </div>
            )}
            <div className="user-status"></div>
          </div>
          {!isCollapsed && (
            <div className="user-info">
              <div className="user-name">
                {user?.title} {user?.firstName} {user?.lastName}
              </div>
              <div className="user-role">Öğretim Görevlisi</div>
            </div>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="sidebar-nav">
          <div className="nav-section">
            {!isCollapsed && <div className="nav-section-title">Ana Menü</div>}
            <ul className="nav-list">
              {menuItems.map((item) => (
                <li key={item.path} className="nav-item">
                  <Link
                    to={item.path}
                    onClick={onClose}
                    className={`nav-link ${isActiveRoute(item.path) ? 'nav-link--active' : ''}`}
                    title={isCollapsed ? item.name : ''}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    {!isCollapsed && (
                      <>
                        <span className="nav-text">{item.name}</span>
                        {item.badge && (
                          <span className="nav-badge">{item.badge}</span>
                        )}
                      </>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="nav-section">
            {!isCollapsed && <div className="nav-section-title">Ayarlar</div>}
            <ul className="nav-list">
              {settingsItems.map((item) => (
                <li key={item.path} className="nav-item">
                  <Link
                    to={item.path}
                    onClick={onClose}
                    className={`nav-link ${isActiveRoute(item.path) ? 'nav-link--active' : ''}`}
                    title={isCollapsed ? item.name : ''}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    {!isCollapsed && <span className="nav-text">{item.name}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Quick Stats */}
        {!isCollapsed && (
          <div className="sidebar-stats">
            <div className="stats-header">
              <h4>Bu Hafta</h4>
            </div>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-number">12</div>
                <div className="stat-label">Ders</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">89%</div>
                <div className="stat-label">Devam</div>
              </div>
            </div>
          </div>
        )}

        {/* Sidebar Footer */}
        <div className="sidebar-footer">
          {!isCollapsed ? (
            <div className="footer-content">
              <div className="app-version">
                <span className="version-label">EduTrack</span>
                <span className="version-number">v2.1.0</span>
              </div>
              <div className="footer-links">
                <a href="#" className="footer-link">Yardım</a>
                <a href="#" className="footer-link">Destek</a>
              </div>
            </div>
          ) : (
            <div className="footer-collapsed">
              <div className="version-dot"></div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;