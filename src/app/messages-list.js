"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronUp } from "lucide-react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

import { getMessages } from "@/app/actions";
import MessageItem from "@/app/chat/MessageItem";

const PAGE_SIZE = 10;

export default function MessagesList({ courseId }) {
  const { data: session, status: sessionStatus } = useSession();
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

  useEffect(() => {
    if (sessionStatus !== "authenticated") {
      return;
    }

    const eventSource = new EventSource("/api/messages/stream");

    eventSource.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);

        switch (payload.type) {
          case "connected":
            toast.success("Connected to live chat");
            break;
          case "new":
            if (payload.data?.course_id !== courseId) {
              return;
            }

            shouldScrollToBottomRef.current = true;
            setMessages((currentMessages) => {
              const alreadyExists = currentMessages.some(
                (message) => message.id === payload.data.id
              );

              return alreadyExists
                ? currentMessages
                : [...currentMessages, payload.data];
            });
            break;
          case "delete":
            setMessages((currentMessages) =>
              currentMessages.filter(
                (message) => message.id !== payload.data
              )
            );
            break;
          default:
            console.warn("Unknown payload type:", payload.type);
        }
      } catch (error) {
        console.error("Failed to parse live message:", error);
      }
    };

    eventSource.onerror = () => {
      console.error("Live chat connection lost. Reconnecting...");
    };

    return () => {
      eventSource.close();
    };
  }, [courseId, sessionStatus]);

  async function loadMore() {
    if (loading || !hasMore) {
      return;
    }

    const newOffset = offset + PAGE_SIZE;

    setOffset(newOffset);
    await fetchMessages(newOffset);
  }

  async function handleDelete(id) {
    const deletedIndex = messages.findIndex((message) => message.id === id);
    const deletedMessage = messages[deletedIndex];

    setMessages((currentMessages) =>
      currentMessages.filter((message) => message.id !== id)
    );

    try {
      const response = await fetch("/api/messages", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to delete message");
      }

      toast.success("Message deleted");
    } catch (error) {
      if (deletedMessage) {
        setMessages((currentMessages) => {
          if (currentMessages.some((message) => message.id === id)) {
            return currentMessages;
          }

          const restoredMessages = [...currentMessages];
          const restoreIndex = Math.min(deletedIndex, restoredMessages.length);
          restoredMessages.splice(restoreIndex, 0, deletedMessage);
          return restoredMessages;
        });
      }

      console.error("Failed to delete message:", error);
      toast.error("Failed to delete message");
    }
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
        {messages.map((message) => (
          <MessageItem
            key={message.id}
            message={message}
            session={session}
            onDelete={handleDelete}
          />
        ))}
      </ul>

      <div ref={bottomRef} />
    </div>
  );
}
