import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

/** POST /api/admin/hash – Utility to generate bcrypt hash for a password (dev only) */
export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available in production" }, { status: 404 });
  }
  const { password } = await req.json();
  const hash = await bcrypt.hash(password, 12);
  return NextResponse.json({ hash });
}
