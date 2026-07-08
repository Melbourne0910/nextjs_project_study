"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { sendResetEmail } from "./actions";
import FormError from "@/components/FormError";
import SubmitButton from "@/components/ui/SubmitButton";
import { inputClasses } from "@/lib/styles";

const forgotPasswordSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
});

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("email", data.email);

      const result = await sendResetEmail(formData);

      if (result.success) {
        toast.success(
          "If that email exists, a reset link has been sent."
        );
        reset();
      } else {
        toast.error(result.error || "Something went wrong.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Request failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md p-6">
      <h1 className="mb-4 text-center text-2xl font-bold">
        Forgot Password
      </h1>

      <p className="mb-6 text-center text-gray-600 dark:text-gray-300">
        Enter your email address and we will send you a password reset
        link.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <input
            type="email"
            placeholder="Email"
            className={inputClasses}
            disabled={loading}
            {...register("email")}
          />

          <FormError>{errors.email?.message}</FormError>
        </div>

        <SubmitButton
          isLoading={loading}
          loadingText="Sending..."
        >
          Send Reset Link
        </SubmitButton>
      </form>
    </div>
  );
}
