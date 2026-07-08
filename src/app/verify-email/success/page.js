import Link from "next/link";

export const metadata = {
  title: "Email Verified",
  description: "Your email has been verified successfully",
};

export default function VerifyEmailSuccessPage() {
  return (
    <div className="mx-auto mt-20 max-w-md text-center">
      <h1 className="mb-4 text-3xl font-bold text-green-600">
        Email Verified Successfully
      </h1>

      <p className="mb-6 text-gray-600 dark:text-gray-300">
        Your email has been verified. You can now log in to your
        account.
      </p>

      <Link
        href="/login"
        className="inline-block rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        Log In
      </Link>
    </div>
  );
}
