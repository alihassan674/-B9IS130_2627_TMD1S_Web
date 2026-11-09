
import { useEffect, useState } from 'react'

function JournalEntries({ tripId }) {
    const [entries, setEntries] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        let active = true

        const fetchEntries = async () => {
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
                        data.message || 'Failed to load journal entries'
                    )
                }

                if (active) {
                    setEntries(data.entries)
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

        fetchEntries()

        return () => {
            active = false
        }
    }, [tripId])

    if (loading) {
        return <p>Loading journal entries...</p>
    }

    if (error) {
        return <p role="alert">{error}</p>
    }

    return (
        <section>
            <h4>Journal Entries</h4>

            {entries.length === 0 ? (
                <p>No journal entries yet for this trip.</p>
            ) : (
                <div>
                    {entries.map((entry) => (
                        <article
                            key={entry._id}
                            style={{
                                border: '1px solid #ddd',
                                padding: '12px',
                                marginBottom: '10px',
                                borderRadius: '8px',
                            }}
                        >
                            <h5>{entry.title}</h5>

                            <p>
                                Date: {entry.entryDate.slice(0, 10)}
                            </p>

                            <p>{entry.content}</p>
                        </article>
                    ))}
                </div>
            )}
        </section>
    )
}

export default JournalEntries
