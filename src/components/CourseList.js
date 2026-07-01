"use client";

export default function CourseList({ courses }) {
  return (
    <ul className="space-y-4">
      {courses.map((course) => (
        <li
          key={course.id}
          className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition"
        >
          <h2 className="text-xl font-semibold">{course.title}</h2>
          <p>{course.description}</p>
        </li>
      ))}
    </ul>
  );
}