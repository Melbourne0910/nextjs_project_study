"use client";

import Link from "next/link";
import toast from "react-hot-toast";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import FormError from "@/components/FormError";
import GitHubAuthButton from "@/components/ui/GitHubAuthButton";
import GoogleAuthButton from "@/components/ui/GoogleAuthButton";
import SubmitButton from "@/components/ui/SubmitButton";
import { inputClasses } from "@/lib/styles";

const loginSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters",
  }),
});

export default function LoginPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    const res = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });

    if (res?.error) {
      toast.error("Invalid email or password");
    } else {
      toast.success("Login successful");
      router.push("/chat");
    }
  };

  return (
    <div className="mt-10 flex flex-col items-center justify-center">
      <div className="w-full max-w-md rounded border bg-white p-6 shadow dark:bg-gray-900">
        <h1 className="mb-6 text-center text-2xl font-bold">
          Login
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email"
              className={inputClasses}
              {...register("email")}
            />

            <FormError>{errors.email?.message}</FormError>
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              className={inputClasses}
              {...register("password")}
            />

            <FormError>{errors.password?.message}</FormError>
          </div>

          <SubmitButton
            isLoading={isSubmitting}
            loadingText="Logging in..."
          >
            Login
          </SubmitButton>
        </form>

        <div className="my-6 flex items-center" aria-hidden="true">
          <div className="flex-1 border-t border-gray-300 dark:border-gray-700" />
          <span className="px-4 text-sm text-gray-500 dark:text-gray-400">
            or
          </span>
          <div className="flex-1 border-t border-gray-300 dark:border-gray-700" />
        </div>

        <div className="space-y-3">
          <GoogleAuthButton />
          <GitHubAuthButton />
        </div>

        <p className="mt-4 text-center text-sm">
          <Link
            href="/forgot-password"
            className="text-blue-600 hover:underline"
          >
            Forgot password?
          </Link>
        </p>
      </div>
    </div>
  );
}
