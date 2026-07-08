"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { resetPassword } from "./actions";
import FormError from "@/components/FormError";
import SubmitButton from "@/components/ui/SubmitButton";
import { inputClasses } from "@/lib/styles";

const passwordSchema = z.object({
  password: z
    .string()
    .min(8, {
      message: "Password must be at least 8 characters",
    })
    .max(100, {
      message: "Password must be less than 100 characters",
    }),
});

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(passwordSchema),
  });

  if (!token) {
    return (
      <p className="mt-10 text-center text-red-500">
        Invalid reset link.
      </p>
    );
  }

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("token", token);
      formData.append("password", data.password);

      const result = await resetPassword(formData);

      if (result.success) {
        toast.success("Password reset successfully.");
        reset();
        router.push("/login");
      } else {
        toast.error(result.error || "Password reset failed.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Request failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md p-6">
      <h1 className="mb-6 text-center text-2xl font-bold">
        Reset Password
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <input
            type="password"
            placeholder="New Password"
            className={inputClasses}
            disabled={loading}
            {...register("password")}
          />

          <FormError>{errors.password?.message}</FormError>
        </div>

        <SubmitButton
          isLoading={loading}
          loadingText="Resetting..."
        >
          Reset Password
        </SubmitButton>
      </form>
    </div>
  );
}
