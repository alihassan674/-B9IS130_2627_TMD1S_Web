
import { useState } from 'react'

function EditTrip({ trip, onTripUpdated, onCancel }) {
    const formatDate = (date) => date.slice(0, 10)

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
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (form.endDate < form.startDate) {
            setError('End date cannot be before start date')
            return
        }

        setLoading(true)

        try {
            const token = sessionStorage.getItem('token')

            const response = await fetch(`/api/trips/${trip._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(form),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || 'Failed to update trip')
            }

            onTripUpdated(data.trip)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <section>
            <h3>Edit Trip</h3>

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="edit-title">Trip Title</label>
                    <input
                        id="edit-title"
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        maxLength={100}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="edit-destination">Destination</label>
                    <input
                        id="edit-destination"
                        type="text"
                        name="destination"
                        value={form.destination}
                        onChange={handleChange}
                        maxLength={100}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="edit-start-date">Start Date</label>
                    <input
                        id="edit-start-date"
                        type="date"
                        name="startDate"
                        value={form.startDate}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="edit-end-date">End Date</label>
                    <input
                        id="edit-end-date"
                        type="date"
                        name="endDate"
                        value={form.endDate}
                        min={form.startDate}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="edit-description">Description</label>
                    <textarea
                        id="edit-description"
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        maxLength={1000}
                        rows={3}
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

export default EditTrip
