import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getPool, sql } from "@/lib/db";

type Params = { params: { id: string } };

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { Nombre, LogoUrl, Activo, Orden } = await req.json();
    const pool = await getPool();
    await pool.request()
      .input("Id", sql.Int, Number(params.id))
      .input("Nombre", sql.NVarChar, Nombre)
      .input("LogoUrl", sql.NVarChar, LogoUrl || "")
      .input("Activo", sql.Bit, Activo ? 1 : 0)
      .input("Orden", sql.Int, Orden || 0)
      .query("UPDATE web.CLIENTES SET Nombre=@Nombre, LogoUrl=@LogoUrl, Activo=@Activo, Orden=@Orden WHERE Id=@Id");
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
    const pool = await getPool();
    await pool.request()
      .input("Id", sql.Int, Number(params.id))
      .query("DELETE FROM web.CLIENTES WHERE Id=@Id");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Error al eliminar" }, { status: 500 });
  }
}
