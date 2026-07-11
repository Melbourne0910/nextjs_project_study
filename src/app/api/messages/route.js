import db from "@/lib/db-setup";
import { broadcastMessage } from "./stream/route";

export async function GET() {
  try {
    const messages = db
      .prepare(`
        SELECT
          messages.id,
          messages.text,
          messages.course_id AS courseId,
          messages.created_at AS createdAt,
          messages.edited_at AS editedAt,
          users.name AS username
        FROM messages
        JOIN users ON messages.user_id = users.id
        ORDER BY messages.id ASC
      `)
      .all();

    return Response.json(messages);
  } catch (error) {
    console.error("Failed to fetch messages:", error);

    return Response.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { text, courseId } = await request.json();

    if (!text?.trim()) {
      return Response.json(
        { success: false, error: "Message text is required" },
        { status: 400 }
      );
    }

    const userIds = db
      .prepare("SELECT id FROM users")
      .all()
      .map((user) => user.id);

    if (userIds.length === 0) {
      return Response.json(
        { success: false, error: "No users available" },
        { status: 500 }
      );
    }

    const randomUserId =
      userIds[Math.floor(Math.random() * userIds.length)];

    const course = courseId
      ? db.prepare("SELECT id FROM courses WHERE id = ?").get(courseId)
      : db.prepare("SELECT id FROM courses ORDER BY id ASC LIMIT 1").get();

    if (!course) {
      return Response.json(
        { success: false, error: "A valid course is required" },
        { status: 400 }
      );
    }

    const result = db
      .prepare(`
        INSERT INTO messages (user_id, course_id, text)
        VALUES (?, ?, ?)
      `)
      .run(randomUserId, course.id, text.trim());

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

    broadcastMessage(message);

    return Response.json({
      success: true,
      message: "Message saved successfully",
      data: message,
    });
  } catch (error) {
    console.error("Failed to save message:", error);

    return Response.json(
      { success: false, error: "Failed to save message" },
      { status: 500 }
    );
  }
}
