
import { useEffect, useState } from 'react'

const categories = [
    'Accommodation',
    'Transport',
    'Food',
    'Activities',
    'Shopping',
    'Other',
]

const emptyForm = {
    title: '',
    amount: '',
    category: 'Food',
    expenseDate: '',
    notes: '',
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

            try {
                const data = await fetchExpenses()

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

    const handleEditChange = (e) => {
        setEditForm((previous) => ({
            ...previous,
            [e.target.name]: e.target.value,
        }))
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

    if (loading) {
        return <p>Loading expenses...</p>
    }

    return (
        <section>
            <h4>Trip Expenses</h4>

            <h3>
                Total Spending: {totalAmount.toFixed(2)}
            </h3>

            <p>Number of Expenses: {expenseCount}</p>

            <hr />

            <h4>Add Expense</h4>

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor={`expense-title-${tripId}`}>
                        Expense Title
                    </label>
                    <input
                        id={`expense-title-${tripId}`}
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        maxLength={150}
                        required
                    />
                </div>

                <div>
                    <label htmlFor={`expense-amount-${tripId}`}>
                        Amount
                    </label>
                    <input
                        id={`expense-amount-${tripId}`}
                        type="number"
                        name="amount"
                        value={form.amount}
                        onChange={handleChange}
                        min="0.01"
                        step="0.01"
                        required
                    />
                </div>

                <div>
                    <label htmlFor={`expense-category-${tripId}`}>
                        Category
                    </label>
                    <select
                        id={`expense-category-${tripId}`}
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        required
                    >
                        {categories.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor={`expense-date-${tripId}`}>
                        Expense Date
                    </label>
                    <input
                        id={`expense-date-${tripId}`}
                        type="date"
                        name="expenseDate"
                        value={form.expenseDate}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label htmlFor={`expense-notes-${tripId}`}>
                        Notes (optional)
                    </label>
                    <textarea
                        id={`expense-notes-${tripId}`}
                        name="notes"
                        value={form.notes}
                        onChange={handleChange}
                        maxLength={1000}
                        rows={3}
                    />
                </div>

                <button type="submit" disabled={saving}>
                    {saving ? 'Saving Expense...' : 'Add Expense'}
                </button>
            </form>

            {error && <p role="alert">{error}</p>}

            <hr />

            <h4>Expense History</h4>

            {expenses.length === 0 ? (
                <p>No expenses recorded for this trip yet.</p>
            ) : (
                <div>
                    {expenses.map((expense) => (
                        <article
                            key={expense._id}
                            style={{
                                border: '1px solid #ddd',
                                padding: '12px',
                                marginBottom: '10px',
                                borderRadius: '8px',
                            }}
                        >
                            <h5>{expense.title}</h5>

                            <p>
                                Amount: {Number(expense.amount).toFixed(2)}
                            </p>

                            <p>Category: {expense.category}</p>

                            <p>
                                Date: {expense.expenseDate.slice(0, 10)}
                            </p>

                            {expense.notes && (
                                <p>Notes: {expense.notes}</p>
                            )}

                            {editingId === expense._id ? (
                                <form onSubmit={handleUpdate}>
                                    <h5>Edit Expense</h5>

                                    <div>
                                        <label
                                            htmlFor={`edit-title-${expense._id}`}
                                        >
                                            Expense Title
                                        </label>
                                        <input
                                            id={`edit-title-${expense._id}`}
                                            type="text"
                                            name="title"
                                            value={editForm.title}
                                            onChange={handleEditChange}
                                            maxLength={150}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor={`edit-amount-${expense._id}`}
                                        >
                                            Amount
                                        </label>
                                        <input
                                            id={`edit-amount-${expense._id}`}
                                            type="number"
                                            name="amount"
                                            value={editForm.amount}
                                            onChange={handleEditChange}
                                            min="0.01"
                                            step="0.01"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor={`edit-category-${expense._id}`}
                                        >
                                            Category
                                        </label>
                                        <select
                                            id={`edit-category-${expense._id}`}
                                            name="category"
                                            value={editForm.category}
                                            onChange={handleEditChange}
                                            required
                                        >
                                            {categories.map((category) => (
                                                <option
                                                    key={category}
                                                    value={category}
                                                >
                                                    {category}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label
                                            htmlFor={`edit-date-${expense._id}`}
                                        >
                                            Expense Date
                                        </label>
                                        <input
                                            id={`edit-date-${expense._id}`}
                                            type="date"
                                            name="expenseDate"
                                            value={editForm.expenseDate}
                                            onChange={handleEditChange}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor={`edit-notes-${expense._id}`}
                                        >
                                            Notes
                                        </label>
                                        <textarea
                                            id={`edit-notes-${expense._id}`}
                                            name="notes"
                                            value={editForm.notes}
                                            onChange={handleEditChange}
                                            maxLength={1000}
                                            rows={3}
                                        />
                                    </div>

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
                                        onClick={cancelEditing}
                                        disabled={updating}
                                    >
                                        Cancel
                                    </button>
                                </form>
                            ) : (
                                <div>
                                    <button
                                        type="button"
                                        onClick={() => startEditing(expense)}
                                    >
                                        Edit
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleDelete(expense._id)
                                        }
                                        disabled={deletingId === expense._id}
                                    >
                                        {deletingId === expense._id
                                            ? 'Deleting...'
                                            : 'Delete'}
                                    </button>
                                </div>
                            )}
                        </article>
                    ))}
                </div>
            )}
        </section>
    )
}

export default TripExpenses
