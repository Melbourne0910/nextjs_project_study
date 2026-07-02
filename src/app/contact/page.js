"use client";

import toast from "react-hot-toast";

function handleSubmit(e) {
  e.preventDefault();

  toast.success("Message sent successfully!");
}

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-xl rounded-lg border border-gray-200 bg-white p-6 text-gray-900 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-gray-100">
      <h2 className="text-2xl font-bold">Contact Us</h2>

      <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className="mb-2 block text-sm font-medium" htmlFor="name">
            Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="Your name"
            required
            className="w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-800 dark:text-gray-100 dark:placeholder:text-slate-400 dark:focus:border-blue-400 dark:focus:ring-blue-950"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Your email"
            required
            className="w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-800 dark:text-gray-100 dark:placeholder:text-slate-400 dark:focus:border-blue-400 dark:focus:ring-blue-950"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium" htmlFor="message">
            Message
          </label>
          <textarea
            id="message"
            placeholder="Your message"
            rows={5}
            required
            className="min-h-32 w-full resize-y rounded-md border border-gray-300 bg-white px-4 py-2.5 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-800 dark:text-gray-100 dark:placeholder:text-slate-400 dark:focus:border-blue-400 dark:focus:ring-blue-950"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-md bg-blue-600 px-4 py-2.5 font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:bg-blue-500 dark:hover:bg-blue-400 dark:focus:ring-blue-900"
        >
          Send
        </button>
      </form>
    </div>
  );
}
