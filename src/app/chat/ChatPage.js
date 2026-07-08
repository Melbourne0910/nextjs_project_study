"use client";

import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import toast from "react-hot-toast";

export default function ChatPage() {
  const { status } = useSession();
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status !== "authenticated") {
      return;
    }

    async function fetchMessages() {
      try {
        const res = await fetch("/api/messages", { cache: "no-store" });
        const data = await res.json();
        setMessages(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    }

    fetchMessages();
  }, [status]);

  useEffect(() => {
    if (status !== "authenticated") {
      return;
    }

    const eventSource = new EventSource("/api/messages/stream");

    eventSource.onmessage = (event) => {
      const newMessage = JSON.parse(event.data);

      if (newMessage.type === "connected") {
        toast.success("Realtime connection established");
      } else {
        setMessages((prev) => {
          if (prev.some((message) => message.id === newMessage.id)) {
            return prev;
          }

          return [...prev, newMessage];
        });
      }
    };

    return () => {
      eventSource.close();
    };
  }, [status]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newMsg.trim()) return;

    setLoading(true);

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: newMsg }),
      });

      const data = await res.json();

      if (data.success) {
        setNewMsg("");
      } else {
        alert("Failed to save message.");
      }
    } catch (error) {
      console.error("Failed to submit message:", error);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <p className="p-6 text-center">
        Loading session...
      </p>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="mx-auto mt-20 max-w-md text-center">
        <p className="mb-4 text-lg">
          You must be logged in to view messages.
        </p>

        <button
          type="button"
          onClick={() => signIn()}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Login
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">💬 Messages</h1>

      <ul className="space-y-2 mb-6">
        {messages.map((msg) => (
          <li
            key={msg.id}
            className="p-3 border rounded bg-white dark:bg-gray-800"
          >
            <p className="font-bold">
              {msg.username || "Anonymous"}
            </p>

            <p>{msg.text}</p>

            <span className="text-xs text-gray-500">
              {msg.createdAt}
            </span>
          </li>
        ))}
      </ul>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          placeholder="Type a message..."
          required
          disabled={loading}
          className="border p-2 flex-1 rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded text-white bg-blue-600"
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );
}
