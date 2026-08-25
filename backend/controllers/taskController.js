// Ankit Katwal
const { TaskStore } = require("../models/store");
const mongoose = require("mongoose");

const isInvalidId = (id) => !mongoose.isValidObjectId(id) && typeof id !== "string";

// @desc    Create a new task for the authenticated user
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res, next) => {
  try {
    const { title, description, isCompleted, dueDate } = req.body;

    if (!title || typeof title !== "string" || title.trim() === "") {
      return res.status(400).json({
        error: "Bad Request",
        message: "Task title is required and cannot be empty",
      });
    }

    if (title.trim().length > 100) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Task title cannot exceed 100 characters",
      });
    }

    const task = await TaskStore.create({
      user: req.user._id,
      title: title.trim(),
      description: description ? description.trim() : "",
      isCompleted: Boolean(isCompleted),
      dueDate: dueDate ? new Date(dueDate) : null,
    });

    return res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all tasks for the authenticated user (with optional filter)
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res, next) => {
  try {
    const filter = { user: req.user._id };
    const { completed } = req.query;

    if (completed !== undefined) {
      filter.isCompleted = completed === "true";
    }

    const tasks = await TaskStore.find(filter);
    return res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single task by ID
// @route   GET /api/tasks/:id
// @access  Private
const getTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isInvalidId(id)) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Invalid task ID format",
      });
    }

    const task = await TaskStore.findOne({ _id: id, user: req.user._id });

    if (!task) {
      return res.status(404).json({
        error: "Not Found",
        message: `Task with id ${id} not found`,
      });
    }

    return res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};

// @desc    Update task details or toggle completion status
// @route   PUT /api/tasks/:id or PATCH /api/tasks/:id
// @access  Private
const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, isCompleted, dueDate } = req.body;

    if (isInvalidId(id)) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Invalid task ID format",
      });
    }

    if (title !== undefined) {
      if (typeof title !== "string" || title.trim() === "") {
        return res.status(400).json({
          error: "Bad Request",
          message: "Task title cannot be empty",
        });
      }
      if (title.trim().length > 100) {
        return res.status(400).json({
          error: "Bad Request",
          message: "Task title cannot exceed 100 characters",
        });
      }
    }

    const task = await TaskStore.findOne({ _id: id, user: req.user._id });

    if (!task) {
      return res.status(404).json({
        error: "Not Found",
        message: `Task with id ${id} not found`,
      });
    }

    const updatedTask = await TaskStore.findByIdAndUpdate(
      id,
      {
        $set: {
          ...(title !== undefined && { title: title.trim() }),
          ...(description !== undefined && { description: description.trim() }),
          ...(isCompleted !== undefined && { isCompleted: Boolean(isCompleted) }),
          ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
        },
      },
      { new: true, runValidators: true }
    );

    return res.status(200).json(updatedTask);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a task by ID
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isInvalidId(id)) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Invalid task ID format",
      });
    }

    const task = await TaskStore.findOneAndDelete({ _id: id, user: req.user._id });

    if (!task) {
      return res.status(404).json({
        error: "Not Found",
        message: `Task with id ${id} not found`,
      });
    }

    return res.status(200).json({
      message: "Task successfully deleted",
      id,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
};
