import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getPool, sql } from "@/lib/db";
import { extractYoutubeId } from "@/lib/youtube";

/** GET /api/videos – Returns all active videos (public) */
export async function GET() {
  try {
    const pool = await getPool();
    const result = await pool.request().query(`
      SELECT Id, Titulo, Descripcion, YoutubeUrl, YoutubeId, Categoria, Activo, Orden, CreadoEn
      FROM web.VIDEOS
      ORDER BY Orden ASC, CreadoEn DESC
    `);
    return NextResponse.json(result.recordset);
  } catch (err) {
    console.error("GET /api/videos error:", err);
    return NextResponse.json([], { status: 200 });
  }
}

/** POST /api/videos – Adds a new video (admin only) */
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { Titulo, Descripcion, YoutubeUrl, Categoria, Orden } = body;
    const YoutubeId = extractYoutubeId(YoutubeUrl);

    const pool = await getPool();
    const ordenVal = Number(Orden) || 1;
    // Shift existing videos with same or higher order
    await pool.request()
      .input("Orden", sql.Int, ordenVal)
      .query("UPDATE web.VIDEOS SET Orden = Orden + 1 WHERE Orden >= @Orden");

    await pool.request()
      .input("Titulo", sql.NVarChar, Titulo)
      .input("Descripcion", sql.NVarChar, Descripcion || "")
      .input("YoutubeUrl", sql.NVarChar, YoutubeUrl)
      .input("YoutubeId", sql.NVarChar, YoutubeId)
      .input("Categoria", sql.NVarChar, Categoria || "General")
      .input("Orden", sql.Int, ordenVal)
      .query(`
        INSERT INTO web.VIDEOS (Titulo, Descripcion, YoutubeUrl, YoutubeId, Categoria, Orden)
        VALUES (@Titulo, @Descripcion, @YoutubeUrl, @YoutubeId, @Categoria, @Orden)
      `);

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error("POST /api/videos error:", err);
    return NextResponse.json({ error: "Error al guardar el video" }, { status: 500 });
  }
}
