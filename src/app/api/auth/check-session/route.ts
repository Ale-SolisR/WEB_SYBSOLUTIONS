import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getPool, sql } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ valid: false, reason: "unauthenticated" });
  }

  const sessionToken = (session.user as any).sessionToken;
  const userId = (session.user as any).userId;

  // Sessions created before this feature had no token — treat as valid
  if (!sessionToken || !userId) {
    return NextResponse.json({ valid: true });
  }

  try {
    const pool = await getPool();
    const result = await pool.request()
      .input("UserId",       sql.NVarChar, String(userId))
      .input("SessionToken", sql.NVarChar, String(sessionToken))
      .query("SELECT 1 AS ok FROM web.SESIONES WHERE UserId = @UserId AND SessionToken = @SessionToken AND Activo = 1");

    return NextResponse.json({ valid: result.recordset.length > 0 });
  } catch {
    return NextResponse.json({ valid: true }); // Fail open on DB error
  }
}
