"use client";

import { motion } from "framer-motion";
import { Globe, Server, Network, Cpu, GraduationCap, Headphones } from "lucide-react";

const SERVICES = [
  {
    icon: Globe,
    title: "Desarrollo Web",
    desc: "Creamos páginas web y aplicaciones profesionales, modernas y optimizadas para tu negocio. Desde sitios informativos hasta plataformas empresariales complejas.",
    color: "#3b82f6",
  },
  {
    icon: Server,
    title: "Servidores e Infraestructura",
    desc: "Instalación, configuración y administración de servidores. Implementamos soluciones robustas para garantizar la continuidad y seguridad de tu negocio.",
    color: "#8b5cf6",
  },
  {
    icon: Network,
    title: "Redes y Conectividad",
    desc: "Diseño, instalación y mantenimiento de redes empresariales. Garantizamos conectividad rápida, segura y confiable para toda tu organización.",
    color: "#06b6d4",
  },
  {
    icon: Cpu,
    title: "Reparación y Mejora de Equipos",
    desc: "Diagnóstico, reparación y actualización de equipos de cómputo. Maximizamos el rendimiento y vida útil de tu hardware al mejor costo.",
    color: "#f59e0b",
  },
  {
    icon: GraduationCap,
    title: "Capacitaciones Tecnológicas",
    desc: "Formación personalizada para tu equipo en herramientas tecnológicas, sistemas empresariales y mejores prácticas digitales para optimizar su trabajo.",
    color: "#10b981",
  },
  {
    icon: Headphones,
    title: "Soporte y Mantenimiento TI",
    desc: "Soporte técnico continuo y mantenimiento preventivo para asegurar el óptimo funcionamiento de toda tu infraestructura tecnológica.",
    color: "#ef4444",
  },
];

export default function Services() {
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {SERVICES.map((svc, i) => {
          const Icon = svc.icon;
          return (
            <motion.div
              key={svc.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="card p-6 group cursor-default"
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                style={{ background: `${svc.color}18` }}
              >
                <Icon size={24} style={{ color: svc.color }} />
              </div>
              <h3 className="font-bold text-lg mb-2" style={{ color: "var(--color-text)" }}>
                {svc.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
                {svc.desc}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
