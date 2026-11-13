
import { useState } from 'react'

function EditJournalEntry({
    tripId,
    entry,
    onEntryUpdated,
    onCancel,
}) {
    const [form, setForm] = useState({
        title: entry.title || '',
        entryDate: entry.entryDate
            ? entry.entryDate.slice(0, 10)
            : '',
        content: entry.content || '',
    })

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
                `/api/trips/${tripId}/journals/${entry._id}`,
                {
                    method: 'PUT',
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
                    data.message ||
                    'Failed to update journal entry'
                )
            }

            onEntryUpdated(data.entry)
        } catch (err) {
            setError(
                err.message ||
                'Something went wrong. Please try again.'
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <section className="edit-journal">
            <div className="edit-journal-header">
                <div className="edit-journal-header-icon">
                    ✏️
                </div>

                <div>
                    <span className="edit-journal-eyebrow">
                        REFINE YOUR TRAVEL STORY
                    </span>

                    <h3>Edit Journal Entry</h3>

                    <p>
                        Update the details of your travel memory.
                    </p>
                </div>
            </div>

            <form
                className="edit-journal-form"
                onSubmit={handleSubmit}
            >
                <div className="edit-journal-section-heading">
                    <span>📖</span>

                    <div>
                        <h4>Journal Details</h4>
                        <p>
                            Edit the title and date of your memory.
                        </p>
                    </div>
                </div>

                <div className="edit-journal-grid">
                    <div className="edit-journal-field">
                        <label htmlFor="edit-journal-title">
                            Entry Title <span>*</span>
                        </label>

                        <input
                            id="edit-journal-title"
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

                    <div className="edit-journal-field">
                        <label htmlFor="edit-journal-date">
                            Entry Date <span>*</span>
                        </label>

                        <input
                            id="edit-journal-date"
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

                <div className="edit-journal-divider" />

                <div className="edit-journal-section-heading">
                    <span>📝</span>

                    <div>
                        <h4>Edit Your Story</h4>
                        <p>
                            Update the places, experiences, and
                            moments you want to remember.
                        </p>
                    </div>
                </div>

                <div className="edit-journal-field">
                    <label htmlFor="edit-journal-content">
                        Your Travel Memory <span>*</span>
                    </label>

                    <textarea
                        id="edit-journal-content"
                        name="content"
                        value={form.content}
                        onChange={handleChange}
                        placeholder="Update your travel story here..."
                        maxLength={5000}
                        rows={7}
                        required
                    />

                    <div className="edit-journal-field-bottom">
                        <small>
                            Make any changes to your travel memory.
                        </small>

                        <small>
                            {form.content.length}/5000
                        </small>
                    </div>
                </div>

                {error && (
                    <p
                        className="edit-journal-error"
                        role="alert"
                    >
                        {error}
                    </p>
                )}

                <div className="edit-journal-footer">
                    <p>
                        💡 Your existing photos will remain
                        attached to this journal entry.
                    </p>

                    <div className="edit-journal-actions">
                        <button
                            type="button"
                            className="edit-journal-cancel-btn"
                            onClick={onCancel}
                            disabled={loading}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="edit-journal-save-btn"
                            disabled={loading}
                        >
                            {loading
                                ? 'Saving Changes...'
                                : '✓ Save Changes'}
                        </button>
                    </div>
                </div>
            </form>
        </section>
    )
}

export default EditJournalEntry
