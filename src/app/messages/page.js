"use client";

import { useEffect, useState } from "react";

export default function MessagesPage() {
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const getMessages = async () => {
    const res = await fetch("/api/messages");

    return res.json();
  };

  useEffect(() => {
    async function loadMessages() {
      try {
        const data = await getMessages();
        setMessages(data);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    }

    loadMessages();
  }, []);

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
        const updatedMessages = await getMessages();
        setMessages(updatedMessages);
      } else {
        alert("Failed to save message.");
      }
    } catch (error) {
      console.error("Failed to submit message:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-3xl font-bold">Messages</h1>

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
    </section>
  );
}
