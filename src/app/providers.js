"use client";

import AuthProvider from "@/components/AuthProvider";
import ToasterClient from "@/components/ToasterClient";
import ThemeProvider from "@/context/ThemeContext";

export default function Providers({ children }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        {children}
        <ToasterClient />
      </AuthProvider>
    </ThemeProvider>
  );
}
