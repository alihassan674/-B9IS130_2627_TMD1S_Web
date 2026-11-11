
const mongoose = require('mongoose')

const expenseSchema = new mongoose.Schema(
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

        amount: {
            type: Number,
            required: true,
            min: 0.01,
            validate: {
                validator: Number.isFinite,
                message: 'Amount must be a valid number',
            },
        },

        category: {
            type: String,
            required: true,
            enum: [
                'Accommodation',
                'Transport',
                'Food',
                'Activities',
                'Shopping',
                'Other',
            ],
        },

        expenseDate: {
            type: Date,
            required: true,
        },

        notes: {
            type: String,
            trim: true,
            default: '',
            maxlength: 1000,
        },
    },
    {
        timestamps: true,
    }
)

// Quickly find expenses for a trip in date order
expenseSchema.index({ trip: 1, expenseDate: 1 })

module.exports = mongoose.model('Expense', expenseSchema)
