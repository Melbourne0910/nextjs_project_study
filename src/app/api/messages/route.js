import { getServerSession } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import db from "@/lib/db-setup";
import { broadcastMessage } from "@/app/api/messages/stream/route";

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
          m.user_id,
          m.text,
          m.course_id,
          m.created_at,
          m.edited_at,
          u.name AS username
        FROM messages m
        LEFT JOIN users u ON m.user_id = u.id
        WHERE m.id = ?
      `)
      .get(result.lastInsertRowid);

    broadcastMessage({
      type: "new",
      data: message,
    });

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

export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return Response.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await request.json();
    const parsedId = Number(id);

    if (!Number.isInteger(parsedId) || parsedId <= 0) {
      return Response.json(
        { success: false, error: "Message ID is required" },
        { status: 400 }
      );
    }

    const message = db
      .prepare("SELECT user_id FROM messages WHERE id = ?")
      .get(parsedId);

    if (!message || message.user_id !== session.user.id) {
      return Response.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    db.prepare("DELETE FROM messages WHERE id = ?").run(parsedId);

    broadcastMessage({
      type: "delete",
      data: parsedId,
    });

    return Response.json({
      success: true,
      message: "Message deleted successfully",
    });
  } catch (error) {
    console.error("Failed to delete message:", error);

    return Response.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
