
import { useState } from 'react'

function EditJournalEntry({
    tripId,
    entry,
    onEntryUpdated,
    onCancel,
}) {
    const [form, setForm] = useState({
        title: entry.title,
        entryDate: entry.entryDate.slice(0, 10),
        content: entry.content,
    })

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const token = sessionStorage.getItem('token')

            const response = await fetch(
                `/api/trips/${tripId}/journals/${entry._id}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(form),
                }
            )

            const data = await response.json()

            if (!response.ok) {
                throw new Error(
                    data.message || 'Failed to update journal entry'
                )
            }

            onEntryUpdated(data.entry)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <section>
            <h4>Edit Journal Entry</h4>

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="edit-journal-title">
                        Entry Title
                    </label>
                    <input
                        id="edit-journal-title"
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        maxLength={150}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="edit-journal-date">
                        Entry Date
                    </label>
                    <input
                        id="edit-journal-date"
                        type="date"
                        name="entryDate"
                        value={form.entryDate}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="edit-journal-content">
                        Your Travel Memory
                    </label>
                    <textarea
                        id="edit-journal-content"
                        name="content"
                        value={form.content}
                        onChange={handleChange}
                        maxLength={5000}
                        rows={5}
                        required
                    />
                </div>

                {error && <p role="alert">{error}</p>}

                <button type="submit" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Changes'}
                </button>

                <button
                    type="button"
                    onClick={onCancel}
                    disabled={loading}
                >
                    Cancel
                </button>
            </form>
        </section>
    )
}

export default EditJournalEntry
