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



## ✅ Task 3 — Authentication & Authorization *(Completed)*

### What Was Done

Implemented secure user registration and login using **JWT (JSON Web Tokens)** and **bcryptjs** password hashing. Added a `protect` middleware that guards any route requiring a signed-in user. The backend now enforces that only authenticated users can access protected resources.

---

### New Libraries Installed

| Library | Version | Type | Purpose |
| :--- | :--- | :--- | :--- |
| **bcryptjs** | ^3.0.3 | dependency | Hashes passwords before storing — plaintext passwords are never saved to the database |
| **jsonwebtoken** | ^9.0.3 | dependency | Signs and verifies JWTs — used to authenticate users on protected routes |

---

### Updated Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── db.js                  ← existing (unchanged)
│   ├── models/
│   │   └── User.js                ← NEW — MongoDB user schema
│   ├── routes/
│   │   ├── index.js               ← existing (unchanged)
│   │   └── authRoutes.js          ← NEW — register, login endpoints
│   └── middleware/
│       └── authMiddleware.js      ← NEW — protect() JWT guard
├── server.js                      ← updated — mounts authRoutes
├── .env                           ← updated — added JWT_SECRET, JWT_EXPIRES_IN
└── package.json                   ← updated — bcryptjs, jsonwebtoken added
```

---

### New Files Created

#### `backend/src/models/User.js` — User Schema
Defines the MongoDB document structure for a user account.

| Field | Type | Rules |
| :--- | :--- | :--- |
| `name` | String | Required, trimmed |
| `email` | String | Required, unique, lowercased, trimmed |
| `password` | String | Required, min 8 chars, `select: false` (never returned in queries) |
| `createdAt` | Date | Auto-added by `timestamps: true` |
| `updatedAt` | Date | Auto-added by `timestamps: true` |

> `select: false` on the password field means it is never accidentally returned in any query unless explicitly requested with `.select('+password')`.

---

#### `backend/src/routes/authRoutes.js` — Auth Endpoints

**`POST /api/auth/register`**
1. Validates that `name`, `email`, and `password` are present.
2. Checks password is at least 8 characters.
3. Normalizes email (trim + lowercase).
4. Checks if an account with that email already exists → returns `409` if so.
5. Hashes the password with `bcrypt.hash(password, 12)` (12 salt rounds).
6. Creates the user in MongoDB with `User.create()`.
7. Generates a JWT with `jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn })`.
8. Returns `201` with `{ message, token, user: { id, name, email } }`.

**`POST /api/auth/login`**
1. Validates `email` and `password` are present.
2. Looks up the user by normalized email, explicitly including the password with `.select('+password')`.
3. Returns `401` with a generic message if user not found (avoids revealing whether the email exists).
4. Compares entered password against stored hash using `bcrypt.compare()`.
5. Returns `401` if password doesn't match (same generic message — prevents email enumeration).
6. Generates a JWT and returns `200` with `{ message, token, user: { id, name, email } }`.

---

#### `backend/src/middleware/authMiddleware.js` — `protect` Guard

Middleware function placed in front of any route that requires authentication.

**How it works:**
1. Reads the `Authorization` header — expects format: `Bearer <token>`.
2. If no token is present → returns `401`.
3. Calls `jwt.verify(token, JWT_SECRET)` to decode and validate the token.
4. Looks up the user by the `id` stored in the token payload (excluding password).
5. If user not found → returns `401`.
6. Attaches the user to `req.user` and calls `next()` so the route handler runs.
7. If the token is expired or invalid → returns `401`.

---

### Updated API Endpoints

| Method | Endpoint | Description | Auth Required |
| :----- | :------- | :---------- | :------------ |
| `GET` | `/api/health` | Server health check | ❌ Public |
| `POST` | `/api/auth/register` | Create a new user account | ❌ Public |
| `POST` | `/api/auth/login` | Sign in, returns JWT | ❌ Public |

---

### Updated Environment Variables (`.env`)

| Variable | Purpose | Example Value |
| :--- | :--- | :--- |
| `PORT` | Express server port | `5000` |
| `MONGO_URI` | MongoDB Atlas connection string | `mongodb+srv://...` |
| `NODE_ENV` | Runtime environment | `development` |
| `JWT_SECRET` | Secret key used to sign/verify JWTs | `imsecretjwttoken` |
| `JWT_EXPIRES_IN` | Token expiry duration | `1d` |

> **Security note:** `JWT_SECRET` should be a long random string in production. Never commit the actual `.env` file to Git.

---

### How Authentication Flows

```
── Registration ─────────────────────────────────────────────────

Client  →  POST /api/auth/register  { name, email, password }
                    │
              authRoutes.js
                    │
              Validate fields
                    │
              bcrypt.hash(password, 12)      ← plaintext never stored
                    │
              User.create({ name, email, hashedPassword })
                    │
              jwt.sign({ id }, JWT_SECRET)
                    │
Client  ←  201  { token, user: { id, name, email } }

── Login ────────────────────────────────────────────────────────

Client  →  POST /api/auth/login  { email, password }
                    │
              authRoutes.js
                    │
              User.findOne({ email }).select('+password')
                    │
              bcrypt.compare(entered, stored hash)
                    │
              jwt.sign({ id }, JWT_SECRET)
                    │
Client  ←  200  { token, user: { id, name, email } }

── Protected Route (future) ─────────────────────────────────────

Client  →  GET /api/trips   Authorization: Bearer <token>
                    │
              authMiddleware.protect()
                    │
              jwt.verify(token, JWT_SECRET)   → decoded.id
                    │
              User.findById(id)  → req.user
                    │
              route handler runs with req.user available
                    │
Client  ←  200  { trips: [...] }
```

---

### Deliverable Achieved

> ✅ `POST /api/auth/register` — creates user with hashed password in MongoDB  
> ✅ `POST /api/auth/login` — verifies credentials and returns JWT  
> ✅ `protect` middleware ready to guard any private route  
> ✅ Password never stored or returned in plaintext  
> ✅ Generic error messages prevent email/password enumeration  
> ✅ `JWT_SECRET` and `JWT_EXPIRES_IN` loaded from `.env`

---

### Reference

- [ChatGPT conversation reference](https://chatgpt.com/s/t_6aeec323b6ac819193f836610961d529)
- [jsonwebtoken npm docs](https://www.npmjs.com/package/jsonwebtoken)
- [bcryptjs npm docs](https://www.npmjs.com/package/bcryptjs)

---

## 🔲 Task 4 — *(Upcoming)*

---

## 🔲 Task 5 — *(Upcoming)*
