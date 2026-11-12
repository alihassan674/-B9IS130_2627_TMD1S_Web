
import { useEffect, useState } from 'react'

function PublicTrip({ tripId }) {
    const [trip, setTrip] = useState(null)
    const [entries, setEntries] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        let active = true

        const fetchPublicTrip = async () => {
            setLoading(true)
            setError('')
            setTrip(null)
            setEntries([])

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
                    setEntries(data.entries || [])
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
        if (!date) return ''
        return date.slice(0, 10)
    }

    if (loading) {
        return <p>Loading shared trip...</p>
    }

    if (error) {
        return (
            <main>
                <h2>Trip Unavailable</h2>
                <p role="alert">{error}</p>
                <p>
                    This trip may be private, deleted, or the
                    shared link may be incorrect.
                </p>
            </main>
        )
    }

    if (!trip) {
        return <p>Trip not found.</p>
    }


    return (
        <main
            style={{
                maxWidth: '900px',
                margin: '30px auto',
                padding: '20px',
            }}
        >
            <header>
                <p>TravelLog — Shared Trip</p>

                <h1>{trip.title}</h1>

                <h3>{trip.destination}</h3>

                <p>
                    {formatDate(trip.startDate)}
                    {' to '}
                    {formatDate(trip.endDate)}
                </p>

                {trip.description && (
                    <p>{trip.description}</p>
                )}
            </header>

            <hr />

            <section>
                <h2>Travel Journal</h2>

                {entries.length === 0 ? (
                    <p>
                        No journal entries have been shared yet.
                    </p>
                ) : (
                    <div
                        style={{
                            borderLeft: '3px solid #2563eb',
                            paddingLeft: '20px',
                            marginLeft: '10px',
                        }}
                    >
                        {entries.map((entry) => (
                            <article
                                key={entry._id}
                                style={{
                                    border: '1px solid #ddd',
                                    borderRadius: '8px',
                                    padding: '16px',
                                    marginBottom: '20px',
                                }}
                            >
                                <p>
                                    <strong>
                                        {formatDate(entry.entryDate)}
                                    </strong>
                                </p>

                                <h3>{entry.title}</h3>

                                <p>{entry.content}</p>

                                {entry.photos?.length > 0 && (
                                    <div
                                        style={{
                                            display: 'grid',
                                            gridTemplateColumns:
                                                'repeat(auto-fit, minmax(180px, 1fr))',
                                            gap: '12px',
                                            marginTop: '15px',
                                        }}
                                    >
                                        {entry.photos.map((photo) => (
                                            <figure
                                                key={photo._id}
                                                style={{
                                                    margin: 0,
                                                    border: '1px solid #ddd',
                                                    borderRadius: '8px',
                                                    padding: '8px',
                                                }}
                                            >
                                                <img
                                                    src={photo.imageUrl}
                                                    alt={
                                                        photo.caption ||
                                                        'Travel memory'
                                                    }
                                                    loading="lazy"
                                                    referrerPolicy="no-referrer"
                                                    style={{
                                                        width: '100%',
                                                        height: '180px',
                                                        objectFit: 'cover',
                                                        borderRadius: '6px',
                                                    }}
                                                />

                                                {photo.caption && (
                                                    <figcaption
                                                        style={{
                                                            marginTop: '8px',
                                                        }}
                                                    >
                                                        {photo.caption}
                                                    </figcaption>
                                                )}
                                            </figure>
                                        ))}
                                    </div>
                                )}
                            </article>
                        ))}
                    </div>
                )}
            </section>

            <footer
                style={{
                    marginTop: '30px',
                    textAlign: 'center',
                }}
            >
                <p>Shared using TravelLog</p>
            </footer>
        </main>
    )
}

export default PublicTrip
