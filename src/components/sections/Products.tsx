"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package, BarChart3, Users, FileText, Settings, ArrowRight,
  Clock, CheckCircle2, Zap, Shield, TrendingUp, Bell,
  ShoppingCart, CreditCard, Calculator, Receipt, Truck,
  PieChart, CloudUpload, Building2, ChevronDown,
} from "lucide-react";

const MODULE_CATEGORIES = [
  {
    id: "ventas",
    label: "Ventas",
    color: "#3b82f6",
    icon: ShoppingCart,
    modules: [
      { name: "Punto de Venta", desc: "Facturación POS" },
      { name: "Clientes", desc: "Gestión CRM integrado" },
      { name: "Historial de Ventas", desc: "Facturas emitidas" },
      { name: "Listas de Precio", desc: "Estructuras de precios" },
      { name: "Vendedores", desc: "Equipo comercial" },
      { name: "Comisiones", desc: "Cálculo automático" },
      { name: "Apartados", desc: "Planes de apartado" },
    ],
  },
  {
    id: "inventario",
    label: "Inventario",
    color: "#10b981",
    icon: Package,
    modules: [
      { name: "Artículos", desc: "Maestro de productos" },
      { name: "Categorías", desc: "Líneas, familias y marcas" },
      { name: "Gestión de Stock", desc: "Control de niveles" },
      { name: "Movimientos", desc: "Auditoría de stock" },
      { name: "Bodegas", desc: "Ubicaciones físicas" },
      { name: "Traslados", desc: "Entre bodegas" },
      { name: "Transformaciones", desc: "Ensamblaje de productos" },
      { name: "Toma Física", desc: "Auditoría de almacén" },
    ],
  },
  {
    id: "compras",
    label: "Compras",
    color: "#f59e0b",
    icon: Truck,
    modules: [
      { name: "Órdenes de Compra", desc: "Gestión de pedidos" },
      { name: "Recepción de Compras", desc: "Ingreso de mercadería" },
      { name: "Proveedores", desc: "Gestión de suministradores" },
      { name: "CxP Proveedores", desc: "Cuentas por pagar" },
      { name: "Estado de Cuenta Prov.", desc: "Historial de proveedor" },
    ],
  },
  {
    id: "tesoreria",
    label: "Tesorería",
    color: "#8b5cf6",
    icon: CreditCard,
    modules: [
      { name: "Control de Caja", desc: "Apertura y cierre" },
      { name: "Gestión de Cajas", desc: "Puntos de venta" },
      { name: "Conciliación Bancaria", desc: "Extractos y bancos" },
      { name: "Liquidación de Ruta", desc: "Cierre de vendedores" },
      { name: "Gastos", desc: "Operativos y caja chica" },
    ],
  },
  {
    id: "cxc",
    label: "Cobros",
    color: "#ec4899",
    icon: Receipt,
    modules: [
      { name: "CxC Clientes", desc: "Cuentas por cobrar" },
      { name: "Estado de Cuenta", desc: "Historial de cliente" },
      { name: "Saldos a Favor", desc: "Gestión de vales" },
    ],
  },
  {
    id: "contabilidad",
    label: "Contabilidad",
    color: "#14b8a6",
    icon: Calculator,
    modules: [
      { name: "Asientos Contables", desc: "Libro diario digital" },
      { name: "Catálogo de Cuentas", desc: "Plan de cuentas" },
      { name: "Balance General", desc: "Estados financieros" },
    ],
  },
  {
    id: "reportes",
    label: "BI & Analytics",
    color: "#f97316",
    icon: PieChart,
    modules: [
      { name: "Dashboard BI", desc: "Análisis en tiempo real" },
      { name: "BI & Reportes", desc: "Métricas avanzadas" },
      { name: "Bitácora", desc: "Log de auditoría" },
      { name: "Auditoría de Datos", desc: "Trazabilidad total" },
    ],
  },
  {
    id: "sistema",
    label: "Sistema",
    color: "#6366f1",
    icon: Settings,
    modules: [
      { name: "Multi-empresa", desc: "Gestión de tenants" },
      { name: "Sucursales", desc: "Puntos de operación" },
      { name: "Usuarios", desc: "Gestión de acceso" },
      { name: "Roles", desc: "Permisos y perfiles" },
      { name: "Configuración", desc: "Parámetros del ERP" },
    ],
  },
];

const TOTAL_MODULES = MODULE_CATEGORIES.reduce((a, c) => a + c.modules.length, 0);

const STATS = [
  { value: "99.9%", label: "Uptime" },
  { value: "<2s",   label: "Respuesta" },
  { value: "100%",  label: "Soporte CR" },
  { value: "24/7",  label: "Respaldos" },
];

const WHY_US = [
  { icon: Zap,          text: "Implementación rápida en días, no meses" },
  { icon: Shield,       text: "Cifrado de extremo a extremo en todos tus datos" },
  { icon: CloudUpload,  text: "Respaldos automáticos diarios en la nube" },
  { icon: TrendingUp,   text: "Escalable para PyMEs y grandes corporaciones" },
  { icon: Building2,    text: "Multi-empresa y multi-sucursal sin costo extra" },
  { icon: CheckCircle2, text: "Soporte técnico local en Costa Rica" },
];

