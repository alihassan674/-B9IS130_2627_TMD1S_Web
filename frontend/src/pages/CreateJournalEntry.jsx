
import { useState } from 'react'

function CreateJournalEntry({ tripId, onEntryCreated }) {
    const [form, setForm] = useState({
        title: '',
        entryDate: '',
        content: '',
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
                `/api/trips/${tripId}/journals`,
                {
                    method: 'POST',
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
                    data.message || 'Failed to create journal entry'
                )
            }

            onEntryCreated(data.entry)

            setForm({
                title: '',
                entryDate: '',
                content: '',
            })
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <section>
            <h4>Add Journal Entry</h4>

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="journal-title">
                        Entry Title
                    </label>

                    <input
                        id="journal-title"
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        maxLength={150}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="journal-date">
                        Entry Date
                    </label>

                    <input
                        id="journal-date"
                        type="date"
                        name="entryDate"
                        value={form.entryDate}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="journal-content">
                        Your Travel Memory
                    </label>

                    <textarea
                        id="journal-content"
                        name="content"
                        value={form.content}
                        onChange={handleChange}
                        maxLength={5000}
                        rows={5}
                        required
                    />
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? 'Saving Entry...' : 'Add Entry'}
                </button>
            </form>

            {error && <p role="alert">{error}</p>}
        </section>
    )
}

export default CreateJournalEntry
