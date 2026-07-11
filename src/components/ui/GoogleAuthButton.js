"use client";

import clsx from "clsx";
import { signIn } from "next-auth/react";

function GoogleIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-5 shrink-0"
      viewBox="0 0 24 24"
    >
      <path
        fill="#4285F4"
        d="M21.6 12.23c0-.71-.06-1.4-.18-2.07H12v3.92h5.38a4.6 4.6 0 0 1-2 3.02v2.54h3.24c1.9-1.75 2.98-4.33 2.98-7.41Z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.7 0 4.98-.9 6.63-2.36l-3.24-2.54c-.9.6-2.05.96-3.39.96-2.61 0-4.82-1.76-5.61-4.13H3.04v2.62A10 10 0 0 0 12 22Z"
      />
      <path
        fill="#FBBC05"
        d="M6.39 13.93A6.02 6.02 0 0 1 6.08 12c0-.67.12-1.32.31-1.93V7.45H3.04A10 10 0 0 0 2 12c0 1.63.39 3.17 1.04 4.55l3.35-2.62Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.94c1.47 0 2.79.5 3.83 1.5l2.87-2.87A9.64 9.64 0 0 0 12 2a10 10 0 0 0-8.96 5.45l3.35 2.62C7.18 7.7 9.39 5.94 12 5.94Z"
      />
    </svg>
  );
}

export default function GoogleAuthButton({ mode = "signin" }) {
  const label = mode === "signup"
    ? "Sign up with Google"
    : "Sign in with Google";

  return (
    <button
      type="button"
      onClick={() => signIn("google", { callbackUrl: "/chat" })}
      className={clsx(
        "flex min-h-11 w-full items-center justify-center gap-2 rounded border px-4 py-2 font-medium transition-colors",
        "border-gray-300 bg-white text-gray-700 hover:bg-gray-100",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600",
        "dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
      )}
    >
      <GoogleIcon />
      <span>{label}</span>
    </button>
  );
}
