import { getServerSession } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import db from "@/lib/db-setup";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return Response.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { text, courseId } = await request.json();

    if (typeof text !== "string" || !text.trim()) {
      return Response.json(
        { success: false, error: "Message text is required" },
        { status: 400 }
      );
    }

    if (text.trim().length > 500) {
      return Response.json(
        {
          success: false,
          error: "Message must be less than 500 characters",
        },
        { status: 400 }
      );
    }

    const parsedCourseId = Number(courseId);

    if (!Number.isInteger(parsedCourseId) || parsedCourseId <= 0) {
      return Response.json(
        { success: false, error: "Course ID is required" },
        { status: 400 }
      );
    }

    const course = db
      .prepare("SELECT id FROM courses WHERE id = ?")
      .get(parsedCourseId);

    if (!course) {
      return Response.json(
        { success: false, error: "Course not found" },
        { status: 400 }
      );
    }

    const result = db
      .prepare(`
        INSERT INTO messages (user_id, course_id, text)
        VALUES (?, ?, ?)
      `)
      .run(session.user.id, course.id, text.trim());

    const message = db
      .prepare(`
        SELECT
          m.id,
          m.text,
          m.course_id AS courseId,
          m.created_at AS createdAt,
          m.edited_at AS editedAt,
          u.name AS username
        FROM messages m
        LEFT JOIN users u ON m.user_id = u.id
        WHERE m.id = ?
      `)
      .get(result.lastInsertRowid);

    return Response.json({
      success: true,
      message: "Message saved successfully",
      data: message,
    });
  } catch (error) {
    console.error("Failed to post message:", error);

    return Response.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
