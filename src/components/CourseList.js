import CourseCard from "@/components/CourseCard";

export default function CourseList({ courses }) {
  if (courses.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-gray-300 p-6 text-sm text-gray-600 dark:border-slate-700 dark:text-gray-300">
        No courses available yet.
      </p>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
}
