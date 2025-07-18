import React, { useState } from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import Footer from './Footer'

const Layout = ({ children, showSidebar = false }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar onMenuClick={() => setSidebarOpen(true)} />
      
      <div className="flex flex-1">
        {showSidebar && (
          <Sidebar 
            isOpen={sidebarOpen} 
            onClose={() => setSidebarOpen(false)} 
          />
        )}
        
        <main className={`flex-1 ${showSidebar ? 'lg:ml-64' : ''}`}>
          <div className="min-h-full">
            {children}
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  )
}

export default Layout