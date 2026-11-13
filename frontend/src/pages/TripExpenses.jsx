
import { useEffect, useState } from 'react'

const categories = [
    'Accommodation',
    'Transport',
    'Food',
    'Activities',
    'Shopping',
    'Other',
]

const categoryIcons = {
    Accommodation: '🏨',
    Transport: '🚆',
    Food: '🍽️',
    Activities: '🎟️',
    Shopping: '🛍️',
    Other: '📌',
}

const emptyForm = {
    title: '',
    amount: '',
    category: 'Food',
    expenseDate: '',
    notes: '',
}

const formatAmount = (amount) =>
    Number(amount || 0).toLocaleString('en-GB', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })

const formatDate = (date) => {
    if (!date) return 'Date unavailable'

    const [year, month, day] = date.slice(0, 10).split('-')

    return new Date(
        Number(year),
        Number(month) - 1,
        Number(day)
    ).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    })
}

function ExpenseFields({ values, onChange, prefix }) {
    return (
        <div className="expense-form-grid">
            <div className="expense-field">
                <label htmlFor={`${prefix}-title`}>
                    Expense Title
                </label>
                <input
                    id={`${prefix}-title`}
                    name="title"
                    type="text"
                    value={values.title}
                    onChange={onChange}
                    placeholder="e.g. Hotel booking"
                    maxLength={150}
                    required
                />
            </div>

            <div className="expense-field">
                <label htmlFor={`${prefix}-amount`}>
                    Amount
                </label>
                <input
                    id={`${prefix}-amount`}
                    name="amount"
                    type="number"
                    value={values.amount}
                    onChange={onChange}
                    placeholder="0.00"
                    min="0.01"
                    step="0.01"
                    required
                />
            </div>

            <div className="expense-field">
                <label htmlFor={`${prefix}-category`}>
                    Category
                </label>
                <select
                    id={`${prefix}-category`}
                    name="category"
                    value={values.category}
                    onChange={onChange}
                    required
                >
                    {categories.map((category) => (
                        <option key={category} value={category}>
                            {category}
                        </option>
                    ))}
                </select>
            </div>

            <div className="expense-field">
                <label htmlFor={`${prefix}-date`}>
                    Expense Date
                </label>
                <input
                    id={`${prefix}-date`}
                    name="expenseDate"
                    type="date"
                    value={values.expenseDate}
                    onChange={onChange}
                    required
                />
            </div>

            <div className="expense-field expense-field-full">
                <label htmlFor={`${prefix}-notes`}>
                    Notes (optional)
                </label>
                <textarea
                    id={`${prefix}-notes`}
                    name="notes"
                    value={values.notes}
                    onChange={onChange}
                    placeholder="Add details about this expense..."
                    maxLength={1000}
                    rows={3}
                />
            </div>
        </div>
    )
}

