// Ankit Katwal
import React from "react";

const SkeletonLoader = ({ count = 6, type = "card" }) => {
  if (type === "form") {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <div className="h-5 skeleton-shimmer rounded w-1/3"></div>
        <div className="h-10 skeleton-shimmer rounded-lg w-full"></div>
        <div className="h-5 skeleton-shimmer rounded w-1/4"></div>
        <div className="h-20 skeleton-shimmer rounded-lg w-full"></div>
        <div className="h-10 skeleton-shimmer rounded-lg w-full"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col justify-between h-40 shadow-xs"
        >
          <div>
            <div className="flex items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2.5 w-3/4">
                <div className="h-4 w-4 skeleton-shimmer rounded shrink-0"></div>
                <div className="h-4 skeleton-shimmer rounded w-full"></div>
              </div>
              <div className="h-4 skeleton-shimmer rounded-full w-12 shrink-0"></div>
            </div>

            <div className="space-y-1.5 pl-6">
              <div className="h-3 skeleton-shimmer rounded w-full"></div>
              <div className="h-3 skeleton-shimmer rounded w-4/5"></div>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-100 flex items-center justify-between pl-6">
            <div className="h-3.5 skeleton-shimmer rounded w-20"></div>
            <div className="flex gap-1.5">
              <div className="h-6 w-10 skeleton-shimmer rounded"></div>
              <div className="h-6 w-10 skeleton-shimmer rounded"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
