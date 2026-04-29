<div align="center">
  <img src="https://img.icons8.com/color/96/000000/shield.png" alt="CodeGuard Logo" width="80" />
  <h1 align="center">CodeGuard 2.0</h1>
  <p align="center">
    <strong>Secure and Optimize Your Codebase with AI-Powered Static Analysis</strong>
  </p>
  <p align="center">
    <img src="https://img.shields.io/badge/Frontend-React_18-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React" />
    <img src="https://img.shields.io/badge/Backend-Spring_Boot_3-6DB33F?style=flat-square&logo=spring&logoColor=white" alt="Spring Boot" />
    <img src="https://img.shields.io/badge/Database-PostgreSQL-336791?style=flat-square&logo=postgresql&logoColor=white" alt="PostgreSQL" />
    <img src="https://img.shields.io/badge/Styling-TailwindCSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white" alt="Tailwind" />
  </p>
</div>

<hr />

## 🚀 Overview

**CodeGuard** is a static code analysis platform and quality dashboard designed for modern engineering teams. It scans source files, detects common vulnerabilities, hardcoded secrets, and logic bugs, and visualizes codebase health trends in a sleek, SaaS-style web UI.

It features a **GitHub Repository Analyzer** that evaluates code quality trends commit-by-commit, helping you monitor technical debt and ensure your team ships secure, production-ready code.

## ✨ Key Features

- **Instant Vulnerability Detection**: Drop in a file (`.js`, `.java`, `.py`) and instantly detect security flaws before they reach production.
- **Repository Quality Tracking**: Connect a GitHub repository to monitor complexity, duplication, and style scores over time across multiple branches.
- **Actionable Insights**: Get context-aware, line-by-line suggestions on how to resolve identified code smells.
- **Modern Dashboard**: A clean, responsive dashboard featuring Light/Dark modes, trend charts, and actionable metrics.

## 🛠️ Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Recharts, React Router
- **Backend**: Java, Spring Boot (Maven), JWT Authentication
- **Database**: PostgreSQL
- **Deployments**: Vercel (Frontend), Render (Backend)

## 💻 Local Setup

### 1. Database

Create a PostgreSQL database named `codeguard`.

### 2. Backend Environment Setup

Navigate to the `backend/` directory and configure your environment variables. You can set these in your IDE or environment:

```env
DB_URL=jdbc:postgresql://localhost:5432/codeguard
DB_USERNAME=your_username
DB_PASSWORD=your_password
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRATION=86400000
FRONTEND_URL=http://localhost:5173
GITHUB_TOKEN=ghp_your_optional_github_token
```

Run the backend server:
```bash
mvn spring-boot:run
```
*The API will start on port `8080`.*

### 3. Frontend Environment Setup

Navigate to the `frontend/` directory and create a `.env` file:

```env
VITE_API_URL=http://localhost:8080
```

Install dependencies and start the dev server:
```bash
npm install
npm run dev
```
*The web app will start on port `5173`.*

## 🌐 Live Demo

- **Frontend**: `<YOUR_VERCEL_URL>`
- **Backend API**: `<YOUR_RENDER_URL>`

---

<div align="center">
  <sub>Built with ❤️ by the CodeGuard team.</sub>
</div>
