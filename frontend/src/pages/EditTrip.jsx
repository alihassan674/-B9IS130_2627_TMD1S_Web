
import { useState } from 'react'

function EditTrip({ trip, onTripUpdated, onCancel }) {
    const formatDate = (date) =>
        date ? date.slice(0, 10) : ''

    const [form, setForm] = useState({
        title: trip.title,
        destination: trip.destination,
        startDate: formatDate(trip.startDate),
        endDate: formatDate(trip.endDate),
        description: trip.description || '',
    })

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleChange = (e) => {
        const { name, value } = e.target

        setForm((previous) => ({
            ...previous,
            [name]: value,
            ...(name === 'startDate' &&
                previous.endDate &&
                previous.endDate < value
                ? { endDate: '' }
                : {}),
        }))

        if (error) setError('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (!form.title.trim() || !form.destination.trim()) {
            setError(
                'Please enter a trip title and destination.'
            )
            return
        }

        if (!form.startDate || !form.endDate) {
            setError('Please select both trip dates.')
            return
        }

        if (form.endDate < form.startDate) {
            setError(
                'End date cannot be before start date.'
            )
            return
        }

        setLoading(true)

        try {
            const token = sessionStorage.getItem('token')

            const response = await fetch(
                `/api/trips/${trip._id}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        ...form,
                        title: form.title.trim(),
                        destination: form.destination.trim(),
                        description: form.description.trim(),
                    }),
                }
            )

            const data = await response.json()

            if (!response.ok) {
                throw new Error(
                    data.message || 'Failed to update trip'
                )
            }

            onTripUpdated(data.trip)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <section className="edit-trip">
            <div className="edit-trip-header">
                <div className="edit-trip-header-icon">
                    ✏️
                </div>

                <div>
                    <span className="edit-trip-eyebrow">
                        UPDATE YOUR ADVENTURE
                    </span>
                    <h3>Edit Trip</h3>
                    <p>
                        Make changes to your travel plans.
                    </p>
                </div>
            </div>

            <form
                className="edit-trip-form"
                onSubmit={handleSubmit}
            >
                <div className="edit-trip-section-heading">
                    <span>📍</span>
                    <div>
                        <h4>Trip Details</h4>
                        <p>
                            Update your trip name and destination.
                        </p>
                    </div>
                </div>

                <div className="edit-trip-form-grid">
                    <div className="edit-trip-field">
                        <label htmlFor="edit-title">
                            Trip Title <span>*</span>
                        </label>
                        <input
                            id="edit-title"
                            type="text"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            placeholder="e.g. Summer Adventure in Italy"
                            maxLength={100}
                            required
                        />
                        <small>
                            {form.title.length}/100 characters
                        </small>
                    </div>

                    <div className="edit-trip-field">
                        <label htmlFor="edit-destination">
                            Destination <span>*</span>
                        </label>
                        <input
                            id="edit-destination"
                            type="text"
                            name="destination"
                            value={form.destination}
                            onChange={handleChange}
                            placeholder="e.g. Rome, Italy"
                            maxLength={100}
                            required
                        />
                        <small>
                            City, country, or destination name
                        </small>
                    </div>
                </div>

                <div className="edit-trip-divider" />

                <div className="edit-trip-section-heading">
                    <span>📅</span>
                    <div>
                        <h4>Travel Dates</h4>
                        <p>
                            Adjust your trip's start and end dates.
                        </p>
                    </div>
                </div>

                <div className="edit-trip-form-grid">
                    <div className="edit-trip-field">
                        <label htmlFor="edit-start-date">
                            Start Date <span>*</span>
                        </label>
                        <input
                            id="edit-start-date"
                            type="date"
                            name="startDate"
                            value={form.startDate}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="edit-trip-field">
                        <label htmlFor="edit-end-date">
                            End Date <span>*</span>
                        </label>
                        <input
                            id="edit-end-date"
                            type="date"
                            name="endDate"
                            value={form.endDate}
                            min={form.startDate || undefined}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="edit-trip-divider" />

                <div className="edit-trip-section-heading">
                    <span>📝</span>
                    <div>
                        <h4>Travel Description</h4>
                        <p>
                            Update the story behind your trip.
                        </p>
                    </div>
                </div>

                <div className="edit-trip-field">
                    <label htmlFor="edit-description">
                        Description (Optional)
                    </label>
                    <textarea
                        id="edit-description"
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Describe your travel plans..."
                        maxLength={1000}
                        rows={4}
                    />
                    <small className="edit-trip-char-count">
                        {form.description.length}/1000 characters
                    </small>
                </div>

                {error && (
                    <p className="edit-trip-error" role="alert">
                        {error}
                    </p>
                )}

                <div className="edit-trip-footer">
                    <p>
                        💡 Your existing journal entries,
                        photos, and expenses will remain
                        associated with this trip.
                    </p>

                    <div className="edit-trip-actions">
                        <button
                            type="button"
                            className="edit-trip-cancel-btn"
                            onClick={onCancel}
                            disabled={loading}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="edit-trip-save-btn"
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

export default EditTrip