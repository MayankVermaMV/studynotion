# StudyNotion (MERN EdTech Platform)

StudyNotion is a full-stack EdTech platform where instructors can publish courses and students can discover, purchase, and review them.

## Live Demo

- Frontend: https://your-frontend.vercel.app
- Backend API: https://your-backend.onrender.com

## Features

- JWT-based authentication and authorization
- Student and instructor roles
- Course creation, management, and enrollment
- Razorpay payment integration
- Cloudinary media upload/storage
- Gmail SMTP transactional email support
- Course reviews and ratings
- Course search
- Notification APIs

## Tech Stack

- Frontend: React, Redux Toolkit, Tailwind CSS, React Router
- Backend: Node.js, Express.js, Mongoose
- Database: MongoDB Atlas
- Media: Cloudinary
- Payments: Razorpay
- Email: Nodemailer (Gmail SMTP)
- Deployment: Render (backend), Vercel (frontend)

## Project Structure

```text
Study-Notion/
+-- src/                 # React frontend
+-- server/              # Node/Express backend
+-- .env.example         # Full env template (frontend + backend)
+-- server/.env.example  # Backend env template
```

## Local Installation

### Prerequisites

- Node.js 18+
- npm 9+
- MongoDB Atlas cluster
- Cloudinary account
- Razorpay account
- Gmail App Password (for SMTP)

### 1. Install dependencies

```bash
npm install
cd server && npm install
```

### 2. Configure environment variables

Create two files from examples:

- `./.env` (optional frontend vars)
- `./server/.env` (required backend vars)

Use values from `.env.example` and `server/.env.example`.

### 3. Run the app

From project root:

```bash
npm run dev
```

Expected local ports:

- Frontend: http://localhost:3000
- Backend: http://localhost:4000

## Environment Variables

### Backend (`server/.env`)

| Variable | Required | Example |
|---|---|---|
| `PORT` | Yes | `4000` |
| `MONGODB_URL` | Yes | `mongodb+srv://...` |
| `JWT_SECRET` | Yes | `your_secret` |
| `CLOUD_NAME` | Yes | `your_cloudinary_cloud_name` |
| `API_KEY` | Yes | `your_cloudinary_api_key` |
| `API_SECRET` | Yes | `your_cloudinary_api_secret` |
| `FOLDER_NAME` | Yes | `StudyNotion` |
| `RAZORPAY_KEY` | Yes | `rzp_test_xxxxx` |
| `RAZORPAY_SECRET` | Yes | `xxxxx` |
| `MAIL_HOST` | Yes | `smtp.gmail.com` |
| `MAIL_PORT` | Yes | `587` |
| `MAIL_USER` | Yes | `your_email@gmail.com` |
| `MAIL_PASS` | Yes | `your_gmail_app_password` |
| `MAIL_TEST_TO` | Optional | `your_test_recipient@gmail.com` |
| `FRONTEND_URL` | Yes | `http://localhost:3000` |
| `CORS_ORIGIN` | Yes | `http://localhost:3000,https://your-project.vercel.app,https://your-project-*.vercel.app` |

### Frontend (`.env`)

| Variable | Required | Example |
|---|---|---|
| `REACT_APP_BASE_URL` | Yes | `https://your-backend.onrender.com` |
| `REACT_APP_RAZORPAY_KEY` | Yes | `rzp_test_xxxxx` |

## Backend API Mounts

- `/api/v1/auth`
- `/api/v1/course`
- `/api/v1/payment`
- `/api/v1/reviews`
- `/api/v1/search`
- `/api/v1/notifications`
- `/api/v1/test-email`

## Deployment

### Backend on Render

1. Push this repository to GitHub.
2. In Render, create a new **Web Service** from the repo.
3. Set Root Directory to `server`.
4. Build Command: `npm install`
5. Start Command: `npm start`
6. Add all backend environment variables from `server/.env.example`.
7. Set `CORS_ORIGIN` as a comma-separated list (for example: `http://localhost:3000,https://your-project.vercel.app,https://your-project-*.vercel.app`).
8. Deploy and verify `https://your-backend.onrender.com/` responds.

### Frontend on Vercel

1. Import the repository in Vercel.
2. Keep Root Directory as project root (`Study-Notion`).
3. Build Command: `npm run build`
4. Output Directory: `build`
5. Add frontend env vars:
   - `REACT_APP_BASE_URL=https://your-backend.onrender.com`
   - `REACT_APP_RAZORPAY_KEY=rzp_live_or_test_key`
6. Deploy and verify the app loads.

## Production Readiness Checklist

- `.env` and `server/.env` are ignored by `.gitignore`
- No secrets committed to source control
- MongoDB Atlas network access and DB user configured
- Cloudinary and Razorpay keys set correctly
- Gmail App Password configured for SMTP
- `GET /api/v1/test-email?to=your_email@gmail.com` succeeds

## License

This project is for educational and portfolio use.
