"use client";

import { useState } from "react";

export default function MessagesPage() {
  const [newMsg, setNewMsg] = useState("");
  const loading = false;

  const handleSubmit = (e) => {
    e.preventDefault();
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
