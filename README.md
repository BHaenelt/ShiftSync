ShiftSync
ShiftSync is a full stack web application built to digitize the nurse shift handoff process. Every 12 hours when nursing staff change shifts, critical patient information gets verbally passed from one nurse to the next using a communication framework called SBAR (Situation, Background, Assessment, Recommendation). That process is error prone. ShiftSync gives nurses a structured, documented, and searchable digital handoff system.
Built by a pediatric nurse with 10 years of clinical experience who wanted to solve a real problem she lived every day.
Live App: [shift-sync-alpha.vercel.app](https://shift-sync-alpha.vercel.app)

Tech Stack
Frontend: React 19, React Router v7, Vite, vanilla CSS
Backend: Node.js, Express 5
Database: MongoDB, Mongoose
Authentication: JWT, bcryptjs

Features

Nurse registration and login with JWT authentication and hashed passwords
Patient dashboard showing all active patients sorted by room number
Full patient profiles with MRN, code status, allergies, attending physician, and admitting diagnosis
SBAR structured handoff documentation per patient
Shift handoff history with timestamps per patient
Soft delete for patient records (healthcare records are never truly deleted)
Protected routes on both frontend and backend


Project Structure
ShiftSync/
  client/          React frontend (deployed on Vercel)
  server/          Express backend (deployed on Render)

Running Locally
Backend
bashcd server
npm install
npm run dev
Create a server/.env file:
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=any_random_secret_string
PORT=5000
Frontend
bashcd client
npm install
npm run dev
Create a client/.env file:
VITE_API_URL=http://localhost:5000

In Progress

Add Patient modal on the dashboard
SBAR handoff form (Handoff.jsx)
Auth middleware to protect backend routes
Jest tests for core API endpoints
