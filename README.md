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
├── frontend/                    # React (Vite) app — port 3000
│   ├── src/
│   │   ├── App.jsx              # Status page — checks backend connection
│   │   ├── App.css              # Minimal styles
│   │   ├── main.jsx             # React entry point
│   │   └── index.css            # Global CSS reset
│   ├── public/
│   ├── vite.config.js           # Vite + /api proxy config
│   ├── .env.example
│   └── package.json
│
├── backend/                     # Express REST API — port 5000
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js            # MongoDB Atlas connection (Mongoose)
│   │   └── routes/
│   │       └── index.js         # GET /api/health
│   ├── server.js                # Entry point, middleware, error handlers
│   ├── .env.example
│   └── package.json
│
├── README.md
├── .gitignore
├── specification.md             # Task log and implementation notes
└── Requirement-Analysis-&-Plan.md
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

### `frontend/.env`

| Variable | Description | Example |
| :------- | :---------- | :------ |
| `VITE_API_URL` | Base URL for backend API calls | `http://localhost:5000/api` |

---

## API Endpoints

| Method | Endpoint | Description | Auth Required |
| :----- | :------- | :---------- | :------------ |
| `GET` | `/api/health` | Server and DB health check | ❌ Public |

> More endpoints will be added per task. See [`Requirement-Analysis-&-Plan.md`](./Requirement-Analysis-&-Plan.md) → Appendix B for the full planned API.

---

## Task Progress

| Task | Description | Status |
| :--- | :---------- | :----: |
| Task 1 | Repository setup + Requirements Analysis & Plan | ✅ Done |
| Task 2 | Basic project setup (React + Express + MongoDB Atlas) | ✅ Done |
| Task 3 | Data models + Authentication + Trip CRUD | 🔲 Upcoming |
| Task 4 | Journal entries, timeline, photos, expenses, sharing | 🔲 Upcoming |
| Task 5 | Testing, deployment, report, presentation | 🔲 Upcoming |

---

## See Also

- [`specification.md`](./specification.md) — detailed task log with implementation notes
- [`Requirement-Analysis-&-Plan.md`](./Requirement-Analysis-&-Plan.md) — full requirements analysis
