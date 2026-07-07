"use client";

import Link from "next/link";
import Image from "next/image";
import { Clock, Star } from "lucide-react";

export default function CourseCard({
  course,
  showDescription = true,
  showViewDetailsButton = true,
}) {
  const isBestseller =
    course.is_bestseller === 1 || course.is_bestseller === true;

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow transition-shadow hover:shadow-lg dark:border-slate-700 dark:bg-gray-900">
      <div className="relative">
        <Image
          alt={course.title}
          className="h-48 w-full object-cover"
          height={400}
          src={course.image}
          unoptimized
          width={600}
        />

        {course.duration && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-black/70 px-2 py-1 text-xs text-white">
            <Clock aria-hidden="true" size={14} />
            <span>{course.duration}</span>
          </div>
        )}

        {isBestseller && (
          <div className="absolute left-3 top-3 rounded-full bg-yellow-400 px-2 py-1 text-xs font-bold text-black">
            Bestseller
          </div>
        )}

        {course.current_price && (
          <div className="absolute bottom-3 left-3 rounded-full bg-purple-600 px-3 py-1 text-sm font-semibold text-white">
            {course.current_price}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h2 className="mb-2 text-lg font-bold text-gray-900 dark:text-gray-100">
          {course.title}
        </h2>

        {course.subtitle && (
          <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
            {course.subtitle}
          </p>
        )}

        <div className="mb-3 flex items-center gap-2">
          <Star
            aria-hidden="true"
            className="text-yellow-500"
            fill="currentColor"
            size={16}
          />
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {course.rating}
          </span>
          {course.reviews && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {course.reviews} students
            </span>
          )}
        </div>

        {showDescription && course.description && (
          <p className="mb-4 line-clamp-3 text-sm text-gray-600 dark:text-gray-400">
            {course.description}
          </p>
        )}

        {showViewDetailsButton && (
          <div className="mt-auto flex items-center justify-between gap-3">
            {course.original_price && course.current_price && (
              <span className="text-sm text-gray-400 line-through">
                {course.original_price}
              </span>
            )}

            <Link
              className="inline-flex items-center justify-center rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-purple-700"
              href={`/courses/${course.course_slug}`}
            >
              View Details
            </Link>
          </div>
        )}
      </div>
    </article>
  );
}
