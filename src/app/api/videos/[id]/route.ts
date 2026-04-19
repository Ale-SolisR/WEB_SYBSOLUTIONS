import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getPool, sql } from "@/lib/db";
import { extractYoutubeId } from "@/lib/youtube";

type Params = { params: Promise<{ id: string }> };

/** PUT /api/videos/[id] – Updates a video (admin only) */
export async function PUT(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const { Titulo, Descripcion, YoutubeUrl, Categoria, Activo, Orden } = body;
    const YoutubeId = extractYoutubeId(YoutubeUrl);
    const pool = await getPool();
    const ordenVal = Number(Orden) || 1;
    const numId = Number(id);

    // Get current orden to detect change
    const current = await pool.request()
      .input("Id", sql.Int, numId)
      .query("SELECT Orden FROM web.VIDEOS WHERE Id=@Id");
    const oldOrden = current.recordset[0]?.Orden;

    // If order changed, shift others to make room
    if (oldOrden !== ordenVal) {
      await pool.request()
        .input("Orden", sql.Int, ordenVal)
        .input("Id", sql.Int, numId)
        .query("UPDATE web.VIDEOS SET Orden = Orden + 1 WHERE Orden >= @Orden AND Id <> @Id");
    }

    await pool.request()
      .input("Id", sql.Int, numId)
      .input("Titulo", sql.NVarChar, Titulo)
      .input("Descripcion", sql.NVarChar, Descripcion || "")
      .input("YoutubeUrl", sql.NVarChar, YoutubeUrl)
      .input("YoutubeId", sql.NVarChar, YoutubeId)
      .input("Categoria", sql.NVarChar, Categoria || "General")
      .input("Activo", sql.Bit, Activo ? 1 : 0)
      .input("Orden", sql.Int, ordenVal)
      .query(`
        UPDATE web.VIDEOS
        SET Titulo=@Titulo, Descripcion=@Descripcion, YoutubeUrl=@YoutubeUrl,
            YoutubeId=@YoutubeId, Categoria=@Categoria, Activo=@Activo, Orden=@Orden
        WHERE Id=@Id
      `);

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Error al actualizar" }, { status: 500 });
  }
}

/** DELETE /api/videos/[id] – Deletes a video (admin only) */
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
      .query("DELETE FROM web.VIDEOS WHERE Id=@Id");
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Error al eliminar" }, { status: 500 });
  }
}
