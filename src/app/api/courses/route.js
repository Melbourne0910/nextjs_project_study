const courses = [
  {
    id: 1,
    title: "Next.js Basics",
    description: "Learn the fundamentals of routing, layouts, and pages.",
  },
  {
    id: 2,
    title: "React Fundamentals",
    description: "Understand components, props, state, and rendering.",
  },
  {
    id: 3,
    title: "Tailwind CSS",
    description: "Build responsive interfaces with utility-first CSS.",
  },
];

export async function GET() {
  return Response.json(courses);
}
