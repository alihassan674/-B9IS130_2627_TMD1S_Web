
import { useState } from 'react'

function CreateTrip({ onTripCreated }) {
    const [form, setForm] = useState({
        title: '',
        destination: '',
        startDate: '',
        endDate: '',
        description: '',
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

            const response = await fetch('/api/trips', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(form),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || 'Failed to create trip')
            }

            onTripCreated(data.trip)

            setForm({
                title: '',
                destination: '',
                startDate: '',
                endDate: '',
                description: '',
            })
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <section>
            <h3>Create New Trip</h3>

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="trip-title">Trip Title</label>
                    <input
                        id="trip-title"
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        maxLength={100}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="destination">Destination</label>
                    <input
                        id="destination"
                        type="text"
                        name="destination"
                        value={form.destination}
                        onChange={handleChange}
                        maxLength={100}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="start-date">Start Date</label>
                    <input
                        id="start-date"
                        type="date"
                        name="startDate"
                        value={form.startDate}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="end-date">End Date</label>
                    <input
                        id="end-date"
                        type="date"
                        name="endDate"
                        value={form.endDate}
                        min={form.startDate}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="trip-description">
                        Description (Optional)
                    </label>
                    <textarea
                        id="trip-description"
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        maxLength={1000}
                        rows={3}
                    />
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? 'Creating Trip...' : 'Create Trip'}
                </button>
            </form>

            {error && <p role="alert">{error}</p>}
        </section>
    )
}

export default CreateTrip
