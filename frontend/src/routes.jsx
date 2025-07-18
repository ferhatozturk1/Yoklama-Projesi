import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import RouteGuard from './components/common/RouteGuard'

// Import pages
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import CourseDetail from './pages/CourseDetail'
import AttendanceManagement from './pages/AttendanceManagement'
import Courses from './pages/Courses'
import Reports from './pages/Reports'
import CalendarSettings from './pages/CalendarSettings'
import ScheduleManagement from './pages/ScheduleManagement'
import NotFound from './pages/NotFound'

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route 
        path="/login" 
        element={
          <RouteGuard requireAuth={false}>
            <Login />
          </RouteGuard>
        } 
      />
      <Route 
        path="/register" 
        element={
          <RouteGuard requireAuth={false}>
            <Register />
          </RouteGuard>
        } 
      />
      
      {/* Protected Routes */}
      <Route 
        path="/dashboard" 
        element={
          <RouteGuard>
            <Dashboard />
          </RouteGuard>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <RouteGuard>
            <Profile />
          </RouteGuard>
        } 
      />
      <Route 
        path="/courses" 
        element={
          <RouteGuard>
            <Courses />
          </RouteGuard>
        } 
      />
      <Route 
        path="/course/:courseId" 
        element={
          <RouteGuard>
            <CourseDetail />
          </RouteGuard>
        } 
      />
      <Route 
        path="/attendance" 
        element={
          <RouteGuard>
            <AttendanceManagement />
          </RouteGuard>
        } 
      />
      <Route 
        path="/reports" 
        element={
          <RouteGuard>
            <Reports />
          </RouteGuard>
        } 
      />
      <Route 
        path="/calendar-settings" 
        element={
          <RouteGuard>
            <CalendarSettings />
          </RouteGuard>
        } 
      />
      <Route 
        path="/schedule" 
        element={
          <RouteGuard>
            <ScheduleManagement />
          </RouteGuard>
        } 
      />
      
      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      
      {/* 404 Page */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default AppRoutes