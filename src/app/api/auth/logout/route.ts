import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getPool, sql } from "@/lib/db";

export async function POST() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.userId;
  if (!userId) return NextResponse.json({ ok: true });

  try {
    const pool = await getPool();
    await pool.request()
      .input("UserId", sql.NVarChar, String(userId))
      .query("UPDATE web.SESIONES SET Activo = 0 WHERE UserId = @UserId");
  } catch {
    // Ignore — session will expire naturally
  }

  return NextResponse.json({ ok: true });
}
