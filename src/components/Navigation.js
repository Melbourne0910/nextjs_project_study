"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import clsx from "clsx";
import ThemeToggleButton from "./ThemeToggleButton";

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
  const { data: session } = useSession();

  const isActive = (href) => pathname === href;

  const themeToggleButton = <ThemeToggleButton />;

  return (
    <nav className="relative flex items-center justify-between px-6 py-4 shadow">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="rounded p-2 md:hidden"
          aria-label="Toggle navigation menu"
        >
          ☰
        </button>

        <ul
          className={clsx(
            "absolute left-0 z-50 flex w-full flex-col gap-3 bg-white p-4 shadow-md transition-all duration-300 dark:bg-gray-900",
            "md:static md:w-auto md:flex-row md:bg-transparent md:p-0 md:shadow-none",
            isOpen ? "top-full" : "-top-96"
          )}
        >
          {navItems.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={clsx(
                  "flex items-center justify-center rounded px-3 py-2 text-sm transition",
                  isActive(link.href)
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-center gap-3">
        {themeToggleButton}

        {session ? (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-700 dark:text-gray-200">
              Hello, {session.user?.name || session.user?.email || "User"}
            </span>

            <button
              type="button"
              onClick={() => signOut()}
              className="rounded bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
            >
              Login
            </Link>

            <Link
              href="/signup"
              className="rounded bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
