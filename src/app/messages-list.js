"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { ChevronUp } from "lucide-react";

import { getMessages } from "@/app/actions";

const PAGE_SIZE = 10;

function toUtcDate(createdAt) {
  return new Date(`${createdAt.replace(" ", "T")}Z`);
}

export default function MessagesList({ courseId }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const bottomRef = useRef(null);
  const requestVersionRef = useRef(0);
  const shouldScrollToBottomRef = useRef(false);

  const fetchMessages = useCallback(async (newOffset = 0) => {
    const requestVersion = ++requestVersionRef.current;

    setLoading(true);

    try {
      const data = await getMessages(courseId, PAGE_SIZE, newOffset);

      if (requestVersion !== requestVersionRef.current) {
        return;
      }

      const orderedMessages = [...data].reverse();

      if (newOffset === 0) {
        setOffset(0);
        setMessages(orderedMessages);
        shouldScrollToBottomRef.current = true;
      } else {
        setMessages((currentMessages) => [
          ...orderedMessages,
          ...currentMessages,
        ]);
      }

      setHasMore(data.length === PAGE_SIZE);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      if (requestVersion === requestVersionRef.current) {
        setLoading(false);
      }
    }
  }, [courseId]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchMessages(0);
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      requestVersionRef.current += 1;
    };
  }, [fetchMessages]);

  useEffect(() => {
    if (!loading && shouldScrollToBottomRef.current) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      shouldScrollToBottomRef.current = false;
    }
  }, [loading, messages]);

  async function loadMore() {
    if (loading || !hasMore) {
      return;
    }

    const newOffset = offset + PAGE_SIZE;

    setOffset(newOffset);
    await fetchMessages(newOffset);
  }

  if (loading && messages.length === 0) {
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

      {hasMore && (
        <button
          type="button"
          onClick={loadMore}
          disabled={loading}
          className="mb-4 inline-flex min-h-10 items-center justify-center gap-2 rounded bg-gray-100 px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-gray-800 dark:hover:bg-gray-700"
        >
          <ChevronUp aria-hidden="true" size={16} />
          <span>{loading ? "Loading..." : "Load previous messages"}</span>
        </button>
      )}

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

      <div ref={bottomRef} />
    </div>
  );
}
