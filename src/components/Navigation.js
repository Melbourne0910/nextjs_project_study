"use client";

import Link from "next/link";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useContext, useState } from "react";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { ThemeContext } from "@/context/ThemeContext";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/about/team", label: "Team" },
  { href: "/contact", label: "Contact" },
  { href: "/courses", label: "Courses" },
  { href: "/checkout", label: "Checkout" },
  { href: "/chat", label: "Chat" },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { theme, toggleTheme } = useContext(ThemeContext);

  const activeHref = navItems.reduce((currentHref, item) => {
    const matches =
      item.href === "/"
        ? pathname === item.href
        : pathname === item.href || pathname.startsWith(`${item.href}/`);

    if (!matches) {
      return currentHref;
    }

    return item.href.length > currentHref.length ? item.href : currentHref;
  }, "");

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm dark:bg-slate-900">
      <nav className="relative mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="text-base font-semibold text-gray-950 dark:text-gray-50"
          onClick={() => setIsOpen(false)}
        >
          Next.js Project
        </Link>

        <ul
          id="site-navigation"
          className={clsx(
            "absolute inset-x-0 top-full z-40 flex flex-col gap-2 border-y border-gray-200 bg-white p-4 shadow-md transition duration-200 dark:border-slate-700 dark:bg-slate-900",
            "md:static md:z-auto md:flex md:w-auto md:flex-row md:items-center md:border-0 md:bg-transparent md:p-0 md:shadow-none",
            isOpen
              ? "visible translate-y-0 opacity-100"
              : "invisible -translate-y-2 opacity-0 md:visible md:translate-y-0 md:opacity-100"
          )}
        >
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={clsx(
                  "flex items-center rounded px-3 py-2 text-sm font-medium transition",
                  activeHref === item.href
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-slate-800"
                )}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded border border-gray-200 bg-gray-50 text-gray-900 transition hover:bg-gray-100 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-100 dark:hover:bg-slate-700"
            aria-label="Toggle theme"
            title="Toggle theme"
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          <button
            type="button"
            onClick={() => setIsOpen((current) => !current)}
            className="inline-flex h-10 w-10 items-center justify-center rounded border border-gray-200 bg-gray-50 text-gray-900 transition hover:bg-gray-100 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-100 dark:hover:bg-slate-700 md:hidden"
            aria-label="Toggle navigation menu"
            aria-expanded={isOpen}
            aria-controls="site-navigation"
            title="Toggle navigation menu"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>
    </header>
  );
}
