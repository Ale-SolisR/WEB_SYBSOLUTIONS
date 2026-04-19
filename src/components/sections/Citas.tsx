"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, User, Mail, Phone, FileText, CheckCircle, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";

const TIPO_CEDULA = [
  { value: "fisica", label: "Física" },
  { value: "juridica", label: "Jurídica" },
  { value: "dimex", label: "DIMEX" },
  { value: "nite", label: "NITE" },
];

const DAYS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const MONTHS = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

function toDateStr(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}

function CalendarPicker({ selected, onSelect }: { selected: string; onSelect: (d: string) => void }) {
  const [viewDate, setViewDate] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  const today = new Date(); today.setHours(0,0,0,0);

  const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth()+1, 0).getDate();
  const firstDay = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay();

  const prevMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth()-1, 1));
  const nextMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth()+1, 1));

  return (
    <div className="rounded-xl overflow-hidden border" style={{ borderColor: "var(--color-border)" }}>
      <div className="flex items-center justify-between px-4 py-3" style={{ background: "var(--color-surface-2)" }}>
        <button onClick={prevMonth} className="p-1 rounded-lg hover:opacity-70 transition-opacity">
          <ChevronLeft size={16} style={{ color: "var(--color-text)" }} />
        </button>
        <p className="font-semibold text-sm" style={{ color: "var(--color-text)" }}>
          {MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}
        </p>
        <button onClick={nextMonth} className="p-1 rounded-lg hover:opacity-70 transition-opacity">
          <ChevronRight size={16} style={{ color: "var(--color-text)" }} />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-0">
        {DAYS.map((d) => (
          <div key={d} className="text-center py-2 text-xs font-semibold" style={{ color: "var(--color-text-muted)" }}>{d}</div>
        ))}
        {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} />)}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
          const dateStr = toDateStr(date);
          const isToday = date.getTime() === today.getTime();
          const isPast = date < today;
          const isWeekend = date.getDay() === 0 || date.getDay() === 6;
          const isSelected = selected === dateStr;
          const disabled = isPast || isWeekend;

          return (
            <button
              key={day}
              disabled={disabled}
              onClick={() => onSelect(dateStr)}
              className="aspect-square flex items-center justify-center text-sm rounded-lg m-0.5 transition-all"
              style={isSelected
                ? { background: "var(--color-primary)", color: "#fff", fontWeight: 700 }
                : disabled
                ? { color: "var(--color-border)", cursor: "not-allowed" }
                : isToday
                ? { border: "1px solid var(--color-primary)", color: "var(--color-primary)", fontWeight: 600 }
                : { color: "var(--color-text)" }
              }
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface FormState {
  tipoCedula: string;
  cedula: string;
  nombre: string;
  email: string;
  telefono: string;
  nota: string;
}

export default function Citas() {
  const [form, setForm] = useState<FormState>({
    tipoCedula: "fisica",
    cedula: "",
    nombre: "",
    email: "",
    telefono: "",
    nota: "",
  });
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [slots, setSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [lookingUp, setLookingUp] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const lastLookedUp = useRef("");

  const setField = (k: keyof FormState, v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

  const fetchSlots = useCallback(async (date: string) => {
    if (!date) return;
    setLoadingSlots(true);
    setSelectedSlot("");
    try {
      const res = await fetch(`/api/citas/disponibles?fecha=${date}`);
      const data = await res.json();
      setSlots(data.slots || []);
    } catch {
      setSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  }, []);

  useEffect(() => { if (selectedDate) fetchSlots(selectedDate); }, [selectedDate, fetchSlots]);

  const lookupCedula = useCallback(async (cedula: string) => {
    if (cedula.length < 9) return;
    setLookingUp(true);
    try {
      const res = await fetch(`/api/cedula/${cedula}`);
      if (!res.ok) return;
      const data = await res.json();
      const nombre = data.nombre || data.fullname || "";
      if (nombre) { setField("nombre", nombre); }
    } catch {
      // silent — user can type name manually
    } finally {
      setLookingUp(false);
    }
  }, []);

  useEffect(() => {
    const c = form.cedula;
    if (form.tipoCedula !== "fisica" || c.length < 9) return;
    if (c === lastLookedUp.current) return;
    const timer = setTimeout(() => {
      lastLookedUp.current = c;
      lookupCedula(c);
    }, 600);
    return () => clearTimeout(timer);
  }, [form.cedula, form.tipoCedula, lookupCedula]);

  const validate = (): string | null => {
    if (!form.cedula.trim()) return "Cédula requerida";
    if (!form.nombre.trim()) return "Nombre requerido";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return "Email inválido";
    if (!form.telefono.trim() || form.telefono.replace(/\D/g, "").length < 8) return "Teléfono inválido (mínimo 8 dígitos)";
    if (!selectedDate) return "Selecciona una fecha";
    if (!selectedSlot) return "Selecciona un horario";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) { toast.error(err); return; }

    setSubmitting(true);
    try {
      const res = await fetch("/api/citas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Cedula: form.cedula.trim(),
          TipoCedula: form.tipoCedula,
          NombreCompleto: form.nombre.trim(),
          Email: form.email.trim(),
          Telefono: form.telefono.trim(),
          FechaCita: selectedDate,
          HoraCita: selectedSlot,
          Nota: form.nota.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || "Error al agendar"); return; }
      setSuccess(true);
    } catch {
      toast.error("Error al conectar con el servidor");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <section id="citas" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md mx-auto card p-10 text-center"
        >
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: "#dcfce7" }}>
            <CheckCircle size={32} style={{ color: "#16a34a" }} />
          </div>
          <h2 className="text-2xl font-black mb-2" style={{ color: "var(--color-text)" }}>¡Demo agendada!</h2>
          <p className="mb-2" style={{ color: "var(--color-text-muted)" }}>
            Hemos recibido tu solicitud para el <strong>{selectedDate}</strong> a las <strong>{selectedSlot}</strong>.
          </p>
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
            Nos pondremos en contacto contigo para confirmar la cita.
          </p>
          <button
            onClick={() => { setSuccess(false); setForm({ tipoCedula:"fisica",cedula:"",nombre:"",email:"",telefono:"",nota:"" }); setSelectedDate(""); setSelectedSlot(""); lastLookedUp.current = ""; }}
            className="btn-primary mt-6"
          >
            Agendar otra cita
          </button>
        </motion.div>
      </section>
    );
  }

  return (
    <section id="citas" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <span className="badge mb-4">Demo Gratuita</span>
        <h2 className="section-title">Agenda tu demostración</h2>
        <p className="section-subtitle">
          Reserva un espacio y te mostraremos en vivo todo lo que S&amp;B ERP puede hacer por tu empresa.
        </p>
      </motion.div>

      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
          {/* Left column: personal info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="card p-6 space-y-4"
          >
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2" style={{ color: "var(--color-text)" }}>
              <User size={18} style={{ color: "var(--color-primary)" }} /> Información de contacto
            </h3>

            {/* Tipo cédula */}
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "var(--color-text)" }}>
                Tipo de identificación
              </label>
              <select
                value={form.tipoCedula}
                onChange={(e) => setField("tipoCedula", e.target.value)}
                className="input-field"
              >
                {TIPO_CEDULA.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            {/* Cédula */}
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "var(--color-text)" }}>
                Número de {form.tipoCedula === "fisica" ? "cédula" : "identificación"} *
              </label>
              <div className="relative">
                <input
                  value={form.cedula}
                  onChange={(e) => { setField("cedula", e.target.value.replace(/\D/g, "")); setField("nombre", ""); lastLookedUp.current = ""; }}
                  placeholder="Ej: 123456789"
                  className="input-field"
                  maxLength={12}
                />
                {lookingUp && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Loader2 size={16} className="animate-spin" style={{ color: "var(--color-primary)" }} />
                  </div>
                )}
              </div>
            </div>

            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "var(--color-text)" }}>
                Nombre completo o empresa *
              </label>
              <input
                value={form.nombre}
                onChange={(e) => setField("nombre", e.target.value)}
                placeholder={form.tipoCedula === "fisica" ? "Se autocompleta con la cédula" : "Nombre de la empresa"}
                className="input-field"
                readOnly={form.tipoCedula === "fisica" && !!form.nombre}
                style={form.tipoCedula === "fisica" && form.nombre ? { background: "var(--color-surface-2)", cursor: "default" } : {}}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "var(--color-text)" }}>
                <Mail size={13} className="inline mr-1" /> Correo electrónico *
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setField("email", e.target.value)}
                placeholder="correo@empresa.com"
                className="input-field"
              />
            </div>

            {/* Teléfono */}
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "var(--color-text)" }}>
                <Phone size={13} className="inline mr-1" /> Teléfono *
              </label>
              <input
                type="tel"
                value={form.telefono}
                onChange={(e) => setField("telefono", e.target.value)}
                placeholder="+506 8888-8888"
                className="input-field"
              />
            </div>

            {/* Nota */}
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "var(--color-text)" }}>
                <FileText size={13} className="inline mr-1" /> Nota adicional
              </label>
              <textarea
                value={form.nota}
                onChange={(e) => setField("nota", e.target.value)}
                placeholder="¿Algún requerimiento especial?"
                rows={3}
                className="input-field resize-none"
                maxLength={400}
              />
            </div>
          </motion.div>

          {/* Right column: date & time picker */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="card p-6 space-y-5"
          >
            <h3 className="font-bold text-lg flex items-center gap-2" style={{ color: "var(--color-text)" }}>
              <Calendar size={18} style={{ color: "var(--color-primary)" }} /> Fecha y horario
            </h3>

            <CalendarPicker selected={selectedDate} onSelect={setSelectedDate} />

            {selectedDate && (
              <div>
                <p className="text-sm font-medium mb-3 flex items-center gap-2" style={{ color: "var(--color-text)" }}>
                  <Clock size={14} style={{ color: "var(--color-primary)" }} />
                  Horarios disponibles para {new Date(selectedDate+"T12:00:00").toLocaleDateString("es-CR",{weekday:"long",day:"numeric",month:"long"})}
                </p>
                {loadingSlots ? (
                  <div className="flex justify-center py-6">
                    <Loader2 size={24} className="animate-spin" style={{ color: "var(--color-primary)" }} />
                  </div>
                ) : slots.length === 0 ? (
                  <p className="text-sm text-center py-4" style={{ color: "var(--color-text-muted)" }}>
                    No hay horarios disponibles para esta fecha
                  </p>
                ) : (
                  <div className="grid grid-cols-4 gap-2">
                    {slots.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSelectedSlot(s)}
                        className="py-2 rounded-xl text-sm font-medium border transition-all hover:scale-[1.03]"
                        style={selectedSlot === s
                          ? { background: "var(--color-primary)", color: "#fff", borderColor: "var(--color-primary)" }
                          : { borderColor: "var(--color-border)", color: "var(--color-text)" }
                        }
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Summary */}
            {selectedDate && selectedSlot && (
              <div className="rounded-xl p-3 text-sm" style={{ background: "var(--color-surface-2)" }}>
                <p className="font-semibold mb-1" style={{ color: "var(--color-text)" }}>Resumen de tu cita:</p>
                <p style={{ color: "var(--color-text-muted)" }}>
                  📅 {new Date(selectedDate+"T12:00:00").toLocaleDateString("es-CR",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}
                </p>
                <p style={{ color: "var(--color-text-muted)" }}>🕐 {selectedSlot} (hora Costa Rica)</p>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full justify-center"
            >
              {submitting ? <Loader2 size={18} className="animate-spin" /> : <Calendar size={18} />}
              {submitting ? "Agendando..." : "Confirmar cita"}
            </button>

            <p className="text-xs text-center" style={{ color: "var(--color-text-muted)" }}>
              Recibirás confirmación por correo electrónico. Solo lunes a viernes, 8:00–16:00 hora CR.
            </p>
          </motion.div>
        </form>
      </div>
    </section>
  );
}
