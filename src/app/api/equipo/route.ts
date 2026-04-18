import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getPool, sql } from "@/lib/db";

export async function GET() {
  try {
    const pool = await getPool();
    const result = await pool.request().query(
      "SELECT * FROM web.EQUIPO WHERE Activo=1 ORDER BY Orden ASC"
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
    const { Nombre, Cargo, Descripcion, FotoUrl, LinkedIn, Orden } = await req.json();
    if (!Nombre?.trim()) return NextResponse.json({ error: "Nombre requerido" }, { status: 400 });
    const ordenVal = Math.max(0, Number(Orden) || 0);
    const pool = await getPool();
    await pool.request()
      .input("Nombre", sql.NVarChar, Nombre.trim())
      .input("Cargo", sql.NVarChar, Cargo || "")
      .input("Descripcion", sql.NVarChar, Descripcion || "")
      .input("FotoUrl", sql.NVarChar, FotoUrl || "")
      .input("LinkedIn", sql.NVarChar, LinkedIn || "")
      .input("Orden", sql.Int, ordenVal)
      .query("INSERT INTO web.EQUIPO (Nombre,Cargo,Descripcion,FotoUrl,LinkedIn,Orden) VALUES (@Nombre,@Cargo,@Descripcion,@FotoUrl,@LinkedIn,@Orden)");
    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Error al guardar" }, { status: 500 });
  }
}
