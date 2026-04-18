"use client";

import { useEffect, useState } from "react";
import { Calendar, Loader2, CheckCircle, XCircle, Clock, Phone, Mail, User } from "lucide-react";
import toast from "react-hot-toast";

interface Cita {
  Id: number;
  Cedula: string;
  TipoCedula: string;
  NombreCompleto: string;
  Email: string;
  Telefono: string;
  FechaNac: string | null;
  FechaCita: string;
  HoraCita: string;
  Nota: string;
  Estado: "pendiente" | "confirmada" | "cancelada";
  CreadoEn: string;
}

const ESTADO_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  pendiente:  { bg: "#fef9c3", text: "#854d0e", label: "Pendiente" },
  confirmada: { bg: "#dcfce7", text: "#166534", label: "Confirmada" },
  cancelada:  { bg: "#fee2e2", text: "#991b1b", label: "Cancelada" },
};

export default function AdminCitas() {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"todas" | "pendiente" | "confirmada" | "cancelada">("todas");
  const [updating, setUpdating] = useState<number | null>(null);

  const fetchCitas = () =>
    fetch("/api/citas").then((r) => r.json()).then(setCitas).catch(() => {}).finally(() => setLoading(false));

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
      toast.success("Estado actualizado");
      fetchCitas();
    } catch {
      toast.error("Error al actualizar");
    } finally {
      setUpdating(null);
    }
  };

  const filtered = filter === "todas" ? citas : citas.filter((c) => c.Estado === filter);

  const formatDate = (d: string) =>
    new Date(d + "T12:00:00").toLocaleDateString("es-CR", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "var(--color-primary)" }}>
            <Calendar size={20} color="#fff" />
          </div>
          <div>
            <h1 className="text-3xl font-black" style={{ color: "var(--color-text)" }}>Citas Agendadas</h1>
            <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
              Gestiona las demostraciones agendadas por los visitantes
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {(["todas", "pendiente", "confirmada", "cancelada"] as const).map((f) => {
          const count = f === "todas" ? citas.length : citas.filter((c) => c.Estado === f).length;
          const colors = f === "todas" ? { bg: "var(--color-surface-2)", text: "var(--color-text)" } : { bg: ESTADO_COLORS[f].bg, text: ESTADO_COLORS[f].text };
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="card p-4 text-center transition-all hover:scale-[1.02]"
              style={{
                borderWidth: filter === f ? 2 : 1,
                borderColor: filter === f ? "var(--color-primary)" : "var(--color-border)",
              }}
            >
              <p className="text-2xl font-black" style={{ color: colors.text }}>{count}</p>
              <p className="text-xs capitalize mt-1" style={{ color: "var(--color-text-muted)" }}>{f}</p>
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 size={36} className="animate-spin" style={{ color: "var(--color-primary)" }} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-12 text-center" style={{ color: "var(--color-text-muted)" }}>
          <Calendar size={40} className="mx-auto mb-3 opacity-30" />
          <p>No hay citas {filter !== "todas" ? filter + "s" : "agendadas"}.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((c) => {
            const ec = ESTADO_COLORS[c.Estado];
            return (
              <div key={c.Id} className="card p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                        style={{ background: "var(--color-primary)", color: "#fff" }}>
                        {c.NombreCompleto.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold" style={{ color: "var(--color-text)" }}>{c.NombreCompleto}</p>
                        <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                          Cédula {c.TipoCedula}: {c.Cedula}
                        </p>
                      </div>
                      <span className="ml-auto text-xs font-semibold px-2 py-0.5 rounded-full"
                        style={{ background: ec.bg, color: ec.text }}>
                        {ec.label}
                      </span>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                      <div className="flex items-center gap-2" style={{ color: "var(--color-text-muted)" }}>
                        <Calendar size={14} />
                        <span className="capitalize">{formatDate(c.FechaCita)}</span>
                      </div>
                      <div className="flex items-center gap-2" style={{ color: "var(--color-text-muted)" }}>
                        <Clock size={14} />
                        <span>{c.HoraCita} (hora CR)</span>
                      </div>
                      <div className="flex items-center gap-2" style={{ color: "var(--color-text-muted)" }}>
                        <Mail size={14} />
                        <a href={`mailto:${c.Email}`} className="hover:underline">{c.Email}</a>
                      </div>
                      <div className="flex items-center gap-2" style={{ color: "var(--color-text-muted)" }}>
                        <Phone size={14} />
                        <a href={`tel:${c.Telefono}`} className="hover:underline">{c.Telefono}</a>
                      </div>
                    </div>

                    {c.Nota && (
                      <p className="text-xs mt-3 px-3 py-2 rounded-lg" style={{ background: "var(--color-surface-2)", color: "var(--color-text-muted)" }}>
                        <span className="font-semibold">Nota:</span> {c.Nota}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 min-w-fit">
                    {c.Estado !== "confirmada" && (
                      <button
                        onClick={() => updateEstado(c.Id, "confirmada")}
                        disabled={updating === c.Id}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
                        style={{ background: "#dcfce7", color: "#166534" }}
                      >
                        {updating === c.Id ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle size={12} />}
                        Confirmar
                      </button>
                    )}
                    {c.Estado !== "cancelada" && (
                      <button
                        onClick={() => updateEstado(c.Id, "cancelada")}
                        disabled={updating === c.Id}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
                        style={{ background: "#fee2e2", color: "#991b1b" }}
                      >
                        {updating === c.Id ? <Loader2 size={12} className="animate-spin" /> : <XCircle size={12} />}
                        Cancelar
                      </button>
                    )}
                    {c.Estado !== "pendiente" && (
                      <button
                        onClick={() => updateEstado(c.Id, "pendiente")}
                        disabled={updating === c.Id}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
                        style={{ background: "#fef9c3", color: "#854d0e" }}
                      >
                        {updating === c.Id ? <Loader2 size={12} className="animate-spin" /> : <Clock size={12} />}
                        Pendiente
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
