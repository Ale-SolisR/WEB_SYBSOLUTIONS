"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Plus, Edit2, Trash2, X, Save, Loader2, Globe, Server, Users, Star } from "lucide-react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

// ─── Servicios ───────────────────────────────────────────────────────────────

const ICON_OPTIONS = [
  "Globe","Server","Network","Cpu","GraduationCap","Headphones",
  "Shield","Code","Cloud","Database","Settings","Wifi",
];

interface Servicio { Id: number; Titulo: string; Descripcion: string; Icono: string; Color: string; Activo: boolean; Orden: number; }
interface ServicioForm { Titulo: string; Descripcion: string; Icono: string; Color: string; Orden: number; Activo: boolean; }

function ServiciosTab() {
  const [items, setItems] = useState<Servicio[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<ServicioForm>({
    defaultValues: { Icono: "Globe", Color: "#3b82f6", Activo: true, Orden: 0 },
  });

  const fetch_ = () =>
    fetch("/api/servicios").then(r => r.json()).then(setItems).catch(() => {}).finally(() => setLoading(false));

  useEffect(() => { fetch_(); }, []);

  const openNew = () => {
    reset({ Titulo: "", Descripcion: "", Icono: "Globe", Color: "#3b82f6", Activo: true, Orden: items.length });
    setEditId(null);
    setShowForm(true);
  };

  const openEdit = (s: Servicio) => {
    setValue("Titulo", s.Titulo);
    setValue("Descripcion", s.Descripcion);
    setValue("Icono", s.Icono);
    setValue("Color", s.Color);
    setValue("Activo", s.Activo);
    setValue("Orden", s.Orden);
    setEditId(s.Id);
    setShowForm(true);
  };

  const onSubmit = async (data: ServicioForm) => {
    setSaving(true);
    try {
      const url = editId ? `/api/servicios/${editId}` : "/api/servicios";
      const res = await fetch(url, { method: editId ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      toast.success(editId ? "Servicio actualizado" : "Servicio agregado");
      setShowForm(false);
      fetch_();
    } catch (e: any) { toast.error(e.message || "Error al guardar"); }
    finally { setSaving(false); }
  };

  const del = async (id: number) => {
    if (!confirm("¿Eliminar este servicio?")) return;
    const res = await fetch(`/api/servicios/${id}`, { method: "DELETE" });
    if (res.ok) { toast.success("Servicio eliminado"); fetch_(); }
    else toast.error("Error");
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold" style={{ color: "var(--color-text)" }}>Servicios de TI</h2>
        <button onClick={openNew} className="btn-primary text-sm py-2"><Plus size={16} /> Agregar</button>
      </div>

      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="card p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-lg font-bold" style={{ color: "var(--color-text)" }}>{editId ? "Editar servicio" : "Agregar servicio"}</h3>
                <button onClick={() => setShowForm(false)} style={{ color: "var(--color-text-muted)" }}><X size={18} /></button>
              </div>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="text-sm font-medium block mb-1" style={{ color: "var(--color-text)" }}>Título *</label>
                  <input {...register("Titulo", { required: "Requerido", minLength: { value: 3, message: "Mínimo 3 caracteres" } })}
                    className="input-field" placeholder="Ej: Desarrollo Web" />
                  {errors.Titulo && <p className="text-xs text-red-500 mt-1">{errors.Titulo.message}</p>}
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1" style={{ color: "var(--color-text)" }}>Descripción *</label>
                  <textarea {...register("Descripcion", { required: "Requerido", minLength: { value: 10, message: "Mínimo 10 caracteres" } })}
                    className="input-field resize-none" rows={3} placeholder="Describe el servicio..." />
                  {errors.Descripcion && <p className="text-xs text-red-500 mt-1">{errors.Descripcion.message}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium block mb-1" style={{ color: "var(--color-text)" }}>Ícono</label>
                    <select {...register("Icono")} className="input-field">
                      {ICON_OPTIONS.map(i => <option key={i} value={i}>{i}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1" style={{ color: "var(--color-text)" }}>Color</label>
                    <input type="color" {...register("Color")} className="input-field h-10 cursor-pointer p-1" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1" style={{ color: "var(--color-text)" }}>Orden</label>
                  <input {...register("Orden", { valueAsNumber: true, min: { value: 0, message: "No puede ser negativo" } })}
                    type="number" min={0} className="input-field" />
                  {errors.Orden && <p className="text-xs text-red-500 mt-1">{errors.Orden.message}</p>}
                </div>
                {editId && (
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" {...register("Activo")} className="w-4 h-4" />
                    <span className="text-sm" style={{ color: "var(--color-text)" }}>Visible en la página</span>
                  </label>
                )}
                <div className="flex gap-3 justify-end pt-2">
                  <button type="button" onClick={() => setShowForm(false)} className="btn-outline py-2 px-4 text-sm">Cancelar</button>
                  <button type="submit" disabled={saving} className="btn-primary py-2 px-4 text-sm">
                    {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                    {saving ? "Guardando..." : "Guardar"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {loading ? <div className="flex justify-center py-12"><Loader2 size={32} className="animate-spin" style={{ color: "var(--color-primary)" }} /></div> : (
        <div className="space-y-3">
          {items.map(s => (
            <div key={s.Id} className="card px-5 py-4 flex items-center gap-4" style={{ opacity: s.Activo ? 1 : 0.5 }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${s.Color}20` }}>
                <div className="w-5 h-5 rounded-full" style={{ background: s.Color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate" style={{ color: "var(--color-text)" }}>{s.Titulo}</p>
                <p className="text-xs truncate" style={{ color: "var(--color-text-muted)" }}>{s.Descripcion.slice(0, 80)}...</p>
              </div>
              <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>#{s.Orden}</div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => openEdit(s)} className="p-1.5 rounded-lg border"
                  style={{ borderColor: "var(--color-border)", color: "var(--color-text-muted)" }}>
                  <Edit2 size={13} />
                </button>
                <button onClick={() => del(s.Id)} className="p-1.5 rounded-lg border"
                  style={{ borderColor: "#fee2e2", color: "#ef4444" }}>
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <p className="text-center py-8" style={{ color: "var(--color-text-muted)" }}>No hay servicios. ¡Agrega el primero!</p>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Equipo ───────────────────────────────────────────────────────────────────

interface Miembro { Id: number; Nombre: string; Cargo: string; Descripcion: string; FotoUrl: string; LinkedIn: string; Activo: boolean; Orden: number; }
interface MiembroForm { Nombre: string; Cargo: string; Descripcion: string; FotoUrl: string; LinkedIn: string; Orden: number; Activo: boolean; }

function EquipoTab() {
  const [items, setItems] = useState<Miembro[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<MiembroForm>({
    defaultValues: { Activo: true, Orden: 0 },
  });

  const fetch_ = () =>
    fetch("/api/equipo").then(r => r.json()).then(setItems).catch(() => {}).finally(() => setLoading(false));

  useEffect(() => { fetch_(); }, []);

  const openNew = () => {
    reset({ Nombre: "", Cargo: "", Descripcion: "", FotoUrl: "", LinkedIn: "", Activo: true, Orden: items.length });
    setEditId(null);
    setShowForm(true);
  };

  const openEdit = (m: Miembro) => {
    Object.entries(m).forEach(([k, v]) => setValue(k as keyof MiembroForm, v as any));
    setEditId(m.Id);
    setShowForm(true);
  };

  const onSubmit = async (data: MiembroForm) => {
    setSaving(true);
    try {
      const url = editId ? `/api/equipo/${editId}` : "/api/equipo";
      const res = await fetch(url, { method: editId ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!res.ok) throw new Error();
      toast.success(editId ? "Miembro actualizado" : "Miembro agregado");
      setShowForm(false);
      fetch_();
    } catch { toast.error("Error al guardar"); }
    finally { setSaving(false); }
  };

  const del = async (id: number) => {
    if (!confirm("¿Eliminar este miembro?")) return;
    const res = await fetch(`/api/equipo/${id}`, { method: "DELETE" });
    if (res.ok) { toast.success("Eliminado"); fetch_(); }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold" style={{ color: "var(--color-text)" }}>Equipo</h2>
        <button onClick={openNew} className="btn-primary text-sm py-2"><Plus size={16} /> Agregar</button>
      </div>

      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="card p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-lg font-bold" style={{ color: "var(--color-text)" }}>{editId ? "Editar" : "Agregar"} miembro</h3>
                <button onClick={() => setShowForm(false)} style={{ color: "var(--color-text-muted)" }}><X size={18} /></button>
              </div>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="text-sm font-medium block mb-1" style={{ color: "var(--color-text)" }}>Nombre completo *</label>
                  <input {...register("Nombre", { required: "Requerido" })} className="input-field" placeholder="Nombre" />
                  {errors.Nombre && <p className="text-xs text-red-500 mt-1">{errors.Nombre.message}</p>}
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1" style={{ color: "var(--color-text)" }}>Cargo / Rol *</label>
                  <input {...register("Cargo", { required: "Requerido" })} className="input-field" placeholder="Co-Fundador · Developer" />
                  {errors.Cargo && <p className="text-xs text-red-500 mt-1">{errors.Cargo.message}</p>}
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1" style={{ color: "var(--color-text)" }}>Descripción</label>
                  <textarea {...register("Descripcion")} className="input-field resize-none" rows={4} />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1" style={{ color: "var(--color-text)" }}>URL de foto</label>
                  <input {...register("FotoUrl", {
                    validate: v => !v || (() => { try { new URL(v); return true; } catch { return "URL inválida"; } })()
                  })} className="input-field" placeholder="https://..." />
                  {errors.FotoUrl && <p className="text-xs text-red-500 mt-1">{errors.FotoUrl.message as string}</p>}
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1" style={{ color: "var(--color-text)" }}>LinkedIn URL</label>
                  <input {...register("LinkedIn")} className="input-field" placeholder="https://linkedin.com/in/..." />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1" style={{ color: "var(--color-text)" }}>Orden</label>
                  <input {...register("Orden", { valueAsNumber: true, min: { value: 0, message: "No puede ser negativo" } })}
                    type="number" min={0} className="input-field" />
                  {errors.Orden && <p className="text-xs text-red-500 mt-1">{errors.Orden.message}</p>}
                </div>
                {editId && (
                  <label className="flex items-center gap-2">
                    <input type="checkbox" {...register("Activo")} className="w-4 h-4" />
                    <span className="text-sm" style={{ color: "var(--color-text)" }}>Activo</span>
                  </label>
                )}
                <div className="flex gap-3 justify-end pt-2">
                  <button type="button" onClick={() => setShowForm(false)} className="btn-outline py-2 px-4 text-sm">Cancelar</button>
                  <button type="submit" disabled={saving} className="btn-primary py-2 px-4 text-sm">
                    {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                    {saving ? "Guardando..." : "Guardar"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {loading ? <div className="flex justify-center py-12"><Loader2 size={32} className="animate-spin" style={{ color: "var(--color-primary)" }} /></div> : (
        <div className="grid sm:grid-cols-2 gap-4">
          {items.map(m => (
            <div key={m.Id} className="card p-5" style={{ opacity: m.Activo ? 1 : 0.5 }}>
              <div className="flex items-start gap-3 mb-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-black flex-shrink-0"
                  style={{ background: "var(--color-primary)", color: "#fff" }}>
                  {m.Nombre.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm" style={{ color: "var(--color-text)" }}>{m.Nombre}</p>
                  <p className="text-xs" style={{ color: "var(--color-primary)" }}>{m.Cargo}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(m)} className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs border"
                  style={{ borderColor: "var(--color-border)", color: "var(--color-text-muted)" }}>
                  <Edit2 size={12} /> Editar
                </button>
                <button onClick={() => del(m.Id)} className="p-1.5 rounded-lg border" style={{ borderColor: "#fee2e2", color: "#ef4444" }}>
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

type Tab = "servicios" | "equipo";

export default function AdminSecciones() {
  const [tab, setTab] = useState<Tab>("servicios");

  const TABS: { id: Tab; label: string; icon: typeof Globe }[] = [
    { id: "servicios", label: "Servicios TI", icon: Globe },
    { id: "equipo",    label: "Equipo",       icon: Users },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black" style={{ color: "var(--color-text)" }}>Secciones de la Página</h1>
        <p className="mt-1" style={{ color: "var(--color-text-muted)" }}>
          Edita el contenido visible en el sitio web
        </p>
      </div>

      {/* Tab nav */}
      <div className="flex gap-2 mb-8 border-b pb-0" style={{ borderColor: "var(--color-border)" }}>
        {TABS.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setTab(id)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-all"
            style={{
              borderColor: tab === id ? "var(--color-primary)" : "transparent",
              color: tab === id ? "var(--color-primary)" : "var(--color-text-muted)",
            }}>
            <Icon size={15} /> {label}
          </button>
        ))}
      </div>

      {tab === "servicios" && <ServiciosTab />}
      {tab === "equipo" && <EquipoTab />}
    </div>
  );
}
