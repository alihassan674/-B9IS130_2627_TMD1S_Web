
const express = require('express')
const mongoose = require('mongoose')

const Trip = require('../models/Trip')
const JournalEntry = require('../models/JournalEntry')
const Photo = require('../models/Photo')

const router = express.Router()

// i'm not appling protect to /api/public, because visitors need to access shared trips without logging in

// PUBLIC: View a shared trip without logging in
router.get('/trips/:tripId', async (req, res) => {
    try {
        const { tripId } = req.params

        if (!mongoose.isValidObjectId(tripId)) {
            return res.status(400).json({
                message: 'Invalid trip ID',
            })
        }

        // Only public trips are accessible
        const trip = await Trip.findOne({
            _id: tripId,
            isPublic: true,
        }).select(
            'title destination startDate endDate description'
        )

        if (!trip) {
            return res.status(404).json({
                message: 'Public trip not found',
            })
        }

        // Fetch journal entries for the public trip
        const entries = await JournalEntry.find({
            trip: tripId,
        })
            .select('title entryDate content')
            .sort({ entryDate: 1, _id: 1 })
            .lean()

        // Fetch photos belonging to these entries
        const entryIds = entries.map((entry) => entry._id)

        const photos = await Photo.find({
            journalEntry: { $in: entryIds },
        })
            .select('journalEntry imageUrl caption')
            .sort({ createdAt: 1, _id: 1 })
            .lean()

        // Group photos by journal entry
        const entriesWithPhotos = entries.map((entry) => ({
            ...entry,
            photos: photos.filter(
                (photo) =>
                    String(photo.journalEntry) === String(entry._id)
            ),
        }))

        res.status(200).json({
            trip,
            entries: entriesWithPhotos,
        })
    } catch (error) {
        console.error(error)

        res.status(500).json({
            message: 'Failed to fetch public trip',
        })
    }
})

module.exports = router
