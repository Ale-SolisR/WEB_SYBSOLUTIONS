"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Package, BarChart3, Users, FileText, Settings, ArrowRight, Clock } from "lucide-react";

const ERP_FEATURES = [
  { icon: Package,   label: "Inventarios" },
  { icon: FileText,  label: "Facturación" },
  { icon: BarChart3, label: "Reportes" },
  { icon: Users,     label: "Multi-empresa" },
  { icon: Settings,  label: "Configuración" },
];

export default function Products() {
  return (
    <section
      id="productos"
      className="py-24"
      style={{ background: "var(--color-surface-2)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="badge mb-4">Productos</span>
          <h2 className="section-title">Software empresarial de clase mundial</h2>
          <p className="section-subtitle">
            Desarrollado con las mejores prácticas, pensado para el crecimiento de tu empresa.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* ERP Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="card p-8 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl opacity-10" style={{ background: "var(--color-primary)" }} />
            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl" style={{ background: "var(--color-primary)", color: "#fff" }}>
                  📊
                </div>
                <div>
                  <h3 className="text-2xl font-black" style={{ color: "var(--color-text)" }}>SYB ERP</h3>
                  <span className="badge text-xs">Disponible</span>
                </div>
              </div>
              <p className="mb-6 leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
                Sistema ERP completo para la gestión integral de tu empresa. Desde inventarios y facturación hasta reportes avanzados y administración multi-empresa.
              </p>
              <div className="flex flex-wrap gap-2 mb-8">
                {ERP_FEATURES.map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium"
                    style={{ background: "var(--color-surface-2)", color: "var(--color-text-muted)", border: "1px solid var(--color-border)" }}
                  >
                    <Icon size={13} style={{ color: "var(--color-primary)" }} /> {label}
                  </div>
                ))}
              </div>
              <Link href="/#contacto" className="btn-primary">
                Solicitar demo <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>

          {/* CRM Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="card p-8 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl opacity-10" style={{ background: "#8b5cf6" }} />
            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl" style={{ background: "#8b5cf6", color: "#fff" }}>
                  🤝
                </div>
                <div>
                  <h3 className="text-2xl font-black" style={{ color: "var(--color-text)" }}>SYB CRM</h3>
                  <div className="flex items-center gap-1.5 badge text-xs" style={{ background: "#8b5cf618", color: "#8b5cf6" }}>
                    <Clock size={11} /> En desarrollo
                  </div>
                </div>
              </div>
              <p className="mb-6 leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
                Próximamente: gestión de relaciones con clientes, seguimiento de ventas, automatización de marketing y análisis de oportunidades de negocio.
              </p>
              <div className="rounded-2xl p-5 mb-8" style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)" }}>
                <p className="text-sm font-semibold mb-3" style={{ color: "var(--color-text)" }}>Funciones planeadas</p>
                {["Gestión de contactos", "Pipeline de ventas", "Reportes de KPIs", "Integraciones API"].map((f) => (
                  <div key={f} className="flex items-center gap-2 text-sm py-1" style={{ color: "var(--color-text-muted)" }}>
                    <span style={{ color: "#8b5cf6" }}>○</span> {f}
                  </div>
                ))}
              </div>
              <button
                className="btn-outline opacity-80 cursor-not-allowed"
                style={{ borderColor: "#8b5cf6", color: "#8b5cf6" }}
                disabled
              >
                Próximamente
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
