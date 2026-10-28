# TravelLog — Complete Full-Stack Agent Specification & Build Blueprint
**Academic Assessment:** Continuous Assessment 1 (CA1) — MSc Computing with Information Systems  
**Module:** B9IS130 Web Development for Information Systems (Level 9), Dublin Business School  
**Module Leader:** Dr. Obinna Izima  
**Target Grade:** High Distinction (70%+)  
**Technology Stack:** MERN (MongoDB Atlas, Express.js, React 19 + Vite, Node.js) with Tailwind CSS v4  

---

## 1. Executive Project Summary & Agent Directive

### 1.1 Objective
Build, verify, and document **TravelLog**, an integrated travel journaling and financial planning information system. TravelLog eliminates fragmented travel organization by allowing users to document visited places, upload cloud-hosted photographs, record multi-category expenses, visualize a dynamic vertical day-by-day timeline, and generate read-only cryptographic shareable links without requiring third-party viewers to authenticate.

### 1.2 Agent Persona & Operating Rules
When generating, modifying, or refactoring code for this project, the coding agent MUST adhere to:
1. **Layered Separation of Concerns:** Strictly adhere to the Controller-Service-Repository pattern. Route handlers define only routing and middleware chains. Business logic belongs exclusively in `controllers/`. Schema definitions and hooks belong in `models/`.
2. **Security-First (OWASP ASVS Alignment):** Zero plaintext passwords (`bcryptjs` with salt round 10). Cryptographic JWT tokens passed in headers. All MongoDB queries must pass through sanitization and `express-validator` to prevent NoSQL injection. Strict Insecure Direct Object Reference (IDOR) checks on every mutation/fetch.
3. **MERN Stack Mandate:** All backend server code is ES Module JavaScript (`"type": "module"` in `package.json`). Frontend is React 19 + Vite + Tailwind CSS.
4. **Third-Party API Integration:** Real external data exchange via OpenWeatherMap REST API to fetch live weather for destinations (satisfies Criterion 4 of the B9IS130 specification).
5. **Clean Version Control:** All work must map to the 10-Day Milestone Conventional Commits structure.

---

## 2. System Architecture & Directory Tree

### 2.1 Decoupled Cloud Topology
```
[ Browser / Mobile Client ] (React 19 + Vite + Tailwind CSS on Vercel)
            │
            ▼ HTTPS / JSON (Axios with JWT Bearer Interceptors)
[ Node.js + Express.js API Server ] (Render / Railway Web Service)
     ├── OWASP Middleware (Helmet, Rate-Limit, CORS, Express-Validator)
     ├── OpenWeatherMap REST API (Live Weather Integration)
     ├── Cloudinary SDK (In-Memory Buffer Stream via Multer)
     └── Mongoose ODM (Relational-like Refs & Populate)
            │
            ▼ TCP/TLS
[ MongoDB Atlas Managed Database ] (eu-west-1 M0 Cluster)
```

### 2.2 Canonical Repository Structure
```
travellog/
├── .gitignore
├── README.md
├── server/
│   ├── .env.example
│   ├── .env
│   ├── package.json
│   ├── server.js
│   ├── config/
│   │   ├── db.js
│   │   └── cloudinary.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── tripController.js
│   │   ├── placeController.js
│   │   ├── expenseController.js
│   │   ├── timelineController.js
│   │   └── weatherController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── uploadMiddleware.js
│   │   ├── validationMiddleware.js
│   │   └── errorMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Trip.js
│   │   ├── Place.js
│   │   └── Expense.js
│   └── routes/
│       ├── authRoutes.js
│       ├── tripRoutes.js
│       ├── placeRoutes.js
│       ├── expenseRoutes.js
│       ├── timelineRoutes.js
│       ├── weatherRoutes.js
│       └── shareRoutes.js
└── client/
    ├── index.html
    ├── vite.config.js
    ├── package.json
    ├── src/
    │   ├── main.jsx
    │   ├── App.jsx
    │   ├── index.css
    │   ├── api/
    │   │   └── axiosInstance.js
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── components/
    │   │   ├── common/
    │   │   │   ├── Navbar.jsx
    │   │   │   ├── Footer.jsx
    │   │   │   ├── ProtectedRoute.jsx
    │   │   │   └── LoadingSpinner.jsx
    │   │   ├── dashboard/
    │   │   │   ├── TripCard.jsx
    │   │   │   ├── CreateTripModal.jsx
    │   │   │   └── WeatherBadge.jsx
    │   │   ├── timeline/
    │   │   │   ├── VerticalTimeline.jsx
    │   │   │   ├── TimelineItem.jsx
    │   │   │   └── DayHeader.jsx
    │   │   ├── budget/
    │   │   │   ├── BudgetOverview.jsx
    │   │   │   ├── ExpenseModal.jsx
    │   │   │   └── SpendingPieChart.jsx
    │   │   └── places/
    │   │       ├── PlaceCard.jsx
    │   │       ├── AddPlaceModal.jsx
    │   │       └── PhotoGallery.jsx
    │   └── pages/
    │       ├── HomePage.jsx
    │       ├── LoginPage.jsx
    │       ├── RegisterPage.jsx
    │       ├── DashboardPage.jsx
    │       ├── TripDetailPage.jsx
    │       ├── SharedTripPage.jsx
    │       └── NotFoundPage.jsx
```

