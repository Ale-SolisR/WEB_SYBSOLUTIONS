import nodemailer from "nodemailer";

const MONTHS_ES = [
  "enero","febrero","marzo","abril","mayo","junio",
  "julio","agosto","septiembre","octubre","noviembre","diciembre",
];
const DAYS_ES = ["domingo","lunes","martes","miércoles","jueves","viernes","sábado"];

function getTransporter() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
}

function formatFecha(fecha: string) {
  const [y, m, d] = fecha.split("-").map(Number);
  const dateObj = new Date(y, m - 1, d);
  return {
    larga: `${DAYS_ES[dateObj.getDay()]}, ${d} de ${MONTHS_ES[m - 1]} de ${y}`,
    corta: `${d} de ${MONTHS_ES[m - 1]}`,
    d, m, y,
  };
}

function baseLayout(content: string, subtitle: string) {
  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:'Segoe UI',Arial,sans-serif;">
  <div style="max-width:580px;margin:40px auto;background:#fff;border-radius:20px;
              overflow:hidden;box-shadow:0 4px 32px rgba(0,0,0,0.10);">
    <div style="background:linear-gradient(135deg,#1e3a8a 0%,#1d4ed8 60%,#3b82f6 100%);
                padding:36px 40px;text-align:center;">
      <h1 style="color:#fff;margin:0;font-size:26px;font-weight:800;letter-spacing:-0.5px;">
        S&amp;B Solutions
      </h1>
      <p style="color:rgba(255,255,255,0.75);margin:8px 0 0;font-size:14px;">${subtitle}</p>
    </div>
    <div style="padding:36px 40px;">${content}</div>
    <div style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:20px 40px;text-align:center;">
      <p style="margin:0;color:#94a3b8;font-size:12px;">
        © 2026 S&amp;B Solutions · San José, Costa Rica ·
        <a href="https://sybsolutionscr.netlify.app" style="color:#94a3b8;">sybsolutionscr.netlify.app</a>
      </p>
    </div>
  </div>
</body>
</html>`;
}

function contactBlock() {
  return `<p style="color:#475569;font-size:14px;line-height:1.6;margin-top:24px;">
    ¿Tienes alguna pregunta? Contáctanos:
  </p>
  <p style="color:#475569;font-size:14px;line-height:1.8;margin:0;">
    📱 WhatsApp:
    <a href="https://wa.me/50687457877" style="color:#1d4ed8;text-decoration:none;font-weight:600;">
      +506 8745-7877
    </a><br>
    📧 Email:
    <a href="mailto:sybsolutionscr@gmail.com" style="color:#1d4ed8;text-decoration:none;font-weight:600;">
      sybsolutionscr@gmail.com
    </a>
  </p>`;
}

function detallesCard(fechaLarga: string, hora: string, estadoBadge: string) {
  return `<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:14px;padding:24px;margin-bottom:8px;">
    <h3 style="margin:0 0 18px;color:#0f172a;font-size:15px;font-weight:700;">📋 Detalles de tu cita</h3>
    <table style="width:100%;border-collapse:collapse;font-size:14px;">
      <tr>
        <td style="padding:7px 0;color:#64748b;width:38%;">Fecha:</td>
        <td style="padding:7px 0;color:#0f172a;font-weight:600;text-transform:capitalize;">${fechaLarga}</td>
      </tr>
      <tr style="border-top:1px solid #e2e8f0;">
        <td style="padding:7px 0;color:#64748b;">Hora:</td>
        <td style="padding:7px 0;color:#0f172a;font-weight:600;">${hora}:00 (hora Costa Rica)</td>
      </tr>
      <tr style="border-top:1px solid #e2e8f0;">
        <td style="padding:7px 0;color:#64748b;">Duración:</td>
        <td style="padding:7px 0;color:#0f172a;font-weight:600;">45 minutos</td>
      </tr>
      <tr style="border-top:1px solid #e2e8f0;">
        <td style="padding:7px 0;color:#64748b;">Estado:</td>
        <td style="padding:7px 0;">${estadoBadge}</td>
      </tr>
    </table>
  </div>`;
}

export async function sendLoginHelp({
  correo, mensaje,
}: { correo: string; mensaje: string }) {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) return;
  const content = `
    <p style="font-size:17px;color:#0f172a;margin:0 0 8px;">Solicitud de ayuda de acceso</p>
    <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:14px;padding:24px;margin-bottom:16px;">
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <tr>
          <td style="padding:7px 0;color:#64748b;width:30%;">Correo / usuario:</td>
          <td style="padding:7px 0;color:#0f172a;font-weight:600;">${correo || "(no indicado)"}</td>
        </tr>
        <tr style="border-top:1px solid #e2e8f0;">
          <td style="padding:7px 0;color:#64748b;vertical-align:top;">Mensaje:</td>
          <td style="padding:7px 0;color:#0f172a;">${mensaje}</td>
        </tr>
      </table>
    </div>
    <p style="color:#475569;font-size:13px;">Este mensaje fue enviado desde el formulario de ayuda en la página de inicio de sesión.</p>`;
  await getTransporter().sendMail({
    from: `"S&B Solutions Portal" <${process.env.GMAIL_USER}>`,
    to: "sybsolutionscr@gmail.com",
    subject: `🔐 Ayuda de acceso solicitada – ${correo || "usuario desconocido"}`,
    html: baseLayout(content, "Solicitud de ayuda de acceso"),
  });
}

export async function sendCitaRecibida({
  to, nombre, fecha, hora,
}: { to: string; nombre: string; fecha: string; hora: string }) {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) return;
  const { larga, corta, d, m } = formatFecha(fecha);
  const badge = `<span style="background:#fef9c3;color:#854d0e;padding:3px 12px;border-radius:20px;font-size:12px;font-weight:600;">⏳ Pendiente de confirmación</span>`;
  const content = `
    <p style="font-size:17px;color:#0f172a;margin:0 0 8px;">Hola <strong>${nombre}</strong>,</p>
    <p style="color:#475569;margin:0 0 24px;line-height:1.6;">
      Hemos recibido tu solicitud de demo del <strong>S&amp;B ERP</strong>.
      Tu cita quedará <strong>pendiente de confirmación</strong>. Te notificaremos cuando sea confirmada.
    </p>
    ${detallesCard(larga, hora, badge)}
    <div style="background:#fff8e1;border:1px solid #ffe082;border-radius:12px;padding:16px;margin:24px 0;">
      <p style="margin:0;color:#856404;font-size:14px;">
        📞 Nuestro equipo revisará tu solicitud y te enviará la confirmación con el enlace de reunión.
      </p>
    </div>
    ${contactBlock()}`;
  await getTransporter().sendMail({
    from: `"S&B Solutions" <${process.env.GMAIL_USER}>`,
    to,
    subject: `⏳ Solicitud de Demo recibida – ${hora}h del ${corta}`,
    html: baseLayout(content, "Solicitud de Demo recibida"),
  });
}

export async function sendCitaConfirmada({
  to, nombre, fecha, hora, meetLink,
}: { to: string; nombre: string; fecha: string; hora: string; meetLink: string | null }) {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) return;
  const { larga, corta, d, m } = formatFecha(fecha);
  const badge = `<span style="background:#dcfce7;color:#166534;padding:3px 12px;border-radius:20px;font-size:12px;font-weight:600;">✅ Confirmada</span>`;
  const meetSection = meetLink
    ? `<div style="background:#e8f5e9;border-radius:12px;padding:24px;margin:24px 0;text-align:center;">
        <p style="margin:0 0 14px;font-weight:700;color:#1b5e20;font-size:15px;">🎥 Tu enlace de Google Meet</p>
        <a href="${meetLink}"
           style="display:inline-block;background:#1a73e8;color:#fff;text-decoration:none;
                  padding:14px 32px;border-radius:8px;font-weight:700;font-size:15px;">
          Unirse a la videollamada
        </a>
        <p style="margin:14px 0 0;font-size:12px;color:#555;word-break:break-all;">${meetLink}</p>
      </div>`
    : "";
  const content = `
    <p style="font-size:17px;color:#0f172a;margin:0 0 8px;">Hola <strong>${nombre}</strong>,</p>
    <p style="color:#475569;margin:0 0 24px;line-height:1.6;">
      ¡Tu demo del <strong>S&amp;B ERP</strong> ha sido <strong>confirmada</strong>!
      A continuación encontrarás los detalles y el enlace para unirte a la reunión.
    </p>
    ${detallesCard(larga, hora, badge)}
    ${meetSection}
    ${contactBlock()}`;
  await getTransporter().sendMail({
    from: `"S&B Solutions" <${process.env.GMAIL_USER}>`,
    to,
    subject: `✅ Demo S&B ERP confirmada – ${hora}h del ${corta}`,
    html: baseLayout(content, "Tu Demo ha sido confirmada"),
  });
}

export async function sendCitaCancelada({
  to, nombre, fecha, hora,
}: { to: string; nombre: string; fecha: string; hora: string }) {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) return;
  const { larga, corta } = formatFecha(fecha);
  const badge = `<span style="background:#fee2e2;color:#991b1b;padding:3px 12px;border-radius:20px;font-size:12px;font-weight:600;">❌ Cancelada</span>`;
  const content = `
    <p style="font-size:17px;color:#0f172a;margin:0 0 8px;">Hola <strong>${nombre}</strong>,</p>
    <p style="color:#475569;margin:0 0 24px;line-height:1.6;">
      Lamentamos informarte que tu demo del <strong>S&amp;B ERP</strong> ha sido <strong>cancelada</strong>.
      Si deseas reagendar, puedes hacerlo desde nuestro sitio web o contactarnos directamente.
    </p>
    ${detallesCard(larga, hora, badge)}
    ${contactBlock()}`;
  await getTransporter().sendMail({
    from: `"S&B Solutions" <${process.env.GMAIL_USER}>`,
    to,
    subject: `❌ Demo S&B ERP cancelada – ${hora}h del ${corta}`,
    html: baseLayout(content, "Tu Demo ha sido cancelada"),
  });
}