function TripExpenses({ tripId }) {
    const [expenses, setExpenses] = useState([])
    const [totalAmount, setTotalAmount] = useState(0)
    const [expenseCount, setExpenseCount] = useState(0)
    const [form, setForm] = useState({ ...emptyForm })
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const [editingId, setEditingId] = useState(null)
    const [editForm, setEditForm] = useState({ ...emptyForm })
    const [updating, setUpdating] = useState(false)
    const [deletingId, setDeletingId] = useState(null)
    const [search, setSearch] = useState('')
    const [categoryFilter, setCategoryFilter] = useState('All')

    const fetchExpenses = async () => {
        const token = sessionStorage.getItem('token')

        const response = await fetch(
            `/api/trips/${tripId}/expenses`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        )

        const data = await response.json()

        if (!response.ok) {
            throw new Error(
                data.message || 'Failed to fetch expenses'
            )
        }

        return data
    }

    const refreshExpenses = async () => {
        const data = await fetchExpenses()
        setExpenses(data.expenses)
        setTotalAmount(data.totalAmount)
        setExpenseCount(data.expenseCount)
    }

    useEffect(() => {
        let active = true

        const loadExpenses = async () => {
            setLoading(true)
            setError('')
            setExpenses([])
            setEditingId(null)

            try {
                const token = sessionStorage.getItem('token')
                const response = await fetch(
                    `/api/trips/${tripId}/expenses`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )

                const data = await response.json()

                if (!response.ok) {
                    throw new Error(
                        data.message || 'Failed to fetch expenses'
                    )
                }

                if (active) {
                    setExpenses(data.expenses)
                    setTotalAmount(data.totalAmount)
                    setExpenseCount(data.expenseCount)
                }
            } catch (err) {
                if (active) setError(err.message)
            } finally {
                if (active) setLoading(false)
            }
        }

        loadExpenses()

        return () => {
            active = false
        }
    }, [tripId])

    const handleChange = (e) => {
        setForm((previous) => ({
            ...previous,
            [e.target.name]: e.target.value,
        }))
    }

    const handleEditChange = (e) => {
        setEditForm((previous) => ({
            ...previous,
            [e.target.name]: e.target.value,
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSaving(true)

        try {
            const token = sessionStorage.getItem('token')

            const response = await fetch(
                `/api/trips/${tripId}/expenses`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        ...form,
                        amount: Number(form.amount),
                    }),
                }
            )

            const data = await response.json()

            if (!response.ok) {
                throw new Error(
                    data.message || 'Failed to create expense'
                )
            }

            await refreshExpenses()
            setForm({ ...emptyForm })
        } catch (err) {
            setError(err.message)
        } finally {
            setSaving(false)
        }
    }

    const startEditing = (expense) => {
        setEditingId(expense._id)
        setEditForm({
            title: expense.title,
            amount: String(expense.amount),
            category: expense.category,
            expenseDate: expense.expenseDate.slice(0, 10),
            notes: expense.notes || '',
        })
        setError('')
    }

    const cancelEditing = () => {
        setEditingId(null)
        setEditForm({ ...emptyForm })
    }

    const handleUpdate = async (e) => {
        e.preventDefault()
        setError('')
        setUpdating(true)

        try {
            const token = sessionStorage.getItem('token')

            const response = await fetch(
                `/api/trips/${tripId}/expenses/${editingId}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        ...editForm,
                        amount: Number(editForm.amount),
                    }),
                }
            )

            const data = await response.json()

            if (!response.ok) {
                throw new Error(
                    data.message || 'Failed to update expense'
                )
            }

            await refreshExpenses()
            cancelEditing()
        } catch (err) {
            setError(err.message)
        } finally {
            setUpdating(false)
        }
    }

    const handleDelete = async (expenseId) => {
        const confirmed = window.confirm(
            'Are you sure you want to delete this expense?'
        )

        if (!confirmed) return

        setError('')
        setDeletingId(expenseId)

        try {
            const token = sessionStorage.getItem('token')

            const response = await fetch(
                `/api/trips/${tripId}/expenses/${expenseId}`,
                {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            const data = await response.json()

            if (!response.ok) {
                throw new Error(
                    data.message || 'Failed to delete expense'
                )
            }

            await refreshExpenses()

            if (editingId === expenseId) {
                cancelEditing()
            }
        } catch (err) {
            setError(err.message)
        } finally {
            setDeletingId(null)
        }
    }

    const categoryTotals = categories.map((category) => ({
        category,
        total: expenses
            .filter((expense) => expense.category === category)
            .reduce(
                (sum, expense) => sum + Number(expense.amount),
                0
            ),
    }))

    const filteredExpenses = expenses
        .filter((expense) => {
            const query = search.trim().toLowerCase()
            const matchesSearch =
                expense.title.toLowerCase().includes(query) ||
                (expense.notes || '').toLowerCase().includes(query)

            const matchesCategory =
                categoryFilter === 'All' ||
                expense.category === categoryFilter

            return matchesSearch && matchesCategory
        })
        .sort(
            (a, b) =>
                new Date(b.expenseDate) - new Date(a.expenseDate)
        )

    return (
        <section className="trip-expenses">
            <div className="expense-header">
                <div>
                    <span className="expense-eyebrow">
                        TRAVEL BUDGET
                    </span>
                    <h3>Trip Expenses</h3>
                    <p>Keep track of your travel spending.</p>
                </div>
                <span className="expense-header-icon">💳</span>
            </div>

            {error && (
                <p className="expense-error" role="alert">
                    {error}
                </p>
            )}

            {loading ? (
                <p className="expense-loading">
                    Loading expenses...
                </p>
            ) : (
                <>
                    <div className="expense-total-card">
                        <span>TOTAL TRIP SPENDING</span>
                        <h3>{formatAmount(totalAmount)}</h3>
                        <p>
                            {expenseCount}{' '}
                            {expenseCount === 1
                                ? 'expense recorded'
                                : 'expenses recorded'}
                        </p>
                    </div>

                    <div className="expense-category-section">
                        <h4>Spending by Category</h4>
                        <div className="expense-category-grid">
                            {categoryTotals.map(({ category, total }) => (
                                <div
                                    className="expense-category-card"
                                    key={category}
                                >
                                    <span className="expense-category-icon">
                                        {categoryIcons[category]}
                                    </span>
                                    <span className="expense-category-name">
                                        {category}
                                    </span>
                                    <strong>{formatAmount(total)}</strong>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="expense-add-panel">
                        <h4>➕ Add New Expense</h4>
                        <p>Record what you spent during your trip.</p>

                        <form onSubmit={handleSubmit}>
                            <ExpenseFields
                                values={form}
                                onChange={handleChange}
                                prefix={`expense-${tripId}`}
                            />
                            <button type="submit" disabled={saving}>
                                {saving
                                    ? 'Saving Expense...'
                                    : '+ Add Expense'}
                            </button>
                        </form>
                    </div>

                    <div className="expense-history-header">
                        <div>
                            <h4>Expense History</h4>
                            <p>Review and manage your recorded expenses.</p>
                        </div>
                        <span>{expenseCount} Total</span>
                    </div>

                    {expenses.length > 0 && (
                        <div className="expense-toolbar">
                            <input
                                type="search"
                                aria-label="Search expenses"
                                placeholder="Search expenses..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />

                            <select
                                aria-label="Filter expenses by category"
                                value={categoryFilter}
                                onChange={(e) =>
                                    setCategoryFilter(e.target.value)
                                }
                            >
                                <option value="All">All Categories</option>
                                {categories.map((category) => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {expenses.length === 0 ? (
                        <div className="expense-empty">
                            <span>🧾</span>
                            <h4>No expenses yet</h4>
                            <p>
                                Start tracking your trip spending using
                                the form above.
                            </p>
                        </div>
                    ) : filteredExpenses.length === 0 ? (
                        <div className="expense-empty">
                            <h4>No matching expenses</h4>
                            <p>Try another search or category.</p>
                        </div>
                    ) : (
                        <div className="expense-list">
                            {filteredExpenses.map((expense) => (
                                <article
                                    className="expense-item"
                                    key={expense._id}
                                >
                                    <div className="expense-item-header">
                                        <div className="expense-item-title">
                                            <span className="expense-item-icon">
                                                {categoryIcons[expense.category] || '📌'}
                                            </span>
                                            <div>
                                                <h5>{expense.title}</h5>
                                                <span>{expense.category}</span>
                                            </div>
                                        </div>
                                        <strong className="expense-item-amount">
                                            {formatAmount(expense.amount)}
                                        </strong>
                                    </div>

                                    <p className="expense-item-date">
                                        📅 {formatDate(expense.expenseDate)}
                                    </p>

                                    {expense.notes && (
                                        <p className="expense-item-notes">
                                            {expense.notes}
                                        </p>
                                    )}

                                    {editingId === expense._id ? (
                                        <form
                                            className="expense-edit-form"
                                            onSubmit={handleUpdate}
                                        >
                                            <h5>Edit Expense</h5>
                                            <ExpenseFields
                                                values={editForm}
                                                onChange={handleEditChange}
                                                prefix={`edit-${expense._id}`}
                                            />

                                            <div className="expense-actions">
                                                <button
                                                    type="submit"
                                                    disabled={updating}
                                                >
                                                    {updating
                                                        ? 'Saving Changes...'
                                                        : 'Save Changes'}
                                                </button>
                                                <button
                                                    type="button"
                                                    className="expense-secondary-btn"
                                                    onClick={cancelEditing}
                                                    disabled={updating}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </form>
                                    ) : (
                                        <div className="expense-actions">
                                            <button
                                                type="button"
                                                className="expense-secondary-btn"
                                                onClick={() => startEditing(expense)}
                                            >
                                                ✏️ Edit
                                            </button>
                                            <button
                                                type="button"
                                                className="expense-danger-btn"
                                                disabled={deletingId === expense._id}
                                                onClick={() => handleDelete(expense._id)}
                                            >
                                                {deletingId === expense._id
                                                    ? 'Deleting...'
                                                    : '🗑️ Delete'}
                                            </button>
                                        </div>
                                    )}
                                </article>
                            ))}
                        </div>
                    )}
                </>
            )}
        </section>
    )
}

export default TripExpenses
