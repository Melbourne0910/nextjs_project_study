"use server";

import bcrypt from "bcrypt";
import { z } from "zod";

import db from "@/lib/db-setup";

const resetPasswordSchema = z.object({
  token: z.string().min(1, {
    message: "Token is required",
  }),
  password: z
    .string()
    .min(8, {
      message: "Password must be at least 8 characters",
    })
    .max(100, {
      message: "Password must be less than 100 characters",
    }),
});

export async function resetPassword(formData) {
  const token = formData.get("token")?.toString() || "";
  const password = formData.get("password")?.toString() || "";

  const validation = resetPasswordSchema.safeParse({
    token,
    password,
  });

  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0].message,
    };
  }

  try {
    const user = db
      .prepare(`
        SELECT id
        FROM users
        WHERE password_reset_token = ?
          AND password_reset_expires > ?
      `)
      .get(token, new Date().toISOString());

    if (!user) {
      return {
        success: false,
        error: "Invalid or expired token",
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    db.prepare(`
      UPDATE users
      SET password = ?,
          password_reset_token = NULL,
          password_reset_expires = NULL
      WHERE id = ?
    `).run(
      hashedPassword,
      user.id
    );

    return {
      success: true,
    };
  } catch (error) {
    console.error("Reset password error:", error);

    return {
      success: false,
      error: "Unable to reset password",
    };
  }
}