---

## 3. Data Models & Schemas (Mongoose)

### 3.1 `User.js`
```javascript
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters']
    }
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);
```

### 3.2 `Trip.js`
```javascript
import mongoose from 'mongoose';

const tripSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    title: {
      type: String,
      required: [true, 'Trip title is required'],
      trim: true,
      maxlength: 100
    },
    destination: {
      type: String,
      required: [true, 'Destination is required'],
      trim: true
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required']
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required']
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    coverImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828'
    },
    totalBudget: {
      type: Number,
      default: 0,
      min: [0, 'Budget cannot be negative']
    },
    currency: {
      type: String,
      default: 'EUR',
      uppercase: true
    },
    isPublic: {
      type: Boolean,
      default: false
    },
    shareId: {
      type: String,
      unique: true,
      sparse: true,
      index: true
    }
  },
  { timestamps: true }
);

export default mongoose.model('Trip', tripSchema);
```

### 3.3 `Place.js`
```javascript
import mongoose from 'mongoose';

const placeSchema = new mongoose.Schema(
  {
    trip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trip',
      required: true,
      index: true
    },
    name: {
      type: String,
      required: [true, 'Place or landmark name is required'],
      trim: true
    },
    visitDate: {
      type: Date,
      required: [true, 'Visit date is required']
    },
    location: {
      address: { type: String, default: '' },
      lat: { type: Number, default: null },
      lng: { type: Number, default: null }
    },
    notes: {
      type: String,
      trim: true,
      default: ''
    },
    photos: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true }
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model('Place', placeSchema);
```

### 3.4 `Expense.js`
```javascript
import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema(
  {
    trip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trip',
      required: true,
      index: true
    },
    place: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Place',
      default: null
    },
    title: {
      type: String,
      required: [true, 'Expense title is required'],
      trim: true
    },
    amount: {
      type: Number,
      required: [true, 'Expense amount is required'],
      min: [0.01, 'Amount must be greater than zero']
    },
    category: {
      type: String,
      required: true,
      enum: ['Food', 'Transport', 'Lodging', 'Activities', 'Shopping', 'Other'],
      default: 'Other'
    },
    date: {
      type: Date,
      required: [true, 'Expense date is required']
    }
  },
  { timestamps: true }
);

export default mongoose.model('Expense', expenseSchema);
```

---

## 4. RESTful API Specification

All protected endpoints require the HTTP Header:
`Authorization: Bearer <JWT_TOKEN>`

### 4.1 Authentication Endpoints (`/api/auth`)
* `POST /api/auth/register`
  * Body: `{ name, email, password }`
  * Returns: `{ success: true, token, user: { _id, name, email } }`
* `POST /api/auth/login`
  * Body: `{ email, password }`
  * Returns: `{ success: true, token, user: { _id, name, email } }`
* `GET /api/auth/me` [Protected]
  * Returns: `{ success: true, user: { _id, name, email, createdAt } }`

### 4.2 Trip Management (`/api/trips`)
* `GET /api/trips` [Protected]: Returns array of trips owned by `req.user._id`.
* `POST /api/trips` [Protected]: Body: `{ title, destination, startDate, endDate, description, coverImage, totalBudget, currency }`.
* `GET /api/trips/:id` [Protected]: Returns complete trip details. Must verify ownership (`trip.user.toString() === req.user._id.toString()`).
* `PUT /api/trips/:id` [Protected]: Updates trip attributes. Must verify ownership.
* `DELETE /api/trips/:id` [Protected]: Deletes trip and cascades delete to linked Places and Expenses.
* `PATCH /api/trips/:id/share` [Protected]:
  * Body: `{ isPublic: boolean }`
  * Action: Generates a 10-char `nanoid()` if turning public; sets `shareId = null` if made private.

