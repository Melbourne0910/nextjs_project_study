import db from "@/lib/db-setup";
import { notFound } from "next/navigation";
import CourseCard from "@/components/CourseCard";

function getCourseBySlug(slug) {
  return db
    .prepare("SELECT * FROM courses WHERE course_slug = ?")
    .get(slug);
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const course = getCourseBySlug(slug);

  if (!course) {
    return {};
  }

  return {
    title: `${course.title} | Course Details`,
    description: course.description,
    openGraph: {
      title: course.title,
      description: course.description,
      images: [course.image],
    },
  };
}

export default async function CourseDetailPage({ params }) {
  const { slug } = await params;
  const course = getCourseBySlug(slug);

  if (!course) {
    notFound();
  }

  const thingsToLearn = course.whatYouWillLearn
    ? course.whatYouWillLearn.split(",").map((item) => item.trim())
    : [];

  return (
    <main className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-8 md:grid-cols-[1fr_2fr]">
      <aside className="md:sticky md:top-8 md:self-start">
        <CourseCard
          course={course}
          showDescription={false}
          showViewDetailsButton={false}
        />
      </aside>

      <section className="flex flex-col gap-8">
        <div>
          <h1 className="text-4xl font-bold">
            {course.title}
          </h1>

          <p className="mt-4 text-gray-600 dark:text-gray-300">
            {course.description}
          </p>
        </div>

        {thingsToLearn.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold">
              What you&apos;ll learn
            </h2>

            <ul className="mt-4 list-inside list-disc space-y-2 text-gray-700 dark:text-gray-300">
              {thingsToLearn.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {course.curriculum && (
          <div>
            <h2 className="text-2xl font-semibold">
              Curriculum
            </h2>

            <p className="mt-4 whitespace-pre-line text-gray-700 dark:text-gray-300">
              {course.curriculum}
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
