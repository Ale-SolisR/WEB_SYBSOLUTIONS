"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Bot, Save, Loader2, RotateCcw } from "lucide-react";

const DEFAULT_PROMPT = `Eres un asistente virtual de S&B Solutions. Tu objetivo principal es presentar y vender el S&B ERP empresarial.

Información clave:
- S&B ERP: sistema de gestión empresarial completo (inventarios, facturación, reportes, nómina)
- Precio y planes: a definir según el tamaño de la empresa
- Contacto: WhatsApp +506 87457877 | Email: sybsolutionscr@gmail.com
- Demo: disponible agendando en el sitio web

Instrucciones:
- Habla siempre en español, sé amigable y profesional
- Cuando el visitante muestre interés, invítalo a agendar una demo o contactarnos
- Si preguntan por precios, menciona que depende del tamaño de la empresa y ofrece una demo gratuita
- No inventes información que no tienes
- Siempre dirige hacia el cierre: demo o contacto directo`;

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
    if (!prompt.trim()) { toast.error("El prompt no puede estar vacío"); return; }
    setSaving(true);
    try {
      const res = await fetch("/api/configuracion", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatbot_prompt: prompt }),
      });
      if (!res.ok) throw new Error();
      toast.success("Prompt guardado correctamente");
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
            <h1 className="text-3xl font-black" style={{ color: "var(--color-text)" }}>Entrenamiento del Chatbot</h1>
            <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
              Edita el prompt del sistema para personalizar el comportamiento del asistente virtual
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
          <div className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <label className="font-semibold text-sm" style={{ color: "var(--color-text)" }}>
                Prompt del sistema (instrucciones para la IA)
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
              rows={18}
              className="input-field w-full font-mono text-sm"
              style={{ resize: "vertical" }}
              placeholder="Escribe las instrucciones para el chatbot..."
            />
            <p className="text-xs mt-2" style={{ color: "var(--color-text-muted)" }}>
              {prompt.length} caracteres · El chatbot usará estas instrucciones como guía en cada conversación
            </p>
          </div>

          <div className="card p-4">
            <p className="text-sm font-semibold mb-2" style={{ color: "var(--color-text)" }}>
              Consejos para un buen prompt:
            </p>
            <ul className="text-xs space-y-1 list-disc list-inside" style={{ color: "var(--color-text-muted)" }}>
              <li>Define claramente el rol y objetivo del asistente</li>
              <li>Incluye información clave del producto (ERP) y precios si los tienes</li>
              <li>Especifica el tono: formal, amigable, técnico, etc.</li>
              <li>Indica cómo manejar preguntas fuera del tema</li>
              <li>Siempre incluye datos de contacto para cerrar ventas</li>
            </ul>
          </div>

          <div className="flex justify-end">
            <button onClick={handleSave} disabled={saving} className="btn-primary">
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {saving ? "Guardando..." : "Guardar prompt"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
