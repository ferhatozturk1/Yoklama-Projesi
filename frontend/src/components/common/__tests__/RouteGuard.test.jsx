import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '../../../utils/__tests__/testUtils'
import { useAuth } from '../../../context/AuthContext'
import RouteGuard from '../RouteGuard'

// Mock the auth context
vi.mock('../../../context/AuthContext', () => ({
  useAuth: vi.fn()
}))

// Mock the react-router-dom Navigate component
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    Navigate: vi.fn(() => <div data-testid="navigate">Redirecting...</div>)
  }
})

describe('RouteGuard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })
  
  it('should render children when user is authenticated', () => {
    // Mock authenticated user
    useAuth.mockReturnValue({
      isAuthenticated: true,
      user: { id: '1', name: 'Test User' }
    })
    
    render(
      <RouteGuard>
        <div data-testid="protected-content">Protected Content</div>
      </RouteGuard>
    )
    
    expect(screen.getByTestId('protected-content')).toBeInTheDocument()
    expect(screen.queryByTestId('navigate')).not.toBeInTheDocument()
  })
  
  it('should redirect to login when user is not authenticated', () => {
    // Mock unauthenticated user
    useAuth.mockReturnValue({
      isAuthenticated: false,
      user: null
    })
    
    render(
      <RouteGuard>
        <div data-testid="protected-content">Protected Content</div>
      </RouteGuard>
    )
    
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
    expect(screen.getByTestId('navigate')).toBeInTheDocument()
  })
  
  it('should redirect to specified redirectPath', () => {
    // Mock unauthenticated user
    useAuth.mockReturnValue({
      isAuthenticated: false,
      user: null
    })
    
    render(
      <RouteGuard redirectPath="/custom-login">
        <div data-testid="protected-content">Protected Content</div>
      </RouteGuard>
    )
    
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
    expect(screen.getByTestId('navigate')).toBeInTheDocument()
  })
  
  it('should check for specific roles when roles prop is provided', () => {
    // Mock authenticated user with admin role
    useAuth.mockReturnValue({
      isAuthenticated: true,
      user: { id: '1', name: 'Test User', roles: ['admin'] }
    })
    
    render(
      <RouteGuard roles={['admin']}>
        <div data-testid="protected-content">Admin Content</div>
      </RouteGuard>
    )
    
    expect(screen.getByTestId('protected-content')).toBeInTheDocument()
    
    // Change to user with different role
    useAuth.mockReturnValue({
      isAuthenticated: true,
      user: { id: '2', name: 'Regular User', roles: ['user'] }
    })
    
    render(
      <RouteGuard roles={['admin']}>
        <div data-testid="protected-content">Admin Content</div>
      </RouteGuard>
    )
    
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
    expect(screen.getByTestId('navigate')).toBeInTheDocument()
  })
  
  it('should allow access when user has one of multiple required roles', () => {
    // Mock authenticated user with editor role
    useAuth.mockReturnValue({
      isAuthenticated: true,
      user: { id: '1', name: 'Test User', roles: ['editor'] }
    })
    
    render(
      <RouteGuard roles={['admin', 'editor']}>
        <div data-testid="protected-content">Protected Content</div>
      </RouteGuard>
    )
    
    expect(screen.getByTestId('protected-content')).toBeInTheDocument()
  })
  
  it('should redirect to unauthorized page when user lacks required roles', () => {
    // Mock authenticated user without required role
    useAuth.mockReturnValue({
      isAuthenticated: true,
      user: { id: '1', name: 'Test User', roles: ['user'] }
    })
    
    render(
      <RouteGuard 
        roles={['admin']} 
        unauthorizedPath="/unauthorized"
      >
        <div data-testid="protected-content">Admin Content</div>
      </RouteGuard>
    )
    
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
    expect(screen.getByTestId('navigate')).toBeInTheDocument()
  })
  
  it('should show loading indicator when auth is still loading', () => {
    // Mock loading auth state
    useAuth.mockReturnValue({
      isAuthenticated: false,
      user: null,
      loading: true
    })
    
    render(
      <RouteGuard>
        <div data-testid="protected-content">Protected Content</div>
      </RouteGuard>
    )
    
    expect(screen.getByTestId('loading-indicator')).toBeInTheDocument()
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
    expect(screen.queryByTestId('navigate')).not.toBeInTheDocument()
  })
})