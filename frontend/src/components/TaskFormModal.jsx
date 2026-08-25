// Ankit Katwal
import React, { useState, useEffect } from "react";

const TaskFormModal = ({ isOpen, onClose, onSubmit, initialTask = null, isSubmitting = false }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title || "");
      setDescription(initialTask.description || "");
      setDueDate(
        initialTask.dueDate
          ? new Date(initialTask.dueDate).toISOString().split("T")[0]
          : ""
      );
      setIsCompleted(Boolean(initialTask.isCompleted));
    } else {
      setTitle("");
      setDescription("");
      setDueDate("");
      setIsCompleted(false);
    }
    setError("");
  }, [initialTask, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Please enter a task title.");
      return;
    }

    if (title.trim().length > 100) {
      setError("Task title cannot exceed 100 characters.");
      return;
    }

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      isCompleted,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white border border-gray-200 rounded-xl w-full max-w-md p-5 sm:p-6 shadow-xl relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
          <h2 className="text-base sm:text-lg font-bold text-gray-900">
            {initialTask ? "Edit Task" : "Add New Task"}
          </h2>
          <button
            onClick={onClose}
            className="h-7 w-7 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 flex items-center justify-center text-xs font-bold transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Validation Alert */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs font-medium flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-gray-700">
                Title <span className="text-red-500">*</span>
              </label>
              <span className="text-[11px] text-gray-400">
                {title.length}/100
              </span>
            </div>
            <input
              type="text"
              required
              maxLength={100}
              placeholder="e.g., Complete Week 8 Assignment Report"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Description <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea
              rows={3}
              placeholder="Add additional notes or details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
            ></textarea>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Due Date <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer"
            />
          </div>

          {initialTask && (
            <div className="flex items-center gap-2.5 pt-1 bg-gray-50 p-2.5 rounded-lg border border-gray-200">
              <input
                type="checkbox"
                id="isCompletedModal"
                checked={isCompleted}
                onChange={(e) => setIsCompleted(e.target.checked)}
                className="custom-checkbox cursor-pointer"
              />
              <label htmlFor="isCompletedModal" className="text-xs font-medium text-gray-700 cursor-pointer select-none">
                Mark as completed
              </label>
            </div>
          )}

          {/* Buttons */}
          <div className="pt-3 flex items-center justify-end gap-2 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 text-xs sm:text-sm font-medium transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg font-medium text-xs sm:text-sm transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting
                ? "Saving..."
                : initialTask
                ? "Update Task"
                : "Add Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskFormModal;
