import React, { useEffect } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { AuthProvider } from './context/AuthContext'
import { CalendarProvider } from './context/CalendarContext'
import AppRoutes from './routes'
import { browserUtils, cacheManager, errorReporter } from './utils'
import 'react-toastify/dist/ReactToastify.css'
import './App.css'
import './styles/PageLoader.css'

function App() {
  // Initialize browser fixes, cache manager, and error reporter
  useEffect(() => {
    // Apply browser-specific CSS fixes
    browserUtils.applyBrowserFixes()
    
    // Initialize cache manager
    cacheManager.initCache({
      maxSize: 200,
      defaultTTL: 10 * 60 * 1000, // 10 minutes
      persistToStorage: true,
      debug: process.env.NODE_ENV === 'development'
    })
    
    // Initialize error reporter
    errorReporter.initErrorReporter({
      enabled: true,
      logToConsole: true,
      captureUnhandledErrors: true,
      captureUnhandledRejections: true,
      captureNetworkErrors: true,
      reportEndpoint: process.env.REACT_APP_ERROR_REPORT_ENDPOINT,
      debug: process.env.NODE_ENV === 'development'
    })
    
    // Log browser information in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Browser info:', browserUtils.detectBrowser())
      
      // Log feature support
      const features = [
        'flexbox', 'grid', 'customProperties', 'intersectionObserver',
        'webp', 'webgl', 'webworkers', 'serviceWorkers',
        'localStorage', 'fetch', 'promises', 'async'
      ]
      
      console.log('Feature support:', features.reduce((acc, feature) => {
        acc[feature] = browserUtils.supportsFeature(feature)
        return acc
      }, {}))
    }
  }, [])
  
  return (
    <AuthProvider>
      <CalendarProvider>
        <Router>
          <div className="App">
            <AppRoutes />
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
          </div>
        </Router>
      </CalendarProvider>
    </AuthProvider>
  )
}

export default App