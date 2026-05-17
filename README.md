# GlobalTNA

GlobalTNA is a full-stack job request app with:

- a Next.js frontend in `frontend/`
- an Express and MongoDB backend in `backend/`

The backend now seeds the sample jobs on startup before the API begins listening.

## Prerequisites

- Node.js 18+
- npm 9+
- MongoDB running locally, or a reachable MongoDB connection string

## Repository Structure

- `frontend/` - Next.js app running on port `3000`
- `backend/` - Express API running on port `5000` by default

## Setup

### 1. Install backend dependencies

```bash
cd backend
npm install
```

### 2. Install frontend dependencies

```bash
cd frontend
npm install
```

### 3. Configure environment variables

Create a `.env` file in `backend/` for backend variables.

Create a `.env.local` file in `frontend/` if you want to override the frontend API URL.

## Required Environment Variables

### Backend

Required in production or any non-local environment:

- `MONGO_URI` or `MONGO_URL`
  MongoDB connection string used by the backend.

Strongly recommended:

- `JWT_SECRET`
  Secret used to sign and verify auth tokens. The code has a development fallback, but you should set this explicitly outside local development.

Optional:

- `PORT`
  Backend port. Defaults to `5000`.

Local development note:

- If `MONGO_URI` and `MONGO_URL` are both unset, the backend falls back to `mongodb://localhost:27017/globaltna` when not running on Railway.

Example `backend/.env`:

```env
MONGO_URI=mongodb://localhost:27017/globaltna
JWT_SECRET=replace-this-with-a-long-random-secret
PORT=5000
```

### Frontend

Optional for local development, recommended when pointing to a custom backend:

- `NEXT_PUBLIC_API_URL`
  Base URL for the backend API. If unset:
  - in development it defaults to `http://localhost:5000`
  - in production it defaults to the deployed Railway backend URL in the code

Example `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Run the Backend

From the backend folder:

```bash
cd backend
npm run dev
```

Or run without nodemon:

```bash
cd backend
npm start
```

The backend will:

- connect to MongoDB
- seed the sample jobs
- start the API server on `http://localhost:5000` unless `PORT` is overridden

Useful endpoints:

- `GET /` - service status
- `GET /health` - health check

## Run the Frontend

From the frontend folder:

```bash
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:3000`.

For a production build:

```bash
cd frontend
npm run build
npm start
```

## Running Both Locally

Use two terminals.

Terminal 1:

```bash
cd backend
npm install
npm run dev
```

Terminal 2:

```bash
cd frontend
npm install
npm run dev
```

Then open:

- frontend: `http://localhost:3000`
- backend: `http://localhost:5000`

## Seeding Jobs Manually

The backend seeds on startup automatically, but you can also run the seed script directly:

```bash
cd backend
npm run seed
```

To clear existing jobs first:

```bash
cd backend
npm run seed -- --reset
```

## Tests

Run backend tests with:

```bash
cd backend
npm test
```
