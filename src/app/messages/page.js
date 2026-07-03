"use client";

import { useEffect, useState } from "react";

export default function MessagesPage() {
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/messages");
      const data = await res.json();
      setMessages(data);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  };

  useEffect(() => {
    fetchMessages();
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
        fetchMessages();
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
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">💬 Messages</h1>

      <ul className="space-y-2 mb-6">
        {messages.map((msg) => (
          <li
            key={msg.id}
            className="p-3 border rounded bg-white dark:bg-gray-800"
          >
            {msg.text}
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