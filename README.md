# Smart Hostel Cleaning (Full-Stack Website)

Responsive **web** application for hostel cleaning requests (students) and request management (workers).

## Project structure

- `frontend/`: React (Vite) website
- `backend/`: Node.js + Express REST API + MongoDB (Mongoose)

## Features

- **Landing page**: choose Student or Worker
- **Student**
  - Sign up / Sign in with **room number + password**
  - Dashboard:
    - Display room number
    - Schedule cleaning request (time slot)
    - View **today’s requests** (all rooms)
    - View **cleaning history** (your room)
- **Worker**
  - Login (worker ID + password)
  - Dashboard:
    - View requests (today/all)
    - Mark request as completed

## REST API (backend)

- `POST /signup`
- `POST /login`
- `POST /request-cleaning`
- `GET /today-requests`
- `GET /history` (optional `?roomNumber=101`)
- `PATCH /mark-complete`

## Run locally

### 1) Backend

1. Open terminal in `backend/`
2. Install:

```bash
npm install
```

3. Create `.env` from `.env.example` and fill values:
   - `MONGODB_URI`: MongoDB connection string (MongoDB Atlas recommended)
   - `PORT`: backend port (default `4000`)
   - `CLIENT_ORIGIN`: frontend origin(s), comma-separated  
     Example: `http://localhost:5173`

4. Start:

```bash
npm run dev
```

Backend runs at `http://localhost:4000`.

### 2) Frontend

1. Open terminal in `frontend/`
2. Install:

```bash
npm install
```

3. Create `.env` from `.env.example`:
   - `VITE_API_BASE_URL`: `http://localhost:4000`

4. Start:

```bash
npm run dev
```

Frontend runs at `http://localhost:5173`.

## Deployment guide

### MongoDB (Atlas)

1. Create a MongoDB Atlas cluster
2. Create a database user + password
3. Add your IP access (for development) or allow access as needed
4. Copy your connection string → this becomes `MONGODB_URI`

### Deploy backend on Render

1. Push this repo to GitHub
2. In Render: **New + → Web Service**
3. Connect your repo
4. Settings:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add environment variables:
   - `MONGODB_URI` = your MongoDB Atlas connection string
   - `CLIENT_ORIGIN` = your Vercel frontend URL (example: `https://your-app.vercel.app`)
   - `PORT` is provided by Render automatically (you can omit it)
6. Deploy. Copy the Render URL (example: `https://your-backend.onrender.com`)

### Deploy frontend on Vercel

1. In Vercel: **New Project**
2. Import your GitHub repo
3. Settings:
   - **Root Directory**: `frontend`
   - Framework preset: Vite/React (auto-detected)
4. Add environment variables:
   - `VITE_API_BASE_URL` = your Render backend URL (example: `https://your-backend.onrender.com`)
5. Deploy

### Important deployment notes

- **CORS**: set backend `CLIENT_ORIGIN` to your Vercel URL (or comma-separated list of allowed origins).
- **Passwords**: stored securely as bcrypt hashes in MongoDB.

