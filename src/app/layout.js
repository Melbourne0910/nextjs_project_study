import "./globals.css";

export const metadata = {
  title: "Next.js Project",
  description: "Learning Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}