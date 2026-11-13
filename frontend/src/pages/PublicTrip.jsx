
import { useEffect, useState } from 'react'

function PublicTrip({ tripId }) {
    const [trip, setTrip] = useState(null)
    const [entries, setEntries] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [brokenImages, setBrokenImages] = useState({})

    useEffect(() => {
        let active = true

        const fetchPublicTrip = async () => {
            setLoading(true)
            setError('')
            setTrip(null)
            setEntries([])
            setBrokenImages({})

            try {
                const response = await fetch(
                    `/api/public/trips/${tripId}`
                )

                const data = await response.json()

                if (!response.ok) {
                    throw new Error(
                        data.message || 'Unable to load public trip'
                    )
                }

                if (active) {
                    setTrip(data.trip)

                    const sortedEntries = [
                        ...(data.entries || []),
                    ].sort(
                        (a, b) =>
                            new Date(a.entryDate) -
                            new Date(b.entryDate)
                    )

                    setEntries(sortedEntries)
                }
            } catch (err) {
                if (active) setError(err.message)
            } finally {
                if (active) setLoading(false)
            }
        }

        fetchPublicTrip()

        return () => {
            active = false
        }
    }, [tripId])

    const formatDate = (date) => {
        if (!date) return 'Not specified'

        const [year, month, day] =
            date.slice(0, 10).split('-')

        return new Date(
            Number(year),
            Number(month) - 1,
            Number(day)
        ).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        })
    }

    const photoCount = entries.reduce(
        (total, entry) =>
            total + (entry.photos?.length || 0),
        0
    )

    if (loading) {
        return (
            <main className="public-trip-page">
                <div className="public-trip-message">
                    <span>🧳</span>
                    <h2>Loading shared trip...</h2>
                    <p>Getting the travel memories ready.</p>
                </div>
            </main>
        )
    }

    if (error || !trip) {
        return (
            <main className="public-trip-page">
                <div className="public-trip-message">
                    <span>🧭</span>
                    <h2>Trip Unavailable</h2>

                    {error && (
                        <p role="alert">{error}</p>
                    )}

                    <p>
                        This trip may be private, deleted,
                        or the shared link may be incorrect.
                    </p>

                    <a href="/">Visit TravelLog</a>
                </div>
            </main>
        )
    }

    return (
        <main className="public-trip-page">
            <nav
                className="public-trip-nav"
                aria-label="Public trip navigation"
            >
                <a className="public-trip-brand" href="/">
                    <span>🌍</span>
                    TravelLog
                </a>

                <span className="public-trip-badge">
                    🌐 Shared Trip
                </span>
            </nav>

            <header className="public-trip-hero">
                <span className="public-trip-eyebrow">
                    A JOURNEY WORTH SHARING
                </span>

                <h1>{trip.title}</h1>

                <div className="public-trip-meta">
                    <span>📍 {trip.destination}</span>

                    <span>
                        📅 {formatDate(trip.startDate)}
                        {' — '}
                        {formatDate(trip.endDate)}
                    </span>
                </div>

                {trip.description && (
                    <p className="public-trip-description">
                        {trip.description}
                    </p>
                )}
            </header>

            <section
                className="public-trip-stats"
                aria-label="Trip summary"
            >
                <div className="public-trip-stat">
                    <span>📖</span>
                    <strong>{entries.length}</strong>
                    <small>Journal Entries</small>
                </div>

                <div className="public-trip-stat">
                    <span>📸</span>
                    <strong>{photoCount}</strong>
                    <small>Travel Photos</small>
                </div>
            </section>

            <section className="public-trip-journal">
                <div className="public-trip-section-heading">
                    <span className="public-trip-eyebrow">
                        TRAVEL MEMORIES
                    </span>

                    <h2>The Journey</h2>

                    <p>
                        Explore the moments and stories
                        from this adventure.
                    </p>
                </div>

                {entries.length === 0 ? (
                    <div className="public-trip-empty">
                        <span>📖</span>
                        <h3>No journal entries shared yet</h3>
                        <p>
                            Travel memories will appear here
                            when they are added.
                        </p>
                    </div>
                ) : (
                    <div className="public-trip-timeline">
                        {entries.map((entry, index) => (
                            <article
                                className="public-trip-entry"
                                key={entry._id}
                            >
                                <div
                                    className="public-trip-marker"
                                    aria-hidden="true"
                                >
                                    <span>📍</span>
                                </div>

                                <div className="public-trip-entry-card">
                                    <div className="public-trip-entry-top">
                                        <span className="public-trip-date">
                                            📅 {formatDate(entry.entryDate)}
                                        </span>

                                        <span className="public-trip-entry-number">
                                            Memory {index + 1}
                                        </span>
                                    </div>

                                    <h3>{entry.title}</h3>

                                    <p className="public-trip-entry-content">
                                        {entry.content}
                                    </p>

                                    {entry.photos?.length > 0 && (
                                        <div className="public-trip-photos">
                                            <h4>
                                                📸 Travel Photos
                                                <span>
                                                    {' '}({entry.photos.length})
                                                </span>
                                            </h4>

                                            <div className="public-trip-photo-grid">
                                                {entry.photos.map((photo) => (
                                                    <figure
                                                        className="public-trip-photo"
                                                        key={photo._id}
                                                    >
                                                        {brokenImages[photo._id] ===
                                                            photo.imageUrl ? (
                                                            <div className="public-trip-image-fallback">
                                                                <span>🖼️</span>
                                                                <small>
                                                                    Image unavailable
                                                                </small>
                                                            </div>
                                                        ) : (
                                                            <img
                                                                src={photo.imageUrl}
                                                                alt={
                                                                    photo.caption ||
                                                                    'Travel memory'
                                                                }
                                                                loading="lazy"
                                                                referrerPolicy="no-referrer"
                                                                onError={() =>
                                                                    setBrokenImages((previous) => ({
                                                                        ...previous,
                                                                        [photo._id]: photo.imageUrl,
                                                                    }))
                                                                }
                                                            />
                                                        )}

                                                        {photo.caption && (
                                                            <figcaption>
                                                                {photo.caption}
                                                            </figcaption>
                                                        )}
                                                    </figure>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>

            <footer className="public-trip-footer">
                <span>🌍 TravelLog</span>
                <p>
                    Every journey has a story worth remembering.
                </p>
                <small>Shared using TravelLog</small>
            </footer>
        </main>
    )
}

export default PublicTrip
