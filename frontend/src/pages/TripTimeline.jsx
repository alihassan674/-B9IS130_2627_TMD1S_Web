
import { useEffect, useState } from 'react'

function TripTimeline({ tripId }) {
    const [entries, setEntries] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        let active = true

        const fetchTimeline = async () => {
            setLoading(true)
            setError('')

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

                // Sort journal entries from oldest to newest
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

    if (loading) {
        return <p>Loading trip timeline...</p>
    }

    if (error) {
        return <p role="alert">{error}</p>
    }

    return (
        <section>
            <h4>Trip Timeline</h4>

            {entries.length === 0 ? (
                <p>
                    No journal entries available for this trip yet.
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
                                position: 'relative',
                                marginBottom: '24px',
                                padding: '12px',
                                border: '1px solid #ddd',
                                borderRadius: '8px',
                            }}
                        >
                            <span
                                aria-hidden="true"
                                style={{
                                    position: 'absolute',
                                    left: '-29px',
                                    top: '16px',
                                    width: '12px',
                                    height: '12px',
                                    backgroundColor: '#2563eb',
                                    borderRadius: '50%',
                                }}
                            />

                            <p>
                                <strong>
                                    {entry.entryDate.slice(0, 10)}
                                </strong>
                            </p>

                            <h5>{entry.title}</h5>

                            <p>{entry.content}</p>
                        </article>
                    ))}
                </div>
            )}
        </section>
    )
}

export default TripTimeline
