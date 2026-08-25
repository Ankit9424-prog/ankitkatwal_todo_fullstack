// Ankit Katwal
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const notFound = require("./middleware/notFoundMiddleware");
const errorHandler = require("./middleware/errorMiddleware");

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB Database
connectDB();

// Global Middleware
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

// API Status & Health Check Route
app.get("/", (req, res) => {
  res.status(200).json({
    status: "Active",
    application: "Full-Stack To-Do Application REST API Backend",
    author: "Ankit Katwal",
    course: "CSE 230 Web Design & Development (Week 8)",
    endpoints: {
      auth: {
        register: "POST /api/auth/register",
        login: "POST /api/auth/login",
        me: "GET /api/auth/me (Protected)",
        logout: "POST /api/auth/logout",
      },
      tasks: {
        createTask: "POST /api/tasks (Protected)",
        getAllTasks: "GET /api/tasks (Protected, filter: ?completed=true)",
        getTaskById: "GET /api/tasks/:id (Protected)",
        updateTask: "PUT/PATCH /api/tasks/:id (Protected)",
        deleteTask: "DELETE /api/tasks/:id (Protected)",
      },
    },
  });
});

// Mount Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  console.log(`[Server] Full-Stack To-Do Backend running on http://127.0.0.1:${PORT}`);
});

module.exports = app;
