# TravelLog — Project Specification & Task Log

**Module:** B9IS130 – Web Development for Information Systems  
**Assessment:** Continuous Assessment 1 – Individual Project  
**Stack:** MERN (MongoDB | Express.js | React | Node.js)

---

## ✅ Task 1 — Project Setup & Requirements Analysis *(Completed)*

### What Was Done
- Created a Git repository and pushed initial commit.
- Completed **Requirement Analysis & Plan** (`Requirement-Analysis-&-Plan.md`) covering:
  - Problem statement and stakeholders
  - Functional requirements (FR-01 to FR-16)
  - Non-functional requirements (NFR-01 to NFR-10)
  - Project scope, feasibility, user stories, use-case model
  - System architecture, data model, security analysis
  - 5-day development plan and traceability matrix

---

## ✅ Task 2 — Basic Project Setup *(Completed)*

### Project Structure

```
TravelLog/
├── frontend/                    # React (Vite) app — runs on port 3000
│   ├── src/
│   │   ├── App.jsx              # Status page — checks backend connection
│   │   ├── App.css              # Minimal styles
│   │   ├── main.jsx             # React entry point
│   │   └── index.css            # Global CSS reset
│   ├── public/
│   ├── vite.config.js           # Vite + proxy config
│   ├── .env.example             # Environment variable template
│   └── package.json
│
├── backend/                     # Express REST API — runs on port 5000
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js            # MongoDB Atlas connection
│   │   └── routes/
│   │       └── index.js         # API routes (GET /api/health)
│   ├── server.js                # Entry point, middleware, error handlers
│   ├── .env.example             # Environment variable template
│   └── package.json
│
├── README.md                    # Setup guide and documentation
├── .gitignore                   # Ignored files (node_modules, .env, dist)
└── Requirement-Analysis-&-Plan.md
```

---

### Setup Details

#### What was configured:

| Item | Detail |
| :--- | :--- |
| **Frontend** | React 19 scaffolded with Vite 8. Dev server runs on port 3000. |
| **Backend** | Express 5 server with middleware (cors, json parser, 404, error handler). Runs on port 5000. |
| **Database** | Mongoose connects to MongoDB Atlas using `MONGO_URI` from `.env`. |
| **Environment variables** | `dotenv` loads `.env` on startup. `.env.example` files provided for both frontend and backend. |
| **Proxy** | Vite proxies `/api/*` → `localhost:5000` so no CORS issues in development. |
| **Dev workflow** | `nodemon` auto-restarts the backend on file save. |

#### `.env` Rules (Important)
- **No quotes** around values: `MONGO_URI=mongodb+srv://...` ✅ — NOT `MONGO_URI="mongodb+srv://..."` ❌
- **No spaces** around `=`
- **Never commit** `.env` to Git — it is in `.gitignore`
- Share via `.env.example` with placeholder values only

#### Deliverable Achieved
> ✅ React (Vite) runs on `localhost:3000`  
> ✅ Express runs on `localhost:5000`  
> ✅ Express successfully connects to MongoDB Atlas  
> ✅ `GET /api/health` returns `{ status: "ok", message: "TravelLog API is running" }`  
> ✅ React status page confirms both frontend and backend are live

---

### Libraries Used

#### Backend (`backend/package.json`)

| Library | Version | Type | Purpose |
| :--- | :--- | :--- | :--- |
| **express** | ^5.3.0 | dependency | Web server framework — creates HTTP server, defines routes, handles middleware |
| **mongoose** | ^9.12.0 | dependency | MongoDB ODM — connects to Atlas, defines schemas and models, reads/writes data |
| **dotenv** | ^18.0.9 | dependency | Loads `.env` file into `process.env` so secrets stay out of code |
| **cors** | ^2.8.6 | dependency | Middleware that allows the React frontend (port 3000) to call the Express API (port 5000) |
| **nodemon** | ^3.1.14 | devDependency | Watches files and auto-restarts the server on save — development only |

#### Frontend (`frontend/package.json`)

| Library | Version | Type | Purpose |
| :--- | :--- | :--- | :--- |
| **react** | ^19.3.1 | dependency | UI library — builds components, manages state (`useState`), handles side effects (`useEffect`) |
| **react-dom** | ^19.3.1 | dependency | Renders React components into the browser DOM |
| **vite** | ^8.3.6 | devDependency | Build tool and dev server — fast hot reload, proxies `/api` to Express |
| **@vitejs/plugin-react** | ^6.1.2 | devDependency | Vite plugin that enables JSX and React fast refresh |

#### What Each Library Does — Plain English

**`express`**  
Creates the HTTP server and defines which code runs for each URL.  
`app.use(cors())` → allow cross-origin. `app.use(express.json())` → parse request bodies. `app.use('/api', routes)` → route `/api/*` requests.

**`mongoose`**  
Bridges JavaScript and MongoDB. `mongoose.connect(uri)` opens the connection. Later it will be used to define Schemas (data blueprints) and Models (JavaScript classes for CRUD).

**`dotenv`**  
Reads `backend/.env` and loads each `KEY=VALUE` pair into `process.env.KEY`. Must be called with `require('dotenv').config()` as the very first line of `server.js`.

**`cors`**  
Without this, browsers block requests from `localhost:3000` to `localhost:5000` (different ports = different origin). `app.use(cors())` adds the required HTTP headers to every response.

**`nodemon`**  
Runs as `nodemon server.js` instead of `node server.js`. Watches for file changes and automatically restarts — saves you stopping and restarting manually every edit.

**`react` + `react-dom`**  
`react` provides hooks like `useState` (store data) and `useEffect` (run code after render). `react-dom` renders the component tree into `index.html`. Both are needed for a browser React app.

**`vite`**  
Serves the React app during development with instant hot module replacement. The proxy config in `vite.config.js` forwards any `/api` request to `localhost:5000`, so no CORS config is needed on the frontend.

---

### Key Files Explained

#### `backend/server.js`
Entry point. Loads env vars → registers middleware (cors, json) → mounts routes → registers 404 and error handlers → connects to DB → starts listening.

#### `backend/src/config/db.js`
Async function that calls `mongoose.connect(process.env.MONGO_URI)`. On success logs the host. On failure logs the error and calls `process.exit(1)` to stop the server — no point running without a database.

#### `backend/src/routes/index.js`
Defines `GET /api/health` — a simple endpoint that returns `{ status, message, timestamp }`. Used to verify the server is alive and the connection is working.

#### `frontend/src/App.jsx`
On mount (`useEffect` with `[]`), calls `fetch('/api/health')`. Updates `apiStatus` state with the response message. Displays ✅ or ❌ depending on whether the backend responded.

#### `frontend/vite.config.js`
Sets dev port to `3000`. Configures a proxy so that any request to `/api` is forwarded to `http://localhost:5000` — this avoids CORS issues during local development.

---

## 🔲 Task 3 — *(Upcoming)*

---

## 🔲 Task 4 — *(Upcoming)*

---

## 🔲 Task 5 — *(Upcoming)*
