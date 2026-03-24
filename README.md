# Hostel Management System

Full-stack web app for college hostels: **students**, **admin**, and **workers** manage cleaning, maintenance, complaints, laundry, mess feedback, lost & found, and notices. UI is simple (white / light blue / grey), responsive, and **bilingual (English + Punjabi)**.

## Tech stack

- **Frontend:** React (Vite), React Router, Axios, Tailwind CSS v4  
- **Backend:** Node.js, Express, JWT auth, Multer (file uploads)  
- **Database:** MongoDB (M Mongoose)

## Project structure

```
smarthostel/
├── backend/
│   ├── src/
│   │   ├── index.js              # Express app, CORS, /uploads static
│   │   ├── config/db.js
│   │   ├── middleware/
│   │   │   ├── auth.js          # JWT sign + requireRole
│   │   │   └── upload.js        # Multer (uploads/ subfolders)
│   │   ├── models/              # User, Complaint, RoomCleaningRequest, LaundryOrder,
│   │   │                        # MessFeedback, LostFoundItem, Notice, AppNotification
│   │   ├── routes/              # auth, dashboard, complaints, cleaning, laundry, mess,
│   │   │                        # lostfound, notices, notifications, admin, worker, student
│   │   └── utils/notify.js
│   └── uploads/                  # Created at runtime (gitignored)
├── frontend/
│   ├── src/
│   │   ├── api/client.js        # Axios + Bearer token + assetUrl()
│   │   ├── auth/storage.js
│   │   ├── i18n/                # English + Punjabi strings
│   │   ├── components/
│   │   └── pages/               # Landing, auth, student/*, admin/*, worker/*
│   └── index.html
└── README.md
```

## Run locally

### 1. MongoDB

Use a local MongoDB or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas). Note the connection string.

### 2. Backend

```bash
cd backend
npm install
```

Copy `backend/.env.example` to `backend/.env` and set:

- `MONGODB_URI` – connection string  
- `JWT_SECRET` – long random string (required for production)  
- `CLIENT_ORIGIN` – `http://localhost:5173` (comma-separated if multiple)  

Start:

```bash
npm run dev
```

API root: `http://localhost:4000`  
Uploaded files are served at `http://localhost:4000/uploads/...`.

### 3. Frontend

```bash
cd frontend
npm install
```

Copy `frontend/.env.example` to `frontend/.env.local` (or `.env`):

- `VITE_API_BASE_URL=http://localhost:4000`

Start:

```bash
npm run dev
```

Open `http://localhost:5173`.

## Main API routes (prefix `/api`)

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/api/auth/signup/student` | Student registration |
| POST | `/api/auth/signup/admin` | Admin registration |
| POST | `/api/auth/signup/worker` | Worker registration |
| POST | `/api/auth/login` | Login (role + email or workerId) |
| GET | `/api/auth/me` | Current user (JWT) |
| GET | `/api/dashboard` | Role-based dashboard summary |
| GET/POST/PATCH | `/api/notifications`, `/api/notifications/:id/read` | In-app notifications |
| POST/GET/PATCH | `/api/complaints`, `/api/complaints/my`, `/api/complaints/upload-images`, … | Complaints by category |
| GET/POST/PATCH | `/api/cleaning/*` | Room cleaning slots, requests, worker completion, student rating |
| GET/POST/PATCH | `/api/laundry/*` | Laundry orders, claim, assign, status |
| POST/GET | `/api/mess-feedback` | Mess ratings + optional image |
| GET/POST/PATCH | `/api/lost-found` | Lost/found + images |
| POST/GET | `/api/notices` | Admin notices (students / workers) |
| GET | `/api/admin/analytics` | Complaint counts by category |
| GET | `/api/admin/workers` | Worker list |
| PATCH | `/api/admin/cleaning/:id/assign` | Assign cleaner |
| GET | `/api/worker/tasks` | Worker task overview |

All protected routes expect header: `Authorization: Bearer <token>`.

## Deployment (optional)

### MongoDB Atlas

Create a cluster, database user, allow network access, copy connection string into `MONGODB_URI`.

### Backend (e.g. Render)

1. New **Web Service**, root directory `backend`.  
2. Build: `npm install` · Start: `npm start`  
3. Env: `MONGODB_URI`, `JWT_SECRET`, `CLIENT_ORIGIN` (your Vercel URL), `PORT` auto on Render.

Ensure the host **persists `uploads/`** or switch to S3-style storage for production files.

### Frontend (e.g. Vercel)

1. Root directory `frontend`, framework Vite.  
2. Env: `VITE_API_BASE_URL=https://your-api.onrender.com` (no trailing slash required).

Redeploy after env changes. Point `CLIENT_ORIGIN` on the backend to the exact Vercel URL.

## Notes

- Passwords are hashed with bcrypt.  
- Roles: `student`, `admin`, `worker`.  
- Room cleaning time slots are fixed **9:00–15:00** (hourly blocks) as per product rules.  
- **Punjabi** UI copy lives in `frontend/src/i18n/strings.js`; toggle is in the header on key pages.
