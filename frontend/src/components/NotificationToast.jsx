// Ankit Katwal
import React, { useEffect } from "react";

const NotificationToast = ({ notification, onClose }) => {
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        onClose();
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [notification, onClose]);

  if (!notification) return null;

  const isSuccess = notification.type === "success";

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-sm shadow-lg">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${
          isSuccess
            ? "bg-white border-green-200 text-green-900 shadow-green-100"
            : "bg-white border-red-200 text-red-900 shadow-red-100"
        }`}
      >
        <div
          className={`h-6 w-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
            isSuccess
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {isSuccess ? "✓" : "⚠️"}
        </div>

        <div className="text-xs sm:text-sm font-medium pr-1">
          {notification.message}
        </div>

        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-700 ml-auto p-1 text-xs font-bold transition-colors cursor-pointer"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default NotificationToast;
