# Full-Stack To-Do App

A simple full-stack to-do application built with React, Node.js, Express, and MongoDB for the CSE 230 (Web Design and Development) course at Model Institute of Technology (MIT).

## Features

- User registration and login using JWT authentication
- Protected routes so only logged-in users can view and manage their tasks
- Full CRUD task functionality (create, read, update, mark as complete, delete)
- Filter tasks by status (All, Pending, Completed)
- Search tasks by title or description
- Responsive layout for mobile and desktop

## Tech Stack

- **Frontend**: React, Vite, React Router, Axios, Tailwind CSS
- **Backend**: Node.js, Express.js, MongoDB, Mongoose, JSON Web Tokens (JWT), bcryptjs

## Project Structure

```
ankitkatwal_todo_fullstack/
├── backend/
│   ├── config/db.js              # Database connection
│   ├── controllers/              # Route controllers (auth & tasks)
│   ├── middleware/               # Auth token verification & error handlers
│   ├── models/                   # Mongoose schemas (User & Task)
│   ├── routes/                   # API route definitions
│   ├── .env.example              # Environment variables template
│   ├── package.json
│   └── server.js                 # Express server entry point
├── frontend/
│   ├── src/
│   │   ├── components/           # Navbar, TaskCard, TaskModal, etc.
│   │   ├── context/              # AuthContext for login state
│   │   ├── pages/                # Login, Signup, Dashboard
│   │   ├── services/api.js       # Axios API client
│   │   ├── App.jsx               # Routes
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── .gitignore
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB running locally or a MongoDB Atlas connection string

### 1. Backend Setup

```bash
cd backend
npm install
npm run dev
```

The backend server will start on `http://localhost:5000`.

### 2. Frontend Setup

In a new terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend app will start on `http://localhost:5173`.

## API Endpoints

### Authentication (`/api/auth`)

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and receive JWT token
- `GET /api/auth/me` - Get logged-in user details (requires token)

### Tasks (`/api/tasks`)

- `GET /api/tasks` - Get all tasks for the logged-in user
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/:id` - Get a specific task
- `PUT /api/tasks/:id` - Update task details or toggle completion
- `DELETE /api/tasks/:id` - Delete a task

## Student Information

- **Name**: Ankit Katwal
- **Course**: CSE 230: Web Design and Development (Week 8)
- **Institution**: Model Institute of Technology (MIT)
- **Instructor**: Professor Gaurav Raut