"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { sendContactMessage } from "./actions";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  message: z.string().min(5, "Message must be at least 5 characters"),
});

const inputClasses =
  "w-full rounded border border-gray-300 p-3 placeholder:text-gray-500 disabled:cursor-not-allowed disabled:opacity-70 dark:placeholder:text-white/70";
const labelClasses = "mb-1 block font-medium";
const errorClasses = "mt-1 text-sm text-red-500";

export default function ContactPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  async function onSubmit(data) {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("message", data.message);

      // const res = await fetch("/api/contact", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(data),
      // });
      //
      // const result = await res.json();

      const result = await sendContactMessage(formData);

      if (!result.success) {
        toast.error(result.message || "Failed to send message");
        return;
      }

      toast.success("Message sent successfully");
      reset();
    } catch (error) {
      console.error("Failed to submit contact form:", error);
      toast.error("Something went wrong");
    }
  }

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold">Contact Us</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="name" className={labelClasses}>
            Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="Your name"
            disabled={isSubmitting}
            className={inputClasses}
            {...register("name")}
          />
          {errors.name && (
            <p className={errorClasses}>{errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className={labelClasses}>
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Your email"
            disabled={isSubmitting}
            className={inputClasses}
            {...register("email")}
          />
          {errors.email && (
            <p className={errorClasses}>{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="message" className={labelClasses}>
            Message
          </label>
          <textarea
            id="message"
            rows={4}
            placeholder="Your message"
            disabled={isSubmitting}
            className={inputClasses}
            {...register("message")}
          />
          {errors.message && (
            <p className={errorClasses}>{errors.message.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  );
}
