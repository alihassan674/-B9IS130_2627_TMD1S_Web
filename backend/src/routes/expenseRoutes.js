
const express = require('express')
const mongoose = require('mongoose')

const Trip = require('../models/Trip')
const Expense = require('../models/Expense')
const protect = require('../middleware/authMiddleware')

const router = express.Router({ mergeParams: true })

// All expense routes require authentication
router.use(protect)

const allowedFields = [
    'title',
    'amount',
    'category',
    'expenseDate',
    'notes',
]

const allowedCategories = [
    'Accommodation',
    'Transport',
    'Food',
    'Activities',
    'Shopping',
    'Other',
]

// Validate real calendar dates
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

// Validate expense creation and update input
const validateExpenseInput = (
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

    const expenseData = {}

    // Copy only permitted fields
    for (const field of allowedFields) {
        if (
            Object.prototype.hasOwnProperty.call(
                body,
                field
            )
        ) {
            expenseData[field] = body[field]
        }
    }

    const providedFields = Object.keys(expenseData)

    // Reject empty update requests
    if (isUpdate && providedFields.length === 0) {
        return {
            error: 'At least one valid expense field is required',
        }
    }

    // Required fields for expense creation
    if (!isUpdate) {
        const requiredFields = [
            'title',
            'amount',
            'category',
            'expenseDate',
        ]

        for (const field of requiredFields) {
            if (expenseData[field] === undefined) {
                return {
                    error: `${field} is required`,
                }
            }
        }
    }

    // Validate expense title
    if (providedFields.includes('title')) {
        if (
            typeof expenseData.title !== 'string' ||
            !expenseData.title.trim()
        ) {
            return {
                error: 'Title must be a non-empty string',
            }
        }

        expenseData.title =
            expenseData.title.trim()

        if (expenseData.title.length > 150) {
            return {
                error: 'Title must not exceed 150 characters',
            }
        }
    }

    // Validate expense amount
    if (providedFields.includes('amount')) {
        const amount = expenseData.amount

        if (
            typeof amount !== 'number' ||
            !Number.isFinite(amount)
        ) {
            return {
                error: 'Amount must be a valid number',
            }
        }

        if (amount < 0.01) {
            return {
                error: 'Amount must be at least 0.01',
            }
        }

        // Reject unreasonably large expense values
        if (amount > 999999999.99) {
            return {
                error: 'Amount must not exceed 999999999.99',
            }
        }

        // Require a maximum of two decimal places
        const cents = Math.round(amount * 100)

        if (amount !== cents / 100) {
            return {
                error: 'Amount must have no more than 2 decimal places',
            }
        }

        expenseData.amount = cents / 100
    }

    // Validate expense category
    if (providedFields.includes('category')) {
        if (
            typeof expenseData.category !== 'string' ||
            !allowedCategories.includes(
                expenseData.category
            )
        ) {
            return {
                error: 'Please select a valid expense category',
            }
        }
    }

    // Validate expense date
    if (providedFields.includes('expenseDate')) {
        if (!isValidDate(expenseData.expenseDate)) {
            return {
                error: 'Expense date must be a valid date in YYYY-MM-DD format',
            }
        }
    }

    // Validate optional notes
    if (providedFields.includes('notes')) {
        if (typeof expenseData.notes !== 'string') {
            return {
                error: 'Notes must be a string',
            }
        }

        expenseData.notes =
            expenseData.notes.trim()

        if (expenseData.notes.length > 1000) {
            return {
                error: 'Notes must not exceed 1000 characters',
            }
        }
    }

    return { expenseData }
}

// Verify trip ownership
router.use(async (req, res, next) => {
    try {
        const { tripId } = req.params

        if (!mongoose.isValidObjectId(tripId)) {
            return res.status(400).json({
                message: 'Invalid trip ID',
            })
        }

        const trip = await Trip.findOne({
            _id: tripId,
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

// Validate expense ID
router.param(
    'expenseId',
    (req, res, next, expenseId) => {
        if (!mongoose.isValidObjectId(expenseId)) {
            return res.status(400).json({
                message: 'Invalid expense ID',
            })
        }

        next()
    }
)

// CREATE EXPENSE
router.post('/', async (req, res) => {
    try {
        const { expenseData, error } =
            validateExpenseInput(req.body)

        if (error) {
            return res.status(400).json({
                message: error,
            })
        }

        const expense = await Expense.create({
            ...expenseData,
            trip: req.trip._id,
        })

        res.status(201).json({
            message: 'Expense created successfully',
            expense,
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
            message: 'Failed to create expense',
        })
    }
})

// GET ALL EXPENSES AND TOTAL
router.get('/', async (req, res) => {
    try {
        const expenses = await Expense.find({
            trip: req.trip._id,
        }).sort({
            expenseDate: 1,
            createdAt: 1,
        })

        // Add amounts as integer cents to reduce
        // floating-point rounding issues
        const totalCents = expenses.reduce(
            (sum, expense) =>
                sum + Math.round(expense.amount * 100),
            0
        )

        const totalAmount = totalCents / 100

        res.status(200).json({
            expenses,
            totalAmount,
            expenseCount: expenses.length,
        })
    } catch (error) {
        console.error(error)

        res.status(500).json({
            message: 'Failed to fetch expenses',
        })
    }
})

// GET ONE EXPENSE
router.get('/:expenseId', async (req, res) => {
    try {
        const expense = await Expense.findOne({
            _id: req.params.expenseId,
            trip: req.trip._id,
        })

        if (!expense) {
            return res.status(404).json({
                message: 'Expense not found',
            })
        }

        res.status(200).json({ expense })
    } catch (error) {
        console.error(error)

        res.status(500).json({
            message: 'Failed to fetch expense',
        })
    }
})

// UPDATE EXPENSE
router.put('/:expenseId', async (req, res) => {
    try {
        // Verify that the expense belongs to this trip
        const expense = await Expense.findOne({
            _id: req.params.expenseId,
            trip: req.trip._id,
        })

        if (!expense) {
            return res.status(404).json({
                message: 'Expense not found',
            })
        }

        const { expenseData, error } =
            validateExpenseInput(req.body, true)

        if (error) {
            return res.status(400).json({
                message: error,
            })
        }

        // Update only validated permitted fields
        for (const field of Object.keys(expenseData)) {
            expense[field] = expenseData[field]
        }

        await expense.save()

        res.status(200).json({
            message: 'Expense updated successfully',
            expense,
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
            message: 'Failed to update expense',
        })
    }
})

// DELETE EXPENSE
router.delete('/:expenseId', async (req, res) => {
    try {
        const expense = await Expense.findOneAndDelete({
            _id: req.params.expenseId,
            trip: req.trip._id,
        })

        if (!expense) {
            return res.status(404).json({
                message: 'Expense not found',
            })
        }

        res.status(200).json({
            message: 'Expense deleted successfully',
        })
    } catch (error) {
        console.error(error)

        res.status(500).json({
            message: 'Failed to delete expense',
        })
    }
})

module.exports = router
