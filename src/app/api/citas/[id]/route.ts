import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getPool, sql } from "@/lib/db";
import { createCalendarEvent, cancelCalendarEvent } from "@/lib/googleCalendar";
import { sendCitaConfirmada, sendCitaCancelada } from "@/lib/mailer";

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

    // Fetch current cita
    const citaResult = await pool.request()
      .input("Id", sql.Int, Number(id))
      .query("SELECT * FROM web.CITAS WHERE Id=@Id");
    const cita = citaResult.recordset[0];
    if (!cita) return NextResponse.json({ error: "No encontrada" }, { status: 404 });

    if (Estado === "confirmada") {
      let meetLink: string | null = null;
      let googleEventId: string | null = null;

      // FechaCita from mssql DATE column may be a Date object or string
      const fechaStr = cita.FechaCita instanceof Date
        ? cita.FechaCita.toISOString().split("T")[0]
        : String(cita.FechaCita).split("T")[0];

      const horaStr = String(cita.HoraCita).substring(0, 5);

      try {
        const calResult = await createCalendarEvent({
          summary: `Demo S&B ERP – ${cita.NombreCompleto}`,
          description: `Demo del S&B ERP\n\nCliente: ${cita.NombreCompleto}\nCédula: ${cita.Cedula}\nTeléfono: ${cita.Telefono}\nNota: ${cita.Nota || "—"}`,
          date: fechaStr,
          time: horaStr,
          attendeeEmail: cita.Email,
          attendeeName: cita.NombreCompleto,
        });
        meetLink      = calResult.meetLink;
        googleEventId = calResult.eventId;
      } catch (calErr) {
        console.error("Calendar error:", calErr);
      }

      await pool.request()
        .input("Id",            sql.Int,      Number(id))
        .input("Estado",        sql.NVarChar, "confirmada")
        .input("GoogleEventId", sql.NVarChar, googleEventId ?? "")
        .input("MeetLink",      sql.NVarChar, meetLink ?? "")
        .query("UPDATE web.CITAS SET Estado=@Estado, GoogleEventId=@GoogleEventId, MeetLink=@MeetLink WHERE Id=@Id");

      try {
        await sendCitaConfirmada({
          to:       cita.Email,
          nombre:   cita.NombreCompleto,
          fecha:    fechaStr,
          hora:     horaStr,
          meetLink,
        });
      } catch (mailErr) {
        console.error("Email error:", mailErr);
      }

      return NextResponse.json({ success: true, meetLink });
    }

    if (Estado === "cancelada") {
      const googleEventId = cita.GoogleEventId?.trim();
      if (googleEventId) {
        try {
          await cancelCalendarEvent(googleEventId);
        } catch (calErr) {
          console.error("Calendar cancel error:", calErr);
        }
      }

      const fechaStr = cita.FechaCita instanceof Date
        ? cita.FechaCita.toISOString().split("T")[0]
        : String(cita.FechaCita).split("T")[0];
      const horaStr = String(cita.HoraCita).substring(0, 5);

      await pool.request()
        .input("Id",     sql.Int,      Number(id))
        .input("Estado", sql.NVarChar, "cancelada")
        .query("UPDATE web.CITAS SET Estado=@Estado WHERE Id=@Id");

      try {
        await sendCitaCancelada({
          to:     cita.Email,
          nombre: cita.NombreCompleto,
          fecha:  fechaStr,
          hora:   horaStr,
        });
      } catch (mailErr) {
        console.error("Email error:", mailErr);
      }

      return NextResponse.json({ success: true });
    }

    // Estado = "pendiente"
    await pool.request()
      .input("Id",     sql.Int,      Number(id))
      .input("Estado", sql.NVarChar, "pendiente")
      .query("UPDATE web.CITAS SET Estado=@Estado WHERE Id=@Id");

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PATCH /api/citas/[id] error:", err);
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: "Error", detail: msg }, { status: 500 });
  }
}
