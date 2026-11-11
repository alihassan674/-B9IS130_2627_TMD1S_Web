
import { useEffect, useState } from 'react'

function PhotoGallery({ entryId }) {
    const [photos, setPhotos] = useState([])
    const [imageUrl, setImageUrl] = useState('')
    const [caption, setCaption] = useState('')
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        let active = true

        const fetchPhotos = async () => {
            setLoading(true)
            setError('')
            setPhotos([])

            try {
                const token = sessionStorage.getItem('token')

                const response = await fetch(
                    `/api/journals/${entryId}/photos`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )

                const data = await response.json()

                if (!response.ok) {
                    throw new Error(
                        data.message || 'Failed to load photos'
                    )
                }

                if (active) {
                    setPhotos(data.photos)
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

        fetchPhotos()

        return () => {
            active = false
        }
    }, [entryId])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSaving(true)

        try {
            const token = sessionStorage.getItem('token')

            const response = await fetch(
                `/api/journals/${entryId}/photos`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        imageUrl,
                        caption,
                    }),
                }
            )

            const data = await response.json()

            if (!response.ok) {
                throw new Error(
                    data.message || 'Failed to add photo'
                )
            }

            setPhotos((previousPhotos) => [
                ...previousPhotos,
                data.photo,
            ])

            setImageUrl('')
            setCaption('')
        } catch (err) {
            setError(err.message)
        } finally {
            setSaving(false)
        }
    }

    return (
        <section>
            <h5>Travel Photos</h5>

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor={`photo-url-${entryId}`}>
                        Photo URL
                    </label>

                    <input
                        id={`photo-url-${entryId}`}
                        type="url"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="https://example.com/photo.jpg"
                        maxLength={2000}
                        required
                    />
                </div>

                <div>
                    <label htmlFor={`photo-caption-${entryId}`}>
                        Caption (optional)
                    </label>

                    <input
                        id={`photo-caption-${entryId}`}
                        type="text"
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        placeholder="Describe this memory"
                        maxLength={300}
                    />
                </div>

                <button type="submit" disabled={saving}>
                    {saving ? 'Adding Photo...' : 'Add Photo'}
                </button>
            </form>

            {error && <p role="alert">{error}</p>}

            {loading ? (
                <p>Loading photos...</p>
            ) : photos.length === 0 ? (
                <p>No photos added yet.</p>
            ) : (
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns:
                            'repeat(auto-fit, minmax(180px, 1fr))',
                        gap: '12px',
                        marginTop: '15px',
                    }}
                >
                    {photos.map((photo) => (
                        <figure
                            key={photo._id}
                            style={{
                                margin: 0,
                                padding: '8px',
                                border: '1px solid #ddd',
                                borderRadius: '8px',
                            }}
                        >
                            <img
                                src={photo.imageUrl}
                                alt={photo.caption || 'Travel photo'}
                                loading="lazy"
                                referrerPolicy="no-referrer"
                                style={{
                                    width: '100%',
                                    height: '160px',
                                    objectFit: 'cover',
                                    borderRadius: '6px',
                                }}
                            />

                            {photo.caption && (
                                <figcaption
                                    style={{
                                        marginTop: '8px',
                                        fontSize: '14px',
                                    }}
                                >
                                    {photo.caption}
                                </figcaption>
                            )}
                        </figure>
                    ))}
                </div>
            )}
        </section>
    )
}

export default PhotoGallery
