
const mongoose = require('mongoose')

const journalEntrySchema = new mongoose.Schema(
    {
        trip: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Trip',
            required: true,
        },

        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 150,
        },

        entryDate: {
            type: Date,
            required: true,
        },

        content: {
            type: String,
            required: true,
            trim: true,
            maxlength: 5000,
        },
    },
    {
        timestamps: true,
    }
)

// Retrieve journal entries efficiently by trip and date
journalEntrySchema.index({ trip: 1, entryDate: 1 })

module.exports = mongoose.model(
    'JournalEntry',
    journalEntrySchema
)
