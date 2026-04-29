# CodeGuard

CodeGuard is a static code analysis and quality dashboard that scans source files, detects common vulnerabilities, and visualizes trends and metrics in a modern web UI.

## Tech Stack
- Backend: Java Spring Boot (Maven)
- Frontend: React + Vite + TailwindCSS
- Database: PostgreSQL
- Auth: JWT
- Deployments: Render (backend), Vercel (frontend)

## Local Setup

### Backend
1. Create a PostgreSQL database named `codeguard`.
2. Set the required environment variables:
   - `DB_URL`
   - `DB_USERNAME`
   - `DB_PASSWORD`
   - `JWT_SECRET`
   - `JWT_EXPIRATION`
   - `FRONTEND_URL`
3. From the backend folder:
   - `mvn spring-boot:run`

The API will run on port `8080`.

### Frontend
1. Set the environment variable in `frontend/.env`:
   - `VITE_API_URL=http://localhost:8080`
2. From the frontend folder:
   - `npm install`
   - `npm run dev`

The app will run on port `5173` by default.

## Environment Variables

### Backend
- `DB_URL` - JDBC URL for PostgreSQL
- `DB_USERNAME` - Database username
- `DB_PASSWORD` - Database password
- `JWT_SECRET` - JWT signing key
- `JWT_EXPIRATION` - Token expiration in milliseconds
- `FRONTEND_URL` - Deployed frontend URL for CORS

### Frontend
- `VITE_API_URL` - Backend API base URL

## Live Demo
- Frontend: <YOUR_VERCEL_URL>
- Backend: <YOUR_RENDER_URL>
