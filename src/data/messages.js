export const messages = [
  {
    user_id: 1,
    course_id: 1,
    text: "This React course is really helpful!",
  },
  {
    user_id: 2,
    course_id: 1,
    text: "I finally understand components now.",
  },
  {
    user_id: 3,
    course_id: 2,
    text: "Next.js routing is powerful.",
  },
  {
    user_id: 1,
    course_id: 2,
    text: "API routes make fullstack development easier.",
  },
];

export const shuffledMessages = messages
  .map((message) => ({
    ...message,
    sort: Math.random(),
  }))
  .sort((a, b) => a.sort - b.sort)
  .map(({ sort, ...message }) => message);