const CRM_FEATURES = [
  "Gestión de contactos y leads",
  "Pipeline de ventas visual",
  "Reportes de KPIs en tiempo real",
  "Integraciones con API externa",
  "Automatización de marketing",
];

export default function Products() {
  const [activeTab, setActiveTab] = useState("ventas");
  const [modulesOpen, setModulesOpen] = useState(false);

  const active = MODULE_CATEGORIES.find((c) => c.id === activeTab)!;

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
          className="relative overflow-hidden rounded-3xl mb-4"
          style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
        >
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full blur-3xl opacity-10"
              style={{ background: "var(--color-primary)" }} />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full blur-3xl opacity-8"
              style={{ background: "var(--color-accent)" }} />
          </div>

          <div className="relative grid lg:grid-cols-5">
            {/* Left */}
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

              <p className="text-base leading-relaxed mb-6" style={{ color: "var(--color-text-muted)" }}>
                Centraliza <strong style={{ color: "var(--color-text)" }}>toda tu operación empresarial</strong> en una sola plataforma robusta.
                Ventas, inventario, compras, tesorería, contabilidad y reportes avanzados —
                todo integrado, desde cualquier dispositivo, con respaldos diarios automáticos en la nube.
              </p>

              {/* Module count highlight */}
              <div className="flex items-center gap-3 mb-6 p-3 rounded-2xl"
                style={{ background: "color-mix(in srgb, var(--color-primary) 8%, transparent)", border: "1px solid color-mix(in srgb, var(--color-primary) 20%, transparent)" }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "var(--color-primary)" }}>
                  <FileText size={16} color="#fff" />
                </div>
                <div>
                  <p className="text-sm font-bold" style={{ color: "var(--color-text)" }}>
                    {TOTAL_MODULES}+ módulos incluidos
                  </p>
                  <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                    Ventas · Inventario · Compras · Tesorería · Contabilidad · BI
                  </p>
                </div>
              </div>

              <Link href="/#citas" className="btn-primary">
                Solicitar demo gratuito <ArrowRight size={16} />
              </Link>
            </div>

            {/* Right: why us + stats */}
            <div className="lg:col-span-2 p-8 lg:p-12 flex flex-col justify-between"
              style={{ borderTop: "1px solid var(--color-border)" }}>
              <style jsx>{`
                @media (min-width: 1024px) {
                  .right-panel { border-left: 1px solid var(--color-border); border-top: none; }
                }
              `}</style>
              <div className="right-panel">
                <p className="text-xs font-bold uppercase tracking-widest mb-5"
                  style={{ color: "var(--color-text-muted)" }}>¿Por qué elegirnos?</p>
                <div className="space-y-3">
                  {WHY_US.map(({ icon: Icon, text }) => (
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

              <div className="grid grid-cols-4 gap-2 mt-8">
                {STATS.map(({ value, label }) => (
                  <div key={label} className="text-center p-2 rounded-xl"
                    style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)" }}>
                    <p className="text-base font-black" style={{ color: "var(--color-primary)" }}>{value}</p>
                    <p className="text-xs leading-tight mt-0.5" style={{ color: "var(--color-text-muted)" }}>{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Module explorer — collapsible */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-3xl mb-8 overflow-hidden"
          style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
        >
          <button
            onClick={() => setModulesOpen(!modulesOpen)}
            className="w-full flex items-center justify-between px-8 py-5 text-left transition-opacity hover:opacity-80"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: "color-mix(in srgb, var(--color-primary) 15%, transparent)" }}>
                <Package size={15} style={{ color: "var(--color-primary)" }} />
              </div>
              <div>
                <p className="text-sm font-bold" style={{ color: "var(--color-text)" }}>
                  Explorar todos los módulos
                </p>
                <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                  {TOTAL_MODULES} módulos en {MODULE_CATEGORIES.length} categorías
                </p>
              </div>
            </div>
            <ChevronDown
              size={18}
              style={{
                color: "var(--color-text-muted)",
                transform: modulesOpen ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.3s",
              }}
            />
          </button>

          <AnimatePresence>
            {modulesOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{ overflow: "hidden", borderTop: "1px solid var(--color-border)" }}
              >
                <div className="p-6">
                  {/* Category tabs */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {MODULE_CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setActiveTab(cat.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
                        style={{
                          background: activeTab === cat.id
                            ? `color-mix(in srgb, ${cat.color} 18%, transparent)`
                            : "var(--color-surface-2)",
                          color: activeTab === cat.id ? cat.color : "var(--color-text-muted)",
                          border: `1px solid ${activeTab === cat.id ? cat.color + "40" : "var(--color-border)"}`,
                        }}
                      >
                        <cat.icon size={12} />
                        {cat.label}
                        <span className="ml-0.5 opacity-70">({cat.modules.length})</span>
                      </button>
                    ))}
                  </div>

                  {/* Active category modules */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3"
                    >
                      {active.modules.map((mod) => (
                        <div
                          key={mod.name}
                          className="flex items-start gap-2.5 p-3 rounded-xl"
                          style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)" }}
                        >
                          <div
                            className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                            style={{ background: active.color }}
                          />
                          <div>
                            <p className="text-xs font-semibold leading-tight" style={{ color: "var(--color-text)" }}>
                              {mod.name}
                            </p>
                            <p className="text-xs leading-tight mt-0.5" style={{ color: "var(--color-text-muted)" }}>
                              {mod.desc}
                            </p>
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
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
