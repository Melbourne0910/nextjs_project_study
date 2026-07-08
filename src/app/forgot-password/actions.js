"use server";

import { randomBytes } from "crypto";
import { z } from "zod";

import db from "@/lib/db-setup";
import { sendEmail } from "@/lib/send-email";

const emailSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
});

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function sendResetEmail(formData) {
  const email = formData.get("email")?.toString().trim() || "";

  const validation = emailSchema.safeParse({ email });

  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0].message,
    };
  }

  try {
    const user = db
      .prepare("SELECT id, name, email FROM users WHERE email = ?")
      .get(email);

    if (!user) {
      return {
        success: true,
      };
    }

    const token = randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 30 * 60 * 1000);

    db.prepare(`
      UPDATE users
      SET password_reset_token = ?,
          password_reset_expires = ?
      WHERE id = ?
    `).run(
      token,
      expires.toISOString(),
      user.id
    );

    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const resetUrl =
      `${appUrl}/reset-password?token=${token}`;
    const safeName = escapeHtml(user.name);

    const emailSent = await sendEmail({
      to: user.email,
      subject: "Reset your password",
      html: `
        <p>Hello ${safeName},</p>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>This link will expire in 30 minutes.</p>
      `,
    });

    if (!emailSent) {
      console.warn("Password reset email failed to send.");
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error("Send reset email error:", error);

    return {
      success: false,
      error: "Unable to send reset email",
    };
  }
}
