import React, { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import './Layout.css';

const Layout = ({ children, showSidebar = false }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="layout">
      {showSidebar && (
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
        />
      )}
      
      <div className={`layout-content ${showSidebar ? 'layout-content--with-sidebar' : ''}`}>
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="layout-main">
          {children}
        </main>
        
        <Footer />
      </div>
    </div>
  );
};

export default Layout