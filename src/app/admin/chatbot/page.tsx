"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Bot, Save, Loader2, RotateCcw } from "lucide-react";

const DEFAULT_PROMPT = `Información adicional sobre S&B Solutions (el chatbot la usa como contexto extra):

- S&B ERP: sistema de gestión empresarial completo (inventarios, facturación electrónica, nómina, reportes)
- Precio: varía según tamaño de empresa y módulos requeridos
- Demo gratuita disponible agendando en el sitio web
- WhatsApp: +506 8745-7877
- Email: sybsolutionscr@gmail.com
- Ubicación: San José, Costa Rica
- Servicios: desarrollo web, redes, servidores, reparación, capacitaciones, soporte TI`;

export default function AdminChatbot() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/configuracion")
      .then((r) => r.json())
      .then((data) => setPrompt(data.chatbot_prompt || DEFAULT_PROMPT))
      .catch(() => setPrompt(DEFAULT_PROMPT))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (!prompt.trim()) { toast.error("El contenido no puede estar vacío"); return; }
    setSaving(true);
    try {
      const res = await fetch("/api/configuracion", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatbot_prompt: prompt }),
      });
      if (!res.ok) throw new Error();
      toast.success("Información del chatbot guardada");
    } catch {
      toast.error("Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "var(--color-primary)" }}>
            <Bot size={20} color="#fff" />
          </div>
          <div>
            <h1 className="text-3xl font-black" style={{ color: "var(--color-text)" }}>Configurar Chatbot</h1>
            <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
              Edita la información que el asistente virtual usa para responder a los visitantes
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 size={36} className="animate-spin" style={{ color: "var(--color-primary)" }} />
        </div>
      ) : (
        <div className="max-w-3xl space-y-4">
          <div className="card p-4 text-sm" style={{ background: "var(--color-surface-2)", color: "var(--color-text-muted)" }}>
            <p className="font-semibold mb-1" style={{ color: "var(--color-text)" }}>ℹ️ ¿Cómo funciona?</p>
            <p>El chatbot responde automáticamente preguntas sobre precios, demos, ERP, servicios y contacto. Aquí puedes editar la información adicional que usará como contexto, como datos de contacto actualizados, nuevos módulos del ERP, precios específicos, etc.</p>
          </div>

          <div className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <label className="font-semibold text-sm" style={{ color: "var(--color-text)" }}>
                Información del negocio para el chatbot
              </label>
              <button
                onClick={() => setPrompt(DEFAULT_PROMPT)}
                className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg border transition-opacity hover:opacity-70"
                style={{ borderColor: "var(--color-border)", color: "var(--color-text-muted)" }}
              >
                <RotateCcw size={12} /> Restaurar
              </button>
            </div>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={14}
              className="input-field w-full text-sm"
              style={{ resize: "vertical" }}
              placeholder="Escribe información sobre tu empresa, productos, precios y contacto..."
            />
            <p className="text-xs mt-2" style={{ color: "var(--color-text-muted)" }}>
              {prompt.length} caracteres
            </p>
          </div>

          <div className="card p-4">
            <p className="text-sm font-semibold mb-2" style={{ color: "var(--color-text)" }}>
              Temas que el chatbot responde automáticamente:
            </p>
            <div className="flex flex-wrap gap-2">
              {["Saludos","Preguntas sobre el ERP","Precios y planes","Agendar demo","Información de contacto","Servicios TI","Ubicación"].map((t) => (
                <span key={t} className="text-xs px-2.5 py-1 rounded-full font-medium"
                  style={{ background: "var(--color-surface-2)", color: "var(--color-text-muted)" }}>
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button onClick={handleSave} disabled={saving} className="btn-primary">
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {saving ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
