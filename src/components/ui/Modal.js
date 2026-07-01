"use client";

import { useState } from "react";

export default function Modal({ children }) {
    const [open, setOpen] = useState(true);

    if (!open) return null;

    return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="relative rounded-lg bg-white p-6 shadow-lg">
        <button
          onClick={() => setOpen(false)}
          className="absolute right-3 top-3 text-xl"
          aria-label="Close modal"
        >
          &times;
        </button>

        {children}
      </div>
    </div>
  );
}