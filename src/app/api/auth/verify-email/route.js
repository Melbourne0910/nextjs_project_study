import db from "@/lib/db-setup";

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const token = url.searchParams.get("token")?.trim();

    if (!token) {
      return Response.json(
        { error: "Missing token" },
        { status: 400 }
      );
    }

    const user = db
      .prepare("SELECT id FROM users WHERE verification_token = ?")
      .get(token);

    if (!user) {
      return Response.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      );
    }

    db.prepare(`
      UPDATE users
      SET email_verified = 1,
          verification_token = NULL
      WHERE id = ?
    `).run(user.id);

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || url.origin;

    return Response.redirect(`${appUrl}/verify-email/success`);
  } catch (error) {
    console.error("Verify email error:", error);

    return Response.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
