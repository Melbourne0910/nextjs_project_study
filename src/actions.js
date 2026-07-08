"use server";

import bcrypt from "bcrypt";
import { randomBytes } from "crypto";
import { z } from "zod";

import db from "@/lib/db-setup";
import { sendEmail } from "@/lib/send-email";

const registerSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Name must be at least 2 characters",
    })
    .max(50, {
      message: "Name must be less than 50 characters",
    }),

  email: z.string().email({
    message: "Please enter a valid email address",
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

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function registerUser(formData) {
  try {
    const name = formData.get("name")?.toString().trim() || "";
    const email = formData.get("email")?.toString().trim() || "";
    const password = formData.get("password")?.toString().trim() || "";

    const validation = registerSchema.safeParse({
      name,
      email,
      password,
    });

    if (!validation.success) {
      return {
        success: false,
        error: validation.error.issues[0].message,
      };
    }

    const existingUser = db
      .prepare("SELECT * FROM users WHERE email = ?")
      .get(email);

    if (existingUser) {
      return {
        success: false,
        error: "Email is already registered",
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = randomBytes(32).toString("hex");

    const result = db
      .prepare(`
        INSERT INTO users (
          name,
          email,
          password,
          email_verified,
          verification_token,
          is_admin
        ) VALUES (?, ?, ?, ?, ?, ?)
      `)
      .run(
        name,
        email,
        hashedPassword,
        0,
        verificationToken,
        0
      );

    const newUser = db
      .prepare(`
        SELECT id, name, email
        FROM users
        WHERE id = ?
      `)
      .get(result.lastInsertRowid);

    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const verificationUrl =
      `${appUrl}/api/auth/verify-email?token=${verificationToken}`;
    const safeName = escapeHtml(name);

    const html = `
      <h1>Welcome, ${safeName}</h1>
      <p>Please verify your email address by clicking the link below:</p>
      <a href="${verificationUrl}">Verify Email</a>
    `;

    const emailSent = await sendEmail({
      to: email,
      subject: "Verify your email address",
      html,
    });

    if (!emailSent) {
      console.warn("Verification email failed to send.");
    }

    return {
      success: true,
      user: newUser,
    };
  } catch (error) {
    console.error("Register action error:", error);

    return {
      success: false,
      error: "Something went wrong. Please try again.",
    };
  }
}
