"use client";

export default function FormError({ children }) {
  if (!children) {
    return null;
  }

  return (
    <p className="mt-1 text-sm text-red-500">
      {children}
    </p>
  );
}