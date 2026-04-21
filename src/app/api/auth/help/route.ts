import { NextRequest, NextResponse } from "next/server";
import { sendLoginHelp } from "@/lib/mailer";

export async function POST(req: NextRequest) {
  const { correo, mensaje } = await req.json();
  if (!mensaje?.trim()) {
    return NextResponse.json({ error: "Mensaje requerido" }, { status: 400 });
  }
  try {
    await sendLoginHelp({ correo: correo?.trim() || "", mensaje: mensaje.trim() });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "No se pudo enviar" }, { status: 500 });
  }
}
