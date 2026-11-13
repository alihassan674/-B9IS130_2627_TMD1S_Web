
import { useEffect, useState } from 'react'
import CreateTrip from './CreateTrip'
import EditTrip from './EditTrip'
import JournalEntries from './JournalEntries'
import TripExpenses from './TripExpenses'
import TripTimeline from './TripTimeline'

function MyTrips() {
    const [trips, setTrips] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [editingTrip, setEditingTrip] = useState(null)
    const [deletingId, setDeletingId] = useState(null)
    const [sharingId, setSharingId] = useState(null)
    const [selectedJournalTripId, setSelectedJournalTripId] = useState(null)
    const [selectedExpenseTripId, setSelectedExpenseTripId] = useState(null)
    const [selectedTimelineTripId, setSelectedTimelineTripId] = useState(null)
    const [search, setSearch] = useState('')
    const [filter, setFilter] = useState('all')

    useEffect(() => {
        let active = true

        const fetchTrips = async () => {
            try {
                const token = sessionStorage.getItem('token')

                const response = await fetch('/api/trips', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })

                const data = await response.json()

                if (!response.ok) {
                    throw new Error(data.message || 'Failed to load trips')
                }

                if (active) setTrips(data.trips)
            } catch (err) {
                if (active) setError(err.message)
            } finally {
                if (active) setLoading(false)
            }
        }

        fetchTrips()

        return () => {
            active = false
        }
    }, [])

    const handleTripCreated = (newTrip) => {
        setTrips((previousTrips) => [
            newTrip,
            ...previousTrips,
        ])
    }

    const handleTripUpdated = (updatedTrip) => {
        setTrips((previousTrips) =>
            previousTrips.map((trip) =>
                trip._id === updatedTrip._id ? updatedTrip : trip
            )
        )
        setEditingTrip(null)
    }

    const handleTogglePublic = async (trip) => {
        const newStatus = !trip.isPublic
        setSharingId(trip._id)

        try {
            const token = sessionStorage.getItem('token')

            const response = await fetch(`/api/trips/${trip._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ isPublic: newStatus }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(
                    data.message || 'Failed to update sharing settings'
                )
            }

            setTrips((previousTrips) =>
                previousTrips.map((existingTrip) =>
                    existingTrip._id === trip._id
                        ? data.trip
                        : existingTrip
                )
            )

            if (editingTrip?._id === trip._id) {
                setEditingTrip(data.trip)
            }
        } catch (err) {
            alert(err.message)
        } finally {
            setSharingId(null)
        }
    }

    const handleCopyShareLink = async (tripId) => {
        const shareUrl =
            `${window.location.origin}/shared/${tripId}`

        try {
            await navigator.clipboard.writeText(shareUrl)
            alert('Share link copied successfully!')
        } catch {
            window.prompt('Copy this share link:', shareUrl)
        }
    }

    const handleDelete = async (tripId) => {
        const confirmed = window.confirm(
            'Delete this trip and all its journals, photos, and expenses? This cannot be undone.'
        )

        if (!confirmed) return

        setDeletingId(tripId)
        setError('')

        try {
            const token = sessionStorage.getItem('token')

            const response = await fetch(`/api/trips/${tripId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || 'Failed to delete trip')
            }

            setTrips((previousTrips) =>
                previousTrips.filter((trip) => trip._id !== tripId)
            )

            if (editingTrip?._id === tripId) setEditingTrip(null)
            if (selectedJournalTripId === tripId) setSelectedJournalTripId(null)
            if (selectedExpenseTripId === tripId) setSelectedExpenseTripId(null)
            if (selectedTimelineTripId === tripId) setSelectedTimelineTripId(null)
        } catch (err) {
            setError(err.message)
        } finally {
            setDeletingId(null)
        }
    }

    const formatDate = (date) =>
        date ? date.slice(0, 10) : 'Not specified'

    const filteredTrips = trips.filter((trip) => {
        const query = search.trim().toLowerCase()

        const matchesSearch =
            trip.title.toLowerCase().includes(query) ||
            trip.destination.toLowerCase().includes(query)

        const matchesFilter =
            filter === 'all' ||
            (filter === 'public' && trip.isPublic) ||
            (filter === 'private' && !trip.isPublic)

        return matchesSearch && matchesFilter
    })

    const publicCount = trips.filter((trip) => trip.isPublic).length

    return (
        <section className="mytrips">
            <div className="mytrips-create">
                <CreateTrip onTripCreated={handleTripCreated} />
            </div>

            <div className="mytrips-heading">
                <div>
                    <span className="mytrips-eyebrow">YOUR ADVENTURES</span>
                    <h3>My Trips</h3>
                    <p>Explore, organize, and share your travel memories.</p>
                </div>

                <span className="mytrips-count">
                    {trips.length} {trips.length === 1 ? 'Trip' : 'Trips'}
                </span>
            </div>

            {error && (
                <p className="mytrips-error" role="alert">
                    {error}
                </p>
            )}

            {editingTrip && (
                <div className="mytrips-edit-panel">
                    <EditTrip
                        key={editingTrip._id}
                        trip={editingTrip}
                        onTripUpdated={handleTripUpdated}
                        onCancel={() => setEditingTrip(null)}
                    />
                </div>
            )}

            {loading ? (
                <p>Loading trips...</p>
            ) : (
                <>
                    <div className="mytrips-summary">
                        <div className="mytrips-stat">
                            <span>All Trips</span>
                            <strong>{trips.length}</strong>
                        </div>

                        <div className="mytrips-stat">
                            <span>Public Trips</span>
                            <strong>{publicCount}</strong>
                        </div>

                        <div className="mytrips-stat">
                            <span>Private Trips</span>
                            <strong>{trips.length - publicCount}</strong>
                        </div>
                    </div>

                    <div className="mytrips-toolbar">
                        <input
                            type="search"
                            aria-label="Search trips"
                            placeholder="Search by title or destination..."
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                        />

                        <select
                            aria-label="Filter trips by sharing status"
                            value={filter}
                            onChange={(event) => setFilter(event.target.value)}
                        >
                            <option value="all">All Trips</option>
                            <option value="public">Public Trips</option>
                            <option value="private">Private Trips</option>
                        </select>
                    </div>

                    {trips.length === 0 ? (
                        <div className="mytrips-empty">
                            <span>🌍</span>
                            <h4>Your adventure starts here</h4>
                            <p>Create your first trip using the form above.</p>
                        </div>
                    ) : filteredTrips.length === 0 ? (
                        <div className="mytrips-empty">
                            <h4>No matching trips</h4>
                            <p>Try a different search or filter.</p>
                        </div>
                    ) : (
                        <div className="mytrips-grid">
                            {filteredTrips.map((trip) => (
                                <article className="mytrips-card" key={trip._id}>
                                    <div className="mytrips-card-top">
                                        <span className="mytrips-card-icon">✈️</span>

                                        <span
                                            className={
                                                trip.isPublic
                                                    ? 'mytrips-status public'
                                                    : 'mytrips-status private'
                                            }
                                        >
                                            {trip.isPublic ? '🌐 Public' : '🔒 Private'}
                                        </span>
                                    </div>

                                    <h4>{trip.title}</h4>

                                    <p className="mytrips-destination">
                                        📍 {trip.destination}
                                    </p>

                                    <p className="mytrips-dates">
                                        📅 {formatDate(trip.startDate)}
                                        {' — '}
                                        {formatDate(trip.endDate)}
                                    </p>

                                    {trip.description && (
                                        <p className="mytrips-description">
                                            {trip.description}
                                        </p>
                                    )}

                                    <div className="mytrips-actions">
                                        <button
                                            type="button"
                                            className="mytrips-btn-secondary"
                                            onClick={() => setEditingTrip(trip)}
                                        >
                                            Edit Trip
                                        </button>

                                        <button
                                            type="button"
                                            className="mytrips-btn-danger"
                                            disabled={deletingId === trip._id}
                                            onClick={() => handleDelete(trip._id)}
                                        >
                                            {deletingId === trip._id
                                                ? 'Deleting...'
                                                : 'Delete'}
                                        </button>
                                    </div>

                                    <div className="mytrips-section-label">
                                        Explore your trip
                                    </div>

                                    <div className="mytrips-actions">
                                        <button
                                            type="button"
                                            className="mytrips-btn-secondary"
                                            aria-expanded={selectedJournalTripId === trip._id}
                                            onClick={() =>
                                                setSelectedJournalTripId(
                                                    selectedJournalTripId === trip._id
                                                        ? null
                                                        : trip._id
                                                )
                                            }
                                        >
                                            {selectedJournalTripId === trip._id
                                                ? 'Hide Journal'
                                                : '📖 Journal'}
                                        </button>

                                        <button
                                            type="button"
                                            className="mytrips-btn-secondary"
                                            aria-expanded={selectedExpenseTripId === trip._id}
                                            onClick={() =>
                                                setSelectedExpenseTripId(
                                                    selectedExpenseTripId === trip._id
                                                        ? null
                                                        : trip._id
                                                )
                                            }
                                        >
                                            {selectedExpenseTripId === trip._id
                                                ? 'Hide Expenses'
                                                : '💳 Expenses'}
                                        </button>

                                        <button
                                            type="button"
                                            className="mytrips-btn-secondary"
                                            aria-expanded={selectedTimelineTripId === trip._id}
                                            onClick={() =>
                                                setSelectedTimelineTripId(
                                                    selectedTimelineTripId === trip._id
                                                        ? null
                                                        : trip._id
                                                )
                                            }
                                        >
                                            {selectedTimelineTripId === trip._id
                                                ? 'Hide Timeline'
                                                : '🕒 Timeline'}
                                        </button>
                                    </div>

                                    <div className="mytrips-sharing">
                                        <div className="mytrips-section-label">
                                            Sharing & Privacy
                                        </div>

                                        <div className="mytrips-actions">
                                            <button
                                                type="button"
                                                disabled={sharingId === trip._id}
                                                onClick={() => handleTogglePublic(trip)}
                                            >
                                                {sharingId === trip._id
                                                    ? 'Updating...'
                                                    : trip.isPublic
                                                        ? 'Make Private'
                                                        : 'Make Public'}
                                            </button>

                                            {trip.isPublic && (
                                                <button
                                                    type="button"
                                                    className="mytrips-btn-secondary"
                                                    onClick={() => handleCopyShareLink(trip._id)}
                                                >
                                                    🔗 Copy Share Link
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {selectedJournalTripId === trip._id && (
                                        <div className="mytrips-expanded">
                                            <JournalEntries tripId={trip._id} />
                                        </div>
                                    )}

                                    {selectedExpenseTripId === trip._id && (
                                        <div className="mytrips-expanded">
                                            <TripExpenses tripId={trip._id} />
                                        </div>
                                    )}

                                    {selectedTimelineTripId === trip._id && (
                                        <div className="mytrips-expanded">
                                            <TripTimeline tripId={trip._id} />
                                        </div>
                                    )}
                                </article>
                            ))}
                        </div>
                    )}
                </>
            )}
        </section>
    )
}

export default MyTrips
