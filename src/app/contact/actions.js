"use server";

import { sendEmail } from "@/lib/send-email";

/**
 * Sends a contact form message.
 * @param {FormData} formData
 */
export async function sendContactMessage(formData) {
  try {
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const message = String(formData.get("message") || "").trim();

    if (!name || !email || !message) {
      return {
        success: false,
        message: "Missing required fields",
      };
    }

    const html = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `;

    const success = await sendEmail({
      to: process.env.CONTACT_EMAIL || "delivered@resend.dev",
      subject: `New message from ${name}`,
      html,
    });

    if (success) {
      return {
        success: true,
        message: "Message sent successfully",
      };
    }

    return {
      success: false,
      message: "Failed to send email",
    };
  } catch (error) {
    console.error("Contact action error:", error.message);
    console.error(error.stack);

    return {
      success: false,
      message: "Server error",
    };
  }
}
