"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Plus, Edit2, Trash2, Eye, EyeOff, X, Save, Loader2, Search } from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";
import type { Video } from "@/types";
import { getYoutubeThumbnail, extractYoutubeId } from "@/lib/youtube";
import { motion, AnimatePresence } from "framer-motion";

const MODULES = ["Todos","POS","Inventario","Ventas","Tesorería","Compras","Cuentas por Cobrar","Cuentas por Pagar","Contabilidad","Reportes","Vendedores"];

interface VideoForm {
  Titulo: string;
  Descripcion: string;
  YoutubeUrl: string;
  Categoria: string;
  Orden: number;
  Activo: boolean;
}

export default function AdminVideos() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [moduleFilter, setModuleFilter] = useState("Todos");
  const [thumbId, setThumbId] = useState("");

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<VideoForm>({
    defaultValues: { Activo: true, Orden: 0, Categoria: "Inventario" },
  });

  const youtubeUrlValue = watch("YoutubeUrl");
  useEffect(() => {
    const t = setTimeout(() => {
      const id = extractYoutubeId(youtubeUrlValue || "");
      setThumbId(id.length === 11 ? id : "");
    }, 600);
    return () => clearTimeout(t);
  }, [youtubeUrlValue]);

  const fetchVideos = () =>
    fetch("/api/videos").then((r) => r.json()).then(setVideos).catch(() => {}).finally(() => setLoading(false));

  useEffect(() => { fetchVideos(); }, []);

  const openNew = () => {
    reset({ Titulo: "", Descripcion: "", YoutubeUrl: "", Categoria: "Inventario", Orden: videos.length + 1, Activo: true });
    setThumbId("");
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (v: Video) => {
    setValue("Titulo", v.Titulo);
    setValue("Descripcion", v.Descripcion);
    setValue("YoutubeUrl", v.YoutubeUrl);
    setValue("Categoria", v.Categoria);
    setValue("Orden", v.Orden);
    setValue("Activo", v.Activo);
    setThumbId(v.YoutubeId || "");
    setEditingId(v.Id);
    setShowForm(true);
  };

  const onSubmit = async (data: VideoForm) => {
    setSaving(true);
    try {
      const url = editingId ? `/api/videos/${editingId}` : "/api/videos";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!res.ok) throw new Error();
      toast.success(editingId ? "Video actualizado" : "Video agregado");
      setShowForm(false);
      fetchVideos();
    } catch {
      toast.error("Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (v: Video) => {
    const res = await fetch(`/api/videos/${v.Id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...v, Activo: !v.Activo }),
    });
    if (res.ok) { toast.success("Estado actualizado"); fetchVideos(); }
  };

  const deleteVideo = async (id: number) => {
    if (!confirm("¿Eliminar este video?")) return;
    const res = await fetch(`/api/videos/${id}`, { method: "DELETE" });
    if (res.ok) { toast.success("Eliminado"); fetchVideos(); }
    else toast.error("Error al eliminar");
  };

  const filtered = videos.filter((v) => {
    const matchModule = moduleFilter === "Todos" || v.Categoria === moduleFilter;
    const matchSearch = !search || v.Titulo.toLowerCase().includes(search.toLowerCase());
    return matchModule && matchSearch;
  });

  return (
    <div className="max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: "var(--color-text)" }}>Videos</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--color-text-muted)" }}>
            {videos.length} capacitaciones en total
          </p>
        </div>
        <button onClick={openNew} className="btn-primary text-sm py-2 px-4">
          <Plus size={15} /> Agregar
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--color-text-muted)" }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar videos..."
            className="input-field pl-9 text-sm py-2 w-56"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {MODULES.map((m) => (
            <button
              key={m}
              onClick={() => setModuleFilter(m)}
              className="text-xs font-medium px-3 py-1.5 rounded-full border transition-all"
              style={moduleFilter === m
                ? { background: "var(--color-primary)", borderColor: "var(--color-primary)", color: "#fff" }
                : { background: "transparent", borderColor: "var(--color-border)", color: "var(--color-text-muted)" }}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)" }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 6 }}
              transition={{ duration: 0.15 }}
              className="w-full max-w-lg rounded-2xl shadow-2xl border"
              style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
            >
              <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "var(--color-border)" }}>
                <h2 className="text-base font-semibold" style={{ color: "var(--color-text)" }}>
                  {editingId ? "Editar video" : "Nuevo video"}
                </h2>
                <button onClick={() => setShowForm(false)} className="p-1 rounded-lg hover:opacity-70" style={{ color: "var(--color-text-muted)" }}>
                  <X size={16} />
                </button>
              </div>
              <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-5 space-y-4">
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text-muted)" }}>URL de YouTube *</label>
                  <div className="flex gap-3 items-start">
                    <div className="flex-1">
                      <input {...register("YoutubeUrl", { required: "Requerido" })} className="input-field text-sm" placeholder="https://youtu.be/..." />
                      {errors.YoutubeUrl && <p className="text-xs text-red-500 mt-1">{errors.YoutubeUrl.message}</p>}
                    </div>
                    <div className="w-28 h-16 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center"
                      style={{ background: "var(--color-surface-2)", border: "1px dashed var(--color-border)" }}>
                      {thumbId ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={getYoutubeThumbnail(thumbId)} alt="Miniatura" className="w-full h-full object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${thumbId}/hqdefault.jpg`; }} />
                      ) : (
                        <p className="text-xs text-center px-1" style={{ color: "var(--color-text-muted)" }}>Preview</p>
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text-muted)" }}>Título *</label>
                  <input {...register("Titulo", { required: "Requerido" })} className="input-field text-sm" placeholder="Nombre del video" />
                  {errors.Titulo && <p className="text-xs text-red-500 mt-1">{errors.Titulo.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text-muted)" }}>Descripción</label>
                  <textarea {...register("Descripcion")} className="input-field resize-none text-sm" rows={2} placeholder="Descripción breve..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text-muted)" }}>Módulo</label>
                    <select {...register("Categoria")} className="input-field text-sm">
                      {MODULES.slice(1).map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text-muted)" }}>Orden</label>
                    <input {...register("Orden", { valueAsNumber: true })} type="number" className="input-field text-sm" />
                  </div>
                </div>
                {editingId && (
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" {...register("Activo")} className="w-4 h-4 rounded" />
                    <span className="text-sm" style={{ color: "var(--color-text)" }}>Visible en el portal</span>
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
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border py-16 text-center" style={{ borderColor: "var(--color-border)" }}>
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
            {videos.length === 0 ? "No hay videos. ¡Agrega el primero!" : "Sin resultados para este filtro."}
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((v) => (
            <motion.div key={v.Id} layout className="card overflow-hidden" style={{ opacity: v.Activo ? 1 : 0.55 }}>
              <div className="relative aspect-video bg-black">
                <Image
                  src={getYoutubeThumbnail(v.YoutubeId)}
                  alt={v.Titulo}
                  fill
                  className="object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${v.YoutubeId}/hqdefault.jpg`; }}
                />
                {!v.Activo && (
                  <div className="absolute inset-0 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.5)" }}>
                    <span className="text-white text-xs font-semibold px-2.5 py-0.5 rounded-full bg-black/60">Oculto</span>
                  </div>
                )}
                <span className="absolute top-2 left-2 text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: "rgba(0,0,0,0.65)", color: "#fff" }}>
                  {v.Categoria}
                </span>
              </div>
              <div className="p-4">
                <p className="font-medium text-sm line-clamp-1 mb-0.5" style={{ color: "var(--color-text)" }}>{v.Titulo}</p>
                <p className="text-xs mb-3" style={{ color: "var(--color-text-muted)" }}>Orden #{v.Orden}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEdit(v)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium border hover:opacity-80 transition-opacity"
                    style={{ borderColor: "var(--color-border)", color: "var(--color-text)" }}
                  >
                    <Edit2 size={12} /> Editar
                  </button>
                  <button
                    onClick={() => toggleActive(v)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border hover:opacity-70 transition-opacity"
                    style={{ borderColor: "var(--color-border)", color: v.Activo ? "#f59e0b" : "#22c55e" }}
                    title={v.Activo ? "Ocultar" : "Mostrar"}
                  >
                    {v.Activo ? <EyeOff size={13} /> : <Eye size={13} />}
                  </button>
                  <button
                    onClick={() => deleteVideo(v.Id)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border hover:opacity-70 transition-opacity"
                    style={{ borderColor: "#fee2e2", color: "#ef4444" }}
                    title="Eliminar"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
