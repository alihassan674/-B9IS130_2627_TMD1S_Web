
const express = require('express')
const mongoose = require('mongoose')

const Trip = require('../models/Trip')
const JournalEntry = require('../models/JournalEntry')
const protect = require('../middleware/authMiddleware')
const Photo = require('../models/Photo')

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

// DELETE /api/trips/:tripId/journals/:entryId
// Delete an owned journal entry and its photos
router.delete('/:entryId', async (req, res) => {
    let session

    try {
        const { tripId, entryId } = req.params

        // Validate both MongoDB IDs
        if (
            !mongoose.isValidObjectId(tripId) ||
            !mongoose.isValidObjectId(entryId)
        ) {
            return res.status(400).json({
                message: 'Invalid trip or journal entry ID',
            })
        }

        session = await mongoose.startSession()

        await session.withTransaction(async () => {
            // Verify trip ownership
            const trip = await Trip.findOne({
                _id: tripId,
                user: req.user.id,
            }).session(session)

            if (!trip) {
                const error = new Error('Trip not found')
                error.statusCode = 404
                throw error
            }

            // Verify the journal belongs to this trip
            const entry = await JournalEntry.findOne({
                _id: entryId,
                trip: trip._id,
            }).session(session)

            if (!entry) {
                const error = new Error(
                    'Journal entry not found'
                )
                error.statusCode = 404
                throw error
            }

            // Delete all photos belonging to this journal
            await Photo.deleteMany({
                journalEntry: entry._id,
            }).session(session)

            // Delete the journal entry
            await JournalEntry.deleteOne({
                _id: entry._id,
                trip: trip._id,
            }).session(session)
        })

        res.status(200).json({
            message:
                'Journal entry and related photos deleted successfully',
        })
    } catch (error) {
        if (error.statusCode === 404) {
            return res.status(404).json({
                message: error.message,
            })
        }

        console.error(error)

        res.status(500).json({
            message: 'Failed to delete journal entry',
        })
    } finally {
        if (session) {
            await session.endSession()
        }
    }
})


module.exports = router