### 4.3 Places & Media Endpoints (`/api/trips/:tripId/places` & `/api/places`)
* `GET /api/trips/:tripId/places` [Protected]: Get all places for a trip, sorted by `visitDate` ascending.
* `POST /api/trips/:tripId/places` [Protected]: Add new place (`name`, `visitDate`, `location`, `notes`).
* `PUT /api/places/:id` [Protected]: Edit place metadata.
* `DELETE /api/places/:id` [Protected]: Delete place and triggers Cloudinary API to remove associated images.
* `POST /api/places/:id/photos` [Protected]: Multipart form upload (`images` array, max 5 files, 5MB each). Streams buffer to Cloudinary and pushes `{ url, publicId }` to `Place.photos`.

### 4.4 Expense Endpoints (`/api/trips/:tripId/expenses` & `/api/expenses`)
* `GET /api/trips/:tripId/expenses` [Protected]: Get all expenses and returns aggregated summary:
  ```json
  {
    "success": true,
    "totalSpent": 485.50,
    "remainingBudget": 514.50,
    "categoryBreakdown": [
      { "category": "Food", "total": 150.00 },
      { "category": "Lodging", "total": 220.00 }
    ],
    "expenses": [ ... ]
  }
  ```
* `POST /api/trips/:tripId/expenses` [Protected]: Record expense (`title`, `amount`, `category`, `date`, `placeId`).
* `DELETE /api/expenses/:id` [Protected]: Delete single expense record.

### 4.5 Standout Feature 1: Chronological Timeline (`/api/trips/:id/timeline`)
* `GET /api/trips/:id/timeline` [Protected]:
  * Merges `Place` documents and `Expense` documents into a unified list.
  * Formats and groups items by day offset:
    ```json
    {
      "success": true,
      "trip": { "title": "Alpine Trek", "destination": "Innsbruck" },
      "days": [
        {
          "dayNumber": 1,
          "date": "2026-06-10",
          "places": [ ... ],
          "expenses": [ ... ],
          "dayTotalSpent": 65.00
        }
      ]
    }
    ```

### 4.6 Standout Feature 2: Public Shared Page (`/api/share/:shareId`)
* `GET /api/share/:shareId` [Public - No Auth Required]:
  * Queries `Trip.findOne({ shareId, isPublic: true })`.
  * If found, executes lean query populating places and expenses.
  * Explicitly sanitizes and removes all user identification (`email`, internal IDs, passwords).

### 4.7 External Web Service: Weather Proxy (`/api/weather/:city`)
* `GET /api/weather/:city` [Protected]:
  * Calls `https://api.openweathermap.org/data/2.5/weather?q={city}&units=metric&appid={WEATHER_API_KEY}`.
  * Returns normalized payload: `{ temp, feels_like, condition, icon, humidity, wind_speed }`.
  * Catches upstream failures gracefully without breaking the UI.

---

## 5. Security & Threat Mitigation Specification (OWASP Top 10)

| Vulnerability | Mitigation Strategy Implemented in TravelLog |
|---|---|
| **A01: Broken Access Control (IDOR)** | Every controller handling `/api/trips/:id`, `/api/places/:id`, or `/api/expenses/:id` confirms the entity's `trip.user` strictly equals `req.user._id`. Rejection returns status `403 Forbidden`. |
| **A02: Cryptographic Failures** | Passwords salted and hashed with `bcryptjs` (factor 10). Secrets stored strictly in `.env`. JWT tokens signed with high-entropy keys with a 7-day expiration. |
| **A03: Injection (NoSQL & XSS)** | `express-validator` validates and sanitizes all input strings (`trim()`, `escape()`). Mongoose strict schemas block arbitrary operator injections (`$gt`). Client React JSX provides default HTML entity escaping. |
| **A05: Security Misconfiguration** | `helmet()` sets `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, and disables `X-Powered-By`. CORS origin locked strictly to client production URL in deployment. |
| **A07: Identification & Auth Failures** | `express-rate-limit` limits login/register attempts to 10 requests per 15 minutes per IP address. |
| **File Upload Exploits** | Multer memory storage blocks direct disk writes. Custom file filter rejects any file whose MIME type is not `image/jpeg`, `image/png`, or `image/webp`. 5MB size limit enforced. |

---

## 6. Ten-Day Implementation Sprint & Commit Sequence

```
Day 1:  chore: initial setup of MERN project with hello world
        chore: configure server folder structure and base middleware
        feat(client): initialize vite react app with tailwind v4

