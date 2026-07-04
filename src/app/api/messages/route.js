import db from "@/lib/db";
import { broadcastMessage } from "./stream/route";

export async function GET() {
  try {
    const messages = db
      .prepare("SELECT id, text, createdAt FROM messages ORDER BY id ASC")
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

    const result = db
      .prepare("INSERT INTO messages (text) VALUES (?)")
      .run(text.trim());

    const message = db
      .prepare("SELECT * FROM messages WHERE id = ?")
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
