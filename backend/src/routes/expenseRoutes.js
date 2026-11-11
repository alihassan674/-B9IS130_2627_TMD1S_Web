
const express = require('express')
const mongoose = require('mongoose')

const Trip = require('../models/Trip')
const Expense = require('../models/Expense')
const protect = require('../middleware/authMiddleware')

const router = express.Router({ mergeParams: true })

// All expense routes require authentication
router.use(protect)

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
router.param('expenseId', (req, res, next, expenseId) => {
    if (!mongoose.isValidObjectId(expenseId)) {
        return res.status(400).json({
            message: 'Invalid expense ID',
        })
    }

    next()
})

// CREATE EXPENSE
router.post('/', async (req, res) => {
    try {
        const { title, amount, category, expenseDate, notes } =
            req.body

        const expense = await Expense.create({
            trip: req.trip._id,
            title,
            amount,
            category,
            expenseDate,
            notes,
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
        }).sort({ expenseDate: 1, createdAt: 1 })

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
        const expense = await Expense.findOne({
            _id: req.params.expenseId,
            trip: req.trip._id,
        })

        if (!expense) {
            return res.status(404).json({
                message: 'Expense not found',
            })
        }

        const fields = [
            'title',
            'amount',
            'category',
            'expenseDate',
            'notes',
        ]

        for (const field of fields) {
            if (req.body[field] !== undefined) {
                expense[field] = req.body[field]
            }
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
