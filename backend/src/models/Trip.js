
const mongoose = require('mongoose')

const tripSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },

        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100,
        },

        destination: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100,
        },

        startDate: {
            type: Date,
            required: true,
        },

        endDate: {
            type: Date,
            required: true,
            validate: {
                validator: function (value) {
                    return !this.startDate || value >= this.startDate
                },
                message: 'End date must be on or after start date',
            },
        },

        description: {
            type: String,
            trim: true,
            default: '',
            maxlength: 1000,
        },

        isPublic: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('Trip', tripSchema)
