"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Palette, Save, Loader2 } from "lucide-react";
import type { Theme } from "@/types";
import { useTheme } from "@/contexts/ThemeContext";

const THEMES: { id: Theme; label: string; emoji: string; color: string; desc: string }[] = [
  { id: "blue",      label: "Azul Corporativo",  emoji: "🔵", color: "#1d4ed8", desc: "Profesional y confiable" },
  { id: "dark",      label: "Modo Oscuro",        emoji: "🌑", color: "#111827", desc: "Elegante y moderno" },
  { id: "light",     label: "Claro",              emoji: "☀️", color: "#475569", desc: "Limpio y minimalista" },
  { id: "red",       label: "Rojo",               emoji: "🔴", color: "#dc2626", desc: "Energético y dinámico" },
  { id: "orange",    label: "Naranja",             emoji: "🟠", color: "#ea580c", desc: "Cálido y creativo" },
  { id: "christmas", label: "Navidad",             emoji: "🎄", color: "#166534", desc: "Temporada diciembre" },
  { id: "valentine", label: "San Valentín",        emoji: "💝", color: "#be185d", desc: "Temporada febrero" },
  { id: "easter",    label: "Pascua",              emoji: "🐣", color: "#7c3aed", desc: "Temporada marzo/abril" },
];

export default function AdminTemas() {
  const { theme: currentTheme, setTheme } = useTheme();
  const [saving, setSaving] = useState(false);
  const [activeTheme, setActiveTheme] = useState<Theme>(currentTheme);

  useEffect(() => { setActiveTheme(currentTheme); }, [currentTheme]);

  const handleSelect = (t: Theme) => {
    setActiveTheme(t);
    setTheme(t); // preview immediately
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/configuracion", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ site_theme: activeTheme }),
      });
      if (!res.ok) throw new Error();
      toast.success(`Tema "${THEMES.find(t => t.id === activeTheme)?.label}" guardado para todos los usuarios`);
    } catch {
      toast.error("Error al guardar el tema");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold" style={{ color: "var(--color-text)" }}>Temas</h1>
        <p className="text-sm mt-0.5" style={{ color: "var(--color-text-muted)" }}>
          El tema activo se aplica a toda la página para todos los visitantes
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {THEMES.map((t) => (
          <button
            key={t.id}
            onClick={() => handleSelect(t.id)}
            className="card p-4 text-left transition-all hover:shadow-md"
            style={{
              borderWidth: activeTheme === t.id ? 2 : 1,
              borderColor: activeTheme === t.id ? t.color : "var(--color-border)",
              boxShadow: activeTheme === t.id ? `0 0 0 3px ${t.color}18` : undefined,
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center text-lg"
                style={{ background: t.color }}
              >
                {t.emoji}
              </div>
              {activeTheme === t.id && (
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: `${t.color}18`, color: t.color }}
                >
                  Activo
                </span>
              )}
            </div>
            <p className="font-medium text-sm" style={{ color: "var(--color-text)" }}>{t.label}</p>
            <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>{t.desc}</p>
          </button>
        ))}
      </div>

      <div className="card p-5 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium" style={{ color: "var(--color-text)" }}>
            {THEMES.find(t => t.id === activeTheme)?.emoji} {THEMES.find(t => t.id === activeTheme)?.label}
          </p>
          <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>
            Guarda para aplicarlo a todos los visitantes
          </p>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-primary">
          {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
          {saving ? "Guardando..." : "Guardar tema"}
        </button>
      </div>
    </div>
  );
}
