import { NextResponse } from "next/server";
import { initDatabase } from "@/lib/db-init";

/** POST /api/init – Creates web schema tables if they don't exist */
export async function POST() {
  try {
    await initDatabase();
    return NextResponse.json({ success: true, message: "Database initialized" });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("DB init error:", msg);
    return NextResponse.json({ error: "Initialization failed", detail: msg }, { status: 500 });
  }
}
