
const express = require('express')
const mongoose = require('mongoose')
const Trip = require('../models/Trip')
const JournalEntry = require('../models/JournalEntry')
const Photo = require('../models/Photo')
const Expense = require('../models/Expense')
const protect = require('../middleware/authMiddleware')

const router = express.Router()

// All routes require a valid JWT
router.use(protect)

const allowedFields = [
    'title',
    'destination',
    'startDate',
    'endDate',
    'description',
    'isPublic',
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

// Validate trip creation and update input
const validateTripInput = (body, existingTrip = null) => {
    if (
        !body ||
        typeof body !== 'object' ||
        Array.isArray(body)
    ) {
        return {
            error: 'A valid request body is required',
        }
    }

    const tripData = {}

    // Copy only permitted fields
    for (const field of allowedFields) {
        if (Object.prototype.hasOwnProperty.call(body, field)) {
            tripData[field] = body[field]
        }
    }

    const providedFields = Object.keys(tripData)

    // Reject empty update requests
    if (existingTrip && providedFields.length === 0) {
        return {
            error: 'At least one valid trip field is required',
        }
    }

    // Required fields for new trips
    if (!existingTrip) {
        const requiredFields = [
            'title',
            'destination',
            'startDate',
            'endDate',
        ]

        for (const field of requiredFields) {
            if (tripData[field] === undefined) {
                return {
                    error: `${field} is required`,
                }
            }
        }
    }

    // Validate title
    if (providedFields.includes('title')) {
        if (
            typeof tripData.title !== 'string' ||
            !tripData.title.trim()
        ) {
            return {
                error: 'Title must be a non-empty string',
            }
        }

        tripData.title = tripData.title.trim()

        if (tripData.title.length > 100) {
            return {
                error: 'Title must not exceed 100 characters',
            }
        }
    }

    // Validate destination
    if (providedFields.includes('destination')) {
        if (
            typeof tripData.destination !== 'string' ||
            !tripData.destination.trim()
        ) {
            return {
                error: 'Destination must be a non-empty string',
            }
        }

        tripData.destination = tripData.destination.trim()

        if (tripData.destination.length > 100) {
            return {
                error: 'Destination must not exceed 100 characters',
            }
        }
    }

    // Validate optional description
    if (providedFields.includes('description')) {
        if (typeof tripData.description !== 'string') {
            return {
                error: 'Description must be a string',
            }
        }

        tripData.description = tripData.description.trim()

        if (tripData.description.length > 1000) {
            return {
                error: 'Description must not exceed 1000 characters',
            }
        }
    }

    // Validate start date
    if (providedFields.includes('startDate')) {
        if (!isValidDate(tripData.startDate)) {
            return {
                error: 'Start date must be a valid date in YYYY-MM-DD format',
            }
        }
    }

    // Validate end date
    if (providedFields.includes('endDate')) {
        if (!isValidDate(tripData.endDate)) {
            return {
                error: 'End date must be a valid date in YYYY-MM-DD format',
            }
        }
    }

    // Use existing dates when performing partial updates
    const startDate = providedFields.includes('startDate')
        ? new Date(tripData.startDate)
        : existingTrip?.startDate

    const endDate = providedFields.includes('endDate')
        ? new Date(tripData.endDate)
        : existingTrip?.endDate

    if (startDate && endDate && endDate < startDate) {
        return {
            error: 'End date must be on or after start date',
        }
    }

    // Validate public sharing value
    if (
        providedFields.includes('isPublic') &&
        typeof tripData.isPublic !== 'boolean'
    ) {
        return {
            error: 'isPublic must be true or false',
        }
    }

    return { tripData }
}

// POST /api/trips - Create a new trip
router.post('/', async (req, res) => {
    try {
        const { tripData, error } = validateTripInput(req.body)

        if (error) {
            return res.status(400).json({
                message: error,
            })
        }

        const trip = await Trip.create({
            ...tripData,
            user: req.user.id,
        })

        res.status(201).json({
            message: 'Trip created successfully',
            trip,
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
            message: 'Failed to create trip',
        })
    }
})

// GET /api/trips - Get logged-in user's trips
router.get('/', async (req, res) => {
    try {
        const trips = await Trip.find({
            user: req.user.id,
        }).sort({ startDate: -1 })

        res.status(200).json({ trips })
    } catch (error) {
        console.error(error)

        res.status(500).json({
            message: 'Failed to fetch trips',
        })
    }
})

// Validate trip ID before accessing ID-based routes
router.param('id', (req, res, next, id) => {
    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({
            message: 'Invalid trip ID',
        })
    }

    next()
})

// GET /api/trips/:id - Get one owned trip
router.get('/:id', async (req, res) => {
    try {
        const trip = await Trip.findOne({
            _id: req.params.id,
            user: req.user.id,
        })

        if (!trip) {
            return res.status(404).json({
                message: 'Trip not found',
            })
        }

        res.status(200).json({ trip })
    } catch (error) {
        console.error(error)

        res.status(500).json({
            message: 'Failed to fetch trip',
        })
    }
})

// PUT /api/trips/:id - Update an owned trip
router.put('/:id', async (req, res) => {
    try {
        // Verify ownership before updating
        const trip = await Trip.findOne({
            _id: req.params.id,
            user: req.user.id,
        })

        if (!trip) {
            return res.status(404).json({
                message: 'Trip not found',
            })
        }

        const { tripData, error } = validateTripInput(
            req.body,
            trip
        )

        if (error) {
            return res.status(400).json({
                message: error,
            })
        }

        // Update only validated permitted fields
        for (const field of Object.keys(tripData)) {
            trip[field] = tripData[field]
        }

        await trip.save()

        res.status(200).json({
            message: 'Trip updated successfully',
            trip,
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
            message: 'Failed to update trip',
        })
    }
})

// DELETE /api/trips/:id
// Delete an owned trip and its related data
router.delete('/:id', async (req, res) => {
    let session

    try {
        session = await mongoose.startSession()

        await session.withTransaction(async () => {
            // Verify ownership before deleting anything
            const trip = await Trip.findOne({
                _id: req.params.id,
                user: req.user.id,
            }).session(session)

            if (!trip) {
                const error = new Error('Trip not found')
                error.statusCode = 404
                throw error
            }

            // Find associated journal entries
            const entries = await JournalEntry.find({
                trip: trip._id,
            })
                .select('_id')
                .session(session)

            const entryIds = entries.map(
                (entry) => entry._id
            )

            // Delete photos belonging to journal entries
            await Photo.deleteMany({
                journalEntry: { $in: entryIds },
            }).session(session)

            // Delete journal entries
            await JournalEntry.deleteMany({
                trip: trip._id,
            }).session(session)

            // Delete expenses
            await Expense.deleteMany({
                trip: trip._id,
            }).session(session)

            // Finally delete the trip
            await Trip.deleteOne({
                _id: trip._id,
                user: req.user.id,
            }).session(session)
        })

        res.status(200).json({
            message:
                'Trip and related records deleted successfully',
        })
    } catch (error) {
        if (error.statusCode === 404) {
            return res.status(404).json({
                message: 'Trip not found',
            })
        }

        console.error(error)

        res.status(500).json({
            message: 'Failed to delete trip',
        })
    } finally {
        if (session) {
            await session.endSession()
        }
    }
})

module.exports = router
