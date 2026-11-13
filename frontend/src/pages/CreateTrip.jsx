
import { useState } from 'react'

const emptyForm = {
    title: '',
    destination: '',
    startDate: '',
    endDate: '',
    description: '',
}

function CreateTrip({ onTripCreated }) {
    const [form, setForm] = useState({ ...emptyForm })
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
            setError('Please enter a trip title and destination.')
            return
        }

        if (!form.startDate || !form.endDate) {
            setError('Please select both trip dates.')
            return
        }

        if (form.endDate < form.startDate) {
            setError('End date cannot be before start date.')
            return
        }

        setLoading(true)

        try {
            const token = sessionStorage.getItem('token')

            const response = await fetch('/api/trips', {
                method: 'POST',
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
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(
                    data.message || 'Failed to create trip'
                )
            }

            onTripCreated(data.trip)
            setForm({ ...emptyForm })
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <section className="create-trip">
            <div className="create-trip-header">
                <div className="create-trip-header-icon">
                    ✈️
                </div>

                <div>
                    <span className="create-trip-eyebrow">
                        PLAN YOUR ADVENTURE
                    </span>
                    <h3>Create New Trip</h3>
                    <p>
                        Every great journey starts with a plan.
                    </p>
                </div>
            </div>

            <form
                className="create-trip-form"
                onSubmit={handleSubmit}
            >
                <div className="create-trip-section-heading">
                    <span>📍</span>
                    <div>
                        <h4>Trip Details</h4>
                        <p>
                            Give your adventure a name and destination.
                        </p>
                    </div>
                </div>

                <div className="create-trip-form-grid">
                    <div className="create-trip-field">
                        <label htmlFor="trip-title">
                            Trip Title <span>*</span>
                        </label>
                        <input
                            id="trip-title"
                            type="text"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            placeholder="e.g. Summer Adventure in Italy"
                            maxLength={100}
                            required
                        />
                        <small>{form.title.length}/100 characters</small>
                    </div>

                    <div className="create-trip-field">
                        <label htmlFor="destination">
                            Destination <span>*</span>
                        </label>
                        <input
                            id="destination"
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

                <div className="create-trip-divider" />

                <div className="create-trip-section-heading">
                    <span>📅</span>
                    <div>
                        <h4>Travel Dates</h4>
                        <p>
                            Choose when your journey begins and ends.
                        </p>
                    </div>
                </div>

                <div className="create-trip-form-grid">
                    <div className="create-trip-field">
                        <label htmlFor="start-date">
                            Start Date <span>*</span>
                        </label>
                        <input
                            id="start-date"
                            type="date"
                            name="startDate"
                            value={form.startDate}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="create-trip-field">
                        <label htmlFor="end-date">
                            End Date <span>*</span>
                        </label>
                        <input
                            id="end-date"
                            type="date"
                            name="endDate"
                            value={form.endDate}
                            min={form.startDate || undefined}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="create-trip-divider" />

                <div className="create-trip-section-heading">
                    <span>📝</span>
                    <div>
                        <h4>Your Travel Story</h4>
                        <p>
                            Add a short description of your plans.
                        </p>
                    </div>
                </div>

                <div className="create-trip-field">
                    <label htmlFor="trip-description">
                        Description (Optional)
                    </label>
                    <textarea
                        id="trip-description"
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="What makes this trip special? What are you planning to explore?"
                        maxLength={1000}
                        rows={4}
                    />
                    <small className="create-trip-char-count">
                        {form.description.length}/1000 characters
                    </small>
                </div>

                {error && (
                    <p className="create-trip-error" role="alert">
                        {error}
                    </p>
                )}

                <div className="create-trip-footer">
                    <p>
                        🔒 Your trip stays private until you
                        choose to share it.
                    </p>

                    <button type="submit" disabled={loading}>
                        {loading
                            ? 'Creating Trip...'
                            : '✈️ Create Trip'}
                    </button>
                </div>
            </form>
        </section>
    )
}

export default CreateTrip
