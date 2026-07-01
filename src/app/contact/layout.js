export default function ContactLayout({ children }) {
  return (
    <div className="flex flex-col bg-blue-50">
        <header className="p-4 bg-blue-100">
            Contact Page Header
        </header>

        <main className="flex-grow p-4">
            {children}
        </main>
    </div>
  );
}