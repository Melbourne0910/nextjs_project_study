"use client";

import toast from "react-hot-toast";

export default function ContactPage() {
  const inputClasses =
    "w-full rounded border border-gray-300 p-3 placeholder:text-gray-500 dark:placeholder:text-white/70";

  function handleSubmit(e) {
    e.preventDefault();

    toast.success("Message sent successfully!");
  }

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold">Contact Us</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Your name"
          required
          className={inputClasses}
        />

        <input
          type="email"
          placeholder="Your email"
          required
          className={inputClasses}
        />

        <textarea
          placeholder="Your message"
          rows={4}
          required
          className={inputClasses}
        />

        <button
          type="submit"
          className="rounded bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
        >
          Send
        </button>
      </form>
    </div>
  );
}