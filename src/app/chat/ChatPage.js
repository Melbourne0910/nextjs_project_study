"use client";

import { signIn, useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import CourseCard from "@/components/CourseCard";
import FormError from "@/components/FormError";
import SubmitButton from "@/components/ui/SubmitButton";
import { inputClasses } from "@/lib/styles";

const messageSchema = z.object({
  text: z
    .string()
    .trim()
    .min(1, "Message is required")
    .max(500, "Message must be less than 500 characters"),
});

export default function ChatPage({ course }) {
  const { status } = useSession();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      text: "",
    },
  });

  const onSubmit = async (values) => {
    console.log(values);
    reset();
  };

  if (status === "loading") {
    return <p className="p-6 text-center">Loading session...</p>;
  }

  if (status === "unauthenticated") {
    return (
      <div className="mx-auto mt-20 max-w-md text-center">
        <p className="mb-4 text-lg">
          You must be logged in to access the chat room.
        </p>

        <button
          type="button"
          onClick={() => signIn()}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Login
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Chat Room</h1>

      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="lg:w-2/5 xl:w-1/3">
          <CourseCard course={course} />
        </div>

        <section className="flex-1" aria-labelledby="message-form-title">
          <h2 id="message-form-title" className="text-xl font-semibold">
            Join the discussion
          </h2>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-6 flex flex-col gap-4"
          >
            <div>
              <input
                type="text"
                placeholder="Type your message..."
                disabled={isSubmitting}
                aria-invalid={Boolean(errors.text)}
                aria-describedby={errors.text ? "message-error" : undefined}
                className={inputClasses}
                {...register("text")}
              />

              <div id="message-error">
                <FormError>{errors.text?.message}</FormError>
              </div>
            </div>

            <SubmitButton
              isLoading={isSubmitting}
              loadingText="Sending..."
            >
              Send
            </SubmitButton>
          </form>
        </section>
      </div>
    </div>
  );
}
