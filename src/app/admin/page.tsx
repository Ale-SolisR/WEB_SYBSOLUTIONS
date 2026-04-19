"use client";

import { useEffect, useState } from "react";
import { Video, Users2, Settings, Calendar, ArrowUpRight, Layers, Palette, Bot } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ videos: 0, clientes: 0, citas: 0, pendientes: 0 });

  useEffect(() => {
    Promise.all([
      fetch("/api/videos").then((r) => r.json()),
      fetch("/api/clientes").then((r) => r.json()),
      fetch("/api/citas").then((r) => r.json()),
    ]).then(([videos, clientes, citas]) => {
      const pendientes = Array.isArray(citas) ? citas.filter((c: any) => c.Estado === "pendiente").length : 0;
      setStats({
        videos: Array.isArray(videos) ? videos.length : 0,
        clientes: Array.isArray(clientes) ? clientes.length : 0,
        citas: Array.isArray(citas) ? citas.length : 0,
        pendientes,
      });
    }).catch(() => {});
  }, []);

  const STATS = [
    { label: "Videos",          value: stats.videos,     icon: Video,    color: "var(--color-primary)", href: "/admin/videos" },
    { label: "Clientes",        value: stats.clientes,   icon: Users2,   color: "#8b5cf6",              href: "/admin/clientes" },
    { label: "Citas totales",   value: stats.citas,      icon: Calendar, color: "#10b981",              href: "/admin/citas" },
    { label: "Citas pendientes",value: stats.pendientes, icon: Calendar, color: "#f59e0b",              href: "/admin/citas" },
  ];

  const SHORTCUTS = [
    { href: "/admin/secciones",     icon: Layers,   label: "Secciones",    desc: "Edita el contenido del sitio" },
    { href: "/admin/temas",         icon: Palette,  label: "Temas",        desc: "Cambia colores y estilo" },
    { href: "/admin/chatbot",       icon: Bot,      label: "Chatbot",      desc: "Configura el asistente" },
    { href: "/admin/configuracion", icon: Settings, label: "Configuración",desc: "Contacto y redes sociales" },
  ];

  return (
    <div className="max-w-5xl space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold" style={{ color: "var(--color-text)" }}>Dashboard</h1>
        <p className="text-sm mt-0.5" style={{ color: "var(--color-text-muted)" }}>
          Resumen general del sitio
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map(({ label, value, icon: Icon, color, href }) => (
          <Link
            key={label}
            href={href}
            className="card p-5 group hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ background: `color-mix(in srgb, ${color} 12%, transparent)` }}
              >
                <Icon size={17} style={{ color }} />
              </div>
              <ArrowUpRight size={15} className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ color }} />
            </div>
            <p className="text-2xl font-bold leading-none" style={{ color }}>{value}</p>
            <p className="text-xs mt-1.5" style={{ color: "var(--color-text-muted)" }}>{label}</p>
          </Link>
        ))}
      </div>

      {/* Shortcuts */}
      <div>
        <h2 className="text-sm font-medium mb-3" style={{ color: "var(--color-text-muted)" }}>
          Acceso rápido
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {SHORTCUTS.map(({ href, icon: Icon, label, desc }) => (
            <Link
              key={href}
              href={href}
              className="card p-4 flex items-start gap-3 hover:shadow-md transition-shadow group"
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: "var(--color-surface-2)" }}
              >
                <Icon size={15} style={{ color: "var(--color-primary)" }} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: "var(--color-text)" }}>{label}</p>
                <p className="text-xs mt-0.5 truncate" style={{ color: "var(--color-text-muted)" }}>{desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
