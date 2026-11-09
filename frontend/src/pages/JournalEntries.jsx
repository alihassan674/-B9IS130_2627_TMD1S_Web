
import { useEffect, useState } from 'react'
import CreateJournalEntry from './CreateJournalEntry'
import EditJournalEntry from './EditJournalEntry'

function JournalEntries({ tripId }) {
    const [entries, setEntries] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [editingEntry, setEditingEntry] = useState(null)
    const [deletingId, setDeletingId] = useState(null)

    const sortEntries = (items) =>
        [...items].sort(
            (a, b) =>
                new Date(a.entryDate) - new Date(b.entryDate)
        )

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
                    setEntries(sortEntries(data.entries))
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

    const handleEntryCreated = (newEntry) => {
        setEntries((previousEntries) =>
            sortEntries([...previousEntries, newEntry])
        )
    }

    const handleEntryUpdated = (updatedEntry) => {
        setEntries((previousEntries) =>
            sortEntries(
                previousEntries.map((entry) =>
                    entry._id === updatedEntry._id
                        ? updatedEntry
                        : entry
                )
            )
        )

        setEditingEntry(null)
    }

    const handleDelete = async (entryId) => {
        const confirmed = window.confirm(
            'Are you sure you want to delete this journal entry?'
        )

        if (!confirmed) return

        setDeletingId(entryId)
        setError('')

        try {
            const token = sessionStorage.getItem('token')

            const response = await fetch(
                `/api/trips/${tripId}/journals/${entryId}`,
                {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            const data = await response.json()

            if (!response.ok) {
                throw new Error(
                    data.message || 'Failed to delete journal entry'
                )
            }

            setEntries((previousEntries) =>
                previousEntries.filter(
                    (entry) => entry._id !== entryId
                )
            )

            if (editingEntry?._id === entryId) {
                setEditingEntry(null)
            }
        } catch (err) {
            setError(err.message)
        } finally {
            setDeletingId(null)
        }
    }

    if (loading) {
        return <p>Loading journal entries...</p>
    }

    return (
        <section>
            <CreateJournalEntry
                tripId={tripId}
                onEntryCreated={handleEntryCreated}
            />

            <hr />

            <h4>Journal Entries</h4>

            {error && <p role="alert">{error}</p>}

            {editingEntry && (
                <EditJournalEntry
                    key={editingEntry._id}
                    tripId={tripId}
                    entry={editingEntry}
                    onEntryUpdated={handleEntryUpdated}
                    onCancel={() => setEditingEntry(null)}
                />
            )}

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

                            <button
                                type="button"
                                onClick={() => setEditingEntry(entry)}
                            >
                                Edit
                            </button>

                            <button
                                type="button"
                                onClick={() => handleDelete(entry._id)}
                                disabled={deletingId === entry._id}
                            >
                                {deletingId === entry._id
                                    ? 'Deleting...'
                                    : 'Delete'}
                            </button>
                        </article>
                    ))}
                </div>
            )}
        </section>
    )
}

export default JournalEntries
