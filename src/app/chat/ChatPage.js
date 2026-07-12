"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { getCourses } from "@/app/actions";
import MessagesList from "@/app/messages-list";
import CourseCard from "@/components/CourseCard";
import ErrorBoundary from "@/components/ErrorBoundary";
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

export default function ChatPage() {
  const { status } = useSession();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const inputRef = useRef(null);
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
  const { ref: textInputRef, ...textField } = register("text");

  useEffect(() => {
    if (status !== "authenticated") {
      return;
    }

    async function loadCourses() {
      try {
        const data = await getCourses();

        setCourses(data);
        setSelectedCourse((currentCourseId) => {
          const currentCourseStillExists = data.some(
            (course) => course.id === currentCourseId
          );

          return currentCourseStillExists
            ? currentCourseId
            : data[0]?.id ?? null;
        });

        if (data.length === 0) {
          console.warn("No courses found.");
        }
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      }
    }

    loadCourses();
  }, [status]);

  const onSubmit = async (values) => {
    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: values.text,
          courseId: selectedCourse,
        }),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        console.error(data.error || "Failed to send message");
        return;
      }

      reset();
      setTimeout(() => inputRef.current?.focus(), 500);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const selectedCourseData = courses.find(
    (course) => course.id === selectedCourse
  );

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

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_2fr]">
        <aside>
          {selectedCourseData && (
            <div className="lg:sticky lg:top-8">
              <CourseCard
                course={selectedCourseData}
                showDescription={false}
                showViewDetailsButton={false}
              />

              <div className="mt-4">
                <label
                  htmlFor="course-select"
                  className="mb-2 block font-medium"
                >
                  Select Course
                </label>

                <select
                  id="course-select"
                  value={selectedCourse}
                  onChange={(event) =>
                    setSelectedCourse(Number(event.target.value))
                  }
                  className={inputClasses}
                >
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </aside>

        <section className="flex-1" aria-labelledby="message-form-title">
          {selectedCourse ? (
            <ErrorBoundary key={selectedCourse}>
              <Suspense
                fallback={
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Loading messages...
                  </p>
                }
              >
                <MessagesList courseId={selectedCourse} />
              </Suspense>
            </ErrorBoundary>
          ) : (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Loading courses...
            </p>
          )}

          <h2
            id="message-form-title"
            className="mt-6 text-xl font-semibold"
          >
            Join the discussion
          </h2>

          <form
            // The submit callback reads the ref only after the request completes.
            // eslint-disable-next-line react-hooks/refs
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
                {...textField}
                ref={(element) => {
                  textInputRef(element);
                  inputRef.current = element;
                }}
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
