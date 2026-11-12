
import { useEffect, useState } from 'react'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import './App.css'
import PublicTrip from './pages/PublicTrip'

function App() {
  const [page, setPage] = useState('login')
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Verify existing login when the page refreshes
  useEffect(() => {
    const checkAuth = async () => {
      const token = sessionStorage.getItem('token')

      if (!token) {
        setLoading(false)
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
        setUser(data.user)
      } catch (error) {
        console.error('Authentication check failed:', error)
        sessionStorage.removeItem('token')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])



  const handleAuthSuccess = (loggedInUser) => {
    setUser(loggedInUser)
  }

  const handleLogout = () => {
    sessionStorage.removeItem('token')
    setUser(null)
    setPage('login')
  }

  if (loading) {
    return <p>Checking authentication...</p>
  }


  const sharedMatch = window.location.pathname.match(
    /^\/shared\/([a-fA-F0-9]{24})\/?$/
  )

  if (sharedMatch) {
    return <PublicTrip tripId={sharedMatch[1]} />
  }


  if (user) {
    return (
      <Dashboard
        user={user}
        onLogout={handleLogout}
      />
    )
  }

  return (
    <div>
      {page === 'login' ? (
        <>
          <Login onAuthSuccess={handleAuthSuccess} />

          <p>
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
  )
}

export default App
