"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Calendar, Loader2, CheckCircle, XCircle, Clock, Video, Plus, Search, X, Save } from "lucide-react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

interface Cita {
  Id: number;
  Cedula: string;
  TipoCedula: string;
  NombreCompleto: string;
  Email: string;
  Telefono: string;
  FechaCita: string;
  HoraCita: string;
  Nota: string;
  Estado: "pendiente" | "confirmada" | "cancelada";
  MeetLink: string | null;
  GoogleEventId: string | null;
}

interface CitaForm {
  NombreCompleto: string;
  TipoCedula: string;
  Cedula: string;
  Email: string;
  Telefono: string;
  FechaCita: string;
  HoraCita: string;
  Nota: string;
}

const SLOTS = ["08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00"];

const ESTADOS = {
  pendiente:  { bg: "#fef9c3", text: "#854d0e", label: "Pendiente",  dot: "#eab308" },
  confirmada: { bg: "#dcfce7", text: "#166534", label: "Confirmada", dot: "#22c55e" },
  cancelada:  { bg: "#fee2e2", text: "#991b1b", label: "Cancelada",  dot: "#ef4444" },
} as const;

const FILTERS = ["todas", "pendiente", "confirmada", "cancelada"] as const;
type Filter = typeof FILTERS[number];

export default function AdminCitas() {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("todas");
  const [updating, setUpdating] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CitaForm>({
    defaultValues: { TipoCedula: "fisica" },
  });

  const fetchCitas = () =>
    fetch("/api/citas").then(r => r.json()).then(setCitas).catch(() => {}).finally(() => setLoading(false));

  useEffect(() => { fetchCitas(); }, []);

  const updateEstado = async (id: number, estado: string) => {
    setUpdating(id);
    try {
      const res = await fetch(`/api/citas/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Estado: estado }),
      });
      if (!res.ok) throw new Error();
      toast.success(estado === "confirmada" ? "Cita confirmada · Meet generado" : "Estado actualizado");
      fetchCitas();
    } catch {
      toast.error("Error al actualizar");
    } finally {
      setUpdating(null);
    }
  };

  const onSubmit = async (data: CitaForm) => {
    setSaving(true);
    try {
      const postRes = await fetch("/api/citas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, adminCreate: true }),
      });
      if (!postRes.ok) {
        const err = await postRes.json();
        throw new Error(err.error || "Error al crear");
      }
      const { id: newId } = await postRes.json();

      // Auto-confirm + create Meet
      await fetch(`/api/citas/${newId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Estado: "confirmada" }),
      });

      toast.success("Cita creada, confirmada y Meet generado");
      setShowForm(false);
      reset({ TipoCedula: "fisica" });
      fetchCitas();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Error al crear la cita");
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (d: string) => {
    const datePart = d.includes("T") ? d.split("T")[0] : d;
    return new Date(datePart + "T12:00:00").toLocaleDateString("es-CR", {
      weekday: "short", month: "short", day: "numeric",
    });
  };

  const filtered = citas
    .filter(c => filter === "todas" || c.Estado === filter)
    .filter(c => {
      if (!search) return true;
      const q = search.toLowerCase();
      return c.NombreCompleto.toLowerCase().includes(q) || c.Cedula.includes(q);
    })
    .filter(c => {
      if (!dateFilter) return true;
      const citaDate = c.FechaCita.includes("T") ? c.FechaCita.split("T")[0] : c.FechaCita;
      return citaDate === dateFilter;
    });

  return (
    <div className="max-w-5xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: "var(--color-text)" }}>Citas</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--color-text-muted)" }}>Demostraciones agendadas</p>
        </div>
        <button onClick={() => { reset({ TipoCedula: "fisica" }); setShowForm(true); }} className="btn-primary text-sm py-2 px-4">
          <Plus size={14} /> Nueva cita
        </button>
      </div>

      {/* Filters row */}
      <div className="flex flex-wrap gap-2 items-center justify-between">
        {/* Status tabs */}
        <div className="flex gap-1 p-1 rounded-xl" style={{ background: "var(--color-surface-2)" }}>
          {FILTERS.map((f) => {
            const count = f === "todas" ? citas.length : citas.filter(c => c.Estado === f).length;
            const active = filter === f;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={active ? {
                  background: "var(--color-surface)",
                  color: "var(--color-primary)",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                } : {
                  background: "transparent",
                  color: "var(--color-text-muted)",
                }}
              >
                {f !== "todas" && (
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: active ? ESTADOS[f as keyof typeof ESTADOS].dot : "currentColor" }} />
                )}
                <span className="capitalize">{f}</span>
                <span className="ml-0.5 text-xs px-1.5 py-0.5 rounded-full font-semibold"
                  style={{ background: active ? "var(--color-primary)" : "var(--color-surface)", color: active ? "#fff" : "var(--color-text-muted)" }}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search + date */}
        <div className="flex gap-2 items-center">
          <div className="relative">
            <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--color-text-muted)" }} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Nombre o cédula..."
              className="input-field pl-8 text-xs py-2 w-44" />
          </div>
          <input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)}
            className="input-field text-xs py-2 w-36" />
          {(search || dateFilter) && (
            <button onClick={() => { setSearch(""); setDateFilter(""); }}
              className="p-2 rounded-lg border hover:opacity-70 transition-opacity"
              style={{ borderColor: "var(--color-border)", color: "var(--color-text-muted)" }}>
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      {/* New cita modal */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)" }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 6 }}
              transition={{ duration: 0.15 }}
              className="w-full max-w-md rounded-2xl shadow-2xl border"
              style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
            >
              <div className="flex items-center justify-between px-5 py-3.5 border-b" style={{ borderColor: "var(--color-border)" }}>
                <h3 className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>Nueva cita</h3>
                <button onClick={() => setShowForm(false)} className="p-1 rounded-lg hover:opacity-70" style={{ color: "var(--color-text-muted)" }}>
                  <X size={15} />
                </button>
              </div>
              <form onSubmit={handleSubmit(onSubmit)} className="px-5 py-4 space-y-3">
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: "var(--color-text-muted)" }}>Nombre completo *</label>
                  <input {...register("NombreCompleto", { required: "Requerido" })} className="input-field text-sm py-2" placeholder="Nombre completo" />
                  {errors.NombreCompleto && <p className="text-xs text-red-500 mt-0.5">{errors.NombreCompleto.message}</p>}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: "var(--color-text-muted)" }}>Tipo</label>
                    <select {...register("TipoCedula")} className="input-field text-sm py-2">
                      <option value="fisica">Física</option>
                      <option value="juridica">Jurídica</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-medium mb-1" style={{ color: "var(--color-text-muted)" }}>Cédula *</label>
                    <input {...register("Cedula", { required: "Requerido" })} className="input-field text-sm py-2" placeholder="207720184" />
                    {errors.Cedula && <p className="text-xs text-red-500 mt-0.5">{errors.Cedula.message}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: "var(--color-text-muted)" }}>Email *</label>
                    <input {...register("Email", { required: "Requerido" })} type="email" className="input-field text-sm py-2" placeholder="email@..." />
                    {errors.Email && <p className="text-xs text-red-500 mt-0.5">{errors.Email.message}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: "var(--color-text-muted)" }}>Teléfono *</label>
                    <input {...register("Telefono", { required: "Requerido" })} className="input-field text-sm py-2" placeholder="87457877" />
                    {errors.Telefono && <p className="text-xs text-red-500 mt-0.5">{errors.Telefono.message}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: "var(--color-text-muted)" }}>Fecha *</label>
                    <input {...register("FechaCita", { required: "Requerido" })} type="date" className="input-field text-sm py-2" />
                    {errors.FechaCita && <p className="text-xs text-red-500 mt-0.5">{errors.FechaCita.message}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: "var(--color-text-muted)" }}>Hora *</label>
                    <select {...register("HoraCita", { required: "Requerido" })} className="input-field text-sm py-2">
                      <option value="">Seleccionar...</option>
                      {SLOTS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {errors.HoraCita && <p className="text-xs text-red-500 mt-0.5">{errors.HoraCita.message}</p>}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: "var(--color-text-muted)" }}>Nota (opcional)</label>
                  <textarea {...register("Nota")} className="input-field resize-none text-sm" rows={2} placeholder="Observaciones..." />
                </div>
                <p className="text-xs px-3 py-2 rounded-lg" style={{ background: "var(--color-surface-2)", color: "var(--color-text-muted)" }}>
                  Se creará <strong style={{ color: "var(--color-text)" }}>confirmada</strong> y se generará el enlace de Google Meet al instante.
                </p>
                <div className="flex gap-2 justify-end pt-1">
                  <button type="button" onClick={() => setShowForm(false)} className="btn-outline py-1.5 px-4 text-sm">Cancelar</button>
                  <button type="submit" disabled={saving} className="btn-primary py-1.5 px-4 text-sm">
                    {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
                    {saving ? "Creando..." : "Crear y confirmar"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Citas list */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 size={28} className="animate-spin" style={{ color: "var(--color-primary)" }} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border py-12 text-center" style={{ borderColor: "var(--color-border)" }}>
          <Calendar size={24} className="mx-auto mb-2 opacity-25" style={{ color: "var(--color-text-muted)" }} />
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
            No hay citas{filter !== "todas" ? ` ${filter}s` : ""}.
          </p>
        </div>
      ) : (
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--color-border)" }}>
          {filtered.map((c, i) => {
            const est = ESTADOS[c.Estado];
            return (
              <div
                key={c.Id}
                className="flex items-center gap-3 px-4 py-2.5"
                style={{
                  borderBottom: i < filtered.length - 1 ? "1px solid var(--color-border)" : undefined,
                  background: "var(--color-surface)",
                  opacity: c.Estado === "cancelada" ? 0.55 : 1,
                }}
              >
                {/* Avatar */}
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ background: "color-mix(in srgb, var(--color-primary) 12%, transparent)", color: "var(--color-primary)" }}
                >
                  {c.NombreCompleto.charAt(0)}
                </div>

                {/* Name + cedula */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold truncate" style={{ color: "var(--color-text)" }}>{c.NombreCompleto}</p>
                  <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>{c.Cedula}</p>
                </div>

                {/* Date/time */}
                <div className="hidden sm:block w-32 flex-shrink-0">
                  <p className="text-xs font-medium capitalize" style={{ color: "var(--color-text)" }}>{formatDate(c.FechaCita)}</p>
                  <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>{c.HoraCita.substring(0,5)} CR</p>
                </div>

                {/* Email */}
                <div className="hidden lg:block w-44 flex-shrink-0">
                  <a href={`mailto:${c.Email}`} className="text-xs truncate block hover:underline" style={{ color: "var(--color-text-muted)" }}>{c.Email}</a>
                  <a href={`tel:${c.Telefono}`} className="text-xs hover:underline" style={{ color: "var(--color-text-muted)" }}>{c.Telefono}</a>
                </div>

                {/* Status */}
                <span
                  className="text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 hidden sm:inline-block"
                  style={{ background: est.bg, color: est.text }}
                >
                  {est.label}
                </span>

                {/* Meet */}
                {c.MeetLink ? (
                  <a href={c.MeetLink} target="_blank" rel="noopener noreferrer"
                    className="w-6 h-6 flex items-center justify-center rounded-lg flex-shrink-0 hover:opacity-80 transition-opacity"
                    style={{ background: "#e8f5e9", color: "#166534" }} title="Unirse a Google Meet">
                    <Video size={11} />
                  </a>
                ) : (
                  <div className="w-6 h-6 flex-shrink-0" />
                )}

                {/* Actions */}
                <div className="flex gap-1 flex-shrink-0">
                  {c.Estado !== "confirmada" && (
                    <button onClick={() => updateEstado(c.Id, "confirmada")} disabled={updating === c.Id}
                      className="w-6 h-6 flex items-center justify-center rounded-lg hover:opacity-80 transition-opacity"
                      style={{ background: "#dcfce7", color: "#166534" }} title="Confirmar">
                      {updating === c.Id ? <Loader2 size={10} className="animate-spin" /> : <CheckCircle size={11} />}
                    </button>
                  )}
                  {c.Estado !== "cancelada" && (
                    <button onClick={() => updateEstado(c.Id, "cancelada")} disabled={updating === c.Id}
                      className="w-6 h-6 flex items-center justify-center rounded-lg hover:opacity-80 transition-opacity"
                      style={{ background: "#fee2e2", color: "#991b1b" }} title="Cancelar">
                      {updating === c.Id ? <Loader2 size={10} className="animate-spin" /> : <XCircle size={11} />}
                    </button>
                  )}
                  {c.Estado === "cancelada" && (
                    <button onClick={() => updateEstado(c.Id, "pendiente")} disabled={updating === c.Id}
                      className="w-6 h-6 flex items-center justify-center rounded-lg hover:opacity-80 transition-opacity"
                      style={{ background: "#fef9c3", color: "#854d0e" }} title="Reactivar">
                      {updating === c.Id ? <Loader2 size={10} className="animate-spin" /> : <Clock size={11} />}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
