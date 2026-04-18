"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Plus, Edit2, Trash2, Eye, EyeOff, X, Save, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";
import type { Video } from "@/types";
import { getYoutubeThumbnail, extractYoutubeId } from "@/lib/youtube";
import { motion, AnimatePresence } from "framer-motion";

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

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<VideoForm>({
    defaultValues: { Activo: true, Orden: 0 },
  });

  const fetchVideos = () =>
    fetch("/api/videos")
      .then((r) => r.json())
      .then(setVideos)
      .catch(() => {})
      .finally(() => setLoading(false));

  useEffect(() => { fetchVideos(); }, []);

  const openNew = () => {
    reset({ Titulo: "", Descripcion: "", YoutubeUrl: "", Categoria: "ERP", Orden: videos.length + 1, Activo: true });
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
    setEditingId(v.Id);
    setShowForm(true);
  };

  const onSubmit = async (data: VideoForm) => {
    setSaving(true);
    try {
      const url = editingId ? `/api/videos/${editingId}` : "/api/videos";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
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
    if (res.ok) { toast.success("Video eliminado"); fetchVideos(); }
    else toast.error("Error al eliminar");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black" style={{ color: "var(--color-text)" }}>Videos</h1>
          <p className="mt-1" style={{ color: "var(--color-text-muted)" }}>Gestiona las capacitaciones en video</p>
        </div>
        <button onClick={openNew} className="btn-primary">
          <Plus size={18} /> Agregar video
        </button>
      </div>

      {/* Form modal */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="card p-6 w-full max-w-lg"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold" style={{ color: "var(--color-text)" }}>
                  {editingId ? "Editar video" : "Agregar video"}
                </h2>
                <button onClick={() => setShowForm(false)} style={{ color: "var(--color-text-muted)" }}><X size={20} /></button>
              </div>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "var(--color-text)" }}>URL de YouTube *</label>
                  <input {...register("YoutubeUrl", { required: "Requerido" })} className="input-field" placeholder="https://youtu.be/..." />
                  {errors.YoutubeUrl && <p className="text-xs text-red-500 mt-1">{errors.YoutubeUrl.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "var(--color-text)" }}>Título *</label>
                  <input {...register("Titulo", { required: "Requerido" })} className="input-field" placeholder="Nombre del video" />
                  {errors.Titulo && <p className="text-xs text-red-500 mt-1">{errors.Titulo.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "var(--color-text)" }}>Descripción</label>
                  <textarea {...register("Descripcion")} className="input-field resize-none" rows={3} placeholder="Descripción del video..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: "var(--color-text)" }}>Categoría</label>
                    <input {...register("Categoria")} className="input-field" placeholder="ERP, CRM, etc." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: "var(--color-text)" }}>Orden</label>
                    <input {...register("Orden", { valueAsNumber: true })} type="number" className="input-field" />
                  </div>
                </div>
                {editingId && (
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" {...register("Activo")} className="w-4 h-4 rounded" />
                    <span className="text-sm" style={{ color: "var(--color-text)" }}>Activo (visible en portal)</span>
                  </label>
                )}
                <div className="flex gap-3 justify-end pt-2">
                  <button type="button" onClick={() => setShowForm(false)} className="btn-outline py-2 px-4 text-sm">Cancelar</button>
                  <button type="submit" disabled={saving} className="btn-primary py-2 px-4 text-sm">
                    {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    {saving ? "Guardando..." : "Guardar"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 size={36} className="animate-spin" style={{ color: "var(--color-primary)" }} /></div>
      ) : videos.length === 0 ? (
        <div className="card p-12 text-center" style={{ color: "var(--color-text-muted)" }}>
          <p>No hay videos. ¡Agrega el primero!</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((v) => (
            <motion.div key={v.Id} layout className="card overflow-hidden" style={{ opacity: v.Activo ? 1 : 0.6 }}>
              <div className="relative aspect-video">
                <Image
                  src={getYoutubeThumbnail(v.YoutubeId)}
                  alt={v.Titulo}
                  fill
                  className="object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${v.YoutubeId}/hqdefault.jpg`; }}
                />
                {!v.Activo && (
                  <div className="absolute inset-0 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.5)" }}>
                    <span className="text-white text-xs font-bold px-3 py-1 rounded-full" style={{ background: "rgba(0,0,0,0.7)" }}>OCULTO</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <p className="font-semibold text-sm mb-1 line-clamp-1" style={{ color: "var(--color-text)" }}>{v.Titulo}</p>
                <p className="text-xs mb-3" style={{ color: "var(--color-text-muted)" }}>{v.Categoria} · Orden #{v.Orden}</p>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(v)} className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-medium border" style={{ borderColor: "var(--color-border)", color: "var(--color-text-muted)" }}>
                    <Edit2 size={13} /> Editar
                  </button>
                  <button onClick={() => toggleActive(v)} className="p-1.5 rounded-lg border" style={{ borderColor: "var(--color-border)", color: v.Activo ? "#f59e0b" : "#22c55e" }} title={v.Activo ? "Ocultar" : "Mostrar"}>
                    {v.Activo ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                  <button onClick={() => deleteVideo(v.Id)} className="p-1.5 rounded-lg border" style={{ borderColor: "#fee2e2", color: "#ef4444" }} title="Eliminar">
                    <Trash2 size={14} />
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
