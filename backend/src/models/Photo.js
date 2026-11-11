
const mongoose = require('mongoose')

const photoSchema = new mongoose.Schema(
    {
        journalEntry: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'JournalEntry',
            required: true,
        },

        imageUrl: {
            type: String,
            required: true,
            trim: true,
            maxlength: 2000,
            validate: {
                validator: function (value) {
                    try {
                        const url = new URL(value)
                        return (
                            url.protocol === 'https:' ||
                            url.protocol === 'http:'
                        )
                    } catch {
                        return false
                    }
                },
                message: 'Please provide a valid HTTP or HTTPS image URL',
            },
        },

        caption: {
            type: String,
            trim: true,
            default: '',
            maxlength: 300,
        },
    },
    {
        timestamps: true,
    }
)

// Find photos belonging to a journal entry
photoSchema.index({ journalEntry: 1 })

module.exports = mongoose.model('Photo', photoSchema)
