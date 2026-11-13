
import { useEffect, useState } from 'react'

function PhotoGallery({ entryId }) {
    const [photos, setPhotos] = useState([])
    const [imageUrl, setImageUrl] = useState('')
    const [caption, setCaption] = useState('')
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const [editingId, setEditingId] = useState(null)
    const [editUrl, setEditUrl] = useState('')
    const [editCaption, setEditCaption] = useState('')
    const [updating, setUpdating] = useState(false)
    const [deletingId, setDeletingId] = useState(null)
    const [brokenImages, setBrokenImages] = useState({})

    useEffect(() => {
        let active = true

        const fetchPhotos = async () => {
            setLoading(true)
            setError('')
            setPhotos([])
            setEditingId(null)

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
                    throw new Error(data.message || 'Failed to load photos')
                }

                if (active) setPhotos(data.photos)
            } catch (err) {
                if (active) setError(err.message)
            } finally {
                if (active) setLoading(false)
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
                    body: JSON.stringify({ imageUrl, caption }),
                }
            )

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || 'Failed to add photo')
            }

            setPhotos((previous) => [...previous, data.photo])
            setImageUrl('')
            setCaption('')
        } catch (err) {
            setError(err.message)
        } finally {
            setSaving(false)
        }
    }

    const startEditing = (photo) => {
        setEditingId(photo._id)
        setEditUrl(photo.imageUrl)
        setEditCaption(photo.caption || '')
        setError('')
    }

    const cancelEditing = () => {
        setEditingId(null)
        setEditUrl('')
        setEditCaption('')
    }

    const handleUpdate = async (e) => {
        e.preventDefault()
        setError('')
        setUpdating(true)

        try {
            const token = sessionStorage.getItem('token')
            const response = await fetch(
                `/api/journals/${entryId}/photos/${editingId}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        imageUrl: editUrl,
                        caption: editCaption,
                    }),
                }
            )

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || 'Failed to update photo')
            }

            setPhotos((previous) =>
                previous.map((photo) =>
                    photo._id === data.photo._id
                        ? data.photo
                        : photo
                )
            )

            setBrokenImages((previous) => {
                const next = { ...previous }
                delete next[data.photo._id]
                return next
            })

            cancelEditing()
        } catch (err) {
            setError(err.message)
        } finally {
            setUpdating(false)
        }
    }

    const handleDelete = async (photoId) => {
        const confirmed = window.confirm(
            'Are you sure you want to delete this photo?'
        )

        if (!confirmed) return

        setError('')
        setDeletingId(photoId)

        try {
            const token = sessionStorage.getItem('token')
            const response = await fetch(
                `/api/journals/${entryId}/photos/${photoId}`,
                {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || 'Failed to delete photo')
            }

            setPhotos((previous) =>
                previous.filter((photo) => photo._id !== photoId)
            )

            if (editingId === photoId) cancelEditing()
        } catch (err) {
            setError(err.message)
        } finally {
            setDeletingId(null)
        }
    }

    return (
        <section className="photo-gallery">
            <div className="photo-gallery-header">
                <div>
                    <h5>📸 Travel Photos</h5>
                    <p>Save the moments that made your trip special.</p>
                </div>

                <span className="photo-gallery-count">
                    {photos.length} {photos.length === 1 ? 'Photo' : 'Photos'}
                </span>
            </div>

            <form
                className="photo-add-form"
                onSubmit={handleSubmit}
            >
                <h6>Add a New Photo</h6>

                <div className="photo-form-field">
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

                <div className="photo-form-field">
                    <label htmlFor={`photo-caption-${entryId}`}>
                        Caption (optional)
                    </label>
                    <input
                        id={`photo-caption-${entryId}`}
                        type="text"
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        placeholder="Describe this beautiful moment..."
                        maxLength={300}
                    />
                </div>

                <button type="submit" disabled={saving}>
                    {saving ? 'Adding Photo...' : '+ Add Photo'}
                </button>
            </form>

            {error && (
                <p className="photo-gallery-error" role="alert">
                    {error}
                </p>
            )}

            {loading ? (
                <p className="photo-gallery-loading">
                    Loading photos...
                </p>
            ) : photos.length === 0 ? (
                <div className="photo-gallery-empty">
                    <span>📷</span>
                    <h6>No photos added yet</h6>
                    <p>Add your first travel memory using a photo URL.</p>
                </div>
            ) : (
                <div className="photo-gallery-grid">
                    {photos.map((photo) => (
                        <figure
                            className="photo-gallery-card"
                            key={photo._id}
                        >
                            {brokenImages[photo._id] === photo.imageUrl ? (
                                <div className="photo-image-fallback">
                                    <span>🖼️</span>
                                    <p>Image unavailable</p>
                                </div>
                            ) : (
                                <img
                                    src={photo.imageUrl}
                                    alt={photo.caption || 'Travel photo'}
                                    loading="lazy"
                                    referrerPolicy="no-referrer"
                                    onError={() =>
                                        setBrokenImages((previous) => ({
                                            ...previous,
                                            [photo._id]: photo.imageUrl,
                                        }))
                                    }
                                />
                            )}

                            <div className="photo-gallery-card-body">
                                {photo.caption && (
                                    <figcaption>{photo.caption}</figcaption>
                                )}

                                {editingId === photo._id ? (
                                    <form
                                        className="photo-edit-form"
                                        onSubmit={handleUpdate}
                                    >
                                        <div className="photo-form-field">
                                            <label htmlFor={`edit-url-${photo._id}`}>
                                                Edit Photo URL
                                            </label>
                                            <input
                                                id={`edit-url-${photo._id}`}
                                                type="url"
                                                value={editUrl}
                                                onChange={(e) => setEditUrl(e.target.value)}
                                                maxLength={2000}
                                                required
                                            />
                                        </div>

                                        <div className="photo-form-field">
                                            <label htmlFor={`edit-caption-${photo._id}`}>
                                                Edit Caption
                                            </label>
                                            <input
                                                id={`edit-caption-${photo._id}`}
                                                type="text"
                                                value={editCaption}
                                                onChange={(e) => setEditCaption(e.target.value)}
                                                maxLength={300}
                                            />
                                        </div>

                                        <div className="photo-gallery-actions">
                                            <button type="submit" disabled={updating}>
                                                {updating ? 'Saving...' : 'Save Changes'}
                                            </button>

                                            <button
                                                type="button"
                                                className="photo-btn-secondary"
                                                onClick={cancelEditing}
                                                disabled={updating}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="photo-gallery-actions">
                                        <button
                                            type="button"
                                            className="photo-btn-secondary"
                                            onClick={() => startEditing(photo)}
                                        >
                                            ✏️ Edit
                                        </button>

                                        <button
                                            type="button"
                                            className="photo-btn-danger"
                                            onClick={() => handleDelete(photo._id)}
                                            disabled={deletingId === photo._id}
                                        >
                                            {deletingId === photo._id
                                                ? 'Deleting...'
                                                : '🗑️ Delete'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </figure>
                    ))}
                </div>
            )}
        </section>
    )
}

export default PhotoGallery
