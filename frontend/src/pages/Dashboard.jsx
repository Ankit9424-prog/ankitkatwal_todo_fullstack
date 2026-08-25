// Ankit Katwal
import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import TaskCard from "../components/TaskCard";
import TaskFormModal from "../components/TaskFormModal";
import SkeletonLoader from "../components/SkeletonLoader";
import NotificationToast from "../components/NotificationToast";
import { taskAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // 'all', 'completed', 'pending'
  const [sortBy, setSortBy] = useState("newest"); // 'newest', 'oldest', 'dueDate'
  const [searchTerm, setSearchTerm] = useState("");
  const [quickTitle, setQuickTitle] = useState("");
  const [isQuickAdding, setIsQuickAdding] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const filterParam =
        filter === "completed" ? "true" : filter === "pending" ? "false" : undefined;
      const res = await taskAPI.getTasks(filterParam);
      setTasks(res.data);
    } catch (err) {
      console.error("Failed to load tasks:", err);
      showNotification("Failed to fetch tasks from server", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [filter]);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
  };

  const handleOpenCreateModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleQuickAdd = async (e) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;

    try {
      setIsQuickAdding(true);
      const res = await taskAPI.createTask({
        title: quickTitle.trim(),
        description: "",
        isCompleted: false,
      });
      setTasks((prev) => [res.data, ...prev]);
      setQuickTitle("");
      showNotification("Task created successfully!");
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to create task.";
      showNotification(msg, "error");
    } finally {
      setIsQuickAdding(false);
    }
  };

  const handleSaveTask = async (taskData) => {
    try {
      setIsSubmitting(true);
      if (editingTask) {
        // Update task
        const res = await taskAPI.updateTask(editingTask._id, taskData);
        setTasks((prev) =>
          prev.map((t) => (t._id === editingTask._id ? res.data : t))
        );
        showNotification("Task updated successfully!");
      } else {
        // Create task
        const res = await taskAPI.createTask(taskData);
        setTasks((prev) => [res.data, ...prev]);
        showNotification("Task created successfully!");
      }
      setIsModalOpen(false);
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to save task.";
      showNotification(msg, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleComplete = async (task) => {
    // Optimistic UI update
    const newStatus = !task.isCompleted;
    setTasks((prev) =>
      prev.map((t) => (t._id === task._id ? { ...t, isCompleted: newStatus } : t))
    );

    try {
      await taskAPI.updateTask(task._id, { isCompleted: newStatus });
      showNotification(
        newStatus ? "Task marked as completed." : "Task marked as pending."
      );
    } catch (err) {
      // Rollback
      setTasks((prev) =>
        prev.map((t) => (t._id === task._id ? { ...t, isCompleted: !newStatus } : t))
      );
      showNotification("Failed to update task status on server", "error");
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }

    try {
      await taskAPI.deleteTask(id);
      setTasks((prev) => prev.filter((t) => t._id !== id));
      showNotification("Task deleted successfully!");
    } catch (err) {
      showNotification("Failed to delete task from server", "error");
    }
  };

  // Search filter
  let filteredTasks = tasks.filter((t) =>
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (t.description && t.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Sorting
  filteredTasks.sort((a, b) => {
    if (sortBy === "oldest") {
      return new Date(a.createdAt) - new Date(b.createdAt);
    } else if (sortBy === "dueDate") {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    }
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const totalTasks = tasks.length;
  const completedCount = tasks.filter((t) => t.isCompleted).length;
  const pendingCount = totalTasks - completedCount;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col font-sans">
      <Navbar
        onOpenCreateModal={handleOpenCreateModal}
        taskStats={{ total: totalTasks, pending: pendingCount, completed: completedCount }}
      />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Welcome Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Welcome back, {user?.name || "Student"}
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              CSE 230: Web Design and Development - Full-Stack Task Management
            </p>
          </div>

          <button
            onClick={handleOpenCreateModal}
            className="self-start sm:self-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm px-4 py-2 rounded-lg shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
          >
            <span>+</span> Add New Task
          </button>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Tasks</p>
              <h4 className="text-2xl font-bold text-gray-900 mt-1">{totalTasks}</h4>
            </div>
            <div className="h-10 w-10 rounded-lg bg-blue-50 text-blue-700 font-bold flex items-center justify-center text-base">
              📋
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Pending</p>
              <h4 className="text-2xl font-bold text-amber-600 mt-1">{pendingCount}</h4>
            </div>
            <div className="h-10 w-10 rounded-lg bg-amber-50 text-amber-700 font-bold flex items-center justify-center text-base">
              ⏳
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Completed</p>
              <h4 className="text-2xl font-bold text-emerald-600 mt-1">{completedCount}</h4>
            </div>
            <div className="h-10 w-10 rounded-lg bg-emerald-50 text-emerald-700 font-bold flex items-center justify-center text-base">
              ✓
            </div>
          </div>
        </div>

        {/* Quick Add Bar */}
        <form
          onSubmit={handleQuickAdd}
          className="bg-white border border-gray-200 rounded-xl p-2 mb-6 flex items-center gap-2 shadow-xs"
        >
          <input
            type="text"
            placeholder="Quick add task title... (press Enter to save)"
            value={quickTitle}
            onChange={(e) => setQuickTitle(e.target.value)}
            className="flex-1 bg-transparent border-none text-gray-900 text-sm placeholder-gray-400 focus:outline-none px-3 py-1"
          />
          <button
            type="submit"
            disabled={isQuickAdding || !quickTitle.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold disabled:opacity-40 transition-colors cursor-pointer shrink-0"
          >
            {isQuickAdding ? "Adding..." : "Add"}
          </button>
        </form>

        {/* Search, Filter Tabs & Sort */}
        <div className="bg-white border border-gray-200 rounded-xl p-3 mb-6 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
          {/* Search Input */}
          <div className="w-full sm:w-72 relative">
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-8 pr-8 py-1.5 text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-blue-500 transition-colors"
            />
            <span className="absolute left-2.5 top-2 text-gray-400 text-xs">🔍</span>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-2.5 top-1.5 text-gray-400 hover:text-gray-600 text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filter Pills & Sort Select */}
          <div className="flex items-center justify-between w-full sm:w-auto gap-3">
            {/* Filter Tabs */}
            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setFilter("all")}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                  filter === "all"
                    ? "bg-white text-gray-900 shadow-xs"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                All ({totalTasks})
              </button>
              <button
                onClick={() => setFilter("pending")}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                  filter === "pending"
                    ? "bg-white text-gray-900 shadow-xs"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Pending ({pendingCount})
              </button>
              <button
                onClick={() => setFilter("completed")}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                  filter === "completed"
                    ? "bg-white text-gray-900 shadow-xs"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Completed ({completedCount})
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <span>Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-md px-2 py-1 text-xs font-medium text-gray-700 focus:outline-none cursor-pointer"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="dueDate">Due Date</option>
              </select>
            </div>
          </div>
        </div>

        {/* Task Cards Grid */}
        {loading ? (
          <SkeletonLoader count={6} type="card" />
        ) : filteredTasks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onToggleComplete={handleToggleComplete}
                onEdit={handleOpenEditModal}
                onDelete={handleDeleteTask}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white border border-dashed border-gray-300 rounded-xl p-10 text-center my-4">
            <div className="h-12 w-12 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-3 text-xl">
              📝
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-1">
              {searchTerm ? "No matching tasks found" : "No tasks in this list"}
            </h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto mb-4">
              {searchTerm
                ? "Try searching for a different keyword or clear the search filter."
                : "You don't have any tasks here yet. Click below to add your first task."}
            </p>
            <button
              onClick={handleOpenCreateModal}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2 rounded-lg transition-colors cursor-pointer"
            >
              + Add New Task
            </button>
          </div>
        )}
      </main>

      {/* Task Modal */}
      <TaskFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveTask}
        initialTask={editingTask}
        isSubmitting={isSubmitting}
      />

      {/* Notification Toast */}
      <NotificationToast
        notification={notification}
        onClose={() => setNotification(null)}
      />
    </div>
  );
};

export default Dashboard;
