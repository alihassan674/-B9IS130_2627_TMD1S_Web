
import MyTrips from './MyTrips'

function Dashboard({ user, onLogout }) {
    return (
        <div className="dashboard">
            <h1>✈️ TravelLog Dashboard</h1>

            <h2>Welcome, {user.name}!</h2>
            <p>Email: {user.email}</p>

            <MyTrips />

            <button type="button" onClick={onLogout}>
                Logout
            </button>
        </div>
    )
}

export default Dashboard
