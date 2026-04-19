"use client";

import { useEffect, useState } from "react";
import { Calendar, Loader2, CheckCircle, XCircle, Clock, Phone, Mail, Video } from "lucide-react";
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
  MeetLink: string | null;
  GoogleEventId: string | null;
}

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

  const formatDate = (d: string) => {
    const datePart = d.includes("T") ? d.split("T")[0] : d;
    return new Date(datePart + "T12:00:00").toLocaleDateString("es-CR", {
      weekday: "short", year: "numeric", month: "short", day: "numeric",
    });
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold" style={{ color: "var(--color-text)" }}>Citas</h1>
        <p className="text-sm mt-0.5" style={{ color: "var(--color-text-muted)" }}>
          Demostraciones agendadas por visitantes
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {FILTERS.map((f) => {
          const count = f === "todas" ? citas.length : citas.filter((c) => c.Estado === f).length;
          const active = filter === f;
          const dot = f !== "todas" ? ESTADOS[f].dot : "var(--color-primary)";
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all"
              style={active ? {
                background: "color-mix(in srgb, var(--color-primary) 10%, transparent)",
                borderColor: "var(--color-primary)",
                color: "var(--color-primary)",
              } : {
                background: "transparent",
                borderColor: "var(--color-border)",
                color: "var(--color-text-muted)",
              }}
            >
              {f !== "todas" && (
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: active ? dot : "var(--color-text-muted)" }} />
              )}
              <span className="capitalize">{f}</span>
              <span
                className="text-xs px-1.5 py-0.5 rounded-full font-semibold"
                style={{ background: active ? "var(--color-primary)" : "var(--color-surface-2)", color: active ? "#fff" : "var(--color-text-muted)" }}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 size={28} className="animate-spin" style={{ color: "var(--color-primary)" }} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border py-16 text-center" style={{ borderColor: "var(--color-border)" }}>
          <Calendar size={28} className="mx-auto mb-3 opacity-25" style={{ color: "var(--color-text-muted)" }} />
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
            No hay citas {filter !== "todas" ? `${filter}s` : "agendadas"}.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((c) => {
            const est = ESTADOS[c.Estado];
            return (
              <div key={c.Id} className="card p-5">
                <div className="flex flex-wrap items-start gap-4">
                  {/* Person info */}
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                      style={{ background: "color-mix(in srgb, var(--color-primary) 12%, transparent)", color: "var(--color-primary)" }}
                    >
                      {c.NombreCompleto.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-sm" style={{ color: "var(--color-text)" }}>{c.NombreCompleto}</p>
                        <span
                          className="text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0"
                          style={{ background: est.bg, color: est.text }}
                        >
                          {est.label}
                        </span>
                      </div>
                      <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>
                        Cédula {c.TipoCedula}: {c.Cedula}
                      </p>

                      {/* Details grid */}
                      <div className="mt-3 grid sm:grid-cols-2 gap-x-6 gap-y-1.5">
                        <div className="flex items-center gap-2 text-xs" style={{ color: "var(--color-text-muted)" }}>
                          <Calendar size={12} className="flex-shrink-0" />
                          <span className="capitalize truncate">{formatDate(c.FechaCita)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs" style={{ color: "var(--color-text-muted)" }}>
                          <Clock size={12} className="flex-shrink-0" />
                          <span>{c.HoraCita} (hora CR)</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs" style={{ color: "var(--color-text-muted)" }}>
                          <Mail size={12} className="flex-shrink-0" />
                          <a href={`mailto:${c.Email}`} className="hover:underline truncate">{c.Email}</a>
                        </div>
                        <div className="flex items-center gap-2 text-xs" style={{ color: "var(--color-text-muted)" }}>
                          <Phone size={12} className="flex-shrink-0" />
                          <a href={`tel:${c.Telefono}`} className="hover:underline">{c.Telefono}</a>
                        </div>
                      </div>

                      {c.Nota && (
                        <p className="text-xs mt-3 px-3 py-2 rounded-lg" style={{ background: "var(--color-surface-2)", color: "var(--color-text-muted)" }}>
                          <span className="font-medium" style={{ color: "var(--color-text)" }}>Nota:</span> {c.Nota}
                        </p>
                      )}
                      {c.MeetLink && (
                        <a
                          href={c.MeetLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs mt-2 px-3 py-1.5 rounded-lg font-medium"
                          style={{ background: "#e8f5e9", color: "#166534" }}
                        >
                          <Video size={11} /> Unirse a Google Meet
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-1.5 flex-shrink-0">
                    {c.Estado !== "confirmada" && (
                      <button
                        onClick={() => updateEstado(c.Id, "confirmada")}
                        disabled={updating === c.Id}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-opacity hover:opacity-80"
                        style={{ background: "#dcfce7", color: "#166534" }}
                      >
                        {updating === c.Id ? <Loader2 size={11} className="animate-spin" /> : <CheckCircle size={11} />}
                        Confirmar
                      </button>
                    )}
                    {c.Estado !== "pendiente" && (
                      <button
                        onClick={() => updateEstado(c.Id, "pendiente")}
                        disabled={updating === c.Id}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-opacity hover:opacity-80"
                        style={{ background: "#fef9c3", color: "#854d0e" }}
                      >
                        {updating === c.Id ? <Loader2 size={11} className="animate-spin" /> : <Clock size={11} />}
                        Pendiente
                      </button>
                    )}
                    {c.Estado !== "cancelada" && (
                      <button
                        onClick={() => updateEstado(c.Id, "cancelada")}
                        disabled={updating === c.Id}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-opacity hover:opacity-80"
                        style={{ background: "#fee2e2", color: "#991b1b" }}
                      >
                        {updating === c.Id ? <Loader2 size={11} className="animate-spin" /> : <XCircle size={11} />}
                        Cancelar
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
