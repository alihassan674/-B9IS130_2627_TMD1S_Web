import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [apiStatus, setApiStatus] = useState('Checking...')

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => setApiStatus(data.message))
      .catch(() => setApiStatus('❌ Could not reach API'))
  }, [])

  return (
    <div className="app">
      <h1>✈️ TravelLog</h1>
      <p className="tagline">Trip journal with places, photos, notes, and budgets</p>
      <div className="status-card">
        <h2>System Status</h2>
        <p><strong>Frontend:</strong> ✅ React (Vite) running</p>
        <p><strong>Backend API:</strong> {apiStatus}</p>
      </div>
    </div>
  )
}

export default App
