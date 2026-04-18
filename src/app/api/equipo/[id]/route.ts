import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getPool, sql } from "@/lib/db";

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = await params;
    const { Nombre, Cargo, Descripcion, FotoUrl, LinkedIn, Activo, Orden } = await req.json();
    if (!Nombre?.trim()) return NextResponse.json({ error: "Nombre requerido" }, { status: 400 });
    const ordenVal = Math.max(0, Number(Orden) || 0);
    const pool = await getPool();
    await pool.request()
      .input("Id", sql.Int, Number(id))
      .input("Nombre", sql.NVarChar, Nombre.trim())
      .input("Cargo", sql.NVarChar, Cargo || "")
      .input("Descripcion", sql.NVarChar, Descripcion || "")
      .input("FotoUrl", sql.NVarChar, FotoUrl || "")
      .input("LinkedIn", sql.NVarChar, LinkedIn || "")
      .input("Activo", sql.Bit, Activo ? 1 : 0)
      .input("Orden", sql.Int, ordenVal)
      .query("UPDATE web.EQUIPO SET Nombre=@Nombre,Cargo=@Cargo,Descripcion=@Descripcion,FotoUrl=@FotoUrl,LinkedIn=@LinkedIn,Activo=@Activo,Orden=@Orden WHERE Id=@Id");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = await params;
    const pool = await getPool();
    await pool.request()
      .input("Id", sql.Int, Number(id))
      .query("UPDATE web.EQUIPO SET Activo=0 WHERE Id=@Id");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
