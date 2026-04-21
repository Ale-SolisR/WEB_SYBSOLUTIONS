"use client";

import { useState } from "react";
import { Palette, X } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import type { Theme } from "@/types";

const THEMES: { id: Theme; label: string; emoji: string; color: string }[] = [
  { id: "blue",      label: "Azul",      emoji: "🔵", color: "#1d4ed8" },
  { id: "dark",      label: "Oscuro",    emoji: "🌑", color: "#111827" },
  { id: "light",     label: "Claro",     emoji: "☀️", color: "#475569" },
  { id: "red",       label: "Rojo",      emoji: "🔴", color: "#dc2626" },
  { id: "orange",    label: "Naranja",   emoji: "🟠", color: "#ea580c" },
  { id: "christmas", label: "Navidad",   emoji: "🎄", color: "#166534" },
  { id: "valentine", label: "San Valentín", emoji: "💝", color: "#be185d" },
  { id: "easter",    label: "Pascua",    emoji: "🐣", color: "#7c3aed" },
];

export default function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);

  const handleSelect = async (id: Theme) => {
    setTheme(id);
    setOpen(false);
    try {
      await fetch("/api/configuracion", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ site_theme: id }),
      });
    } catch {
      // Ignore — theme already applied locally
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        aria-label="Cambiar tema"
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm font-medium transition-all hover:scale-105"
        style={{ borderColor: "var(--color-border)", color: "var(--color-text-muted)", background: "var(--color-surface)" }}
      >
        <Palette size={16} style={{ color: "var(--color-primary)" }} />
        <span className="hidden sm:inline">Tema</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            className="absolute right-0 top-12 z-50 w-56 rounded-2xl shadow-2xl border p-3"
            style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
          >
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--color-text-muted)" }}>
                Elegir tema
              </span>
              <button onClick={() => setOpen(false)} style={{ color: "var(--color-text-muted)" }}>
                <X size={14} />
              </button>
            </div>
            <div className="grid grid-cols-1 gap-1">
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => handleSelect(t.id)}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all hover:scale-[1.02] text-left"
                  style={{
                    background: theme === t.id ? `color-mix(in srgb, ${t.color} 12%, transparent)` : "transparent",
                    color: "var(--color-text)",
                    fontWeight: theme === t.id ? 600 : 400,
                  }}
                >
                  <span
                    className="w-5 h-5 rounded-full flex-shrink-0"
                    style={{
                      background: t.color,
                      outline: theme === t.id ? `2px solid ${t.color}` : "2px solid transparent",
                      outlineOffset: "2px",
                    }}
                  />
                  <span>{t.emoji} {t.label}</span>
                  {theme === t.id && <span className="ml-auto text-xs" style={{ color: t.color }}>✓</span>}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
