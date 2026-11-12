
const express = require('express')
const mongoose = require('mongoose')
const Trip = require('../models/Trip')
const protect = require('../middleware/authMiddleware')

const router = express.Router()

// All routes below require a valid JWT
router.use(protect)

const allowedFields = [
    'title',
    'destination',
    'startDate',
    'endDate',
    'description',
    'isPublic', // NEW: Allow public sharing
]

// POST /api/trips - Create a new trip
router.post('/', async (req, res) => {
    try {
        const tripData = {}

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                tripData[field] = req.body[field]
            }
        }

        // NEW: Validate isPublic when provided
        if (
            tripData.isPublic !== undefined &&
            typeof tripData.isPublic !== 'boolean'
        ) {
            return res.status(400).json({
                message: 'isPublic must be true or false',
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

// GET /api/trips - Get the logged-in user's trips
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
        const trip = await Trip.findOne({
            _id: req.params.id,
            user: req.user.id,
        })

        if (!trip) {
            return res.status(404).json({
                message: 'Trip not found',
            })
        }

        // NEW: Validate public sharing value
        if (
            req.body.isPublic !== undefined &&
            typeof req.body.isPublic !== 'boolean'
        ) {
            return res.status(400).json({
                message: 'isPublic must be true or false',
            })
        }

        // Update only permitted fields
        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                trip[field] = req.body[field]
            }
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

// DELETE /api/trips/:id - Delete an owned trip
router.delete('/:id', async (req, res) => {
    try {
        const trip = await Trip.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id,
        })

        if (!trip) {
            return res.status(404).json({
                message: 'Trip not found',
            })
        }

        res.status(200).json({
            message: 'Trip deleted successfully',
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: 'Failed to delete trip',
        })
    }
})

module.exports = router
