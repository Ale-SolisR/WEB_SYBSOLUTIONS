"use client";

import { useEffect, useState } from "react";
import { Video, Users2, Settings, ArrowRight, ExternalLink } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ videos: 0, clientes: 0 });

  useEffect(() => {
    Promise.all([
      fetch("/api/videos").then((r) => r.json()),
      fetch("/api/clientes").then((r) => r.json()),
    ]).then(([videos, clientes]) => {
      setStats({ videos: videos.length, clientes: clientes.length });
    }).catch(() => {});
  }, []);

  const CARDS = [
    { href: "/admin/videos",       icon: Video,    label: "Videos",      count: stats.videos,   color: "var(--color-primary)", desc: "Gestionar capacitaciones" },
    { href: "/admin/clientes",     icon: Users2,   label: "Clientes",    count: stats.clientes, color: "#8b5cf6",              desc: "Logos y nombres" },
    { href: "/admin/configuracion", icon: Settings, label: "Configuración", count: null,          color: "#10b981",              desc: "Contacto y redes" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black" style={{ color: "var(--color-text)" }}>Dashboard</h1>
        <p className="mt-1" style={{ color: "var(--color-text-muted)" }}>
          Bienvenido al panel de administración de SYB Solutions
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {CARDS.map(({ href, icon: Icon, label, count, color, desc }, i) => (
          <motion.div
            key={href}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Link href={href} className="card p-6 flex flex-col gap-4 hover:scale-[1.02] transition-transform block">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: `${color}18` }}>
                  <Icon size={24} style={{ color }} />
                </div>
                {count !== null && (
                  <span className="text-3xl font-black" style={{ color }}>{count}</span>
                )}
              </div>
              <div>
                <p className="font-bold" style={{ color: "var(--color-text)" }}>{label}</p>
                <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>{desc}</p>
              </div>
              <div className="flex items-center gap-1 text-xs font-medium" style={{ color }}>
                Administrar <ArrowRight size={14} />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="card p-6">
        <h2 className="font-bold mb-4" style={{ color: "var(--color-text)" }}>Acciones rápidas</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/videos" className="btn-primary text-sm py-2 px-4">
            + Agregar video
          </Link>
          <Link href="/admin/clientes" className="btn-outline text-sm py-2 px-4">
            + Agregar cliente
          </Link>
          <a href="/" target="_blank" rel="noopener noreferrer" className="btn-outline text-sm py-2 px-4 flex items-center gap-2">
            <ExternalLink size={14} /> Ver sitio web
          </a>
        </div>
      </div>
    </div>
  );
}
