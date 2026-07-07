import CourseList from "@/components/CourseList";
import db from "@/lib/db-setup";

export const metadata = {
  title: "Courses | Agora",
  description: "Explore high-quality online courses on Agora.",
  keywords: [
    "online courses",
    "React",
    "Next.js",
    "web development",
    "Agora",
  ],
  openGraph: {
    title: "Courses | Agora",
    description: "Explore high-quality online courses and improve your skills.",
    url: "https://example.com/courses",
    siteName: "Agora",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "https://example.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Agora courses preview image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Courses | Agora",
    description: "Explore online courses and improve your skills with Agora.",
    images: ["https://example.com/twitter-image.jpg"],
  },
};

async function getCourses() {
  try {
    const courses = db.prepare("SELECT * FROM courses ORDER BY id ASC").all();

    return courses;
  } catch (error) {
    console.error("Failed to fetch courses:", error);
    return [];
  }
}

export default async function CoursesPage() {
  const courses = await getCourses();

  return (
    <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-bold mb-6">Available Courses</h1>

      <CourseList courses={courses} />
    </section>
  );
}
