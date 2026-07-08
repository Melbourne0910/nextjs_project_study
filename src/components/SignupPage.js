"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { registerUser } from "@/actions";
import FormError from "@/components/FormError";
import SubmitButton from "@/components/ui/SubmitButton";
import { inputClasses } from "@/lib/styles";

const signupSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Name must be at least 2 characters",
    })
    .max(50, {
      message: "Name must be less than 50 characters",
    }),

  email: z.string().email({
    message: "Please enter a valid email address",
  }),

  password: z
    .string()
    .min(8, {
      message: "Password must be at least 8 characters",
    })
    .max(100, {
      message: "Password must be less than 100 characters",
    }),
});

export default function SignupPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("password", data.password);

      const result = await registerUser(formData);

      if (result.success) {
        toast.success(
          "Account created. Please check your email to verify your account."
        );

        reset();
        router.push("/verify-email");
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="mx-auto max-w-md p-6">
      <h1 className="mb-6 text-center text-2xl font-bold">
        Create Account
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Full Name"
            className={inputClasses}
            {...register("name")}
          />
          <FormError>{errors.name?.message}</FormError>
        </div>

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
          loadingText="Signing up..."
        >
          Sign Up
        </SubmitButton>
      </form>
    </div>
  );
}
