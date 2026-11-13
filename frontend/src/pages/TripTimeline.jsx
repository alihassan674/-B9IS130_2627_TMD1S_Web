
import { useEffect, useState } from 'react'

function TripTimeline({ tripId }) {
    const [entries, setEntries] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [search, setSearch] = useState('')
    const [sortOrder, setSortOrder] = useState('oldest')

    useEffect(() => {
        let active = true

        const fetchTimeline = async () => {
            setLoading(true)
            setError('')
            setEntries([])

            try {
                const token = sessionStorage.getItem('token')

                const response = await fetch(
                    `/api/trips/${tripId}/journals`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )

                const data = await response.json()

                if (!response.ok) {
                    throw new Error(
                        data.message || 'Failed to load timeline'
                    )
                }

                const sortedEntries = [...data.entries].sort(
                    (a, b) =>
                        new Date(a.entryDate) - new Date(b.entryDate)
                )

                if (active) {
                    setEntries(sortedEntries)
                }
            } catch (err) {
                if (active) {
                    setError(err.message)
                }
            } finally {
                if (active) {
                    setLoading(false)
                }
            }
        }

        fetchTimeline()

        return () => {
            active = false
        }
    }, [tripId])

    const formatDate = (date) => {
        if (!date) return 'Date unavailable'

        const [year, month, day] = date.slice(0, 10).split('-')

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

    const filteredEntries = entries
        .filter((entry) => {
            const query = search.trim().toLowerCase()

            return (
                entry.title.toLowerCase().includes(query) ||
                entry.content.toLowerCase().includes(query)
            )
        })
        .sort((a, b) => {
            const difference =
                new Date(a.entryDate) - new Date(b.entryDate)

            return sortOrder === 'oldest'
                ? difference
                : -difference
        })

    const firstDate = entries.length > 0
        ? formatDate(entries[0].entryDate)
        : 'Not available'

    const lastDate = entries.length > 0
        ? formatDate(entries[entries.length - 1].entryDate)
        : 'Not available'

    return (
        <section className="trip-timeline">
            <div className="timeline-header">
                <div className="timeline-header-icon">
                    🗺️
                </div>

                <div>
                    <span className="timeline-eyebrow">
                        YOUR JOURNEY
                    </span>

                    <h3>Trip Timeline</h3>

                    <p>
                        Relive your travel memories,
                        one moment at a time.
                    </p>
                </div>
            </div>

            {error && (
                <p className="timeline-error" role="alert">
                    {error}
                </p>
            )}

            {loading ? (
                <p className="timeline-loading">
                    Loading trip timeline...
                </p>
            ) : (
                <>
                    <div className="timeline-summary">
                        <div className="timeline-summary-card">
                            <span>📖 Journal Entries</span>
                            <strong>{entries.length}</strong>
                            <small>Memories recorded</small>
                        </div>

                        <div className="timeline-summary-card">
                            <span>🚩 First Memory</span>
                            <strong className="timeline-summary-date">
                                {firstDate}
                            </strong>
                            <small>Journey begins</small>
                        </div>

                        <div className="timeline-summary-card">
                            <span>🏁 Latest Memory</span>
                            <strong className="timeline-summary-date">
                                {lastDate}
                            </strong>
                            <small>Most recent entry</small>
                        </div>
                    </div>

                    {entries.length > 0 && (
                        <div className="timeline-toolbar">
                            <input
                                type="search"
                                aria-label="Search timeline"
                                placeholder="Search your journey..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                            />

                            <select
                                aria-label="Timeline sort order"
                                value={sortOrder}
                                onChange={(e) =>
                                    setSortOrder(e.target.value)
                                }
                            >
                                <option value="oldest">
                                    Oldest First
                                </option>
                                <option value="newest">
                                    Newest First
                                </option>
                            </select>
                        </div>
                    )}

                    {entries.length === 0 ? (
                        <div className="timeline-empty">
                            <span>🧭</span>
                            <h4>Your journey starts here</h4>
                            <p>
                                Add journal entries to your trip
                                to build your travel timeline.
                            </p>
                        </div>
                    ) : filteredEntries.length === 0 ? (
                        <div className="timeline-empty">
                            <span>🔎</span>
                            <h4>No matching memories</h4>
                            <p>
                                Try searching for another
                                title or keyword.
                            </p>
                        </div>
                    ) : (
                        <div className="timeline-list">
                            {filteredEntries.map((entry, index) => (
                                <article
                                    className="timeline-item"
                                    key={entry._id}
                                >
                                    <div
                                        className="timeline-marker"
                                        aria-hidden="true"
                                    >
                                        <span>📍</span>
                                    </div>

                                    <div className="timeline-item-card">
                                        <div className="timeline-item-top">
                                            <span className="timeline-date">
                                                📅 {formatDate(entry.entryDate)}
                                            </span>

                                            <span className="timeline-number">
                                                Memory {index + 1}
                                            </span>
                                        </div>

                                        <h4>{entry.title}</h4>

                                        <p className="timeline-content">
                                            {entry.content}
                                        </p>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </>
            )}
        </section>
    )
}

export default TripTimeline
