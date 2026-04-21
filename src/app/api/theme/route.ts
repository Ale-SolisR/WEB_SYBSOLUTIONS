import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";

export async function GET() {
  try {
    const pool = await getPool();
    const result = await pool.request()
      .query("SELECT Valor FROM web.CONFIGURACION WHERE Clave = 'site_theme'");
    const theme = result.recordset[0]?.Valor || "blue";
    return NextResponse.json({ theme }, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return NextResponse.json({ theme: "blue" });
  }
}
