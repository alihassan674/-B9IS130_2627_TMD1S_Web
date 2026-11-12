# âœˆï¸ TravelLog

> Trip journal with places, photos, notes, and budgets.

A full-stack **MERN** web application where users can create trips, write dated journal entries, upload photos, record expenses, view a chronological timeline, and share a curated trip page with others.

**Module:** B9IS130 â€“ Web Development for Information Systems | CA1 â€” Dublin Business School, 2026

---

## Tech Stack

| Layer | Technology | Version |
| :---- | :--------- | :------ |
| Frontend | React + Vite | React 19 / Vite 8 |
| Backend | Node.js + Express.js | Express 5 |
| Database | MongoDB Atlas (Mongoose) | Mongoose 9 |
| Dev tooling | nodemon, dotenv, cors | â€” |

---

## Project Structure

```
TravelLog/
â”œâ”€â”€ backend/                     # Express REST API â€” port 5000
â”‚   â”œâ”€â”€ src/
â”‚   â”‚   â”œâ”€â”€ config/
â”‚   â”‚   â”‚   â””â”€â”€ db.js            # MongoDB Atlas connection (Mongoose)
â”‚   â”‚   â”œâ”€â”€ middleware/
â”‚   â”‚   â”‚   â””â”€â”€ authMiddleware.js # JWT Bearer route protection guard
â”‚   â”‚   â”œâ”€â”€ models/
â”‚   â”‚   â”‚   â”œâ”€â”€ Expense.js       # Expense schema, category enum & validations (Task 17)
â”‚   â”‚   â”‚   â”œâ”€â”€ JournalEntry.js  # Journal schema & date indexing
â”‚   â”‚   â”‚   â”œâ”€â”€ Photo.js         # Photo URL & caption schema (Task 14)
â”‚   â”‚   â”‚   â”œâ”€â”€ Trip.js          # Trip schema & date validations
â”‚   â”‚   â”‚   â””â”€â”€ User.js          # User schema & validation rules
â”‚   â”‚   â””â”€â”€ routes/
â”‚   â”‚       â”œâ”€â”€ authRoutes.js    # /register, /login, and /me endpoints
â”‚   â”‚       â”œâ”€â”€ expenseRoutes.js # Nested expense CRUD & cents total (Task 17)
â”‚   â”‚       â”œâ”€â”€ index.js         # GET /api/health
â”‚   â”‚       â”œâ”€â”€ journalRoutes.js # Nested journal entry CRUD routes
â”‚   â”‚       â”œâ”€â”€ photoRoutes.js   # Nested photo CRUD routes (Task 14)
â”‚   â”‚       â”œâ”€â”€ publicRoutes.js  # Public read-only shared trip route (Task 21)
â”‚   â”‚       â””â”€â”€ tripRoutes.js    # Trip CRUD endpoints & isPublic toggle
â”‚   â”œâ”€â”€ package.json             # Express, Mongoose, bcryptjs, JWT, cors, dotenv
â”‚   â””â”€â”€ server.js                # Entry point: Express, middleware, routes
â”‚
â”œâ”€â”€ frontend/                    # React (Vite) app â€” port 3000
â”‚   â”œâ”€â”€ public/
â”‚   â”‚   â””â”€â”€ favicon.svg          # TravelLog airplane icon
â”‚   â”œâ”€â”€ src/
â”‚   â”‚   â”œâ”€â”€ pages/
â”‚   â”‚   â”‚   â”œâ”€â”€ CreateJournalEntry.jsx # Journal entry creation form component (Task 12)
â”‚   â”‚   â”‚   â”œâ”€â”€ CreateTrip.jsx   # Trip creation form component
â”‚   â”‚   â”‚   â”œâ”€â”€ Dashboard.jsx    # Protected dashboard view
â”‚   â”‚   â”‚   â”œâ”€â”€ EditJournalEntry.jsx   # Journal entry editing form component (Task 13)
â”‚   â”‚   â”‚   â”œâ”€â”€ EditTrip.jsx     # Trip editing form component (Task 9)
â”‚   â”‚   â”‚   â”œâ”€â”€ JournalEntries.jsx # Journal list, controls & embedded PhotoGallery
â”‚   â”‚   â”‚   â”œâ”€â”€ Login.jsx        # Login form component
â”‚   â”‚   â”‚   â”œâ”€â”€ MyTrips.jsx      # Trips list, edit, delete, journal, expense & timeline toggles
â”‚   â”‚   â”‚   â”œâ”€â”€ PhotoGallery.jsx # Travel photo gallery, add, edit & delete (Tasks 15 & 16)
â”‚   â”‚   â”‚   â”œâ”€â”€ PublicTrip.jsx   # Public read-only shared trip page (Task 22)
â”‚   â”‚   â”‚   â”œâ”€â”€ Register.jsx     # Registration form component
â”‚   â”‚   â”‚   â”œâ”€â”€ TripExpenses.jsx # Trip expenses summary, add, edit & delete UI (Tasks 18 & 19)
â”‚   â”‚   â”‚   â””â”€â”€ TripTimeline.jsx # Vertical chronological trip timeline component (Task 20)
â”‚   â”‚   â”œâ”€â”€ App.css              # Consolidated stylesheet
â”‚   â”‚   â”œâ”€â”€ App.jsx              # Main app auth router & session management
â”‚   â”‚   â””â”€â”€ main.jsx             # React entry point
â”‚   â”œâ”€â”€ index.html               # Page title & root mount point
â”‚   â”œâ”€â”€ package.json             # Minimal dependencies (React 19 + Vite)
â”‚   â””â”€â”€ vite.config.js           # Vite + /api proxy config
â”‚
â”œâ”€â”€ .gitignore                   # Ignores node_modules, .env, dist, logs, and internal docs
â””â”€â”€ README.md                    # Setup guide and documentation
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

> **âš ï¸ `.env` rules â€” common mistakes to avoid:**
> - No quotes around values: `MONGO_URI=mongodb+srv://...` âœ… NOT `MONGO_URI="mongodb+srv://..."` âŒ  
> - No double assignment: `MONGO_URI=...` âœ… NOT `MONGO_URI=MONGO_URI=...` âŒ  
> - No spaces around `=`

