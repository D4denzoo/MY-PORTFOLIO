<<<<<<< HEAD
# Denzel Osward Chilewa — Portfolio Website

A modern, production-grade personal portfolio for a Data Scientist and Backend Developer. Built with a dark tech editorial aesthetic, live GitHub API integration, animated skill bars, and a working contact form.

---

## 🗂 Folder Structure

```
denzel-portfolio/
├── index.html              ← Main frontend (deploy to Vercel)
├── css/
│   └── style.css           ← All styles (CSS variables, dark theme, animations)
├── js/
│   └── app.js              ← Frontend logic (GitHub API, typing effect, animations)
├── backend/
│   ├── server.js           ← Express.js REST API
│   ├── package.json
│   ├── .env.example        ← Copy to .env and fill in secrets
│   └── .env                ← ⚠ Never commit this file
└── README.md
=======
# 🚀 Denzel osward— Personal Portfolio

A full-stack personal portfolio website built with **React + Vite** (frontend) and **Node.js + Express** (backend).
Frontend is deployed on **Vercel** and backend on **Render**.

---

## ✨ Features

- ⚡ React 18 + Vite — blazing fast builds
- 🎨 Tailwind CSS — utility-first styling with glassmorphism effects
- 🌗 Dark / Light mode with `localStorage` persistence
- 🎭 Framer Motion animations and scroll-triggered reveals
- ⌨️ Typewriter animation in the hero section
- 📱 Fully responsive — mobile, tablet, desktop
- 🔌 REST API backend (Node.js + Express)
- 📬 Contact form with validation, connected to the backend
- 🛡️ CORS, Helmet, Rate Limiting on the backend
- 🗂️ Project filter by category
- 📊 Animated skill progress bars

---

## 🗂️ Project Structure

```
portfolio/
├── frontend/                  # React + Vite app
│   ├── public/
│   ├── src/
│   │   ├── components/        # UI components (Navbar, Hero, About, …)
│   │   ├── hooks/             # useFetch, useDarkMode
│   │   ├── services/          # api.js (axios layer)
│   │   └── App.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── vercel.json
│   └── package.json
│
└── backend/                   # Node.js + Express API
    ├── data/
    │   ├── profile.json       # Profile / skills / education data
    │   └── projects.json      # Projects data
    ├── routes/
    │   ├── profile.js         # GET /api/profile
    │   ├── projects.js        # GET /api/projects
    │   └── contact.js         # POST /api/contact
    ├── server.js
    └── package.json
>>>>>>> 83e621c665f2e33d739902c55315a7a06b40f4ca
```

---

<<<<<<< HEAD
## 🚀 Quick Start

### Frontend (static — no build step needed)

Open `index.html` directly in a browser, or serve with any static file server:

```bash
npx serve .
```

### Backend API

```bash
cd backend
cp .env.example .env
# Edit .env with your credentials
npm install
npm run dev       # Development (nodemon auto-reload)
npm start         # Production
```

Then set your backend URL in the frontend — add to `index.html` before `app.js`:

```html
<script>window.PORTFOLIO_API = 'https://your-api.onrender.com';</script>
```

=======
## 🛠️ Technologies Used

| Layer     | Tech                                          |
|-----------|-----------------------------------------------|
| Frontend  | React 18, Vite, Tailwind CSS, Framer Motion   |
| Backend   | Node.js, Express, express-validator, Helmet   |
| HTTP      | Axios                                         |
| Hosting   | Vercel (frontend), Render (backend)           |
| Version   | Git + GitHub                                  |

---

## ⚙️ Local Installation

### Prerequisites
- Node.js ≥ 18
- npm ≥ 9
- Git

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/portfolio.git
cd portfolio
```

### 2. Set up the Backend

```bash
cd backend
npm install

# Copy example env and edit values
cp .env.example .env

# Start dev server (port 5000)
npm run dev
```

### 3. Set up the Frontend

