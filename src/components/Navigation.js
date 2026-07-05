"use client";

import Link from "next/link";
import { useContext } from "react";
import { ThemeContext } from "@/context/ThemeContext";

export default function Navigation() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <header className="bg-gray-100 p-4 shadow-sm dark:bg-slate-800">
      <nav>
        <ul className="flex gap-4 list-none p-0 m-0">
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/about">About</Link>
          </li>
          <li>
            <Link href="/about/team">Team</Link>
          </li>
          <li>
            <Link href="/contact">Contact</Link>
          </li>
          <li>
            <Link href="/courses">Courses</Link>
          </li>
          <li>
            <Link href="/checkout">Checkout</Link>
          </li>
          <li>
            <Link href="/chat">Chat</Link>
          </li>
        </ul>

        <button
          onClick={toggleTheme}
          className="cursor-pointer rounded bg-gray-100 px-3 py-2 text-gray-900 transition hover:bg-gray-200 dark:bg-slate-700 dark:text-gray-100 dark:hover:bg-slate-600"
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>
      </nav>
    </header>
  );
}
