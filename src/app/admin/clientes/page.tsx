"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Plus, Edit2, Trash2, X, Save, Loader2, Building2, ImageOff } from "lucide-react";
import toast from "react-hot-toast";
import type { Cliente } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

interface ClienteForm {
  Nombre: string;
  LogoUrl: string;
  Orden: number;
  Activo: boolean;
}

function ImagePreview({ url }: { url: string }) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => { setError(false); setLoading(true); }, [url]);

  if (!url.trim()) return (
    <div className="flex items-center justify-center h-16 rounded-xl"
      style={{ background: "var(--color-surface-2)", border: "1px dashed var(--color-border)" }}>
      <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>Vista previa del logo</p>
    </div>
  );

  return (
    <div className="relative flex items-center justify-center h-16 rounded-xl overflow-hidden"
      style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)" }}>
      {loading && <Loader2 size={16} className="animate-spin absolute" style={{ color: "var(--color-primary)" }} />}
      {error ? (
        <div className="flex flex-col items-center gap-1">
          <ImageOff size={16} style={{ color: "var(--color-text-muted)" }} />
          <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>URL inválida</p>
        </div>
      ) : (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={url}
          alt="Preview"
          className="max-h-12 max-w-full object-contain"
          style={{ display: loading ? "none" : "block" }}
          onLoad={() => setLoading(false)}
          onError={() => { setError(true); setLoading(false); }}
        />
      )}
    </div>
  );
}

export default function AdminClientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<ClienteForm>({
    defaultValues: { Activo: true, Orden: 0 },
  });

  const logoUrlValue = watch("LogoUrl");

  useEffect(() => {
    const timer = setTimeout(() => setPreviewUrl(logoUrlValue || ""), 600);
    return () => clearTimeout(timer);
  }, [logoUrlValue]);

  const fetchClientes = () =>
    fetch("/api/clientes").then((r) => r.json()).then(setClientes).catch(() => {}).finally(() => setLoading(false));

  useEffect(() => { fetchClientes(); }, []);

  const openNew = () => {
    reset({ Nombre: "", LogoUrl: "", Orden: clientes.length, Activo: true });
    setPreviewUrl("");
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (c: Cliente) => {
    setValue("Nombre", c.Nombre);
    setValue("LogoUrl", c.LogoUrl);
    setValue("Orden", c.Orden);
    setValue("Activo", c.Activo);
    setPreviewUrl(c.LogoUrl);
    setEditingId(c.Id);
    setShowForm(true);
  };

  const onSubmit = async (data: ClienteForm) => {
    setSaving(true);
    try {
      const url = editingId ? `/api/clientes/${editingId}` : "/api/clientes";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!res.ok) throw new Error();
      toast.success(editingId ? "Cliente actualizado" : "Cliente agregado");
      setShowForm(false);
      fetchClientes();
    } catch { toast.error("Error al guardar"); }
    finally { setSaving(false); }
  };

  const deleteCliente = async (id: number) => {
    if (!confirm("¿Eliminar este cliente?")) return;
    const res = await fetch(`/api/clientes/${id}`, { method: "DELETE" });
    if (res.ok) { toast.success("Cliente eliminado"); fetchClientes(); }
    else toast.error("Error al eliminar");
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: "var(--color-text)" }}>Clientes</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--color-text-muted)" }}>
            Logos visibles en la página principal
          </p>
        </div>
        <button onClick={openNew} className="btn-primary text-sm py-2 px-4">
          <Plus size={15} /> Agregar
        </button>
      </div>

      {/* Modal */}
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
              <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "var(--color-border)" }}>
                <h2 className="text-base font-semibold" style={{ color: "var(--color-text)" }}>
                  {editingId ? "Editar cliente" : "Nuevo cliente"}
                </h2>
                <button onClick={() => setShowForm(false)} className="p-1 rounded-lg hover:opacity-70" style={{ color: "var(--color-text-muted)" }}>
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-5 space-y-4">
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text-muted)" }}>Nombre *</label>
                  <input
                    {...register("Nombre", { required: "El nombre es requerido", minLength: { value: 2, message: "Mínimo 2 caracteres" } })}
                    className="input-field text-sm"
                    placeholder="Nombre de la empresa"
                  />
                  {errors.Nombre && <p className="text-xs text-red-500 mt-1">{errors.Nombre.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text-muted)" }}>URL del logo</label>
                  <input
                    {...register("LogoUrl", {
                      validate: (v) => { if (!v) return true; try { new URL(v); return true; } catch { return "Debe ser una URL válida"; } },
                    })}
                    className="input-field text-sm"
                    placeholder="https://ejemplo.com/logo.png"
                  />
                  {errors.LogoUrl && <p className="text-xs text-red-500 mt-1">{errors.LogoUrl.message}</p>}
                </div>

                <ImagePreview url={previewUrl} />

                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text-muted)" }}>Orden</label>
                  <input
                    {...register("Orden", { valueAsNumber: true, min: { value: 0, message: "No puede ser negativo" } })}
                    type="number" min={0} className="input-field text-sm"
                  />
                  {errors.Orden && <p className="text-xs text-red-500 mt-1">{errors.Orden.message}</p>}
                </div>

                {editingId && (
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

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 size={28} className="animate-spin" style={{ color: "var(--color-primary)" }} />
        </div>
      ) : clientes.length === 0 ? (
        <div className="rounded-xl border py-16 text-center" style={{ borderColor: "var(--color-border)" }}>
          <Building2 size={32} className="mx-auto mb-3 opacity-25" style={{ color: "var(--color-text-muted)" }} />
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>No hay clientes. ¡Agrega el primero!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {clientes.map((c) => (
            <motion.div
              key={c.Id}
              layout
              className="card p-4 flex flex-col items-center gap-3 text-center"
              style={{ opacity: c.Activo ? 1 : 0.5 }}
            >
              <div className="flex items-center justify-center h-12 w-full">
                {c.LogoUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={c.LogoUrl} alt={c.Nombre} className="object-contain max-h-12 max-w-full" />
                ) : (
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold"
                    style={{ background: "var(--color-primary)", color: "#fff" }}
                  >
                    {c.Nombre.charAt(0)}
                  </div>
                )}
              </div>
              <div className="w-full">
                <p className="font-medium text-xs truncate" style={{ color: "var(--color-text)" }}>{c.Nombre}</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>
                  #{c.Orden}{!c.Activo && " · Oculto"}
                </p>
              </div>
              <div className="flex gap-1.5 w-full">
                <button
                  onClick={() => openEdit(c)}
                  className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs border hover:opacity-80 transition-opacity"
                  style={{ borderColor: "var(--color-border)", color: "var(--color-text-muted)" }}
                >
                  <Edit2 size={11} /> Editar
                </button>
                <button
                  onClick={() => deleteCliente(c.Id)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg border hover:opacity-70 transition-opacity"
                  style={{ borderColor: "#fee2e2", color: "#ef4444" }}
                >
                  <Trash2 size={11} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
