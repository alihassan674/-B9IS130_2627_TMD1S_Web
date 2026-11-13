
import { useState } from 'react'

const emptyForm = {
    title: '',
    entryDate: '',
    content: '',
}

function CreateJournalEntry({ tripId, onEntryCreated }) {
    const [form, setForm] = useState({ ...emptyForm })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleChange = (e) => {
        const { name, value } = e.target

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }))

        if (error) setError('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (!form.title.trim()) {
            setError('Please enter a journal entry title.')
            return
        }

        if (!form.entryDate) {
            setError('Please select a journal entry date.')
            return
        }

        if (!form.content.trim()) {
            setError('Please write your travel memory.')
            return
        }

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
                    body: JSON.stringify({
                        title: form.title.trim(),
                        entryDate: form.entryDate,
                        content: form.content.trim(),
                    }),
                }
            )

            const data = await response.json()

            if (!response.ok) {
                throw new Error(
                    data.message || 'Failed to create journal entry'
                )
            }

            onEntryCreated(data.entry)
            setForm({ ...emptyForm })
        } catch (err) {
            setError(
                err.message || 'Something went wrong. Please try again.'
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <section className="create-journal">
            <div className="create-journal-header">
                <div className="create-journal-header-icon">
                    📖
                </div>

                <div>
                    <span className="create-journal-eyebrow">
                        CAPTURE YOUR MEMORIES
                    </span>

                    <h3>Add Journal Entry</h3>

                    <p>
                        Every journey has a story worth remembering.
                    </p>
                </div>
            </div>

            <form
                className="create-journal-form"
                onSubmit={handleSubmit}
            >
                <div className="create-journal-section-heading">
                    <span>✍️</span>

                    <div>
                        <h4>Your Journal Entry</h4>
                        <p>
                            Give this memory a title and a date.
                        </p>
                    </div>
                </div>

                <div className="create-journal-grid">
                    <div className="create-journal-field">
                        <label htmlFor="journal-title">
                            Entry Title <span>*</span>
                        </label>

                        <input
                            id="journal-title"
                            type="text"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            placeholder="e.g. Exploring the Streets of Rome"
                            maxLength={150}
                            required
                        />

                        <small>
                            {form.title.length}/150 characters
                        </small>
                    </div>

                    <div className="create-journal-field">
                        <label htmlFor="journal-date">
                            Entry Date <span>*</span>
                        </label>

                        <input
                            id="journal-date"
                            type="date"
                            name="entryDate"
                            value={form.entryDate}
                            onChange={handleChange}
                            required
                        />

                        <small>
                            Select the date of this travel memory.
                        </small>
                    </div>
                </div>

                <div className="create-journal-divider" />

                <div className="create-journal-section-heading">
                    <span>📝</span>

                    <div>
                        <h4>Tell Your Story</h4>
                        <p>
                            Describe the places, people, and moments
                            you want to remember.
                        </p>
                    </div>
                </div>

                <div className="create-journal-field">
                    <label htmlFor="journal-content">
                        Your Travel Memory <span>*</span>
                    </label>

                    <textarea
                        id="journal-content"
                        name="content"
                        value={form.content}
                        onChange={handleChange}
                        placeholder="What did you explore today? What made this moment special? Write your travel story here..."
                        maxLength={5000}
                        rows={7}
                        required
                    />

                    <div className="create-journal-field-bottom">
                        <small>
                            Write about your experiences, highlights,
                            and favourite moments.
                        </small>

                        <small>
                            {form.content.length}/5000
                        </small>
                    </div>
                </div>

                {error && (
                    <p
                        className="create-journal-error"
                        role="alert"
                    >
                        {error}
                    </p>
                )}

                <div className="create-journal-footer">
                    <p>
                        💡 You can add photos to this journal
                        entry after saving it.
                    </p>

                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? 'Saving Entry...'
                            : '📖 Add Journal Entry'}
                    </button>
                </div>
            </form>
        </section>
    )
}

export default CreateJournalEntry
