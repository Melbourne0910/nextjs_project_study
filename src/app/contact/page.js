"use client";

import toast from "react-hot-toast";

function handleSubmit(e) {
  e.preventDefault();

  toast.success("Message sent successfully!");
}

export default function ContactPage() {
  return (
    <div className="rounded-lg bg-gray-50 p-6 text-gray-900 dark:bg-slate-900 dark:text-gray-100">
      <h2 className="text-2xl font-bold">Contact Us</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Your name"
          required
        />

        <input
          type="email"
          placeholder="Your email"
          required
        />

        <textarea
          placeholder="Your message"
          rows={4}
          required
        />

        <button type="submit">
          Send
        </button>
      </form>
    </div>
  );
}