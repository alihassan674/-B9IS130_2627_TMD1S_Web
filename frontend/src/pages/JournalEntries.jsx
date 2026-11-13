
import { useEffect, useState } from 'react'
import CreateJournalEntry from './CreateJournalEntry'
import EditJournalEntry from './EditJournalEntry'
import PhotoGallery from './PhotoGallery'

function JournalEntries({ tripId }) {
    const [entries, setEntries] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [editingEntry, setEditingEntry] = useState(null)
    const [deletingId, setDeletingId] = useState(null)
    const [search, setSearch] = useState('')

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
            setEntries([])
            setEditingEntry(null)

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
            'Delete this journal entry and all its photos? This cannot be undone.'
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

    const filteredEntries = entries.filter((entry) => {
        const query = search.trim().toLowerCase()

        return (
            entry.title.toLowerCase().includes(query) ||
            entry.content.toLowerCase().includes(query)
        )
    })

    return (
        <section className="journal-section">
            <div className="journal-header">
                <div className="journal-header-icon">📖</div>

                <div>
                    <span className="journal-eyebrow">
                        YOUR TRAVEL MEMORIES
                    </span>
                    <h3>Travel Journal</h3>
                    <p>
                        Every adventure deserves a story.
                    </p>
                </div>
            </div>

            <div className="journal-create-panel">
                <CreateJournalEntry
                    tripId={tripId}
                    onEntryCreated={handleEntryCreated}
                />
            </div>

            {error && (
                <p className="journal-error" role="alert">
                    {error}
                </p>
            )}

            {editingEntry && (
                <div className="journal-edit-panel">
                    <EditJournalEntry
                        key={editingEntry._id}
                        tripId={tripId}
                        entry={editingEntry}
                        onEntryUpdated={handleEntryUpdated}
                        onCancel={() => setEditingEntry(null)}
                    />
                </div>
            )}

            <div className="journal-list-header">
                <div>
                    <h4>Journal Entries</h4>
                    <p>
                        {entries.length}{' '}
                        {entries.length === 1 ? 'memory' : 'memories'} recorded
                    </p>
                </div>
            </div>

            {loading ? (
                <p className="journal-loading">
                    Loading journal entries...
                </p>
            ) : (
                <>
                    {entries.length > 0 && (
                        <div className="journal-search">
                            <input
                                type="search"
                                aria-label="Search journal entries"
                                placeholder="Search your memories..."
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                            />
                        </div>
                    )}

                    {entries.length === 0 ? (
                        <div className="journal-empty">
                            <span>✍️</span>
                            <h4>No journal entries yet</h4>
                            <p>
                                Start writing about your trip using
                                the form above.
                            </p>
                        </div>
                    ) : filteredEntries.length === 0 ? (
                        <div className="journal-empty">
                            <h4>No matching memories</h4>
                            <p>Try another search term.</p>
                        </div>
                    ) : (
                        <div className="journal-entry-list">
                            {filteredEntries.map((entry, index) => (
                                <article
                                    className="journal-card"
                                    key={entry._id}
                                >
                                    <div className="journal-card-top">
                                        <span className="journal-date">
                                            📅 {formatDate(entry.entryDate)}
                                        </span>

                                        <span className="journal-entry-number">
                                            Entry {index + 1}
                                        </span>
                                    </div>

                                    <h4>{entry.title}</h4>

                                    <p className="journal-content">
                                        {entry.content}
                                    </p>

                                    <div className="journal-photos">
                                        <PhotoGallery entryId={entry._id} />
                                    </div>

                                    <div className="journal-card-actions">
                                        <button
                                            type="button"
                                            className="journal-edit-btn"
                                            onClick={() => setEditingEntry(entry)}
                                        >
                                            ✏️ Edit Entry
                                        </button>

                                        <button
                                            type="button"
                                            className="journal-delete-btn"
                                            disabled={deletingId === entry._id}
                                            onClick={() => handleDelete(entry._id)}
                                        >
                                            {deletingId === entry._id
                                                ? 'Deleting...'
                                                : '🗑️ Delete Entry'}
                                        </button>
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

export default JournalEntries
