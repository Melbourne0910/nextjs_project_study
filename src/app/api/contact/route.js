import { sendEmail } from "@/lib/send-email";

export async function POST(req) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Missing required fields",
        }),
        { status: 400 }
      );
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
      return new Response(
        JSON.stringify({
          success: true,
        }),
        { status: 200 }
      );
    }

    return new Response(
      JSON.stringify({
        success: false,
        message: "Failed to send email",
      }),
      { status: 500 }
    );
  } catch (error) {
    console.error("Contact API error:", error);

    return new Response(
      JSON.stringify({
        success: false,
        message: "Server error",
      }),
      { status: 500 }
    );
  }
}
