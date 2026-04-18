"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Plus, Edit2, Trash2, X, Save, Loader2, Building2 } from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";
import type { Cliente } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

interface ClienteForm { Nombre: string; LogoUrl: string; Orden: number; Activo: boolean; }

export default function AdminClientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<ClienteForm>({ defaultValues: { Activo: true, Orden: 0 } });

  const fetchClientes = () =>
    fetch("/api/clientes").then((r) => r.json()).then(setClientes).catch(() => {}).finally(() => setLoading(false));

  useEffect(() => { fetchClientes(); }, []);

  const openNew = () => {
    reset({ Nombre: "", LogoUrl: "", Orden: clientes.length + 1, Activo: true });
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (c: Cliente) => {
    setValue("Nombre", c.Nombre);
    setValue("LogoUrl", c.LogoUrl);
    setValue("Orden", c.Orden);
    setValue("Activo", c.Activo);
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
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black" style={{ color: "var(--color-text)" }}>Clientes</h1>
          <p className="mt-1" style={{ color: "var(--color-text-muted)" }}>Logos y nombres visibles en la página principal</p>
        </div>
        <button onClick={openNew} className="btn-primary"><Plus size={18} /> Agregar cliente</button>
      </div>

      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="card p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold" style={{ color: "var(--color-text)" }}>{editingId ? "Editar cliente" : "Agregar cliente"}</h2>
                <button onClick={() => setShowForm(false)} style={{ color: "var(--color-text-muted)" }}><X size={20} /></button>
              </div>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "var(--color-text)" }}>Nombre *</label>
                  <input {...register("Nombre", { required: "Requerido" })} className="input-field" placeholder="Nombre de la empresa" />
                  {errors.Nombre && <p className="text-xs text-red-500 mt-1">{errors.Nombre.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "var(--color-text)" }}>URL del logo</label>
                  <input {...register("LogoUrl")} className="input-field" placeholder="https://..." />
                  <p className="text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>URL de la imagen del logo (opcional)</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "var(--color-text)" }}>Orden</label>
                  <input {...register("Orden", { valueAsNumber: true })} type="number" className="input-field" />
                </div>
                {editingId && (
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" {...register("Activo")} className="w-4 h-4" />
                    <span className="text-sm" style={{ color: "var(--color-text)" }}>Visible en la página</span>
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

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 size={36} className="animate-spin" style={{ color: "var(--color-primary)" }} /></div>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {clientes.map((c) => (
            <motion.div key={c.Id} layout className="card p-5 flex flex-col items-center gap-3 text-center" style={{ opacity: c.Activo ? 1 : 0.5 }}>
              {c.LogoUrl ? (
                <Image src={c.LogoUrl} alt={c.Nombre} width={80} height={40} className="object-contain h-10 w-auto" />
              ) : (
                <div className="w-14 h-14 rounded-xl flex items-center justify-center text-xl font-black" style={{ background: "var(--color-primary)", color: "#fff" }}>
                  {c.Nombre.charAt(0)}
                </div>
              )}
              <div>
                <p className="font-semibold text-sm" style={{ color: "var(--color-text)" }}>{c.Nombre}</p>
                {!c.Activo && <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>Oculto</span>}
              </div>
              <div className="flex gap-2 w-full">
                <button onClick={() => openEdit(c)} className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs border" style={{ borderColor: "var(--color-border)", color: "var(--color-text-muted)" }}>
                  <Edit2 size={13} /> Editar
                </button>
                <button onClick={() => deleteCliente(c.Id)} className="p-1.5 rounded-lg border" style={{ borderColor: "#fee2e2", color: "#ef4444" }}>
                  <Trash2 size={13} />
                </button>
              </div>
            </motion.div>
          ))}
          {clientes.length === 0 && (
            <div className="col-span-full card p-12 text-center" style={{ color: "var(--color-text-muted)" }}>
              <Building2 size={40} className="mx-auto mb-3 opacity-30" />
              <p>No hay clientes. ¡Agrega el primero!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
