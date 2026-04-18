"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Servicio {
  Id: number;
  Titulo: string;
  Descripcion: string;
  Icono: string;
  Color: string;
  Activo: boolean;
  Orden: number;
}

function getIcon(name: string): LucideIcon {
  const icons: Record<string, LucideIcon> = {
    Globe: LucideIcons.Globe,
    Server: LucideIcons.Server,
    Network: LucideIcons.Network,
    Cpu: LucideIcons.Cpu,
    GraduationCap: LucideIcons.GraduationCap,
    Headphones: LucideIcons.Headphones,
    Shield: LucideIcons.Shield,
    Code: LucideIcons.Code2,
    Cloud: LucideIcons.Cloud,
    Database: LucideIcons.Database,
    Settings: LucideIcons.Settings,
    Wifi: LucideIcons.Wifi,
  };
  return icons[name] || LucideIcons.Globe;
}

export default function Services() {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/servicios")
      .then((r) => r.json())
      .then((data) => setServicios(data.filter((s: Servicio) => s.Activo)))
      .catch(() => setServicios([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="servicios" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <span className="badge mb-4">Nuestros Servicios</span>
        <h2 className="section-title">Soluciones TI integrales</h2>
        <p className="section-subtitle">
          Todo lo que tu empresa necesita en tecnología, en un solo lugar.
        </p>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card p-6 animate-pulse h-48"
              style={{ background: "var(--color-border)" }} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicios.map((svc, i) => {
            const Icon = getIcon(svc.Icono);
            return (
              <motion.div
                key={svc.Id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="card p-6 group cursor-default"
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                  style={{ background: `${svc.Color}18` }}
                >
                  <Icon size={24} style={{ color: svc.Color }} />
                </div>
                <h3 className="font-bold text-lg mb-2" style={{ color: "var(--color-text)" }}>
                  {svc.Titulo}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
                  {svc.Descripcion}
                </p>
              </motion.div>
            );
          })}
        </div>
      )}
    </section>
  );
}
