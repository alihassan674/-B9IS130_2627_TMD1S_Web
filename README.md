# ✈️ TravelLog

> Trip journal with places, photos, notes, and budgets.

A full-stack **MERN** web application where users can create trips, write dated journal entries, upload photos, record expenses, view a chronological timeline, and share a curated trip page with others.

**Module:** B9IS130 – Web Development for Information Systems | CA1 — Dublin Business School, 2026

---

## Tech Stack

| Layer | Technology | Version |
| :---- | :--------- | :------ |
| Frontend | React + Vite | React 19 / Vite 8 |
| Backend | Node.js + Express.js | Express 5 |
| Database | MongoDB Atlas (Mongoose) | Mongoose 9 |
| Dev tooling | nodemon, dotenv, cors | — |

---

## Project Structure

```
TravelLog/
├── backend/                     # Express REST API — port 5000
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js            # MongoDB Atlas connection (Mongoose)
│   │   ├── middleware/
│   │   │   └── authMiddleware.js # JWT Bearer route protection guard
│   │   ├── models/
│   │   │   ├── JournalEntry.js  # Journal schema & date indexing
│   │   │   ├── Trip.js          # Trip schema & date validations
│   │   │   └── User.js          # User schema & validation rules
│   │   └── routes/
│   │       ├── authRoutes.js    # /register, /login, and /me endpoints
│   │       ├── index.js         # GET /api/health
│   │       ├── journalRoutes.js # Nested journal entry CRUD routes
│   │       └── tripRoutes.js    # Trip CRUD endpoints
│   ├── package.json             # Express, Mongoose, bcryptjs, JWT, cors, dotenv
│   └── server.js                # Entry point: Express, middleware, routes
│
├── frontend/                    # React (Vite) app — port 3000
│   ├── public/
│   │   └── favicon.svg          # TravelLog airplane icon
│   ├── src/
│   │   ├── pages/
│   │   │   ├── CreateTrip.jsx   # Trip creation form component
│   │   │   ├── Dashboard.jsx    # Protected dashboard view
│   │   │   ├── EditTrip.jsx     # Trip editing form component (Task 9)
│   │   │   ├── Login.jsx        # Login form component
│   │   │   ├── MyTrips.jsx      # Trips list, edit & delete controls
│   │   │   └── Register.jsx     # Registration form component
│   │   ├── App.css              # Consolidated stylesheet
│   │   ├── App.jsx              # Main app auth router & session management
│   │   └── main.jsx             # React entry point
│   ├── index.html               # Page title & root mount point
│   ├── package.json             # Minimal dependencies (React 19 + Vite)
│   └── vite.config.js           # Vite + /api proxy config
│
├── .gitignore                   # Ignores node_modules, .env, dist, logs
├── README.md                    # Setup guide and documentation
├── Requirement-Analysis-&-Plan.md # Academic requirements & plan
├── specification.md             # Detailed task log & implementation notes
└── testinglist.md               # Testing checklist & verification log
```

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [npm](https://www.npmjs.com/) v9 or higher
- A [MongoDB Atlas](https://www.mongodb.com/atlas) free account with a cluster

---

## Setup & Running Locally

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd TravelLog
```

---

### 2. Backend Setup

```bash
cd backend
```

**Create the environment file:**

```bash
# Windows
copy .env.example .env

# macOS / Linux
cp .env.example .env
```

Open `backend/.env` and fill in your values:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/travellog?retryWrites=true&w=majority
NODE_ENV=development
```

> **⚠️ `.env` rules — common mistakes to avoid:**
> - No quotes around values: `MONGO_URI=mongodb+srv://...` ✅ NOT `MONGO_URI="mongodb+srv://..."` ❌  
> - No double assignment: `MONGO_URI=...` ✅ NOT `MONGO_URI=MONGO_URI=...` ❌  
> - No spaces around `=`

> **How to get your MONGO_URI from Atlas:**
> 1. Log in to [MongoDB Atlas](https://cloud.mongodb.com)
> 2. Click **Connect** on your cluster → **Drivers**
> 3. Copy the connection string and replace `<username>` and `<password>` with your credentials
> 4. Add `/travellog` before the `?` to set the database name

**Install dependencies:**

```bash
npm install
```

**Start the backend:**

```bash
npm run dev      # development — nodemon auto-restarts on file save
# or
npm start        # production — plain node
```

**Expected output:**

```
✅ MongoDB connected: cluster0.xxxxx.mongodb.net
🚀 Server running on http://localhost:5000
```

**Verify with the health check:**

```
GET http://localhost:5000/api/health
```

```json
{
  "status": "ok",
  "message": "TravelLog API is running",
  "timestamp": "2026-11-06T..."
}
```

---

### 3. Frontend Setup

```bash
cd frontend
```

**Create the environment file:**

```bash
# Windows
copy .env.example .env

# macOS / Linux
cp .env.example .env
```

```env
VITE_API_URL=http://localhost:5000/api
```

**Install dependencies and start:**

```bash
npm install
npm run dev
```

**Expected output:**

```
  VITE v8.x.x  ready in xxx ms
  ➜  Local:   http://localhost:3000/
```

> The Vite dev server automatically proxies all `/api/*` requests to `localhost:5000` — no CORS configuration needed.

---

## Running Both Together

Open **two terminals** side by side:

| Terminal | Directory | Command |
| :------- | :-------- | :------ |
| **1 — Backend** | `backend/` | `npm run dev` |
| **2 — Frontend** | `frontend/` | `npm run dev` |

Then open **`http://localhost:3000`** in your browser.  
You should see ✅ for both **React running** and **Backend API connected**.

---

## Libraries Reference

### Backend

| Library | Version | Purpose |
| :------ | :------ | :------ |
| `express` | ^5.3.0 | HTTP server framework — creates the server, defines routes, registers middleware |
| `mongoose` | ^9.12.0 | MongoDB ODM — connects to Atlas, defines Schemas and Models for CRUD |
| `bcryptjs` | ^3.0.3 | Password hashing algorithm (12 rounds) — keeps plaintext passwords out of DB |
| `jsonwebtoken` | ^9.0.3 | Signs and verifies stateless JWT Bearer tokens for route authorization |
| `dotenv` | ^18.0.9 | Loads `KEY=VALUE` pairs from `.env` into `process.env` at startup |
| `cors` | ^2.8.6 | Adds HTTP headers allowing the React frontend (port 3000) to call the API (port 5000) |
| `nodemon` *(dev)* | ^3.1.14 | Watches files and auto-restarts the server on save — development only |

### Frontend

| Library | Version | Purpose |
| :------ | :------ | :------ |
| `react` | ^19.3.1 | UI component library — `useState` for data, `useEffect` for side effects |
| `react-dom` | ^19.3.1 | Renders the React component tree into `index.html` in the browser |
| `vite` | ^8.3.6 | Dev server with hot module replacement; bundles for production; proxies `/api` |
| `@vitejs/plugin-react` | ^6.1.2 | Enables JSX compilation and React fast refresh inside Vite |

---

## Environment Variables Reference

### `backend/.env`

| Variable | Description | Example |
| :------- | :---------- | :------ |
| `PORT` | Port the Express server listens on | `5000` |
| `MONGO_URI` | Full MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster...` |
| `NODE_ENV` | Runtime environment | `development` |
| `JWT_SECRET` | Secret key used to sign and verify JWT tokens | `your_secret_key` |
| `JWT_EXPIRES_IN` | Token validity duration | `1d` |

### `frontend/.env`

| Variable | Description | Example |
| :------- | :---------- | :------ |
| `VITE_API_URL` | Base URL for backend API calls | `http://localhost:5000/api` |

---

## API Endpoints

| Method | Endpoint | Description | Auth Required |
| :----- | :------- | :---------- | :------------ |
| `GET` | `/api/health` | Server and DB health check | ❌ Public |
| `POST` | `/api/auth/register` | Register new user account | ❌ Public |
| `POST` | `/api/auth/login` | Authenticate and obtain JWT token | ❌ Public |
| `GET` | `/api/auth/me` | Retrieve authenticated user profile | 🔒 Protected (Bearer Token) |
| `POST` | `/api/trips` | Create a new trip | 🔒 Protected (Bearer Token) |
| `GET` | `/api/trips` | List all trips for authenticated user | 🔒 Protected (Bearer Token) |
| `GET` | `/api/trips/:id` | Get details of a single owned trip | 🔒 Protected (Bearer Token) |
| `PUT` | `/api/trips/:id` | Update destination, dates, or details (Task 9) | 🔒 Protected (Bearer Token) |
| `DELETE` | `/api/trips/:id` | Delete an owned trip (Task 9) | 🔒 Protected (Bearer Token) |
| `POST` | `/api/trips/:tripId/journals` | Add a journal entry to a trip (Task 10) | 🔒 Protected (Bearer Token) |
| `GET` | `/api/trips/:tripId/journals` | View journal entries for a trip (Task 10) | 🔒 Protected (Bearer Token) |
| `GET` | `/api/trips/:tripId/journals/:entryId` | View single journal entry (Task 10) | 🔒 Protected (Bearer Token) |
| `PUT` | `/api/trips/:tripId/journals/:entryId` | Update journal entry (Task 10) | 🔒 Protected (Bearer Token) |
| `DELETE` | `/api/trips/:tripId/journals/:entryId` | Delete journal entry (Task 10) | 🔒 Protected (Bearer Token) |

> More endpoints will be added per task. See [`Requirement-Analysis-&-Plan.md`](./Requirement-Analysis-&-Plan.md) → Appendix B for the full planned API.

---

## Task Progress

| Task | Description | Status |
| :--- | :---------- | :----: |
| Task 1 | Repository setup + Requirements Analysis & Plan | ✅ Done |
| Task 2 | Basic project setup (React + Express + MongoDB Atlas) | ✅ Done |
| Task 3 | User registration, login & password hashing (bcryptjs) | ✅ Done |
| Task 4 | JWT route protection & authorization middleware | ✅ Done |
| Task 5 | Frontend authentication, token storage & protected dashboard | ✅ Done |
| Task 6 | Trip CRUD API (Trip model, validation, owner isolation) | ✅ Done |
| Task 7 | Trips list UI component & Dashboard integration (`MyTrips.jsx`) | ✅ Done |
| Task 8 | Trip creation form & real-time list integration (`CreateTrip.jsx`) | ✅ Done |
| Task 9 | Trip Edit and Delete functionality (`EditTrip.jsx` & `MyTrips.jsx`) | ✅ Done |
| Task 10 | Journal entries backend model & routes (`JournalEntry.js`, `journalRoutes.js`) | 🟡 In Progress |
| Task 11 | Journal entries UI & chronological timeline display | 🔲 Upcoming |
| Task 12 | Photos, expenses, sharing & public page | 🔲 Upcoming |
| Task 13 | Final testing, deployment, report & presentation | 🔲 Upcoming |

---

## See Also

- [`specification.md`](./specification.md) — detailed task log with implementation notes
- [`Requirement-Analysis-&-Plan.md`](./Requirement-Analysis-&-Plan.md) — full requirements analysis
