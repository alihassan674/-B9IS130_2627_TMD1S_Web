
import { useState } from 'react'

function Login({ onAuthSuccess, onRegisterClick }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleLogin = async (e) => {
        e.preventDefault()
        setError('')

        if (!email.trim() || !password) {
            setError('Please enter your email and password.')
            return
        }

        setLoading(true)

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email.trim(),
                    password,
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(
                    data.message || 'Login failed. Please try again.'
                )
            }

            if (!data.token || !data.user) {
                throw new Error('Invalid login response from server.')
            }

            sessionStorage.setItem('token', data.token)
            onAuthSuccess(data.user)
        } catch (err) {
            setError(
                err.message || 'Something went wrong. Please try again.'
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="tl-login-page">
            <div className="tl-login-layout">
                <aside className="tl-login-showcase">
                    <div className="tl-login-showcase-top">
                        <div className="tl-login-brand">
                            <span className="tl-login-brand-icon">
                                ✈️
                            </span>
                            <span>TravelLog</span>
                        </div>
                    </div>

                    <div className="tl-login-showcase-content">
                        <span className="tl-login-tag">
                            YOUR JOURNEY, YOUR STORY
                        </span>

                        <h1>
                            Every journey
                            <br />
                            has a story
                            <br />
                            worth telling.
                        </h1>

                        <p>
                            Capture unforgettable moments, organize
                            your adventures, and keep your favourite
                            travel memories together in one place.
                        </p>

                        <div className="tl-login-features">
                            <div>
                                <span>📍</span>
                                <p>Plan and organize your trips</p>
                            </div>

                            <div>
                                <span>📖</span>
                                <p>Record your travel memories</p>
                            </div>

                            <div>
                                <span>📸</span>
                                <p>Share your adventures</p>
                            </div>
                        </div>
                    </div>

                    <p className="tl-login-showcase-footer">
                        TravelLog · Your personal travel journal
                    </p>
                </aside>

                <section className="tl-login-panel">
                    <div className="tl-login-card">
                        <div className="tl-login-mobile-brand">
                            ✈️ TravelLog
                        </div>

                        <div className="tl-login-welcome-icon">
                            👋
                        </div>

                        <span className="tl-login-eyebrow">
                            WELCOME BACK
                        </span>

                        <h2>Sign in to TravelLog</h2>

                        <p className="tl-login-subtitle">
                            Continue your journey and revisit your
                            favourite travel memories.
                        </p>

                        <form
                            className="tl-login-form"
                            onSubmit={handleLogin}
                        >
                            <div className="tl-login-field">
                                <label htmlFor="email">
                                    Email Address
                                </label>

                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value)
                                        if (error) setError('')
                                    }}
                                    placeholder="you@example.com"
                                    autoComplete="email"
                                    required
                                />
                            </div>

                            <div className="tl-login-field">
                                <label htmlFor="password">
                                    Password
                                </label>

                                <div className="tl-login-password-wrap">
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value)
                                            if (error) setError('')
                                        }}
                                        placeholder="Enter your password"
                                        autoComplete="current-password"
                                        required
                                    />

                                    <button
                                        type="button"
                                        className="tl-login-password-toggle"
                                        onClick={() =>
                                            setShowPassword((previous) => !previous)
                                        }
                                        aria-label={
                                            showPassword
                                                ? 'Hide password'
                                                : 'Show password'
                                        }
                                        aria-pressed={showPassword}
                                    >
                                        {showPassword ? 'Hide' : 'Show'}
                                    </button>
                                </div>
                            </div>

                            {error && (
                                <p
                                    className="tl-login-error"
                                    role="alert"
                                >
                                    {error}
                                </p>
                            )}

                            <button
                                type="submit"
                                className="tl-login-submit"
                                disabled={loading}
                            >
                                {loading
                                    ? 'Signing in...'
                                    : 'Sign In →'}
                            </button>
                        </form>

                        <div className="tl-login-bottom">
                            <p>
                                New to TravelLog?{' '}
                                {onRegisterClick ? (
                                    <button
                                        type="button"
                                        onClick={onRegisterClick}
                                        className="tl-login-register-link"
                                    >
                                        Create an account
                                    </button>
                                ) : (
                                    <span>
                                        Create an account using the Register
                                        option.
                                    </span>
                                )}
                            </p>
                        </div>

                        <p className="tl-login-security">
                            🔒 Your travel memories belong to you.
                        </p>
                    </div>
                </section>
            </div>
        </main>
    )
}

export default Login
