import Link from "next/link";

export default function Navigation() {
  return (
    <header className="bg-gray-100 p-4 shadow-sm">
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
        </ul>
      </nav>
    </header>
  );
}