> **How to get your MONGO_URI from Atlas:**
> 1. Log in to [MongoDB Atlas](https://cloud.mongodb.com)
> 2. Click **Connect** on your cluster â†’ **Drivers**
> 3. Copy the connection string and replace `<username>` and `<password>` with your credentials
> 4. Add `/travellog` before the `?` to set the database name

**Install dependencies:**

```bash
npm install
```

**Start the backend:**

```bash
npm run dev      # development â€” nodemon auto-restarts on file save
# or
npm start        # production â€” plain node
```

**Expected output:**

```
âœ… MongoDB connected: cluster0.xxxxx.mongodb.net
ðŸš€ Server running on http://localhost:5000
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
  âžœ  Local:   http://localhost:3000/
```

> The Vite dev server automatically proxies all `/api/*` requests to `localhost:5000` â€” no CORS configuration needed.

---

## Running Both Together

Open **two terminals** side by side:

| Terminal | Directory | Command |
| :------- | :-------- | :------ |
| **1 â€” Backend** | `backend/` | `npm run dev` |
| **2 â€” Frontend** | `frontend/` | `npm run dev` |

Then open **`http://localhost:3000`** in your browser.  
You should see âœ… for both **React running** and **Backend API connected**.

---

## Libraries Reference

### Backend

| Library | Version | Purpose |
| :------ | :------ | :------ |
| `express` | ^5.3.0 | HTTP server framework â€” creates the server, defines routes, registers middleware |
| `mongoose` | ^9.12.0 | MongoDB ODM â€” connects to Atlas, defines Schemas and Models for CRUD |
| `bcryptjs` | ^3.0.3 | Password hashing algorithm (12 rounds) â€” keeps plaintext passwords out of DB |
| `jsonwebtoken` | ^9.0.3 | Signs and verifies stateless JWT Bearer tokens for route authorization |
| `dotenv` | ^18.0.9 | Loads `KEY=VALUE` pairs from `.env` into `process.env` at startup |
| `cors` | ^2.8.6 | Adds HTTP headers allowing the React frontend (port 3000) to call the API (port 5000) |
| `nodemon` *(dev)* | ^3.1.14 | Watches files and auto-restarts the server on save â€” development only |

### Frontend

| Library | Version | Purpose |
| :------ | :------ | :------ |
| `react` | ^19.3.1 | UI component library â€” `useState` for data, `useEffect` for side effects |
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
| `GET` | `/api/health` | Server and DB health check | âŒ Public |
| `POST` | `/api/auth/register` | Register new user account | âŒ Public |
| `POST` | `/api/auth/login` | Authenticate and obtain JWT token | âŒ Public |
| `GET` | `/api/auth/me` | Retrieve authenticated user profile | ðŸ”’ Protected (Bearer Token) |
| `POST` | `/api/trips` | Create a new trip | ðŸ”’ Protected (Bearer Token) |
| `GET` | `/api/trips` | List all trips for authenticated user | ðŸ”’ Protected (Bearer Token) |
| `GET` | `/api/trips/:id` | Get details of a single owned trip | ðŸ”’ Protected (Bearer Token) |
| `PUT` | `/api/trips/:id` | Update destination, dates, or details (Task 9) | ðŸ”’ Protected (Bearer Token) |
| `DELETE` | `/api/trips/:id` | Delete an owned trip (Task 9) | ðŸ”’ Protected (Bearer Token) |
| `POST` | `/api/trips/:tripId/journals` | Add a journal entry to a trip (Task 10) | ðŸ”’ Protected (Bearer Token) |
| `GET` | `/api/trips/:tripId/journals` | View journal entries for a trip (Task 10) | ðŸ”’ Protected (Bearer Token) |
| `GET` | `/api/trips/:tripId/journals/:entryId` | View single journal entry (Task 10) | ðŸ”’ Protected (Bearer Token) |
| `PUT` | `/api/trips/:tripId/journals/:entryId` | Update journal entry (Task 10) | ðŸ”’ Protected (Bearer Token) |
| `DELETE` | `/api/trips/:tripId/journals/:entryId` | Delete journal entry (Task 10) | ðŸ”’ Protected (Bearer Token) |
| `POST` | `/api/journals/:entryId/photos` | Attach image URL & caption to entry (Task 14) | ðŸ”’ Protected (Bearer Token) |
| `GET` | `/api/journals/:entryId/photos` | List all photos for an entry (Task 14) | ðŸ”’ Protected (Bearer Token) |
| `GET` | `/api/journals/:entryId/photos/:photoId` | View single photo record (Task 14) | ðŸ”’ Protected (Bearer Token) |
| `PUT` | `/api/journals/:entryId/photos/:photoId` | Update photo URL or caption (Task 14) | ðŸ”’ Protected (Bearer Token) |
| `DELETE` | `/api/journals/:entryId/photos/:photoId` | Delete photo record (Task 14) | ðŸ”’ Protected (Bearer Token) |
| `POST` | `/api/trips/:tripId/expenses` | Record a trip expense (Task 17) | ðŸ”’ Protected (Bearer Token) |
| `GET` | `/api/trips/:tripId/expenses` | List trip expenses & accurate total (Task 17) | ðŸ”’ Protected (Bearer Token) |
| `GET` | `/api/trips/:tripId/expenses/:expenseId` | View single expense record (Task 17) | ðŸ”’ Protected (Bearer Token) |
| `PUT` | `/api/trips/:tripId/expenses/:expenseId` | Update expense record (Task 17) | ðŸ”’ Protected (Bearer Token) |
| `DELETE` | `/api/trips/:tripId/expenses/:expenseId` | Delete expense record (Task 17) | ðŸ”’ Protected (Bearer Token) |
| `GET` | `/api/public/trips/:tripId` | View a public shared trip (entries & photos, no expenses) (Task 21) | âŒ Public |

> More endpoints will be added per task. See [`Requirement-Analysis-&-Plan.md`](./Requirement-Analysis-&-Plan.md) â†’ Appendix B for the full planned API.

---

## Task Progress

| Task | Description | Status |
| :--- | :---------- | :----: |
| Task 1 | Repository setup + Requirements Analysis & Plan | âœ… Done |
| Task 2 | Basic project setup (React + Express + MongoDB Atlas) | âœ… Done |
| Task 3 | User registration, login & password hashing (bcryptjs) | âœ… Done |
| Task 4 | JWT route protection & authorization middleware | âœ… Done |
| Task 5 | Frontend authentication, token storage & protected dashboard | âœ… Done |
| Task 6 | Trip CRUD API (Trip model, validation, owner isolation) | âœ… Done |
| Task 7 | Trips list UI component & Dashboard integration (`MyTrips.jsx`) | âœ… Done |
| Task 8 | Trip creation form & real-time list integration (`CreateTrip.jsx`) | âœ… Done |
| Task 9 | Trip Edit and Delete functionality (`EditTrip.jsx` & `MyTrips.jsx`) | âœ… Done |
| Task 10 | Journal entries backend model & routes (`JournalEntry.js`, `journalRoutes.js`) | âœ… Done |
| Task 11 | Journal entries frontend listing & toggle UI (`JournalEntries.jsx`) | âœ… Done |
| Task 12 | Journal creation form & chronological timeline display (`CreateJournalEntry.jsx`) | âœ… Done |
| Task 13 | Journal entry Edit and Delete functionality (`EditJournalEntry.jsx` & `JournalEntries.jsx`) | âœ… Done |
| Task 14 | Travel Photos backend model & CRUD endpoints (`Photo.js`, `photoRoutes.js`) | âœ… Done |
| Task 15 | Travel Photos frontend gallery & add form (`PhotoGallery.jsx`) | âœ… Done |
| Task 16 | Travel Photos Edit and Delete functionality (`PhotoGallery.jsx`) | âœ… Done |
| Task 17 | Trip Expenses backend model, total calculation & CRUD API (`Expense.js`, `expenseRoutes.js`) | âœ… Done |
| Task 18 | Trip Expenses frontend UI, add form & total summary (`TripExpenses.jsx`, `MyTrips.jsx`) | âœ… Done |
| Task 19 | Trip Expenses Edit and Delete functionality (`TripExpenses.jsx`) | âœ… Done |
| Task 20 | Chronological Trip Timeline UI (`TripTimeline.jsx`, `MyTrips.jsx`) | âœ… Done |
| Task 21 | Public trip sharing backend API (`publicRoutes.js`, `tripRoutes.js` `isPublic`) | âœ… Done |
| Task 22 | Public trip sharing frontend page UI (`PublicTrip.jsx`, `App.jsx` `/shared/:tripId`) | âœ… Done |
| Task 23 | Share Link & Privacy Controls UI (`MyTrips.jsx` â€” Make Public/Private toggle & Copy Share Link) | âœ… Done |
| Task 24 | Database cascade deletion with atomic MongoDB transactions (trips, journals, photos, expenses) | ✅ Done |
| Task 25 | Final testing, deployment & submission | 🔲 Upcoming |

---

> Internal university planning, specification, testing checklists, report, and presentation notes are kept locally via `.gitignore`. Only `README.md` and application source code are tracked in Git.
