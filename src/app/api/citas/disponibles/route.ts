import { NextRequest, NextResponse } from "next/server";
import { getPool, sql } from "@/lib/db";

const ALL_SLOTS = ["08:00","09:00","10:00","11:00","13:00","14:00","15:00","16:00"];

export async function GET(req: NextRequest) {
  const fecha = req.nextUrl.searchParams.get("fecha");
  if (!fecha || !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
    return NextResponse.json({ error: "fecha requerida (YYYY-MM-DD)" }, { status: 400 });
  }
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input("FechaCita", sql.Date, fecha)
      .query("SELECT HoraCita FROM web.CITAS WHERE FechaCita=@FechaCita AND Estado<>'cancelada'");
    const ocupados = new Set(result.recordset.map((r: { HoraCita: string }) => r.HoraCita));
    const disponibles = ALL_SLOTS.filter((s) => !ocupados.has(s));
    return NextResponse.json({ slots: disponibles });
  } catch {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
