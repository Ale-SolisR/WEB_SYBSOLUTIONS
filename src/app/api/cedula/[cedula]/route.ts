import { NextRequest, NextResponse } from "next/server";

type Params = { params: Promise<{ cedula: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { cedula } = await params;
  if (!/^\d{9,12}$/.test(cedula)) {
    return NextResponse.json({ error: "Cédula inválida" }, { status: 400 });
  }
  try {
    const res = await fetch(`https://apis.gometa.org/cedulas/${cedula}`, {
      headers: { "Accept": "application/json" },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Error al consultar" }, { status: 500 });
  }
}
