# AI Code Reviewer

A full-stack MERN application that lets users submit code snippets and receive automated, AI-powered code reviews — covering security flaws, bugs, performance bottlenecks, and time/space complexity analysis.

**Live Demo:** [Add your Render/Vercel frontend URL here]
**Backend API:** [Add your Render backend URL here]

---

## Features

- 🔐 **JWT Authentication** — access + refresh token flow with httpOnly cookies and token rotation-theft detection
- 🤖 **AI-Powered Code Analysis** — structured feedback on security, bugs, performance, and Big-O complexity
- 📊 **Review History** — paginated history of all past reviews with severity breakdown
- 🛡️ **Security Hardened** — rate limiting, NoSQL injection prevention, XSS sanitization, CORS, Helmet
- ☁️ **Cloud Database** — MongoDB Atlas with compound indexing and aggregation pipelines
- 🎨 **Modern UI** — React + Tailwind CSS with Monaco code editor

---

## Tech Stack

**Frontend:** React (Vite), Tailwind CSS, Axios, React Router, Monaco Editor, Lucide Icons
**Backend:** Node.js, Express, MongoDB (Mongoose), JWT, Bcrypt, Zod
**AI Layer:** Google Gemini API
**Database:** MongoDB Atlas
**Deployment:** Render (backend + frontend)

---

## Architecture

```
Client (React)  →  Express API (Render)  →  MongoDB Atlas
                          │
                          └──→  Gemini AI API (code analysis)
```

The backend follows a **repository → service → controller → route** layered architecture:

- **Repositories** — isolated data-access layer (Mongoose queries only)
- **Services** — business logic (auth flow, review orchestration, AI integration)
- **Controllers** — thin HTTP handlers, no business logic
- **Middleware** — validation (Zod), authentication (JWT), rate limiting, sanitization, centralized error handling

---

## Project Structure

```
ai-code-reviewer/
├── server/
│   ├── src/
│   │   ├── config/          # env, db, logger setup
│   │   ├── models/          # Mongoose schemas (User, Review)
│   │   ├── repositories/    # data access layer
│   │   ├── services/        # business logic (auth, review, AI)
│   │   ├── controllers/     # route handlers
│   │   ├── routes/          # Express routers
│   │   ├── middleware/      # auth, validation, rate limiting, error handling
│   │   ├── validators/      # Zod schemas
│   │   ├── utils/           # ApiError, ApiResponse, asyncHandler, tokenUtils
│   │   └── app.js
│   ├── server.js
│   └── .env
└── client/
    ├── src/
    │   ├── api/              # axios client with interceptors
    │   ├── context/          # AuthContext
    │   ├── hooks/            # useReview
    │   ├── components/       # editor, review, layout, common
    │   ├── pages/             # Login, Register, Dashboard
    │   └── App.jsx
    └── package.json
```

---

## Getting Started (Local Setup)

### Prerequisites

- Node.js v18+
- MongoDB Atlas account (free tier)
- Google Gemini API key (free tier available at [aistudio.google.com](https://aistudio.google.com))

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/ai-code-reviewer.git
cd ai-code-reviewer
```

### 2. Backend setup

```bash
cd server
npm install
```

Create a `.env` file in `server/`:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_atlas_connection_string
JWT_ACCESS_SECRET=generate_a_64_char_random_hex
JWT_REFRESH_SECRET=generate_a_different_64_char_random_hex
ACCESS_TOKEN_TTL=15m
REFRESH_TOKEN_TTL=7d
AI_API_KEY=your_gemini_api_key
AI_API_URL=https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent
CLIENT_ORIGIN=http://localhost:5173
```

Generate secure JWT secrets:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Run the backend:

```bash
npx nodemon server.js
```

### 3. Frontend setup

```bash
cd ../client
npm install
```

Create a `.env` file in `client/`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Run the frontend:

```bash
npm run dev
```

Visit `http://localhost:5173`.

---

## Environment Variables Reference

| Variable | Description |
|---|---|
| `PORT` | Backend server port |
| `NODE_ENV` | `development` or `production` |
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_ACCESS_SECRET` | Secret for signing access tokens |
| `JWT_REFRESH_SECRET` | Secret for signing refresh tokens |
| `ACCESS_TOKEN_TTL` | Access token lifetime (e.g. `15m`) |
| `REFRESH_TOKEN_TTL` | Refresh token lifetime (e.g. `7d`) |
| `AI_API_KEY` | Google Gemini API key |
| `AI_API_URL` | Gemini `generateContent` endpoint |
| `CLIENT_ORIGIN` | Frontend URL (for CORS) |
| `VITE_API_BASE_URL` | Backend API URL (frontend-side) |

---

## API Endpoints

### Auth

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Create a new account |
| POST | `/api/auth/login` | Log in |
| POST | `/api/auth/refresh` | Refresh access token |
| POST | `/api/auth/logout` | Log out |

### Reviews

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/reviews` | Submit code for AI review |
| GET | `/api/reviews` | List paginated review history |
| GET | `/api/reviews/:id` | Get a single review |
| GET | `/api/reviews/stats/summary` | Severity breakdown (aggregation) |

---

## Security Measures

- Passwords hashed with **bcrypt** (cost factor 12)
- JWT access/refresh token pair with **httpOnly, sameSite** cookies
- Refresh token **hashed** in the database; reuse detection invalidates the session
- **express-mongo-sanitize** — NoSQL injection prevention
- **xss-clean** — XSS sanitization
- **hpp** — HTTP parameter pollution prevention
- **express-rate-limit** — tiered limits on auth and AI-review routes
- **Helmet** — secure HTTP headers
- Strict **CORS** origin allowlist
- **Zod** schema validation on every route
- Request body size capped to prevent payload-based DoS

---

## Deployment

Both frontend and backend are deployed on **Render**:

- Backend: Render **Web Service** (`root: server`, build: `npm install`, start: `node server.js`)
- Frontend: Render **Static Site** (`root: client`, build: `npm install && npm run build`, publish: `dist`)
- Database: **MongoDB Atlas** (cloud-hosted)
- AI: **Google Gemini API**

Environment variables are configured directly in the Render dashboard for each service.

---

## License

MIT

---

## Acknowledgements

Built as a learning project to practice production-grade MERN architecture, JWT authentication flows, OWASP security practices, and AI API integration.