```bash
cd ../frontend
npm install

# Copy example env (no changes needed for local dev)
cp .env.example .env

# Start dev server (port 5173)
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

> During development, Vite proxies `/api/*` → `http://localhost:5000` automatically.

>>>>>>> 83e621c665f2e33d739902c55315a7a06b40f4ca
---

## 🌐 API Endpoints

<<<<<<< HEAD
| Method | Endpoint          | Description                          |
|--------|-------------------|--------------------------------------|
| GET    | `/`               | Health check                         |
| GET    | `/api/profile`    | Personal profile data                |
| GET    | `/api/skills`     | Skills list with proficiency levels  |
| GET    | `/api/projects`   | Live GitHub repositories             |
| POST   | `/api/contact`    | Submit contact form                  |
| GET    | `/api/messages`   | View messages (requires admin secret)|

### POST /api/contact — Request Body

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Internship Opportunity",
  "message": "Hi Denzel, I'd like to discuss..."
}
```

### POST /api/contact — Response

```json
{
  "success": true,
  "message": "Message received! I'll respond within 24 hours.",
  "data": { "id": 1717000000000, "receivedAt": "2026-05-29T10:00:00.000Z" }
=======
| Method | Endpoint              | Description                         |
|--------|-----------------------|-------------------------------------|
| GET    | `/`                   | Health check, list of endpoints     |
| GET    | `/health`             | Server status                       |
| GET    | `/api/profile`        | Full profile (bio, skills, edu, exp)|
| GET    | `/api/profile/skills` | Skills only                         |
| GET    | `/api/projects`       | All projects (supports `?featured=true`, `?category=Frontend`) |
| GET    | `/api/projects/:id`   | Single project by ID                |
| POST   | `/api/contact`        | Submit contact form                 |

### POST `/api/contact` — Request Body

```json
{
  "name": "kelvin mkini",
  "email": "tibeshagosha21@gmail.com.com",
  "subject": "Project collaboration",
  "message": "Hi denzel, I'd love to discuss a project with you!"
>>>>>>> 83e621c665f2e33d739902c55315a7a06b40f4ca
}
```

---

<<<<<<< HEAD
## ☁ Deployment

### Frontend → Vercel

1. Push the root folder (or just the frontend files) to a GitHub repo
2. Go to [vercel.com](https://vercel.com) → New Project → Import repo
3. Framework: **Other** (static HTML)
4. Output directory: `.` (root)
5. Click **Deploy**

### Backend → Render

1. Push the `backend/` folder to a separate GitHub repo (or monorepo)
2. Go to [render.com](https://render.com) → New Web Service
3. Connect your repo
4. Build Command: `npm install`
5. Start Command: `npm start`
6. Add environment variables from `.env.example`
7. Copy the Render URL → paste as `window.PORTFOLIO_API` in `index.html`

### Backend → Railway

```bash
npm install -g @railway/cli
railway login
cd backend
railway init
railway up
=======
## 🚀 Deployment

### Step 1 — Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/portfolio.git
git push -u origin main
>>>>>>> 83e621c665f2e33d739902c55315a7a06b40f4ca
```

---

<<<<<<< HEAD
## 🔑 Environment Variables

| Variable         | Required | Description                              |
|------------------|----------|------------------------------------------|
| `PORT`           | No       | Server port (default: 5000)              |
| `FRONTEND_URL`   | Yes      | Your Vercel URL (for CORS)               |
| `GITHUB_TOKEN`   | No       | GitHub PAT (raises rate limit to 5000/hr)|
| `EMAIL_SERVICE`  | Yes*     | Email provider (`gmail`)                 |
| `EMAIL_USER`     | Yes*     | Sender email address                     |
| `EMAIL_PASS`     | Yes*     | Gmail App Password                       |
| `ADMIN_SECRET`   | No       | Secret for `/api/messages` endpoint      |

*Required only for email sending. Without them, messages are still saved in memory.

---

## 📧 Gmail App Password Setup

1. Enable 2-Factor Authentication on your Google account
2. Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
3. Select **Mail** → **Other** → Enter `Portfolio API`
4. Copy the 16-character password into `EMAIL_PASS`

---

## 🎨 Customisation

All design tokens are in `css/style.css` under `:root {}`:

```css
:root {
  --accent: #3b82f6;    /* Primary blue */
  --accent-2: #06b6d4;  /* Cyan accent */
  --bg: #080c14;        /* Deep dark background */
}
```

Change `--accent` to instantly re-theme the whole site.

---

## 📄 License

MIT © 2026 Denzel Osward Chilewa
=======
### Step 2 — Deploy Backend to Render

1. Go to [render.com](https://render.com) → **New Web Service**
2. Connect your GitHub repo
3. Set these values:

| Setting         | Value                 |
|-----------------|-----------------------|
| Root Directory  | `backend`             |
| Environment     | Node                  |
| Build Command   | `npm install`         |
| Start Command   | `npm start`           |
| Node Version    | 18                    |

4. Add **Environment Variables**:

| Key               | Value                                      |
|-------------------|--------------------------------------------|
| `NODE_ENV`        | `production`                               |
| `ALLOWED_ORIGINS` | `https://your-portfolio.vercel.app`        |
| `PORT`            | `5000` (Render sets this automatically)    |

5. Click **Deploy**. Note down your Render URL (e.g. `https://portfolio-api-xxxx.onrender.com`).

---

### Step 3 — Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com) → **New Project**
2. Import your GitHub repo
3. Set:

| Setting         | Value      |
|-----------------|------------|
| Root Directory  | `frontend` |
| Framework       | Vite       |
| Build Command   | `npm run build` |
| Output Dir      | `dist`     |

4. Add **Environment Variable**:

| Key            | Value                                           |
|----------------|-------------------------------------------------|
| `VITE_API_URL` | `https://portfolio-api-xxxx.onrender.com`       |

5. Click **Deploy**. Your site is live! 🎉

---

### Step 4 — Update Backend CORS

Go back to Render → Environment Variables, update:
```
ALLOWED_ORIGINS=https://your-portfolio.vercel.app
```
Then redeploy.

---

## 🔑 Environment Variables

### Backend (`backend/.env`)

```env
PORT=5000
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:5173
```

### Frontend (`frontend/.env`)

```env
# Leave empty in dev — Vite proxy handles it
# In production:
VITE_API_URL=https://your-portfolio-api.onrender.com
```

---

## 📦 Package Commands

```bash
# Backend
npm run dev      # Nodemon dev server
npm start        # Production server

# Frontend
npm run dev      # Vite dev server
npm run build    # Production build
npm run preview  # Preview production build locally
```

---

## 🔗 Live Links (fill in after deploying)

| Service   | URL |
|-----------|-----|
| Frontend  | `https://your-portfolio.vercel.app` |
| Backend   | `https://portfolio-api-xxxx.onrender.com` |

---

## 📄 Licence

MIT © Denzel osward
>>>>>>> 83e621c665f2e33d739902c55315a7a06b40f4ca
