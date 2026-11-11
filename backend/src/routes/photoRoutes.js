
const express = require('express')
const mongoose = require('mongoose')

const Trip = require('../models/Trip')
const JournalEntry = require('../models/JournalEntry')
const Photo = require('../models/Photo')
const protect = require('../middleware/authMiddleware')

const router = express.Router({ mergeParams: true })

// All photo routes require authentication
router.use(protect)

// Check that the journal belongs to the logged-in user
router.use(async (req, res, next) => {
    try {
        const { entryId } = req.params

        if (!mongoose.isValidObjectId(entryId)) {
            return res.status(400).json({
                message: 'Invalid journal entry ID',
            })
        }

        const entry = await JournalEntry.findById(entryId)

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
        const { imageUrl, caption } = req.body

        const photo = await Photo.create({
            journalEntry: req.journalEntry._id,
            imageUrl,
            caption,
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
        const photo = await Photo.findOne({
            _id: req.params.photoId,
            journalEntry: req.journalEntry._id,
        })

        if (!photo) {
            return res.status(404).json({
                message: 'Photo not found',
            })
        }

        const { imageUrl, caption } = req.body

        if (imageUrl !== undefined) {
            photo.imageUrl = imageUrl
        }

        if (caption !== undefined) {
            photo.caption = caption
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
