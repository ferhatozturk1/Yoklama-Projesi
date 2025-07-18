import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { AuthProvider } from './context/AuthContext'
import { CalendarProvider } from './context/CalendarContext'
import AppRoutes from './routes'
import 'react-toastify/dist/ReactToastify.css'
import './App.css'

function App() {
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