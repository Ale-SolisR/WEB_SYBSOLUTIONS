"use client";

import Link from "next/link";
import { ArrowRight, Play, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const HIGHLIGHTS = [
  "ERP empresarial completo",
  "Soporte técnico 24/7",
  "Implementación ágil",
];

export default function Hero() {
  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden gradient-hero hero-bg"
      id="inicio"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }} />
      </div>

      {/* Glowing orbs */}
      <div className="absolute top-20 right-10 w-96 h-96 rounded-full blur-3xl opacity-20" style={{ background: "var(--color-accent)" }} />
      <div className="absolute bottom-20 left-10 w-64 h-64 rounded-full blur-3xl opacity-15" style={{ background: "var(--color-primary-light)" }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6"
              style={{ background: "rgba(255,255,255,0.15)", color: "#fff", backdropFilter: "blur(8px)" }}>
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              ERP & CRM en desarrollo activo
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-tight mb-6">
              Impulsa tu{" "}
              <span className="relative">
                <span className="relative z-10" style={{ color: "var(--color-accent)" }}>
                  empresa
                </span>
                <span className="absolute -bottom-2 left-0 right-0 h-1 rounded-full opacity-60" style={{ background: "var(--color-accent)" }} />
              </span>
              {" "}con tecnología
            </h1>

            <p className="text-xl text-blue-100 mb-8 leading-relaxed max-w-lg">
              Software empresarial, infraestructura TI y desarrollo web de alto impacto.
              Soluciones hechas en Costa Rica para el mundo.
            </p>

            <ul className="space-y-2 mb-10">
              {HIGHLIGHTS.map((h) => (
                <li key={h} className="flex items-center gap-2 text-blue-100">
                  <CheckCircle size={18} className="text-green-400 flex-shrink-0" />
                  {h}
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-4">
              <Link href="/#contacto" className="btn-primary" style={{ background: "#fff", color: "var(--color-primary)" }}>
                Contáctanos <ArrowRight size={18} />
              </Link>
              <Link href="/#productos" className="btn-outline" style={{ borderColor: "rgba(255,255,255,0.5)", color: "#fff" }}>
                <Play size={18} /> Ver productos
              </Link>
            </div>
          </motion.div>

          {/* Right – floating cards */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="hidden lg:block"
          >
            <div className="relative">
              {/* Main card */}
              <div className="rounded-3xl p-8 shadow-2xl" style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.2)" }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl" style={{ background: "var(--color-accent)" }}>
                    📊
                  </div>
                  <div>
                    <p className="text-white font-bold">SYB ERP</p>
                    <p className="text-blue-200 text-sm">Sistema Empresarial</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {["Inventarios", "Facturación", "Reportes", "Multi-empresa"].map((m, i) => (
                    <div key={m} className="flex items-center gap-3 text-white">
                      <div className="w-2 h-2 rounded-full" style={{ background: "var(--color-accent)" }} />
                      <span className="text-sm">{m}</span>
                      <div className="ml-auto h-1.5 rounded-full flex-1 max-w-24" style={{ background: "rgba(255,255,255,0.1)" }}>
                        <div className="h-full rounded-full" style={{ width: `${70 + i * 8}%`, background: "var(--color-accent)" }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating badges */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                className="absolute -top-6 -right-6 rounded-2xl px-4 py-3 shadow-xl"
                style={{ background: "#fff" }}
              >
                <p className="text-xs font-bold" style={{ color: "var(--color-primary)" }}>✅ 100% en la nube</p>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-6 -left-6 rounded-2xl px-4 py-3 shadow-xl"
                style={{ background: "#fff" }}
              >
                <p className="text-xs font-bold" style={{ color: "var(--color-primary)" }}>🚀 Implementación rápida</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Wave */}
      <div className="absolute bottom-0 inset-x-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 80V40C360 0 720 80 1080 40C1260 20 1380 50 1440 40V80H0Z" fill="var(--color-bg)" />
        </svg>
      </div>
    </section>
  );
}
