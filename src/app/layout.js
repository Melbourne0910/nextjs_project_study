import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ThemeProvider from "@/context/ThemeContext";

export const metadata = {
  title: "Next.js Project",
  description: "Learning Next.js Routing",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 dark:bg-slate-900 dark:text-gray-100 min-h-screen flex flex-col">
        <ThemeProvider>
          <Navigation />

          <main className="flex-grow p-4">
            {children}
          </main>

          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}