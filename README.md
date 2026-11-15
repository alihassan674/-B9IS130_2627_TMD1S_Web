# ✈️ TravelLog

> Trip journal with places, photos, notes, and budgets.

A full-stack **MERN** web application where users can create trips, write dated journal entries, attach photos using external image URLs, record expenses, view a chronological timeline, and share a curated trip page with others.

**Module:** B9IS130 – Web Development for Information Systems | CA1 — Dublin Business School, 2026

---

## Features and objectives

TravelLog centralizes travel memories and spending in one application. Authenticated owners can create, view, edit and delete trips, dated journal entries, photo links and expenses; review a chronological timeline and expense totals; and enable or revoke a public read-only share link. Public visitors cannot access private expenses or modify records. Trips are private by default.

Non-functional objectives include responsive layouts, maintainable components, input validation, access control and reproducible installation. The project is a coursework MVP, not a booking or accounting service.

## Architecture and data model

```mermaid
flowchart LR
    frontend["React browser UI"] -->|"REST JSON and JWT"| backend["Express API"]
    backend --> models["Mongoose models"]
    models --> database[("MongoDB Atlas")]
```

| Parent | Child | Relationship |
| --- | --- | --- |
| User | Trip | One-to-many via user |
| Trip | JournalEntry | One-to-many via trip |
| JournalEntry | Photo | One-to-many via journalEntry |
| Trip | Expense | One-to-many via trip |

MongoDB ObjectId references represent relationships. Transactional cascade deletion removes dependent records when a trip or journal is deleted. An Atlas replica-set deployment supports these transactions.

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
│   │   │   ├── Expense.js       # Expense schema, category enum & validations (Task 17)
│   │   │   ├── JournalEntry.js  # Journal schema & date indexing
│   │   │   ├── Photo.js         # Photo URL & caption schema (Task 14)
│   │   │   ├── Trip.js          # Trip schema & date validations
│   │   │   └── User.js          # User schema & validation rules
│   │   └── routes/
│   │       ├── authRoutes.js    # /register, /login, and /me endpoints
│   │       ├── expenseRoutes.js # Nested expense CRUD & cents total (Task 17)
│   │       ├── index.js         # GET /api/health
│   │       ├── journalRoutes.js # Nested journal entry CRUD routes
│   │       ├── photoRoutes.js   # Nested photo CRUD routes (Task 14)
│   │       ├── publicRoutes.js  # Public read-only shared trip route (Task 21)
│   │       └── tripRoutes.js    # Trip CRUD endpoints & isPublic toggle
│   ├── package.json             # Express, Mongoose, bcryptjs, JWT, cors, dotenv
│   └── server.js                # Entry point: Express, middleware, routes
│
├── frontend/                    # React (Vite) app — port 3000
│   ├── public/
│   │   └── favicon.svg          # TravelLog airplane icon
│   ├── src/
│   │   ├── pages/
│   │   │   ├── CreateJournalEntry.jsx # Journal entry creation form component (Task 12)
│   │   │   ├── CreateTrip.jsx   # Trip creation form component
│   │   │   ├── Dashboard.jsx    # Protected dashboard view
│   │   │   ├── EditJournalEntry.jsx   # Journal entry editing form component (Task 13)
│   │   │   ├── EditTrip.jsx     # Trip editing form component (Task 9)
│   │   │   ├── JournalEntries.jsx # Journal list, controls & embedded PhotoGallery
│   │   │   ├── Login.jsx        # Login form component
│   │   │   ├── MyTrips.jsx      # Trips list, edit, delete, journal, expense & timeline toggles
│   │   │   ├── PhotoGallery.jsx # Travel photo gallery, add, edit & delete (Tasks 15 & 16)
│   │   │   ├── PublicTrip.jsx   # Public read-only shared trip page (Task 22)
│   │   │   ├── Register.jsx     # Registration form component
│   │   │   ├── TripExpenses.jsx # Trip expenses summary, add, edit & delete UI (Tasks 18 & 19)
│   │   │   └── TripTimeline.jsx # Vertical chronological trip timeline component (Task 20)
│   │   ├── App.css              # Consolidated stylesheet
│   │   ├── App.jsx              # Main app auth router & session management
│   │   └── main.jsx             # React entry point
│   ├── index.html               # Page title & root mount point
│   ├── package.json             # Minimal dependencies (React 19 + Vite)
│   └── vite.config.js           # Vite + /api proxy config
│
├── .gitignore                   # Ignores node_modules, .env, dist, logs, and internal docs
└── README.md                    # Setup guide and documentation
```

---

## Prerequisites

- [Node.js](https://nodejs.org/) v24 recommended (tested with v24.17.0)
- [npm](https://www.npmjs.com/) v9 or higher
- A [MongoDB Atlas](https://www.mongodb.com/atlas) free account with a cluster

---

## Setup & Running Locally

### 1. Clone the repository

```bash
git clone <your-repo-url> TravelLog
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
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=1d
CLIENT_URL=http://localhost:3000
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
npm ci
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

