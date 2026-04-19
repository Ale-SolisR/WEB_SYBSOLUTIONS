"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Save, Loader2, Phone, Mail, MapPin } from "lucide-react";
import toast from "react-hot-toast";

interface ConfigForm {
  whatsapp: string;
  email: string;
  direccion: string;
  facebook: string;
  linkedin: string;
  instagram: string;
}

function FacebookIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function LinkedInIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function InstagramIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

const SOCIAL_CONFIG = [
  {
    key: "linkedin" as const,
    label: "LinkedIn",
    placeholder: "https://linkedin.com/company/...",
    icon: LinkedInIcon,
    color: "#0A66C2",
    bg: "#E8F0F9",
  },
  {
    key: "facebook" as const,
    label: "Facebook",
    placeholder: "https://facebook.com/...",
    icon: FacebookIcon,
    color: "#1877F2",
    bg: "#E7F0FD",
  },
  {
    key: "instagram" as const,
    label: "Instagram",
    placeholder: "https://instagram.com/...",
    icon: InstagramIcon,
    color: "#E1306C",
    bg: "#FDE8EF",
  },
];

export default function AdminConfiguracion() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, reset, formState: { isDirty } } = useForm<ConfigForm>();

  useEffect(() => {
    fetch("/api/configuracion")
      .then((r) => r.json())
      .then((data) => { reset(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [reset]);

  const onSubmit = async (data: ConfigForm) => {
    setSaving(true);
    try {
      const res = await fetch("/api/configuracion", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      toast.success("Configuración guardada");
      reset(data);
    } catch {
      toast.error("Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold" style={{ color: "var(--color-text)" }}>Configuración</h1>
        <p className="text-sm mt-0.5" style={{ color: "var(--color-text-muted)" }}>
          Información de contacto y redes sociales del sitio
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 size={28} className="animate-spin" style={{ color: "var(--color-primary)" }} />
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          {/* Contacto */}
          <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "var(--color-border)" }}>
            <div
              className="px-5 py-3.5 flex items-center gap-2.5 border-b"
              style={{ background: "var(--color-surface-2)", borderColor: "var(--color-border)" }}
            >
              <div
                className="w-6 h-6 rounded-md flex items-center justify-center"
                style={{ background: "var(--color-primary)" }}
              >
                <Phone size={12} color="#fff" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-text)" }}>
                Contacto
              </span>
            </div>

            <div style={{ background: "var(--color-surface)" }}>
              {/* WhatsApp */}
              <div className="flex items-center gap-4 px-5 py-4 border-b" style={{ borderColor: "var(--color-border)" }}>
                <div className="flex items-center gap-3 w-32 flex-shrink-0">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ background: "#dcfce7" }}
                  >
                    <Phone size={13} style={{ color: "#16a34a" }} />
                  </div>
                  <span className="text-sm font-medium" style={{ color: "var(--color-text)" }}>WhatsApp</span>
                </div>
                <input
                  {...register("whatsapp")}
                  type="text"
                  className="flex-1 bg-transparent text-sm outline-none border-0 focus:ring-0"
                  placeholder="+506 8745-7877"
                  style={{ color: "var(--color-text)" }}
                />
              </div>

              {/* Email */}
              <div className="flex items-center gap-4 px-5 py-4 border-b" style={{ borderColor: "var(--color-border)" }}>
                <div className="flex items-center gap-3 w-32 flex-shrink-0">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ background: "#dbeafe" }}
                  >
                    <Mail size={13} style={{ color: "#2563eb" }} />
                  </div>
                  <span className="text-sm font-medium" style={{ color: "var(--color-text)" }}>Email</span>
                </div>
                <input
                  {...register("email")}
                  type="email"
                  className="flex-1 bg-transparent text-sm outline-none border-0 focus:ring-0"
                  placeholder="info@empresa.com"
                  style={{ color: "var(--color-text)" }}
                />
              </div>

              {/* Dirección */}
              <div className="flex items-center gap-4 px-5 py-4">
                <div className="flex items-center gap-3 w-32 flex-shrink-0">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ background: "#fce7f3" }}
                  >
                    <MapPin size={13} style={{ color: "#db2777" }} />
                  </div>
                  <span className="text-sm font-medium" style={{ color: "var(--color-text)" }}>Dirección</span>
                </div>
                <input
                  {...register("direccion")}
                  type="text"
                  className="flex-1 bg-transparent text-sm outline-none border-0 focus:ring-0"
                  placeholder="San José, Costa Rica"
                  style={{ color: "var(--color-text)" }}
                />
              </div>
            </div>
          </div>

          {/* Redes Sociales */}
          <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "var(--color-border)" }}>
            <div
              className="px-5 py-3.5 flex items-center gap-2.5 border-b"
              style={{ background: "var(--color-surface-2)", borderColor: "var(--color-border)" }}
            >
              <div
                className="w-6 h-6 rounded-md flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #f093fb 0%, #f5576c 50%, #4facfe 100%)" }}
              >
                <InstagramIcon size={11} />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-text)" }}>
                Redes Sociales
              </span>
            </div>

            <div style={{ background: "var(--color-surface)" }}>
              {SOCIAL_CONFIG.map(({ key, label, placeholder, icon: Icon, color, bg }, i) => (
                <div
                  key={key}
                  className="flex items-center gap-4 px-5 py-4"
                  style={{ borderBottom: i < SOCIAL_CONFIG.length - 1 ? `1px solid var(--color-border)` : undefined }}
                >
                  <div className="flex items-center gap-3 w-32 flex-shrink-0">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center"
                      style={{ background: bg, color }}
                    >
                      <Icon size={13} />
                    </div>
                    <span className="text-sm font-medium" style={{ color: "var(--color-text)" }}>{label}</span>
                  </div>
                  <input
                    {...register(key)}
                    type="url"
                    className="flex-1 bg-transparent text-sm outline-none border-0 focus:ring-0 truncate"
                    placeholder={placeholder}
                    style={{ color: "var(--color-text)" }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Save bar */}
          <div
            className="flex items-center justify-between px-5 py-4 rounded-2xl border"
            style={{
              background: isDirty
                ? "color-mix(in srgb, var(--color-primary) 5%, var(--color-surface))"
                : "var(--color-surface)",
              borderColor: isDirty ? "var(--color-primary)" : "var(--color-border)",
              transition: "all 0.2s",
            }}
          >
            <p className="text-sm" style={{ color: isDirty ? "var(--color-primary)" : "var(--color-text-muted)" }}>
              {isDirty ? "Tienes cambios sin guardar" : "Todo guardado"}
            </p>
            <button type="submit" disabled={saving || !isDirty} className="btn-primary py-2 px-5 text-sm disabled:opacity-40">
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              {saving ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>

        </form>
      )}
    </div>
  );
}
