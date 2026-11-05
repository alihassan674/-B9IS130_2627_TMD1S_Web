# ✈️ TravelLog

> Trip journal with places, photos, notes, and budgets.

A full-stack MERN web application where users can organize trip information in one place, view it as a timeline, and share a curated trip page with others.

---

## Tech Stack

| Layer | Technology |
|:------|:-----------|
| Frontend | React 19 + Vite |
| Backend | Node.js + Express.js |
| Database | MongoDB Atlas (Mongoose) |
| Styling | CSS (plain) → Tailwind planned |

---

## Project Structure

```
TravelLog/
├── frontend/        # React (Vite) frontend — runs on port 3000
├── backend/         # Express REST API — runs on port 5000
├── README.md
└── .gitignore
```

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [npm](https://www.npmjs.com/) v9 or higher
- A [MongoDB Atlas](https://www.mongodb.com/atlas) account with a free cluster

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
cp .env.example .env
```

Open `backend/.env` and fill in your values:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/travellog?retryWrites=true&w=majority
NODE_ENV=development
```

> **How to get your MONGO_URI:**
> 1. Log in to [MongoDB Atlas](https://cloud.mongodb.com)
> 2. Click **Connect** on your cluster → **Drivers**
> 3. Copy the connection string and replace `<username>` and `<password>` with your Atlas credentials

**Install dependencies and start:**

```bash
npm install
npm run dev      # development (nodemon, auto-restart)
# or
npm start        # production
```

The API will be available at: `http://localhost:5000`

**Test the connection:**

```
GET http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "ok",
  "message": "TravelLog API is running",
  "timestamp": "..."
}
```

---

### 3. Frontend Setup

```bash
cd frontend
```

**Create the environment file:**

```bash
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

The app will be available at: `http://localhost:3000`

> The Vite dev server proxies `/api` requests to Express automatically — no CORS issues during development.

---

## Running Both Together

Open **two terminals**:

| Terminal | Command |
|:---------|:--------|
| Terminal 1 (backend) | `cd backend && npm run dev` |
| Terminal 2 (frontend) | `cd frontend && npm run dev` |

Then open `http://localhost:3000` — the page will show ✅ for both React and the MongoDB-connected API.

---

## Environment Variables Reference

### `backend/.env`

| Variable | Description | Example |
|:---------|:------------|:--------|
| `PORT` | Port the Express server listens on | `5000` |
| `MONGO_URI` | MongoDB Atlas connection string | `mongodb+srv://...` |
| `NODE_ENV` | Runtime environment | `development` |

### `frontend/.env`

| Variable | Description | Example |
|:---------|:------------|:--------|
| `VITE_API_URL` | Base URL for the backend API | `http://localhost:5000/api` |

---

## API Endpoints (Initial)

| Method | Endpoint | Description | Auth |
|:-------|:---------|:------------|:-----|
| `GET` | `/api/health` | Health check | Public |

> More endpoints will be added as development progresses. See `Requirement-Analysis-&-Plan.md` → Appendix B for the full planned API.

---

## Module

**B9IS130** – Web Development for Information Systems  
Continuous Assessment 1 – Individual Project  
Dublin Business School, 2026