From the repository root, open a separate terminal. The frontend uses relative `/api` requests and the Vite development proxy; no frontend environment file is required for local development.

**Install dependencies and start:**

```bash
npm ci
npm run dev
```

**Expected output:**

```
  VITE v8.x.x  ready in xxx ms
  ➜  Local:   http://localhost:3000/
```

> The Vite dev server automatically proxies all `/api/*` requests to `localhost:5000` — the backend also restricts browser origins using `CLIENT_URL`.

---

## Running Both Together

Open **two terminals** side by side:

| Terminal | Directory | Command |
| :------- | :-------- | :------ |
| **1 — Backend** | `backend/` | `npm run dev` |
| **2 — Frontend** | `frontend/` | `npm run dev` |

Then open **`http://localhost:3000`** in your browser.  
The login page should appear. Register or sign in to access the dashboard.

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
| `helmet` | ^8.3.0 | Security-related HTTP response headers |
| `express-rate-limit` | ^8.7.4 | Restricts repeated authentication attempts |
| `nodemon` *(dev)* | 3.1.11 | Watches files and auto-restarts the server on save — development only |

### Frontend

| Library | Version | Purpose |
| :------ | :------ | :------ |
| `react` | ^19.3.1 | UI component library — `useState` for data, `useEffect` for side effects |
| `react-dom` | ^19.3.1 | Renders the React component tree into `index.html` in the browser |
| `vite` | ^8.3.6 | Dev server with hot module replacement; bundles for production; proxies `/api` |
| `@vitejs/plugin-react` | ^6.2.1 | Enables JSX compilation and React fast refresh inside Vite |

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

| `CLIENT_URL` | Allowed browser origin | `http://localhost:3000` |

Never commit `.env` or real credentials.

---

## API Endpoints

