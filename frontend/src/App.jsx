
import { useEffect, useState } from 'react'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import PublicTrip from './pages/PublicTrip'
import './App.css'

function App() {
  const [page, setPage] = useState('login')
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Check whether this is a public shared-trip URL
  const sharedMatch = window.location.pathname.match(
    /^\/shared\/([a-fA-F0-9]{24})\/?$/
  )

  const isPublicPage = Boolean(sharedMatch)

  // Verify login for private application pages
  useEffect(() => {
    // Public pages do not need authentication
    if (isPublicPage) {
      return
    }

    let active = true

    const checkAuth = async () => {
      const token = sessionStorage.getItem('token')

      if (!token) {
        if (active) setLoading(false)
        return
      }

      try {
        const response = await fetch('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error('Session expired')
        }

        const data = await response.json()

        if (active) {
          setUser(data.user)
        }
      } catch (error) {
        console.error(
          'Authentication check failed:',
          error
        )

        sessionStorage.removeItem('token')
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    checkAuth()

    return () => {
      active = false
    }
  }, [isPublicPage])

  const handleAuthSuccess = (loggedInUser) => {
    setUser(loggedInUser)
  }

  const handleLogout = () => {
    sessionStorage.removeItem('token')
    setUser(null)
    setPage('login')
  }

  // Shared trips are accessible without login
  if (sharedMatch) {
    return <PublicTrip tripId={sharedMatch[1]} />
  }

  if (loading) {
    return (
      <div className="app-loading">
        Checking authentication...
      </div>
    )
  }

  // Logged-in user dashboard
  if (user) {
    return (
      <div className="app-shell">
        <Dashboard
          user={user}
          onLogout={handleLogout}
        />
      </div>
    )
  }

  // Login and Register pages
  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header-inner">
          <div className="app-brand">
            <div className="app-brand-icon">
              ✈
            </div>

            <div>
              <h1>TravelLog</h1>
              <p>
                Your journeys, beautifully remembered
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="auth-layout">
        <div className="auth-card">
          {page === 'login' ? (
            <>
              <Login
                onAuthSuccess={handleAuthSuccess}
              />

              <p className="auth-switch">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setPage('register')}
                >
                  Register here
                </button>
              </p>
            </>
          ) : (
            <Register
              onLoginClick={() => setPage('login')}
              onAuthSuccess={handleAuthSuccess}
            />
          )}
        </div>
      </main>
    </div>
  )
}

export default App
