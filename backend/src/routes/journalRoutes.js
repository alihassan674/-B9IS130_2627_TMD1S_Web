
const express = require('express')
const mongoose = require('mongoose')

const Trip = require('../models/Trip')
const JournalEntry = require('../models/JournalEntry')
const protect = require('../middleware/authMiddleware')
const Photo = require('../models/Photo')

const router = express.Router({ mergeParams: true })

// All journal routes require authentication
router.use(protect)

const allowedFields = [
    'title',
    'entryDate',
    'content',
]

// Validate date format and actual calendar date
const isValidDate = (value) => {
    if (
        typeof value !== 'string' ||
        !/^\d{4}-\d{2}-\d{2}$/.test(value)
    ) {
        return false
    }

    const date = new Date(value)

    return (
        !Number.isNaN(date.getTime()) &&
        date.toISOString().slice(0, 10) === value
    )
}

// Validate journal creation and update input
const validateJournalInput = (
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

    const journalData = {}

    // Copy only permitted fields
    for (const field of allowedFields) {
        if (
            Object.prototype.hasOwnProperty.call(
                body,
                field
            )
        ) {
            journalData[field] = body[field]
        }
    }

    const providedFields = Object.keys(journalData)

    // Reject empty update requests
    if (isUpdate && providedFields.length === 0) {
        return {
            error: 'At least one valid journal field is required',
        }
    }

    // Required fields for new journal entries
    if (!isUpdate) {
        for (const field of allowedFields) {
            if (journalData[field] === undefined) {
                return {
                    error: `${field} is required`,
                }
            }
        }
    }

    // Validate journal title
    if (providedFields.includes('title')) {
        if (
            typeof journalData.title !== 'string' ||
            !journalData.title.trim()
        ) {
            return {
                error: 'Title must be a non-empty string',
            }
        }

        journalData.title = journalData.title.trim()

        if (journalData.title.length > 150) {
            return {
                error: 'Title must not exceed 150 characters',
            }
        }
    }

    // Validate journal entry date
    if (providedFields.includes('entryDate')) {
        if (!isValidDate(journalData.entryDate)) {
            return {
                error: 'Entry date must be a valid date in YYYY-MM-DD format',
            }
        }
    }

    // Validate journal content
    if (providedFields.includes('content')) {
        if (
            typeof journalData.content !== 'string' ||
            !journalData.content.trim()
        ) {
            return {
                error: 'Content must be a non-empty string',
            }
        }

        journalData.content = journalData.content.trim()

        if (journalData.content.length > 5000) {
            return {
                error: 'Content must not exceed 5000 characters',
            }
        }
    }

    return { journalData }
}

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

// Check journal entry ID format
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
        const { journalData, error } =
            validateJournalInput(req.body)

        if (error) {
            return res.status(400).json({
                message: error,
            })
        }

        const entry = await JournalEntry.create({
            ...journalData,
            trip: req.trip._id,
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
        // Verify that the journal belongs to this trip
        const entry = await JournalEntry.findOne({
            _id: req.params.entryId,
            trip: req.trip._id,
        })

        if (!entry) {
            return res.status(404).json({
                message: 'Journal entry not found',
            })
        }

        const { journalData, error } =
            validateJournalInput(req.body, true)

        if (error) {
            return res.status(400).json({
                message: error,
            })
        }

        // Update only validated permitted fields
        for (const field of Object.keys(journalData)) {
            entry[field] = journalData[field]
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
