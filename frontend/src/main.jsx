import React from 'react'
import ReactDOM from 'react-dom/client'
import { ToastContainer } from 'react-toastify'
import App from './App.jsx'
import './index.css'
import 'react-toastify/dist/ReactToastify.css'
import { initGlobalErrorHandler } from './utils/globalErrorHandler'
import { ErrorBoundary } from './components/common'

// Initialize global error handler
initGlobalErrorHandler({
  showNotifications: true,
  logToConsole: true,
  reportToService: false
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
      <ToastContainer position="top-right" />
    </ErrorBoundary>
  </React.StrictMode>,
)