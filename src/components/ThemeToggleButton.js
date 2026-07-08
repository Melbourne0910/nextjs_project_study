"use client";

import { Moon, Sun } from "lucide-react";
import { useContext } from "react";
import { ThemeContext } from "@/context/ThemeContext";

export default function ThemeToggleButton() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded border border-gray-200 bg-gray-50 text-gray-900 transition hover:bg-gray-100 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-100 dark:hover:bg-slate-700"
      aria-label="Toggle theme"
      title="Toggle theme"
    >
      {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
    </button>
  );
}
