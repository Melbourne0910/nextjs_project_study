import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      success: false,
      message: "Email verification will be implemented in the next lesson.",
    },
    { status: 501 }
  );
}
