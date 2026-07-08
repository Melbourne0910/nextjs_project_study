"use client";

export default function SubmitButton({
  isLoading = false,
  children = "Submit",
  loadingText,
  ...props
}) {
  return (
    <button
      type="submit"
      disabled={isLoading}
      className={`w-full rounded px-4 py-2 text-white transition ${
        isLoading
          ? "cursor-not-allowed bg-gray-400"
          : "bg-blue-600 hover:bg-blue-700"
      }`}
      {...props}
    >
      {isLoading ? loadingText || children : children}
    </button>
  );
}