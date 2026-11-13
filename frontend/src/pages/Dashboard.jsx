
import MyTrips from './MyTrips'

function Dashboard({ user, onLogout }) {
    const firstName = user?.name?.trim().split(/\s+/)[0] || 'Traveler'

    const features = [
        {
            icon: '🗺️',
            title: 'My Trips',
            description: 'Plan and manage your adventures.',
        },
        {
            icon: '📖',
            title: 'Travel Journals',
            description: 'Record memories from every journey.',
        },
        {
            icon: '📸',
            title: 'Photo Gallery',
            description: 'Keep your favorite travel moments.',
        },
        {
            icon: '💳',
            title: 'Trip Expenses',
            description: 'Track spending and manage your budget.',
        },
    ]

    return (
        <div className="dashboard">

            {/* Navigation Header */}
            <header className="dashboard-header">
                <div className="dashboard-header-inner">
                    <div className="app-brand">
                        <div className="app-brand-icon">
                            ✈
                        </div>

                        <div>
                            <h1>TravelLog</h1>
                            <p>Your personal travel journal</p>
                        </div>
                    </div>

                    <div className="dashboard-user-actions">
                        <span className="dashboard-user-name">
                            {user?.name || 'Traveler'}
                        </span>

                        <button
                            type="button"
                            className="dashboard-logout"
                            onClick={onLogout}
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <main className="dashboard-main">

                {/* Welcome Section */}
                <section className="dashboard-hero">
                    <div className="dashboard-hero-content">
                        <span className="dashboard-eyebrow">
                            YOUR TRAVEL COMPANION
                        </span>

                        <h2>Welcome back, {firstName}! 👋</h2>

                        <p>
                            Every journey has a story worth remembering.
                            Organize your trips, capture special moments,
                            and relive your adventures with TravelLog.
                        </p>

                        <a
                            href="#my-trips"
                            className="dashboard-hero-link"
                        >
                            Explore My Trips
                        </a>
                    </div>

                    <div
                        className="dashboard-hero-decoration"
                        aria-hidden="true"
                    >
                        🌍
                    </div>
                </section>

                {/* Feature Overview */}
                <section className="dashboard-features">
                    <div className="dashboard-section-heading">
                        <h2>Everything for your journey</h2>
                        <p>
                            Your travel memories, all in one place.
                        </p>
                    </div>

                    <div className="dashboard-feature-grid">
                        {features.map((feature) => (
                            <article
                                className="dashboard-feature-card"
                                key={feature.title}
                            >
                                <div className="dashboard-feature-icon">
                                    {feature.icon}
                                </div>

                                <h3>{feature.title}</h3>
                                <p>{feature.description}</p>
                            </article>
                        ))}
                    </div>
                </section>

                {/* Existing MyTrips Functionality */}
                <section
                    id="my-trips"
                    className="dashboard-trips-section"
                >
                    <div className="dashboard-section-heading">
                        <h2>Your Travel Collection</h2>
                        <p>
                            Create trips, manage journals, organize photos,
                            track expenses, and share your adventures.
                        </p>
                    </div>

                    <div className="dashboard-trips-content">
                        <MyTrips />
                    </div>
                </section>

                {/* Footer */}
                <footer className="dashboard-footer">
                    <p>
                        © {new Date().getFullYear()} TravelLog.
                        Your journeys, beautifully remembered.
                    </p>
                </footer>

            </main>
        </div>
    )
}

export default Dashboard
