"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Package, BarChart3, Users, FileText, Settings, ArrowRight,
  Clock, CheckCircle2, Zap, Shield, TrendingUp, Bell,
} from "lucide-react";

const ERP_FEATURES = [
  { icon: Package,   label: "Inventarios",    desc: "Control total de stock en tiempo real" },
  { icon: FileText,  label: "Facturación",    desc: "Emisión electrónica integrada" },
  { icon: BarChart3, label: "Reportes",       desc: "Dashboards con analytics avanzados" },
  { icon: Users,     label: "Multi-empresa",  desc: "Gestión de múltiples sucursales" },
  { icon: Settings,  label: "Configuración",  desc: "Personalización sin límites" },
];

const STATS = [
  { value: "99.9%", label: "Uptime" },
  { value: "<2s",   label: "Respuesta" },
  { value: "100%",  label: "Soporte CR" },
];

const CRM_FEATURES = [
  "Gestión de contactos y leads",
  "Pipeline de ventas visual",
  "Reportes de KPIs en tiempo real",
  "Integraciones con API externa",
  "Automatización de marketing",
];

export default function Products() {
  return (
    <section id="productos" className="py-16 scroll-mt-20" style={{ background: "var(--color-surface-2)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
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

        {/* ERP — featured wide card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden rounded-3xl mb-8"
          style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
        >
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full blur-3xl opacity-10"
              style={{ background: "var(--color-primary)" }} />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full blur-3xl opacity-8"
              style={{ background: "var(--color-accent)" }} />
          </div>

          <div className="relative grid lg:grid-cols-5">
            {/* Left: main content */}
            <div className="lg:col-span-3 p-8 lg:p-12">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, var(--color-primary-dark), var(--color-primary-light))" }}>
                  <BarChart3 size={28} color="#fff" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-3xl font-black" style={{ color: "var(--color-text)" }}>S&amp;B ERP</h3>
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={{ background: "#10b98115", color: "#10b981" }}>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
                      Disponible
                    </span>
                  </div>
                  <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>Sistema ERP integral para empresas</p>
                </div>
              </div>

              <p className="text-base leading-relaxed mb-8" style={{ color: "var(--color-text-muted)" }}>
                Centraliza toda tu operación empresarial en una sola plataforma robusta. Inventarios, facturación electrónica, reportes avanzados y administración multi-empresa desde cualquier dispositivo.
              </p>

              <div className="grid sm:grid-cols-2 gap-3 mb-8">
                {ERP_FEATURES.map(({ icon: Icon, label, desc }) => (
                  <div key={label} className="flex items-start gap-3 p-3 rounded-xl"
                    style={{ background: "var(--color-surface-2)" }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: "color-mix(in srgb, var(--color-primary) 15%, transparent)" }}>
                      <Icon size={14} style={{ color: "var(--color-primary)" }} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>{label}</p>
                      <p className="text-xs leading-tight" style={{ color: "var(--color-text-muted)" }}>{desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link href="/#citas" className="btn-primary">
                Solicitar demo gratuito <ArrowRight size={16} />
              </Link>
            </div>

            {/* Right: why us + stats */}
            <div className="lg:col-span-2 p-8 lg:p-12 flex flex-col justify-between"
              style={{ borderTop: "1px solid var(--color-border)", borderLeft: "0px" }}>
              <style jsx>{`
                @media (min-width: 1024px) {
                  .right-panel { border-left: 1px solid var(--color-border); border-top: none; }
                }
              `}</style>

              <div className="right-panel">
                <p className="text-xs font-bold uppercase tracking-widest mb-5"
                  style={{ color: "var(--color-text-muted)" }}>¿Por qué elegirnos?</p>
                <div className="space-y-4">
                  {[
                    { icon: Zap,          text: "Implementación rápida en días, no meses" },
                    { icon: Shield,       text: "Datos seguros con cifrado de extremo a extremo" },
                    { icon: TrendingUp,   text: "Escalable para PyMEs y grandes corporaciones" },
                    { icon: CheckCircle2, text: "Soporte técnico local en Costa Rica" },
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: "color-mix(in srgb, var(--color-primary) 15%, transparent)" }}>
                        <Icon size={13} style={{ color: "var(--color-primary)" }} />
                      </div>
                      <p className="text-sm leading-snug" style={{ color: "var(--color-text-muted)" }}>{text}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mt-8">
                {STATS.map(({ value, label }) => (
                  <div key={label} className="text-center p-3 rounded-xl"
                    style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)" }}>
                    <p className="text-lg font-black" style={{ color: "var(--color-primary)" }}>{value}</p>
                    <p className="text-xs leading-tight mt-0.5" style={{ color: "var(--color-text-muted)" }}>{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* CRM — coming soon */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="relative overflow-hidden rounded-3xl"
          style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
        >
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full blur-3xl opacity-10 pointer-events-none"
            style={{ background: "#8b5cf6" }} />

          <div className="relative grid lg:grid-cols-2">
            <div className="p-8 lg:p-10">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, #7c3aed, #8b5cf6)" }}>
                  <Users size={22} color="#fff" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-2xl font-black" style={{ color: "var(--color-text)" }}>S&amp;B CRM</h3>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={{ background: "#8b5cf618", color: "#8b5cf6" }}>
                      <Clock size={10} /> En desarrollo
                    </span>
                  </div>
                  <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>Gestión de relaciones con clientes</p>
                </div>
              </div>
              <p className="leading-relaxed mb-6" style={{ color: "var(--color-text-muted)" }}>
                Potencia tus ventas con inteligencia artificial, automatiza seguimientos y cierra más negocios con nuestra plataforma CRM de última generación.
              </p>
              <button disabled
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border-2 opacity-60 cursor-not-allowed"
                style={{ borderColor: "#8b5cf6", color: "#8b5cf6" }}>
                <Bell size={14} /> Próximamente
              </button>
            </div>

            <div className="p-8 lg:p-10"
              style={{ borderTop: "1px solid var(--color-border)" }}>
              <p className="text-xs font-bold uppercase tracking-widest mb-5" style={{ color: "var(--color-text-muted)" }}>
                Funciones planeadas
              </p>
              <div className="space-y-3">
                {CRM_FEATURES.map((f) => (
                  <div key={f} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ border: "1.5px solid #8b5cf6", background: "#8b5cf610" }}>
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#8b5cf6" }} />
                    </div>
                    <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
