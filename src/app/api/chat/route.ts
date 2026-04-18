import { NextRequest, NextResponse } from "next/server";
import { getPool, sql } from "@/lib/db";

interface Message { role: "user" | "assistant"; content: string }

async function getFAQ(): Promise<string> {
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input("Clave", sql.NVarChar, "chatbot_prompt")
      .query("SELECT Valor FROM web.CONFIGURACION WHERE Clave=@Clave");
    return result.recordset[0]?.Valor || "";
  } catch {
    return "";
  }
}

function buildReply(userMsg: string, faqText: string): string {
  const msg = userMsg.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // Greetings
  if (/^(hola|buenos|buenas|hi|saludos|hey)/.test(msg)) {
    return "¡Hola! 👋 Soy el asistente virtual de S&B Solutions. Estoy aquí para ayudarte con información sobre nuestro **S&B ERP** y nuestros servicios TI. ¿En qué puedo ayudarte?";
  }

  // ERP / product
  if (/erp|sistema|software|gestion|inventario|factura|nomina|contab/.test(msg)) {
    return "El **S&B ERP** es nuestro sistema de gestión empresarial diseñado para Costa Rica. Incluye módulos de:\n\n• 📦 Inventarios y bodega\n• 🧾 Facturación electrónica\n• 👥 Nómina y RRHH\n• 📊 Reportes en tiempo real\n• 🔗 Integración con Hacienda\n\n¿Te gustaría agendar una demo gratuita para verlo en acción?";
  }

  // Price / cost
  if (/precio|costo|cuanto|tarifa|plan|pago/.test(msg)) {
    return "Los precios del S&B ERP varían según el tamaño de tu empresa y los módulos que necesites. 💡\n\nLo mejor es que agendemos una **demo gratuita** donde analizamos tus necesidades y te presentamos la propuesta más conveniente.\n\n¿Te interesa agendar?";
  }

  // Demo / appointment
  if (/demo|cita|agendar|reunion|llamada|prueba|gratis/.test(msg)) {
    return "¡Excelente decisión! 🎯 Puedes agendar tu demo gratuita directamente en esta misma página, en la sección **\"Agenda tu demostración\"**.\n\nEs solo 1 hora donde te mostramos el sistema en vivo adaptado a tu rubro. ¡Sin compromisos!";
  }

  // Contact
  if (/contacto|whatsapp|correo|email|telefono|llamar|escribir/.test(msg)) {
    return "Puedes contactarnos por:\n\n📱 **WhatsApp:** +506 8745-7877\n📧 **Email:** sybsolutionscr@gmail.com\n\n¡Respondemos en menos de 24 horas hábiles!";
  }

  // Services
  if (/servicio|red|servidor|soporte|mantenimiento|reparacion|capacitacion/.test(msg)) {
    return "Además del ERP, ofrecemos servicios TI completos:\n\n🌐 Desarrollo web\n🖥️ Servidores e infraestructura\n🔌 Redes y conectividad\n🔧 Reparación de equipos\n🎓 Capacitaciones\n🛠️ Soporte y mantenimiento\n\n¿Cuál te interesa más?";
  }

  // Location
  if (/ubicacion|donde|direccion|oficina|costa rica/.test(msg)) {
    return "Estamos ubicados en **San José, Costa Rica** y damos servicio a todo el país. 🇨🇷\n\nTambién ofrecemos implementación y soporte remoto para empresas fuera de la GAM.";
  }

  // Thanks
  if (/gracias|thank|perfecto|excelente|ok|listo/.test(msg)) {
    return "¡Con gusto! 😊 Si tienes más preguntas o quieres agendar tu demo, estoy aquí. También puedes escribirnos al WhatsApp: **+506 8745-7877**";
  }

  // Check FAQ text from DB for custom keywords
  if (faqText) {
    const lines = faqText.split("\n").filter((l) => l.trim());
    for (const line of lines) {
      const lower = line.toLowerCase();
      const words = msg.split(/\s+/).filter((w) => w.length > 3);
      if (words.some((w) => lower.includes(w))) {
        // Found relevant FAQ line — return a contextual reply
        break;
      }
    }
  }

  // Default
  return "Gracias por tu mensaje. 😊 Nuestro equipo puede ayudarte mejor de forma directa:\n\n📱 **WhatsApp:** +506 8745-7877\n📧 **Email:** sybsolutionscr@gmail.com\n\nO si prefieres, agenda una **demo gratuita** del S&B ERP en la sección de citas. ¡Sin compromiso!";
}

export async function POST(req: NextRequest) {
  try {
    const { messages }: { messages: Message[] } = await req.json();
    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "messages requerido" }, { status: 400 });
    }

    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    if (!lastUser) return NextResponse.json({ reply: "¿En qué puedo ayudarte?" });

    const faq = await getFAQ();
    const reply = buildReply(lastUser.content, faq);

    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json({ error: "Error al procesar" }, { status: 500 });
  }
}
