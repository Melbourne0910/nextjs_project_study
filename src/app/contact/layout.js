export default function ContactLayout({ children }) {
  return (
    <div className="flex flex-col bg-blue-50 dark:bg-blue-900 min-h-screen">
        <header className="p-4 bg-blue-100 dark:bg-blue-950">
            <h2 className="text-xl font-semibold">Contact Section</h2>
        </header>

        <main className="flex-grow p-4">
            {children}
        </main>
    </div>
  );
}