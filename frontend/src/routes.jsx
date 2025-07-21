import React, { lazy, Suspense, memo } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import RouteGuard from './components/common/RouteGuard'
import { LoadingSpinner } from './components/common'

// Helper function to create lazy-loaded components with prefetching
const lazyWithPreload = (factory) => {
  const Component = lazy(factory)
  Component.preload = factory
  return Component
}

// Lazy load pages for code splitting with better chunk names and prefetching
const Login = lazyWithPreload(() => 
  import(/* webpackChunkName: "auth-login" */ './pages/Login')
)
const Register = lazyWithPreload(() => 
  import(/* webpackChunkName: "auth-register" */ './pages/Register')
)
const Dashboard = lazyWithPreload(() => 
  import(/* webpackChunkName: "dashboard" */ './pages/Dashboard')
)
const Profile = lazyWithPreload(() => 
  import(/* webpackChunkName: "profile" */ './pages/Profile')
)
const CourseDetail = lazyWithPreload(() => 
  import(/* webpackChunkName: "course-detail" */ './pages/CourseDetail')
)
const AttendanceManagement = lazyWithPreload(() => 
  import(/* webpackChunkName: "attendance" */ './pages/AttendanceManagement')
)
const Courses = lazyWithPreload(() => 
  import(/* webpackChunkName: "courses-list" */ './pages/Courses')
)
const Reports = lazyWithPreload(() => 
  import(/* webpackChunkName: "reports" */ './pages/Reports')
)
const CalendarSettings = lazyWithPreload(() => 
  import(/* webpackChunkName: "calendar-settings" */ './pages/CalendarSettings')
)
const ScheduleManagement = lazyWithPreload(() => 
  import(/* webpackChunkName: "schedule" */ './pages/ScheduleManagement')
)
const NotFound = lazyWithPreload(() => 
  import(/* webpackChunkName: "error" */ './pages/NotFound')
)

// Preload critical routes after initial render
setTimeout(() => {
  Dashboard.preload()
  Courses.preload()
}, 1000)

// Memoized loading fallback component
const PageLoader = memo(() => (
  <div className="page-loader">
    <LoadingSpinner size="large" />
  </div>
))

PageLoader.displayName = 'PageLoader'

// Helper component to wrap routes with RouteGuard and Suspense
const ProtectedRoute = memo(({ children, requireAuth = true, roles }) => (
  <RouteGuard requireAuth={requireAuth} roles={roles}>
    {children}
  </RouteGuard>
))

ProtectedRoute.displayName = 'ProtectedRoute'

// Route component map for prefetching
const routeComponentMap = {
  Login,
  Register,
  Dashboard,
  Profile,
  CourseDetail,
  AttendanceManagement,
  Courses,
  Reports,
  CalendarSettings,
  ScheduleManagement,
  NotFound
}

// Import prefetching utility
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { prefetchRelatedRoutes } from './utils/routePrefetcher'

const AppRoutes = () => {
  const location = useLocation()
  
  // Set up route prefetching based on current location
  useEffect(() => {
    prefetchRelatedRoutes(location.pathname, routeComponentMap)
  }, [location.pathname])
  
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/login" 
          element={
            <ProtectedRoute requireAuth={false}>
              <Login />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/register" 
          element={
            <ProtectedRoute requireAuth={false}>
              <Register />
            </ProtectedRoute>
          } 
        />
        
        {/* Protected Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/courses" 
          element={
            <ProtectedRoute>
              <Courses />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/course/:courseId" 
          element={
            <ProtectedRoute>
              <CourseDetail />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/attendance" 
          element={
            <ProtectedRoute>
              <AttendanceManagement />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/reports" 
          element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/calendar-settings" 
          element={
            <ProtectedRoute>
              <CalendarSettings />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/schedule" 
          element={
            <ProtectedRoute>
              <ScheduleManagement />
            </ProtectedRoute>
          } 
        />
        
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* 404 Page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}

export default AppRoutes