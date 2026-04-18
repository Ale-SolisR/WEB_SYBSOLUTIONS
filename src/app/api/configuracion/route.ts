import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getPool, sql } from "@/lib/db";

/** GET /api/configuracion – Returns key-value config as object */
export async function GET() {
  try {
    const pool = await getPool();
    const result = await pool.request().query("SELECT Clave, Valor FROM web.CONFIGURACION");
    const config: Record<string, string> = {};
    result.recordset.forEach((row: { Clave: string; Valor: string }) => {
      config[row.Clave] = row.Valor;
    });
    return NextResponse.json(config);
  } catch {
    return NextResponse.json({
      whatsapp: "+506 87457877",
      email: "sybsolutionscr@gmail.com",
      direccion: "San José, Costa Rica",
    });
  }
}

/** PUT /api/configuracion – Updates config values (admin only) */
export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body: Record<string, string> = await req.json();
    const pool = await getPool();
    for (const [clave, valor] of Object.entries(body)) {
      await pool.request()
        .input("Clave", sql.NVarChar, clave)
        .input("Valor", sql.NVarChar, valor)
        .query(`
          IF EXISTS (SELECT 1 FROM web.CONFIGURACION WHERE Clave=@Clave)
            UPDATE web.CONFIGURACION SET Valor=@Valor, UpdatedAt=GETDATE() WHERE Clave=@Clave
          ELSE
            INSERT INTO web.CONFIGURACION (Clave, Valor) VALUES (@Clave, @Valor)
        `);
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Error al actualizar" }, { status: 500 });
  }
}
