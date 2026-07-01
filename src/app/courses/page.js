export const metadata = {
  title: "Courses",
  description: "Browse all available courses.",
};

async function getCourses() {
  const res = await fetch("https://example.com/api/courses", {
    next: {
      revalidate: 60,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch courses");
  }

  return res.json();
}

export default async function CoursesPage() {
  const courses = await getCourses();

  return (
    <section className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Available Courses</h1>

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
    </section>
  );
}