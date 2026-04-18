import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getPool, sql } from "@/lib/db";

export async function GET() {
  try {
    const pool = await getPool();
    const result = await pool.request().query(
      "SELECT * FROM web.SERVICIOS ORDER BY Orden ASC"
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
    const { Titulo, Descripcion, Icono, Color, Orden } = await req.json();
    if (!Titulo?.trim() || !Descripcion?.trim()) {
      return NextResponse.json({ error: "Título y descripción son requeridos" }, { status: 400 });
    }
    const ordenVal = Math.max(0, Number(Orden) || 0);
    const pool = await getPool();
    await pool.request()
      .input("Titulo", sql.NVarChar, Titulo.trim())
      .input("Descripcion", sql.NVarChar, Descripcion.trim())
      .input("Icono", sql.NVarChar, Icono || "Globe")
      .input("Color", sql.NVarChar, Color || "#3b82f6")
      .input("Orden", sql.Int, ordenVal)
      .query("INSERT INTO web.SERVICIOS (Titulo, Descripcion, Icono, Color, Orden) VALUES (@Titulo,@Descripcion,@Icono,@Color,@Orden)");
    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Error al guardar" }, { status: 500 });
  }
}
