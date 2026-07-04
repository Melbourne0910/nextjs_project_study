import db from "@/lib/db-setup";
import { broadcastMessage } from "./stream/route";

export async function GET() {
  try {
    const messages = db
      .prepare(`
        SELECT
          messages.id,
          messages.text,
          messages.createdAt,
          users.name AS username
        FROM messages
        JOIN users ON messages.userId = users.id
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
    const { text } = await request.json();

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

    const result = db
      .prepare("INSERT INTO messages (userId, text) VALUES (?, ?)")
      .run(randomUserId, text.trim());

    const message = db
      .prepare(`
        SELECT
          m.id,
          m.text,
          m.createdAt,
          u.name AS username
        FROM messages m
        LEFT JOIN users u ON m.userId = u.id
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
