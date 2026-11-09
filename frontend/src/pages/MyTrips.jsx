
import { useEffect, useState } from 'react'
import CreateTrip from './CreateTrip'
import EditTrip from './EditTrip'

function MyTrips() {
    const [trips, setTrips] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [editingTrip, setEditingTrip] = useState(null)
    const [deletingId, setDeletingId] = useState(null)

    useEffect(() => {
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

                setTrips(data.trips)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchTrips()
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

    const handleDelete = async (tripId) => {
        const confirmed = window.confirm(
            'Are you sure you want to delete this trip?'
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

            if (editingTrip?._id === tripId) {
                setEditingTrip(null)
            }
        } catch (err) {
            setError(err.message)
        } finally {
            setDeletingId(null)
        }
    }

    if (loading) {
        return <p>Loading trips...</p>
    }

    return (
        <section>
            <CreateTrip onTripCreated={handleTripCreated} />

            <hr />

            <h3>My Trips</h3>

            {error && <p role="alert">{error}</p>}

            {editingTrip && (
                <EditTrip
                    key={editingTrip._id}
                    trip={editingTrip}
                    onTripUpdated={handleTripUpdated}
                    onCancel={() => setEditingTrip(null)}
                />
            )}

            {trips.length === 0 ? (
                <p>No trips yet. Create your first travel adventure!</p>
            ) : (
                <div>
                    {trips.map((trip) => (
                        <div
                            key={trip._id}
                            style={{
                                border: '1px solid #ccc',
                                padding: '15px',
                                marginBottom: '12px',
                                borderRadius: '8px',
                            }}
                        >
                            <h4>{trip.title}</h4>

                            <p>Destination: {trip.destination}</p>

                            <p>
                                Start Date:{' '}
                                {new Date(trip.startDate).toLocaleDateString()}
                            </p>

                            <p>
                                End Date:{' '}
                                {new Date(trip.endDate).toLocaleDateString()}
                            </p>

                            {trip.description && (
                                <p>Description: {trip.description}</p>
                            )}

                            <p>
                                Status: {trip.isPublic ? 'Public' : 'Private'}
                            </p>

                            <button
                                type="button"
                                onClick={() => setEditingTrip(trip)}
                            >
                                Edit
                            </button>

                            <button
                                type="button"
                                onClick={() => handleDelete(trip._id)}
                                disabled={deletingId === trip._id}
                            >
                                {deletingId === trip._id
                                    ? 'Deleting...'
                                    : 'Delete'}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </section>
    )
}

export default MyTrips
