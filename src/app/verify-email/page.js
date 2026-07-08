export const metadata = {
  title: "Verify Email",
  description: "Check your email to verify your account",
};

export default function VerifyEmailPage() {
  return (
    <div className="mx-auto mt-20 max-w-md text-center">
      <h1 className="mb-4 text-3xl font-bold">
        Check your email
      </h1>

      <p className="text-gray-600 dark:text-gray-300">
        We have sent you a verification link. Please check your inbox
        and click the link to verify your account.
      </p>
    </div>
  );
}
