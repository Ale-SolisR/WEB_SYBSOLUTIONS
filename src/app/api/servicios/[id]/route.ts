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
    const { Titulo, Descripcion, Icono, Color, Activo, Orden } = await req.json();
    if (!Titulo?.trim() || !Descripcion?.trim()) {
      return NextResponse.json({ error: "Título y descripción requeridos" }, { status: 400 });
    }
    const ordenVal = Math.max(0, Number(Orden) || 0);
    const pool = await getPool();
    await pool.request()
      .input("Id", sql.Int, Number(id))
      .input("Titulo", sql.NVarChar, Titulo.trim())
      .input("Descripcion", sql.NVarChar, Descripcion.trim())
      .input("Icono", sql.NVarChar, Icono || "Globe")
      .input("Color", sql.NVarChar, Color || "#3b82f6")
      .input("Activo", sql.Bit, Activo ? 1 : 0)
      .input("Orden", sql.Int, ordenVal)
      .query("UPDATE web.SERVICIOS SET Titulo=@Titulo,Descripcion=@Descripcion,Icono=@Icono,Color=@Color,Activo=@Activo,Orden=@Orden WHERE Id=@Id");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Error al actualizar" }, { status: 500 });
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
      .query("DELETE FROM web.SERVICIOS WHERE Id=@Id");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Error al eliminar" }, { status: 500 });
  }
}
