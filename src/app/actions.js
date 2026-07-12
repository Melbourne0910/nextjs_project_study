"use server";

import db from "@/lib/db-setup";

export async function getCourses() {
  return db
    .prepare("SELECT * FROM courses ORDER BY id ASC")
    .all();
}

export async function getMessages(courseId, limit = 10, offset = 0) {
  const parsedCourseId = Number(courseId);
  const parsedLimit = Number(limit);
  const parsedOffset = Number(offset);

  if (
    !Number.isInteger(parsedCourseId) ||
    parsedCourseId <= 0 ||
    !Number.isInteger(parsedLimit) ||
    parsedLimit < 1 ||
    parsedLimit > 50 ||
    !Number.isInteger(parsedOffset) ||
    parsedOffset < 0
  ) {
    return [];
  }

  try {
    return db
      .prepare(`
        SELECT
          messages.id,
          messages.user_id,
          messages.text,
          messages.created_at,
          messages.edited_at,
          users.name AS username
        FROM messages
        LEFT JOIN users ON messages.user_id = users.id
        WHERE messages.course_id = ?
        ORDER BY messages.created_at DESC, messages.id DESC
        LIMIT ?
        OFFSET ?
      `)
      .all(parsedCourseId, parsedLimit, parsedOffset);
  } catch (error) {
    console.error("Failed to get messages:", error);
    return [];
  }
}
