import { Suspense } from "react";
import ResetPasswordPage from "./ResetPasswordPage";

export const metadata = {
  title: "Reset Password",
  description: "Set a new password for your account",
};

export default function Page() {
  return (
    <Suspense
      fallback={
        <p className="p-6 text-center">
          Loading reset form...
        </p>
      }
    >
      <ResetPasswordPage />
    </Suspense>
  );
}
