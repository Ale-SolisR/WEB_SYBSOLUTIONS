import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getPool, sql } from "@/lib/db";

export async function GET() {
  try {
    const pool = await getPool();
    const result = await pool.request().query(
      "SELECT * FROM web.CLIENTES ORDER BY Orden ASC, CreadoEn DESC"
    );
    return NextResponse.json(result.recordset);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { Nombre, LogoUrl, Orden } = await req.json();
    const pool = await getPool();
    await pool.request()
      .input("Nombre", sql.NVarChar, Nombre)
      .input("LogoUrl", sql.NVarChar, LogoUrl || "")
      .input("Orden", sql.Int, Orden || 0)
      .query("INSERT INTO web.CLIENTES (Nombre, LogoUrl, Orden) VALUES (@Nombre, @LogoUrl, @Orden)");
    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Error al guardar" }, { status: 500 });
  }
}