Day 2:  feat(auth): user schema and bcrypt pre-save password hash
        feat(auth): register and login endpoints with jwt generation
        feat(middleware): jwt verification and rate limiter setup

Day 3:  feat(client): axios instance with jwt request interceptor
        feat(client): auth context with localstorage token persistence
        feat(client): responsive login, register, and protected routes

Day 4:  feat(trips): trip model, crud controllers, and idor validation
        feat(client): dashboard page and responsive trip card grid
        feat(client): create and edit trip modals with react-hook-form

Day 5:  feat(places): place model and trip-nested crud endpoints
        feat(client): trip detail layout with tabs for places and timeline
        feat(client): place creation form with coordinates and notes

Day 6:  feat(upload): multer memory buffer and cloudinary cloud storage
        feat(places): photo upload and remote cloudinary deletion api
        feat(client): multi-image uploader and responsive lightbox gallery

Day 7:  feat(expenses): expense model and aggregation pipeline
        feat(client): expense logging form and category selector
        feat(client): budget progress bar and recharts donut breakdown

Day 8:  feat(weather): external openweathermap proxy endpoint
        feat(timeline): chronological timeline endpoint grouping by day
        feat(client): interactive vertical timeline and weather badge

Day 9:  feat(share): nanoid token generator and public share toggle
        feat(share): sanitized public trip endpoint without auth
        feat(client): read-only public trip page and clipboard copy

Day 10: chore: production deployment configuration for vercel and render
        fix: wcag contrast optimization and edge-case error toasts
        docs: comprehensive readme with architecture diagram and live urls
```

---

## 7. Step-by-Step Initial Setup Commands

### Step 1: Root & Server Setup
```bash
mkdir travellog && cd travellog
git init

# Create server
mkdir server && cd server
npm init -y
npm pkg set type="module"
npm install express mongoose cors dotenv bcryptjs jsonwebtoken express-validator helmet morgan multer cloudinary nanoid express-rate-limit axios
npm install -D nodemon
npm pkg set scripts.dev="nodemon server.js"
```

### Step 2: Server `.env` File
Create `server/.env`:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=super_secret_jwt_high_entropy_key_2026_dbs
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
WEATHER_API_KEY=your_openweathermap_api_key
```

### Step 3: Frontend Setup
```bash
cd ..
npm create vite@latest client -- --template react
cd client
npm install
npm install axios react-router-dom lucide-react react-hot-toast react-hook-form recharts date-fns clsx tailwind-merge
npm install -D tailwindcss @tailwindcss/vite
```

### Step 4: Configure `client/vite.config.js`
```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
```

### Step 5: Configure `client/src/index.css`
```css
@import "tailwindcss";
```

---

## 8. Part 2 & Part 3 Academic Deliverables Alignment

### 8.1 Technical Report Structure (Part 2 - 20 Marks, Min 2,000 Words)
1. **Introduction & Problem Definition:** Fragmentation of travel logs, empirical critique of existing platforms (Polarsteps, Wanderlog).
2. **Requirements Analysis:** Personas (Liam the Backpacker, Priya the Family Planner, External Viewer), Functional and Non-Functional Requirements.
3. **Architecture & Technology Justification:** Why MERN was selected over MEAN/Django; NoSQL vs. Relational document modeling; MVC pattern.
4. **Security & Threat Mitigation:** Detailed OWASP mapping (IDOR, bcrypt hashing, JWT hygiene, input sanitization).
5. **Testing Strategy & Verification:** Postman test suites, client error boundaries, edge cases, mobile viewport testing.
6. **Deployment & Environment Configuration:** Vercel edge deployment, Render web service, Atlas cloud configuration.
7. **Critical Reflection & Limitations:** Honest review of technical debt, limitations (lack of WebSockets, offline PWA capability), future work.
8. **Harvard Referencing:** Complete citations for all academic literature, official documentation, and third-party APIs.

### 8.2 Presentation & Live Demo Timing (Part 3 - 10 Marks, 10–15 Mins)
* **1–2 Min:** Problem domain, target personas, and market gap.
* **2–3 Min:** System architecture, database ERD, and security mechanisms.
* **5–7 Min:** Live end-to-end walkthrough:
  1. Register new user & demonstrate JWT login.
  2. Create trip and show real-time OpenWeatherMap destination weather.
  3. Add places and upload images to Cloudinary.
  4. Log expenses and inspect Recharts donut visualization.
  5. Switch to Vertical Timeline view.
  6. Toggle Public Share and open the link in an Incognito tab to prove unauthenticated read-only access.
* **2–3 Min:** Engineering challenges, reflection, and examiner Q&A defense.