// Ankit Katwal
const express = require("express");
const router = express.Router();
const {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");
const { protect } = require("../middleware/authMiddleware");

// Protect all task routes with JWT Bearer middleware
router.use(protect);

router.route("/").post(createTask).get(getTasks);
router.route("/:id").get(getTask).put(updateTask).patch(updateTask).delete(deleteTask);

module.exports = router;
