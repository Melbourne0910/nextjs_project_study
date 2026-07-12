"use client";

export default function MessagesList({ courseId }) {
  return (
    <div className="border-b border-gray-200 pb-6 dark:border-gray-700">
      <h2 className="text-xl font-semibold">Messages</h2>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
        Messages for course: {courseId}
      </p>
    </div>
  );
}
