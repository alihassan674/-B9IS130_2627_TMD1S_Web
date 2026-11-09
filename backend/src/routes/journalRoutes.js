
const express = require('express')
const mongoose = require('mongoose')

const Trip = require('../models/Trip')
const JournalEntry = require('../models/JournalEntry')
const protect = require('../middleware/authMiddleware')

const router = express.Router({ mergeParams: true })

// All journal routes require authentication
router.use(protect)

// Check that the logged-in user owns the trip
router.use(async (req, res, next) => {
    try {
        if (!mongoose.isValidObjectId(req.params.tripId)) {
            return res.status(400).json({
                message: 'Invalid trip ID',
            })
        }

        const trip = await Trip.findOne({
            _id: req.params.tripId,
            user: req.user.id,
        })

        if (!trip) {
            return res.status(404).json({
                message: 'Trip not found',
            })
        }

        req.trip = trip
        next()
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: 'Failed to verify trip ownership',
        })
    }
})

// Check entry ID format
router.param('entryId', (req, res, next, entryId) => {
    if (!mongoose.isValidObjectId(entryId)) {
        return res.status(400).json({
            message: 'Invalid journal entry ID',
        })
    }

    next()
})

// POST - Create a journal entry
router.post('/', async (req, res) => {
    try {
        const { title, entryDate, content } = req.body

        const entry = await JournalEntry.create({
            trip: req.trip._id,
            title,
            entryDate,
            content,
        })

        res.status(201).json({
            message: 'Journal entry created successfully',
            entry,
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
            message: 'Failed to create journal entry',
        })
    }
})

// GET - View all journal entries for this trip
router.get('/', async (req, res) => {
    try {
        const entries = await JournalEntry.find({
            trip: req.trip._id,
        }).sort({ entryDate: 1, createdAt: 1 })

        res.status(200).json({ entries })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: 'Failed to fetch journal entries',
        })
    }
})

// GET - View one journal entry
router.get('/:entryId', async (req, res) => {
    try {
        const entry = await JournalEntry.findOne({
            _id: req.params.entryId,
            trip: req.trip._id,
        })

        if (!entry) {
            return res.status(404).json({
                message: 'Journal entry not found',
            })
        }

        res.status(200).json({ entry })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: 'Failed to fetch journal entry',
        })
    }
})

// PUT - Update a journal entry
router.put('/:entryId', async (req, res) => {
    try {
        const entry = await JournalEntry.findOne({
            _id: req.params.entryId,
            trip: req.trip._id,
        })

        if (!entry) {
            return res.status(404).json({
                message: 'Journal entry not found',
            })
        }

        const allowedFields = ['title', 'entryDate', 'content']

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                entry[field] = req.body[field]
            }
        }

        await entry.save()

        res.status(200).json({
            message: 'Journal entry updated successfully',
            entry,
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
            message: 'Failed to update journal entry',
        })
    }
})

// DELETE - Delete a journal entry
router.delete('/:entryId', async (req, res) => {
    try {
        const entry = await JournalEntry.findOneAndDelete({
            _id: req.params.entryId,
            trip: req.trip._id,
        })

        if (!entry) {
            return res.status(404).json({
                message: 'Journal entry not found',
            })
        }

        res.status(200).json({
            message: 'Journal entry deleted successfully',
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: 'Failed to delete journal entry',
        })
    }
})

module.exports = router
