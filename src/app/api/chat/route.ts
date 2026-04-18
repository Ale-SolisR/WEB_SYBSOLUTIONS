import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getPool, sql } from "@/lib/db";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function getChatbotPrompt(): Promise<string> {
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input("Clave", sql.NVarChar, "chatbot_prompt")
      .query("SELECT Valor FROM web.CONFIGURACION WHERE Clave=@Clave");
    return result.recordset[0]?.Valor || "";
  } catch {
    return "Eres un asistente de S&B Solutions especializado en vender el ERP empresarial.";
  }
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "messages requerido" }, { status: 400 });
    }

    const systemPrompt = await getChatbotPrompt();

    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 600,
      system: systemPrompt,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";
    return NextResponse.json({ reply: text });
  } catch {
    return NextResponse.json({ error: "Error al procesar" }, { status: 500 });
  }
}
