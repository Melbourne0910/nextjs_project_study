import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Next.js Project",
  description: "Learning Next.js Routing",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Navigation />

        <main className="flex-grow p-4">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}