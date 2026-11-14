
const express = require('express')
const mongoose = require('mongoose')

const Trip = require('../models/Trip')
const JournalEntry = require('../models/JournalEntry')
const Photo = require('../models/Photo')
const protect = require('../middleware/authMiddleware')

const router = express.Router({ mergeParams: true })

// All photo routes require authentication
router.use(protect)

const allowedFields = [
    'imageUrl',
    'caption',
]

// Validate HTTP and HTTPS image URLs
const isValidImageUrl = (value) => {
    if (
        typeof value !== 'string' ||
        !/^https?:\/\//i.test(value) ||
        /[\s\\]/.test(value)
    ) {
        return false
    }

    try {
        const url = new URL(value)

        return (
            (
                url.protocol === 'https:' ||
                url.protocol === 'http:'
            ) &&
            Boolean(url.hostname) &&
            !url.username &&
            !url.password
        )
    } catch {
        return false
    }
}

// Validate photo creation and update input
const validatePhotoInput = (
    body,
    isUpdate = false
) => {
    if (
        !body ||
        typeof body !== 'object' ||
        Array.isArray(body)
    ) {
        return {
            error: 'A valid request body is required',
        }
    }

    const photoData = {}

    // Copy only permitted fields
    for (const field of allowedFields) {
        if (
            Object.prototype.hasOwnProperty.call(
                body,
                field
            )
        ) {
            photoData[field] = body[field]
        }
    }

    const providedFields = Object.keys(photoData)

    // Reject empty update requests
    if (isUpdate && providedFields.length === 0) {
        return {
            error: 'At least one valid photo field is required',
        }
    }

    // Image URL is required when creating a photo
    if (
        !isUpdate &&
        photoData.imageUrl === undefined
    ) {
        return {
            error: 'Image URL is required',
        }
    }

    // Validate image URL
    if (providedFields.includes('imageUrl')) {
        if (
            typeof photoData.imageUrl !== 'string' ||
            !photoData.imageUrl.trim()
        ) {
            return {
                error: 'Image URL must be a non-empty string',
            }
        }

        photoData.imageUrl =
            photoData.imageUrl.trim()

        if (photoData.imageUrl.length > 2000) {
            return {
                error: 'Image URL must not exceed 2000 characters',
            }
        }

        if (!isValidImageUrl(photoData.imageUrl)) {
            return {
                error: 'Please provide a valid HTTP or HTTPS image URL',
            }
        }
    }

    // Validate optional caption
    if (providedFields.includes('caption')) {
        if (typeof photoData.caption !== 'string') {
            return {
                error: 'Caption must be a string',
            }
        }

        photoData.caption =
            photoData.caption.trim()

        if (photoData.caption.length > 300) {
            return {
                error: 'Caption must not exceed 300 characters',
            }
        }
    }

    return { photoData }
}

// Check that the journal belongs to the logged-in user
router.use(async (req, res, next) => {
    try {
        const { entryId } = req.params

        if (!mongoose.isValidObjectId(entryId)) {
            return res.status(400).json({
                message: 'Invalid journal entry ID',
            })
        }

        const entry = await JournalEntry.findById(
            entryId
        )

        if (!entry) {
            return res.status(404).json({
                message: 'Journal entry not found',
            })
        }

        const trip = await Trip.findOne({
            _id: entry.trip,
            user: req.user.id,
        })

        if (!trip) {
            return res.status(404).json({
                message: 'Journal entry not found',
            })
        }

        req.journalEntry = entry
        next()
    } catch (error) {
        console.error(error)

        res.status(500).json({
            message: 'Failed to verify journal ownership',
        })
    }
})

// Validate photo IDs
router.param('photoId', (req, res, next, photoId) => {
    if (!mongoose.isValidObjectId(photoId)) {
        return res.status(400).json({
            message: 'Invalid photo ID',
        })
    }

    next()
})

// CREATE PHOTO
router.post('/', async (req, res) => {
    try {
        const { photoData, error } =
            validatePhotoInput(req.body)

        if (error) {
            return res.status(400).json({
                message: error,
            })
        }

        const photo = await Photo.create({
            ...photoData,
            journalEntry: req.journalEntry._id,
        })

        res.status(201).json({
            message: 'Photo added successfully',
            photo,
        })
    } catch (error) {
        if (
            error.name === 'ValidationError' ||
            error.name === 'CastError'
        ) {
            return res.status(400).json({
                message: error.message,
            })
        }

        console.error(error)

        res.status(500).json({
            message: 'Failed to add photo',
        })
    }
})

// GET ALL PHOTOS FOR A JOURNAL ENTRY
router.get('/', async (req, res) => {
    try {
        const photos = await Photo.find({
            journalEntry: req.journalEntry._id,
        }).sort({ createdAt: 1 })

        res.status(200).json({ photos })
    } catch (error) {
        console.error(error)

        res.status(500).json({
            message: 'Failed to fetch photos',
        })
    }
})

// GET ONE PHOTO
router.get('/:photoId', async (req, res) => {
    try {
        const photo = await Photo.findOne({
            _id: req.params.photoId,
            journalEntry: req.journalEntry._id,
        })

        if (!photo) {
            return res.status(404).json({
                message: 'Photo not found',
            })
        }

        res.status(200).json({ photo })
    } catch (error) {
        console.error(error)

        res.status(500).json({
            message: 'Failed to fetch photo',
        })
    }
})

// UPDATE PHOTO
router.put('/:photoId', async (req, res) => {
    try {
        // Verify that the photo belongs to this journal
        const photo = await Photo.findOne({
            _id: req.params.photoId,
            journalEntry: req.journalEntry._id,
        })

        if (!photo) {
            return res.status(404).json({
                message: 'Photo not found',
            })
        }

        const { photoData, error } =
            validatePhotoInput(req.body, true)

        if (error) {
            return res.status(400).json({
                message: error,
            })
        }

        // Update only validated permitted fields
        for (const field of Object.keys(photoData)) {
            photo[field] = photoData[field]
        }

        await photo.save()

        res.status(200).json({
            message: 'Photo updated successfully',
            photo,
        })
    } catch (error) {
        if (
            error.name === 'ValidationError' ||
            error.name === 'CastError'
        ) {
            return res.status(400).json({
                message: error.message,
            })
        }

        console.error(error)

        res.status(500).json({
            message: 'Failed to update photo',
        })
    }
})

// DELETE PHOTO
router.delete('/:photoId', async (req, res) => {
    try {
        const photo = await Photo.findOneAndDelete({
            _id: req.params.photoId,
            journalEntry: req.journalEntry._id,
        })

        if (!photo) {
            return res.status(404).json({
                message: 'Photo not found',
            })
        }

        res.status(200).json({
            message: 'Photo deleted successfully',
        })
    } catch (error) {
        console.error(error)

        res.status(500).json({
            message: 'Failed to delete photo',
        })
    }
})

module.exports = router
