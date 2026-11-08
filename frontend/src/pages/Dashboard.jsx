function Dashboard({ user, onLogout }) {
    return (
        <div className="dashboard">
            <h1>✈️ TravelLog Dashboard</h1>

            <h2>Welcome, {user.name}!</h2>

            <p>You are successfully logged in.</p>
            <p>Email: {user.email}</p>

            <h3>My Trips</h3>
            <p>No trips yet. Your travel adventures will appear here.</p>

            <button type="button" onClick={onLogout}>
                Logout
            </button>
        </div>
    )
}

export default Dashboard
