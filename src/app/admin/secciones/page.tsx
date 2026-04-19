"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Plus, Edit2, Trash2, X, Save, Loader2, Globe, Users, LayoutTemplate, ImageOff } from "lucide-react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

function ImagePreview({ url }: { url: string }) {
  const [error, setError] = useState(false);
  const [imgLoading, setImgLoading] = useState(true);
  useEffect(() => { setError(false); setImgLoading(true); }, [url]);

  if (!url.trim()) return (
    <div className="flex items-center justify-center h-14 rounded-lg"
      style={{ background: "var(--color-surface-2)", border: "1px dashed var(--color-border)" }}>
      <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>Vista previa</p>
    </div>
  );
  return (
    <div className="relative flex items-center justify-center h-14 rounded-lg overflow-hidden"
      style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)" }}>
      {imgLoading && <Loader2 size={14} className="animate-spin absolute" style={{ color: "var(--color-primary)" }} />}
      {error ? (
        <div className="flex flex-col items-center gap-1">
          <ImageOff size={14} style={{ color: "var(--color-text-muted)" }} />
          <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>URL inválida</p>
        </div>
      ) : (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img src={url} alt="Preview" className="max-h-12 max-w-full object-contain rounded"
          style={{ display: imgLoading ? "none" : "block" }}
          onLoad={() => setImgLoading(false)} onError={() => { setError(true); setImgLoading(false); }} />
      )}
    </div>
  );
}

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
    setValue("Titulo", s.Titulo); setValue("Descripcion", s.Descripcion);
    setValue("Icono", s.Icono); setValue("Color", s.Color);
    setValue("Activo", s.Activo); setValue("Orden", s.Orden);
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
      setShowForm(false); fetch_();
    } catch (e: any) { toast.error(e.message || "Error al guardar"); }
    finally { setSaving(false); }
  };

  const del = async (id: number) => {
    if (!confirm("¿Eliminar este servicio?")) return;
    const res = await fetch(`/api/servicios/${id}`, { method: "DELETE" });
    if (res.ok) { toast.success("Eliminado"); fetch_(); } else toast.error("Error");
  };

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>Gestiona los servicios visibles en la landing</p>
        <button onClick={openNew} className="btn-primary text-sm py-2 px-4"><Plus size={14} /> Agregar</button>
      </div>

      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)" }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 6 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 6 }} transition={{ duration: 0.15 }}
              className="w-full max-w-lg rounded-2xl shadow-2xl border max-h-[90vh] overflow-y-auto"
              style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
            >
              <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0" style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}>
                <h3 className="text-base font-semibold" style={{ color: "var(--color-text)" }}>{editId ? "Editar servicio" : "Nuevo servicio"}</h3>
                <button onClick={() => setShowForm(false)} className="p-1 rounded-lg hover:opacity-70" style={{ color: "var(--color-text-muted)" }}><X size={16} /></button>
              </div>
              <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-5 space-y-4">
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text-muted)" }}>Título *</label>
                  <input {...register("Titulo", { required: "Requerido", minLength: { value: 3, message: "Mínimo 3 caracteres" } })} className="input-field text-sm" placeholder="Ej: Desarrollo Web" />
                  {errors.Titulo && <p className="text-xs text-red-500 mt-1">{errors.Titulo.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text-muted)" }}>Descripción *</label>
                  <textarea {...register("Descripcion", { required: "Requerido", minLength: { value: 10, message: "Mínimo 10 caracteres" } })} className="input-field resize-none text-sm" rows={3} placeholder="Describe el servicio..." />
                  {errors.Descripcion && <p className="text-xs text-red-500 mt-1">{errors.Descripcion.message}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text-muted)" }}>Ícono</label>
                    <select {...register("Icono")} className="input-field text-sm">
                      {ICON_OPTIONS.map(i => <option key={i} value={i}>{i}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text-muted)" }}>Color</label>
                    <input type="color" {...register("Color")} className="input-field h-10 cursor-pointer p-1" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text-muted)" }}>Orden</label>
                  <input {...register("Orden", { valueAsNumber: true, min: { value: 0, message: "No puede ser negativo" } })} type="number" min={0} className="input-field text-sm" />
                  {errors.Orden && <p className="text-xs text-red-500 mt-1">{errors.Orden.message}</p>}
                </div>
                {editId && (
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" {...register("Activo")} className="w-4 h-4 rounded" />
                    <span className="text-sm" style={{ color: "var(--color-text)" }}>Visible en la página</span>
                  </label>
                )}
                <div className="flex gap-3 justify-end pt-1">
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

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 size={28} className="animate-spin" style={{ color: "var(--color-primary)" }} /></div>
      ) : items.length === 0 ? (
        <div className="rounded-xl border py-12 text-center" style={{ borderColor: "var(--color-border)" }}>
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>No hay servicios. ¡Agrega el primero!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map(s => (
            <div
              key={s.Id}
              className="flex items-center gap-4 p-4 rounded-xl border"
              style={{ borderColor: "var(--color-border)", background: "var(--color-surface)", opacity: s.Activo ? 1 : 0.5 }}
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${s.Color}18` }}>
                <div className="w-3.5 h-3.5 rounded-full" style={{ background: s.Color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate" style={{ color: "var(--color-text)" }}>{s.Titulo}</p>
                <p className="text-xs truncate mt-0.5" style={{ color: "var(--color-text-muted)" }}>{s.Descripcion.slice(0, 80)}{s.Descripcion.length > 80 ? "..." : ""}</p>
              </div>
              <span className="text-xs flex-shrink-0" style={{ color: "var(--color-text-muted)" }}>#{s.Orden}</span>
              <div className="flex gap-1.5 flex-shrink-0">
                <button onClick={() => openEdit(s)} className="w-8 h-8 flex items-center justify-center rounded-lg border hover:opacity-70 transition-opacity" style={{ borderColor: "var(--color-border)", color: "var(--color-text-muted)" }}>
                  <Edit2 size={12} />
                </button>
                <button onClick={() => del(s.Id)} className="w-8 h-8 flex items-center justify-center rounded-lg border hover:opacity-70 transition-opacity" style={{ borderColor: "#fee2e2", color: "#ef4444" }}>
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

interface Miembro { Id: number; Nombre: string; Cargo: string; Descripcion: string; FotoUrl: string; LinkedIn: string; Activo: boolean; Orden: number; }
interface MiembroForm { Nombre: string; Cargo: string; Descripcion: string; FotoUrl: string; LinkedIn: string; Orden: number; Activo: boolean; }

function EquipoTab() {
  const [items, setItems] = useState<Miembro[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<MiembroForm>({
    defaultValues: { Activo: true, Orden: 0 },
  });

  const fotoUrlValue = watch("FotoUrl");
  useEffect(() => {
    const t = setTimeout(() => setPreviewUrl(fotoUrlValue || ""), 600);
    return () => clearTimeout(t);
  }, [fotoUrlValue]);

  const fetch_ = () =>
    fetch("/api/equipo").then(r => r.json()).then(setItems).catch(() => {}).finally(() => setLoading(false));

  useEffect(() => { fetch_(); }, []);

  const openNew = () => {
    reset({ Nombre: "", Cargo: "", Descripcion: "", FotoUrl: "", LinkedIn: "", Activo: true, Orden: items.length });
    setPreviewUrl("");
    setEditId(null); setShowForm(true);
  };

  const openEdit = (m: Miembro) => {
    Object.entries(m).forEach(([k, v]) => setValue(k as keyof MiembroForm, v as any));
    setPreviewUrl(m.FotoUrl || "");
    setEditId(m.Id); setShowForm(true);
  };

  const onSubmit = async (data: MiembroForm) => {
    setSaving(true);
    try {
      const url = editId ? `/api/equipo/${editId}` : "/api/equipo";
      const res = await fetch(url, { method: editId ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!res.ok) throw new Error();
      toast.success(editId ? "Miembro actualizado" : "Miembro agregado");
      setShowForm(false); fetch_();
    } catch { toast.error("Error al guardar"); }
    finally { setSaving(false); }
  };

  const del = async (id: number) => {
    if (!confirm("¿Eliminar este miembro?")) return;
    const res = await fetch(`/api/equipo/${id}`, { method: "DELETE" });
    if (res.ok) { toast.success("Eliminado"); fetch_(); }
  };

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>Miembros del equipo visibles en la landing</p>
        <button onClick={openNew} className="btn-primary text-sm py-2 px-4"><Plus size={14} /> Agregar</button>
      </div>

      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)" }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 6 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 6 }} transition={{ duration: 0.15 }}
              className="w-full max-w-md rounded-2xl shadow-2xl border max-h-[90vh] overflow-y-auto"
              style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
            >
              <div className="flex items-center justify-between px-5 py-3.5 border-b sticky top-0" style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}>
                <h3 className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>{editId ? "Editar" : "Nuevo"} miembro</h3>
                <button onClick={() => setShowForm(false)} className="p-1 rounded-lg hover:opacity-70" style={{ color: "var(--color-text-muted)" }}><X size={15} /></button>
              </div>
              <form onSubmit={handleSubmit(onSubmit)} className="px-5 py-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: "var(--color-text-muted)" }}>Nombre *</label>
                    <input {...register("Nombre", { required: "Requerido" })} className="input-field text-sm py-2" placeholder="Nombre completo" />
                    {errors.Nombre && <p className="text-xs text-red-500 mt-0.5">{errors.Nombre.message}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: "var(--color-text-muted)" }}>Cargo *</label>
                    <input {...register("Cargo", { required: "Requerido" })} className="input-field text-sm py-2" placeholder="Desarrollador" />
                    {errors.Cargo && <p className="text-xs text-red-500 mt-0.5">{errors.Cargo.message}</p>}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: "var(--color-text-muted)" }}>Descripción</label>
                  <textarea {...register("Descripcion")} className="input-field resize-none text-sm" rows={2} />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: "var(--color-text-muted)" }}>URL de foto</label>
                  <input {...register("FotoUrl", { validate: v => !v || (() => { try { new URL(v); return true; } catch { return "URL inválida"; } })() })} className="input-field text-sm py-2" placeholder="https://..." />
                  {errors.FotoUrl && <p className="text-xs text-red-500 mt-0.5">{errors.FotoUrl.message as string}</p>}
                  <div className="mt-1.5">
                    <ImagePreview url={previewUrl} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: "var(--color-text-muted)" }}>LinkedIn URL</label>
                  <input {...register("LinkedIn")} className="input-field text-sm py-2" placeholder="https://linkedin.com/in/..." />
                </div>
                <div className="grid grid-cols-2 gap-3 items-end">
                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: "var(--color-text-muted)" }}>Orden</label>
                    <input {...register("Orden", { valueAsNumber: true, min: { value: 0, message: "No puede ser negativo" } })} type="number" min={0} className="input-field text-sm py-2" />
                    {errors.Orden && <p className="text-xs text-red-500 mt-0.5">{errors.Orden.message}</p>}
                  </div>
                  {editId && (
                    <label className="flex items-center gap-2 cursor-pointer pb-2">
                      <input type="checkbox" {...register("Activo")} className="w-4 h-4 rounded" />
                      <span className="text-sm" style={{ color: "var(--color-text)" }}>Activo</span>
                    </label>
                  )}
                </div>
                <div className="flex gap-3 justify-end pt-1">
                  <button type="button" onClick={() => setShowForm(false)} className="btn-outline py-1.5 px-4 text-sm">Cancelar</button>
                  <button type="submit" disabled={saving} className="btn-primary py-1.5 px-4 text-sm">
                    {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
                    {saving ? "Guardando..." : "Guardar"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 size={28} className="animate-spin" style={{ color: "var(--color-primary)" }} /></div>
      ) : items.length === 0 ? (
        <div className="rounded-xl border py-12 text-center" style={{ borderColor: "var(--color-border)" }}>
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>No hay miembros. ¡Agrega el primero!</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-3">
          {items.map(m => (
            <div key={m.Id} className="card p-4 flex items-center gap-3" style={{ opacity: m.Activo ? 1 : 0.5 }}>
              {m.FotoUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={m.FotoUrl} alt={m.Nombre} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
              ) : (
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                  style={{ background: "color-mix(in srgb, var(--color-primary) 15%, transparent)", color: "var(--color-primary)" }}
                >
                  {m.Nombre.charAt(0)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate" style={{ color: "var(--color-text)" }}>{m.Nombre}</p>
                <p className="text-xs truncate" style={{ color: "var(--color-primary)" }}>{m.Cargo}</p>
              </div>
              <div className="flex gap-1.5 flex-shrink-0">
                <button onClick={() => openEdit(m)} className="w-8 h-8 flex items-center justify-center rounded-lg border hover:opacity-70 transition-opacity" style={{ borderColor: "var(--color-border)", color: "var(--color-text-muted)" }}>
                  <Edit2 size={12} />
                </button>
                <button onClick={() => del(m.Id)} className="w-8 h-8 flex items-center justify-center rounded-lg border hover:opacity-70 transition-opacity" style={{ borderColor: "#fee2e2", color: "#ef4444" }}>
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

function HeroTab() {
  const [titulo, setTitulo] = useState("");
  const [subtitulo, setSubtitulo] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/configuracion")
      .then((r) => r.json())
      .then((d) => { setTitulo(d.hero_titulo || ""); setSubtitulo(d.hero_subtitulo || ""); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (!titulo.trim()) { toast.error("El título no puede estar vacío"); return; }
    setSaving(true);
    try {
      const res = await fetch("/api/configuracion", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hero_titulo: titulo, hero_subtitulo: subtitulo }),
      });
      if (!res.ok) throw new Error();
      toast.success("Hero actualizado");
    } catch { toast.error("Error al guardar"); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 size={28} className="animate-spin" style={{ color: "var(--color-primary)" }} /></div>;

  return (
    <div className="max-w-xl space-y-4">
      <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>Texto principal visible en la portada del sitio</p>
      <div className="card p-5 space-y-4">
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text-muted)" }}>Título principal</label>
          <input value={titulo} onChange={(e) => setTitulo(e.target.value)} className="input-field text-sm" placeholder="Impulsa tu empresa con tecnología" />
          <p className="text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>Incluye " con " para resaltar la segunda parte en color acento</p>
        </div>
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text-muted)" }}>Subtítulo / descripción</label>
          <textarea value={subtitulo} onChange={(e) => setSubtitulo(e.target.value)} rows={4} className="input-field resize-none text-sm" placeholder="Software empresarial, infraestructura TI..." />
        </div>
        <div className="flex justify-end">
          <button onClick={handleSave} disabled={saving} className="btn-primary text-sm py-2 px-4">
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            {saving ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}

type Tab = "hero" | "servicios" | "equipo";

export default function AdminSecciones() {
  const [tab, setTab] = useState<Tab>("servicios");

  const TABS: { id: Tab; label: string; icon: typeof Globe }[] = [
    { id: "hero",      label: "Hero",         icon: LayoutTemplate },
    { id: "servicios", label: "Servicios TI", icon: Globe },
    { id: "equipo",    label: "Equipo",       icon: Users },
  ];

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold" style={{ color: "var(--color-text)" }}>Secciones</h1>
        <p className="text-sm mt-0.5" style={{ color: "var(--color-text-muted)" }}>
          Edita el contenido visible en el sitio web
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl w-fit" style={{ background: "var(--color-surface-2)" }}>
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={tab === id ? {
              background: "var(--color-surface)",
              color: "var(--color-primary)",
              boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
            } : {
              background: "transparent",
              color: "var(--color-text-muted)",
            }}
          >
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>

      <div>
        {tab === "hero"      && <HeroTab />}
        {tab === "servicios" && <ServiciosTab />}
        {tab === "equipo"    && <EquipoTab />}
      </div>
    </div>
  );
}