| Method | Endpoint | Description | Auth Required |
| :----- | :------- | :---------- | :------------ |
| `GET` | `/api/health` | API health endpoint | ❌ Public |
| `POST` | `/api/auth/register` | Register new user account | ❌ Public |
| `POST` | `/api/auth/login` | Authenticate and obtain JWT token | ❌ Public |
| `GET` | `/api/auth/me` | Retrieve authenticated user profile | 🔒 Protected (Bearer Token) |
| `POST` | `/api/trips` | Create a new trip | 🔒 Protected (Bearer Token) |
| `GET` | `/api/trips` | List all trips for authenticated user | 🔒 Protected (Bearer Token) |
| `GET` | `/api/trips/:id` | Get details of a single owned trip | 🔒 Protected (Bearer Token) |
| `PUT` | `/api/trips/:id` | Update destination, dates, or details (Task 9) | 🔒 Protected (Bearer Token) |
| `DELETE` | `/api/trips/:id` | Delete an owned trip & cascade-delete child journals, photos, expenses atomically (Tasks 9 & 24) | 🔒 Protected (Bearer Token) |
| `POST` | `/api/trips/:tripId/journals` | Add a journal entry to a trip (Task 10) | 🔒 Protected (Bearer Token) |
| `GET` | `/api/trips/:tripId/journals` | View journal entries for a trip (Task 10) | 🔒 Protected (Bearer Token) |
| `GET` | `/api/trips/:tripId/journals/:entryId` | View single journal entry (Task 10) | 🔒 Protected (Bearer Token) |
| `PUT` | `/api/trips/:tripId/journals/:entryId` | Update journal entry (Task 10) | 🔒 Protected (Bearer Token) |
| `DELETE` | `/api/trips/:tripId/journals/:entryId` | Delete journal entry & cascade-delete child photos atomically (Tasks 10 & 25) | 🔒 Protected (Bearer Token) |
| `POST` | `/api/journals/:entryId/photos` | Attach image URL & caption to entry (Task 14) | 🔒 Protected (Bearer Token) |
| `GET` | `/api/journals/:entryId/photos` | List all photos for an entry (Task 14) | 🔒 Protected (Bearer Token) |
| `GET` | `/api/journals/:entryId/photos/:photoId` | View single photo record (Task 14) | 🔒 Protected (Bearer Token) |
| `PUT` | `/api/journals/:entryId/photos/:photoId` | Update photo URL or caption (Task 14) | 🔒 Protected (Bearer Token) |
| `DELETE` | `/api/journals/:entryId/photos/:photoId` | Delete photo record (Task 14) | 🔒 Protected (Bearer Token) |
| `POST` | `/api/trips/:tripId/expenses` | Record a trip expense (Task 17) | 🔒 Protected (Bearer Token) |
| `GET` | `/api/trips/:tripId/expenses` | List trip expenses & accurate total (Task 17) | 🔒 Protected (Bearer Token) |
| `GET` | `/api/trips/:tripId/expenses/:expenseId` | View single expense record (Task 17) | 🔒 Protected (Bearer Token) |
| `PUT` | `/api/trips/:tripId/expenses/:expenseId` | Update expense record (Task 17) | 🔒 Protected (Bearer Token) |
| `DELETE` | `/api/trips/:tripId/expenses/:expenseId` | Delete expense record (Task 17) | 🔒 Protected (Bearer Token) |
| `GET` | `/api/public/trips/:tripId` | View a public shared trip (entries & photos, no expenses) (Task 21) | ❌ Public |

Protected endpoints require `Authorization: Bearer <token>`. JSON requests use `Content-Type: application/json`.

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
| Task 10 | Journal entries backend model & routes (`JournalEntry.js`, `journalRoutes.js`) | ✅ Done |
| Task 11 | Journal entries frontend listing & toggle UI (`JournalEntries.jsx`) | ✅ Done |
| Task 12 | Journal creation form & chronological timeline display (`CreateJournalEntry.jsx`) | ✅ Done |
| Task 13 | Journal entry Edit and Delete functionality (`EditJournalEntry.jsx` & `JournalEntries.jsx`) | ✅ Done |
| Task 14 | Travel Photos backend model & CRUD endpoints (`Photo.js`, `photoRoutes.js`) | ✅ Done |
| Task 15 | Travel Photos frontend gallery & add form (`PhotoGallery.jsx`) | ✅ Done |
| Task 16 | Travel Photos Edit and Delete functionality (`PhotoGallery.jsx`) | ✅ Done |
| Task 17 | Trip Expenses backend model, total calculation & CRUD API (`Expense.js`, `expenseRoutes.js`) | ✅ Done |
| Task 18 | Trip Expenses frontend UI, add form & total summary (`TripExpenses.jsx`, `MyTrips.jsx`) | ✅ Done |
| Task 19 | Trip Expenses Edit and Delete functionality (`TripExpenses.jsx`) | ✅ Done |
| Task 20 | Chronological Trip Timeline UI (`TripTimeline.jsx`, `MyTrips.jsx`) | ✅ Done |
| Task 21 | Public trip sharing backend API (`publicRoutes.js`, `tripRoutes.js` `isPublic`) | ✅ Done |
| Task 22 | Public trip sharing frontend page UI (`PublicTrip.jsx`, `App.jsx` `/shared/:tripId`) | ✅ Done |
| Task 23 | Share Link & Privacy Controls UI (`MyTrips.jsx` — Make Public/Private toggle & Copy Share Link) | ✅ Done |
| Task 24 | Database trip cascade deletion with atomic MongoDB transactions (trips, journals, photos, expenses) | ✅ Done |
| Task 25 | Database journal cascade deletion & photo cleanup with atomic MongoDB transactions | ✅ Done |
| Task 26 | Comprehensive UI/UX redesign, modern styling (index.css/App.css) & mobile responsiveness | ✅ Done |
| Task 27 | Final testing, deployment & submission | Local testing completed; public deployment and submission pending |

