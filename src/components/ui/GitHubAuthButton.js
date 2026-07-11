"use client";

import clsx from "clsx";
import { signIn } from "next-auth/react";

function GitHubIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-5 shrink-0 fill-current"
      viewBox="0 0 24 24"
    >
      <path d="M12 2C6.48 2 2 6.59 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49 0-.24-.01-1.05-.01-1.91-2.78.62-3.37-1.21-3.37-1.21-.45-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.89 1.57 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.36-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.04 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05A9.3 9.3 0 0 1 12 6.93c.85 0 1.71.12 2.51.35 1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.71 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.07.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.59.69.49A10.23 10.23 0 0 0 22 12.25C22 6.59 17.52 2 12 2Z" />
    </svg>
  );
}

export default function GitHubAuthButton({ mode = "signin" }) {
  const label = mode === "signup"
    ? "Sign up with GitHub"
    : "Sign in with GitHub";

  return (
    <button
      type="button"
      onClick={() => signIn("github", { callbackUrl: "/chat" })}
      className={clsx(
        "flex min-h-11 w-full items-center justify-center gap-2 rounded border px-4 py-2 font-medium transition-colors",
        "border-gray-300 bg-white text-gray-900 hover:bg-gray-100",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600",
        "dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
      )}
    >
      <GitHubIcon />
      <span>{label}</span>
    </button>
  );
}
