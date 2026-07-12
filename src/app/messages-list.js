"use client";

import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";

import { getMessages } from "@/app/actions";

function toUtcDate(createdAt) {
  return new Date(`${createdAt.replace(" ", "T")}Z`);
}

export default function MessagesList({ courseId }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignoreResult = false;

    async function fetchMessages() {
      setLoading(true);

      const data = await getMessages(courseId);

      if (!ignoreResult) {
        setMessages([...data].reverse());
        setLoading(false);
      }
    }

    fetchMessages();

    return () => {
      ignoreResult = true;
    };
  }, [courseId]);

  if (loading) {
    return (
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Loading messages...
      </p>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="border-b border-gray-200 pb-6 dark:border-gray-700">
        <h2 className="text-xl font-semibold">Messages</h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          No messages yet.
        </p>
      </div>
    );
  }

  return (
    <div className="border-b border-gray-200 pb-6 dark:border-gray-700">
      <h2 className="mb-4 text-xl font-semibold">Messages</h2>

      <ul className="space-y-3">
        {messages.map((message) => {
          const createdAt = toUtcDate(message.created_at);

          return (
            <li
              key={message.id}
              className="rounded border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <strong>{message.username || "Anonymous"}</strong>
                <time
                  dateTime={createdAt.toISOString()}
                  className="text-xs text-gray-500 dark:text-gray-400"
                >
                  {formatDistanceToNow(createdAt, { addSuffix: true })}
                </time>
              </div>

              <p className="mt-2 break-words">{message.text}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
