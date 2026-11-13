
import { useState } from 'react'

function Register({ onLoginClick, onAuthSuccess }) {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const passwordValid = password.length >= 8

    const clearError = () => {
        if (error) setError('')
    }

    const handleRegister = async (e) => {
        e.preventDefault()
        setError('')

        if (!name.trim()) {
            setError('Please enter your full name.')
            return
        }

        if (!email.trim()) {
            setError('Please enter your email address.')
            return
        }

        if (!passwordValid) {
            setError('Password must be at least 8 characters.')
            return
        }

        setLoading(true)

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: name.trim(),
                    email: email.trim(),
                    password,
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(
                    data.message || 'Registration failed'
                )
            }

            if (!data.token || !data.user) {
                throw new Error(
                    'Invalid registration response from server.'
                )
            }

            sessionStorage.setItem('token', data.token)
            onAuthSuccess(data.user)
        } catch (err) {
            setError(
                err.message ||
                'Something went wrong. Please try again.'
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="tl-register-page">
            <div className="tl-register-layout">
                <aside className="tl-register-showcase">
                    <div className="tl-register-brand">
                        <span className="tl-register-brand-icon">
                            ✈️
                        </span>
                        <span>TravelLog</span>
                    </div>

                    <div className="tl-register-showcase-content">
                        <span className="tl-register-tag">
                            START YOUR ADVENTURE
                        </span>

                        <h1>
                            Your next
                            <br />
                            adventure
                            <br />
                            starts here.
                        </h1>

                        <p>
                            Create your personal travel journal.
                            Save unforgettable memories, track
                            your experiences, and share the
                            journeys that matter most.
                        </p>

                        <div className="tl-register-features">
                            <div>
                                <span>🌍</span>
                                <p>Organize your travel adventures</p>
                            </div>

                            <div>
                                <span>📖</span>
                                <p>Keep your memories in one place</p>
                            </div>

                            <div>
                                <span>📸</span>
                                <p>Share your favourite moments</p>
                            </div>
                        </div>
                    </div>

                    <p className="tl-register-showcase-footer">
                        TravelLog · Every journey tells a story
                    </p>
                </aside>

                <section className="tl-register-panel">
                    <div className="tl-register-card">
                        <div className="tl-register-mobile-brand">
                            ✈️ TravelLog
                        </div>

                        <div className="tl-register-welcome-icon">
                            🌍
                        </div>

                        <span className="tl-register-eyebrow">
                            JOIN THE JOURNEY
                        </span>

                        <h2>Create your account</h2>

                        <p className="tl-register-subtitle">
                            Start capturing your adventures
                            and building your travel story.
                        </p>

                        <form
                            className="tl-register-form"
                            onSubmit={handleRegister}
                        >
                            <div className="tl-register-field">
                                <label htmlFor="name">
                                    Full Name <span>*</span>
                                </label>

                                <input
                                    id="name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => {
                                        setName(e.target.value)
                                        clearError()
                                    }}
                                    placeholder="Enter your full name"
                                    autoComplete="name"
                                    required
                                />
                            </div>

                            <div className="tl-register-field">
                                <label htmlFor="register-email">
                                    Email Address <span>*</span>
                                </label>

                                <input
                                    id="register-email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value)
                                        clearError()
                                    }}
                                    placeholder="you@example.com"
                                    autoComplete="email"
                                    required
                                />
                            </div>

                            <div className="tl-register-field">
                                <label htmlFor="register-password">
                                    Password <span>*</span>
                                </label>

                                <div className="tl-register-password-wrap">
                                    <input
                                        id="register-password"
                                        type={
                                            showPassword
                                                ? 'text'
                                                : 'password'
                                        }
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value)
                                            clearError()
                                        }}
                                        placeholder="Create a secure password"
                                        autoComplete="new-password"
                                        minLength={8}
                                        required
                                        aria-describedby="register-password-hint"
                                    />

                                    <button
                                        type="button"
                                        className="tl-register-password-toggle"
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

                                <div
                                    id="register-password-hint"
                                    className="tl-register-password-hint"
                                >
                                    <span
                                        className={
                                            passwordValid
                                                ? 'tl-register-valid'
                                                : ''
                                        }
                                    >
                                        {passwordValid ? '✓' : '○'} At least
                                        8 characters
                                    </span>
                                </div>
                            </div>

                            {error && (
                                <p
                                    className="tl-register-error"
                                    role="alert"
                                >
                                    {error}
                                </p>
                            )}

                            <button
                                type="submit"
                                className="tl-register-submit"
                                disabled={loading}
                            >
                                {loading
                                    ? 'Creating Account...'
                                    : 'Create Account →'}
                            </button>
                        </form>

                        <div className="tl-register-bottom">
                            <p>
                                Already have an account?
                            </p>

                            <button
                                type="button"
                                onClick={onLoginClick}
                                className="tl-register-login-link"
                            >
                                Sign in to TravelLog
                            </button>
                        </div>

                        <p className="tl-register-security">
                            🔒 Your travel memories belong to you.
                        </p>
                    </div>
                </section>
            </div>
        </main>
    )
}

export default Register
