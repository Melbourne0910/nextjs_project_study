import { headers } from "next/headers";
import CourseList from "@/components/CourseList";

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
  const headersList = await headers();
  const host = headersList.get("host");
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";

  const res = await fetch(`${protocol}://${host}/api/courses`, {
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

      <CourseList courses={courses} />
    </section>
  );
}
