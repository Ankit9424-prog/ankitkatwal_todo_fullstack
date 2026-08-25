// Ankit Katwal
import React from "react";

const TaskCard = ({ task, onToggleComplete, onEdit, onDelete }) => {
  const isCompleted = task.isCompleted;

  const getDueDateInfo = (dateString) => {
    if (!dateString) return { text: "No due date", isOverdue: false, isToday: false };
    
    const dueDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const targetDate = new Date(dueDate);
    targetDate.setHours(0, 0, 0, 0);

    const diffDays = Math.round((targetDate - today) / (1000 * 60 * 60 * 24));
    
    const formatted = dueDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });

    if (diffDays < 0 && !isCompleted) {
      return { text: `${formatted} (Overdue)`, isOverdue: true, isToday: false };
    } else if (diffDays === 0) {
      return { text: "Today", isOverdue: false, isToday: true };
    } else {
      return { text: formatted, isOverdue: false, isToday: false };
    }
  };

  const dueInfo = getDueDateInfo(task.dueDate);

  return (
    <div
      className={`bg-white border rounded-xl p-4 transition-all duration-150 flex flex-col justify-between shadow-xs ${
        isCompleted
          ? "border-gray-200 bg-gray-50/70"
          : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
      }`}
    >
      <div>
        {/* Top Header: Checkbox + Title + Status Tag */}
        <div className="flex items-start gap-3 mb-2">
          <input
            type="checkbox"
            checked={isCompleted}
            onChange={() => onToggleComplete(task)}
            title={isCompleted ? "Mark as Pending" : "Mark as Completed"}
            className="custom-checkbox mt-0.5 shrink-0"
          />

          <div className="flex-1 min-w-0">
            <h3
              className={`text-sm sm:text-base font-semibold leading-snug truncate ${
                isCompleted
                  ? "line-through text-gray-400 font-normal"
                  : "text-gray-900"
              }`}
            >
              {task.title}
            </h3>
          </div>

          <span
            className={`shrink-0 text-[11px] font-medium px-2 py-0.5 rounded-md border ${
              isCompleted
                ? "bg-green-50 text-green-700 border-green-200"
                : dueInfo.isOverdue
                ? "bg-red-50 text-red-700 border-red-200 font-semibold"
                : "bg-amber-50 text-amber-700 border-amber-200"
            }`}
          >
            {isCompleted ? "Completed" : dueInfo.isOverdue ? "Overdue" : "Pending"}
          </span>
        </div>

        {/* Task Description */}
        {task.description ? (
          <p className="text-xs sm:text-sm text-gray-600 pl-7 mb-3 line-clamp-2 leading-relaxed">
            {task.description}
          </p>
        ) : (
          <div className="h-1"></div>
        )}
      </div>

      {/* Bottom Row: Due Date & Action Buttons */}
      <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2 pl-7">
        <div
          className={`flex items-center gap-1.5 text-xs font-medium ${
            isCompleted
              ? "text-gray-400"
              : dueInfo.isOverdue
              ? "text-red-600"
              : "text-gray-500"
          }`}
        >
          <span>📅</span>
          <span>{dueInfo.text}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onEdit(task)}
            title="Edit Task"
            className="px-2.5 py-1 rounded-md bg-gray-50 hover:bg-gray-100 text-gray-700 hover:text-blue-700 text-xs font-medium border border-gray-200 transition-colors cursor-pointer"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(task._id)}
            title="Delete Task"
            className="px-2.5 py-1 rounded-md bg-gray-50 hover:bg-red-50 text-gray-700 hover:text-red-700 text-xs font-medium border border-gray-200 transition-colors cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
