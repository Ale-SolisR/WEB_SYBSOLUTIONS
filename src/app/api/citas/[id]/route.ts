import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getPool, sql } from "@/lib/db";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = await params;
    const { Estado } = await req.json();
    if (!["pendiente", "confirmada", "cancelada"].includes(Estado)) {
      return NextResponse.json({ error: "Estado inválido" }, { status: 400 });
    }
    const pool = await getPool();
    await pool.request()
      .input("Id", sql.Int, Number(id))
      .input("Estado", sql.NVarChar, Estado)
      .query("UPDATE web.CITAS SET Estado=@Estado WHERE Id=@Id");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