---

> Internal university planning, specification, testing checklists, report, and presentation notes are kept locally via `.gitignore`. Only `README.md` and application source code are tracked in Git.


## Security and validation

- bcrypt password hashing (12 rounds), JWT bearer authentication and owner-scoped database queries.
- Explicit field allowlists, ObjectId checks, strict date-only inputs and field type/length checks.
- HTTP(S) photo URL validation; numeric expense validation with up to two decimal places and totals calculated in integer cents.
- Helmet response headers, disabled X-Powered-By header, 100 KB JSON body limit and generic internal error responses.
- Configurable CORS origin and authentication rate limiting (10 unsuccessful attempts per 15-minute window, shared between login and registration).
- Public API returns selected trip, journal and photo fields only; private trips and expenses are excluded.

## Dependency audit and remediation

The backend development audit initially identified a moderate minimatch denial-of-service advisory through Nodemon 3.1.14 (minimatch 10.2.6). The production-only audit was clear. The dependency tree was inspected with `npm ls minimatch` and `npm explain minimatch`, and remediation was evaluated with `npm audit fix --dry-run --json`. Rather than applying a broad forced upgrade, Nodemon was pinned to 3.1.11 using `npm install --save-dev --save-exact nodemon@3.1.11`. The package manifest and lockfile were updated. Subsequent full and production-only audits for backend and frontend were reported clear. Audit findings are point-in-time results, not a guarantee of security.

## Testing

Project testing records report 535 checks across development, validation, security and regression activities. These are cumulative reported checks, not 535 unique automated tests. Validation alone covered 242 checks across authentication (22), trips (36), journals (47), photos (53) and expenses (84). Testing used Postman, browser interactions, npm audit and production builds. The development log also records 57 passing live HTTP assertions and 15 backend syntax checks. Detailed evidence is maintained in the local testing checklist. No automated UI test suite is claimed.

## Production build and deployment

From the frontend directory run `npm ci` and `npm run build`. The output is generated in `frontend/dist`. From the backend directory run `npm ci --omit=dev` and `npm start` with production environment variables configured. A production host must route `/api` requests to Express and support the `/shared/:tripId` frontend fallback. Configure HTTPS, Atlas database access and the correct `CLIENT_URL` for the deployment. The development proxy alone is not a production hosting solution.

Public deployment URL: pending verification. Local production build success does not establish public cloud deployment.

## Screenshots and demonstration

Application screenshots and a demonstration can be added after capturing the final running application. Suggested views: login, dashboard, trips, journal, gallery, expenses, timeline and public sharing. Do not include credentials, tokens or connection strings.

## Limitations and future improvements

Photos use external URLs rather than binary uploads. External images may become unavailable or expose visitor network information to their hosts. JWTs are stored in sessionStorage, which remains accessible to same-origin scripts. The development rate limiter uses an in-memory store. All expense values are recorded and displayed in US dollars (`USD`, `$`); live currency conversion is not provided. Future improvements include managed image storage, automated regression tests and production-grade distributed rate limiting. No maps or booking integration is claimed.

## References and AI acknowledgement

- [React documentation](https://react.dev/)
- [Vite documentation](https://vite.dev/)
- [Express documentation](https://expressjs.com/)
- [Mongoose documentation](https://mongoosejs.com/)
- [MongoDB Atlas documentation](https://www.mongodb.com/docs/atlas/)
- [OWASP Top Ten](https://owasp.org/www-project-top-ten/)
- [Helmet](https://helmetjs.github.io/)
- [express-rate-limit](https://express-rate-limit.mintlify.app/)

ChatGPT was used during planning, implementation guidance, debugging, security review, test design and documentation drafting. The developer is responsible for reviewing, understanding, testing and explaining the submitted implementation. Detailed assistance references are recorded in the local specification and should be included in the coursework disclosure as required.


