import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { AuthProvider } from './context/AuthContext'
import { CalendarProvider } from './context/CalendarContext'
import { ThemeProvider } from './context/ThemeContext'
import AppRoutes from './routes'
import 'react-toastify/dist/ReactToastify.css'
import './App.css'

function App() {
  console.log('App component rendering...')
  
  return (
    <ThemeProvider>
      <AuthProvider>
        <CalendarProvider>
          <Router>
            <div className="App" style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
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
                theme="colored"
              />
            </div>
          </Router>
        </CalendarProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App