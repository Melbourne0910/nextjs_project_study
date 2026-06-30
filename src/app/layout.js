import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Next.js Project",
  description: "Learning Next.js Routing",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <header className="bg-gray-100 p-4 shadow-sm">
          <nav>
            <ul
              style={{
                display: "flex",
                gap: "1rem",
                listStyle: "none",
                padding: 0,
                margin: 0,
              }}
            >
              <li><Link href="/">Home</Link></li>
              <li><Link href="/about">About</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </nav>
        </header>

        <main className="flex-grow p-4">
          {children}
        </main>
        <footer className="bg-gray-100 p-4 text-center">
          <p>&copy; 2023 My Website. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}