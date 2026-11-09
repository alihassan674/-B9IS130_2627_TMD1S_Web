import { useEffect, useState } from 'react'
import CreateTrip from './CreateTrip'

function MyTrips() {
    const [trips, setTrips] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

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

    if (loading) {
        return <p>Loading trips...</p>
    }

    if (error) {
        return <p role="alert">{error}</p>
    }

    return (
        <section>
            <CreateTrip onTripCreated={handleTripCreated} />

            <hr />

            <h3>My Trips</h3>

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
                        </div>
                    ))}
                </div>
            )}
        </section>
    )
}

export default MyTrips
