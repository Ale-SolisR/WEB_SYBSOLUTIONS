import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getPool, sql } from "@/lib/db";
import { sendCitaRecibida } from "@/lib/mailer";

export async function GET() {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const pool = await getPool();
    const result = await pool.request().query(
      "SELECT * FROM web.CITAS ORDER BY FechaCita ASC, HoraCita ASC"
    );
    return NextResponse.json(result.recordset);
  } catch {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      Cedula, TipoCedula, NombreCompleto, Email, Telefono,
      FechaCita, HoraCita, Nota,
    } = body;

    if (!Cedula?.trim() || !NombreCompleto?.trim() || !Email?.trim() || !Telefono?.trim()) {
      return NextResponse.json({ error: "Campos requeridos incompletos" }, { status: 400 });
    }
    if (!FechaCita || !HoraCita) {
      return NextResponse.json({ error: "Fecha y hora requeridas" }, { status: 400 });
    }

    // Validate Mon–Fri
    const citaDate = new Date(FechaCita + "T12:00:00");
    const dayOfWeek = citaDate.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return NextResponse.json({ error: "Solo se permiten citas de lunes a viernes" }, { status: 400 });
    }

    // Validate 8am–4pm slot
    const [h] = HoraCita.split(":").map(Number);
    if (h < 8 || h >= 16) {
      return NextResponse.json({ error: "Horario solo entre 8:00 y 16:00" }, { status: 400 });
    }

    // Check slot availability
    const pool = await getPool();
    const exists = await pool.request()
      .input("FechaCita", sql.Date, FechaCita)
      .input("HoraCita", sql.NVarChar, HoraCita)
      .query("SELECT COUNT(*) AS cnt FROM web.CITAS WHERE FechaCita=@FechaCita AND HoraCita=@HoraCita AND Estado<>'cancelada'");
    if (exists.recordset[0].cnt > 0) {
      return NextResponse.json({ error: "Este horario ya está reservado" }, { status: 409 });
    }

    // Insert appointment (Estado defaults to 'pendiente')
    const result = await pool.request()
      .input("Cedula",         sql.NVarChar, Cedula.trim())
      .input("TipoCedula",     sql.NVarChar, TipoCedula || "fisica")
      .input("NombreCompleto", sql.NVarChar, NombreCompleto.trim())
      .input("Email",          sql.NVarChar, Email.trim())
      .input("Telefono",       sql.NVarChar, Telefono.trim())
      .input("FechaCita",      sql.Date,     FechaCita)
      .input("HoraCita",       sql.NVarChar, HoraCita)
      .input("Nota",           sql.NVarChar, Nota || "")
      .query(`
        INSERT INTO web.CITAS
          (Cedula, TipoCedula, NombreCompleto, Email, Telefono, FechaCita, HoraCita, Nota)
        OUTPUT INSERTED.Id
        VALUES (@Cedula,@TipoCedula,@NombreCompleto,@Email,@Telefono,@FechaCita,@HoraCita,@Nota)
      `);

    const newId = result.recordset[0].Id;

    // --- Notification email: solicitud recibida (non-blocking) ---
    try {
      await sendCitaRecibida({
        to:     Email.trim(),
        nombre: NombreCompleto.trim(),
        fecha:  FechaCita,
        hora:   HoraCita,
      });
    } catch (mailErr) {
      console.error("Email error:", mailErr);
    }

    return NextResponse.json({ success: true, id: newId }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Error al guardar" }, { status: 500 });
  }
}
