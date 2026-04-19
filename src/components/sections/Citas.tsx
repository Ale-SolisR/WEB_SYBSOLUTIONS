"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, User, Mail, Phone, FileText, CheckCircle, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";

const DAYS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const MONTHS = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

function toDateStr(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}

function detectTipoCedula(cedula: string): string {
  if (/^3\d{9}$/.test(cedula)) return "juridica";
  if (/^4\d{9}$/.test(cedula)) return "nite";
  if (cedula.length >= 11) return "dimex";
  return "fisica";
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
    <div className="rounded-lg overflow-hidden border" style={{ borderColor: "var(--color-border)" }}>
      <div className="flex items-center justify-between px-3 py-2" style={{ background: "var(--color-surface-2)" }}>
        <button type="button" onClick={prevMonth} className="p-1 rounded hover:opacity-70 transition-opacity">
          <ChevronLeft size={14} style={{ color: "var(--color-text)" }} />
        </button>
        <p className="font-semibold text-xs" style={{ color: "var(--color-text)" }}>
          {MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}
        </p>
        <button type="button" onClick={nextMonth} className="p-1 rounded hover:opacity-70 transition-opacity">
          <ChevronRight size={14} style={{ color: "var(--color-text)" }} />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-0 p-1">
        {DAYS.map((d) => (
          <div key={d} className="text-center py-1 text-xs font-semibold" style={{ color: "var(--color-text-muted)" }}>{d}</div>
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
              className="aspect-square flex items-center justify-center text-xs rounded m-px transition-all"
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
  cedula: string;
  nombre: string;
  email: string;
  telefono: string;
  nota: string;
}

export default function Citas() {
  const [form, setForm] = useState<FormState>({
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
    setLookingUp(true);
    try {
      const res = await fetch(`/api/cedula/${cedula}`);
      if (!res.ok) return;
      const data = await res.json();
      const nombre = data.nombre || data.fullname || "";
      if (nombre) setField("nombre", nombre);
    } catch {
      // silent
    } finally {
      setLookingUp(false);
    }
  }, []);

  useEffect(() => {
    const c = form.cedula;
    if (c.length < 9) { setField("nombre", ""); return; }
    if (c === lastLookedUp.current) return;
    const timer = setTimeout(() => {
      lastLookedUp.current = c;
      lookupCedula(c);
    }, 600);
    return () => clearTimeout(timer);
  }, [form.cedula, lookupCedula]);

  const validate = (): string | null => {
    if (!form.cedula.trim()) return "Cédula requerida";
    if (!form.nombre.trim()) return "Nombre requerido";
    if (!form.email.trim()) return "El correo electrónico es obligatorio para agendar la cita";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return "El correo electrónico no es válido";
    if (form.telefono.length < 8) return "Teléfono inválido (8 dígitos)";
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
          TipoCedula: detectTipoCedula(form.cedula.trim()),
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
      <section id="citas" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-sm mx-auto card p-8 text-center"
        >
          <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3"
            style={{ background: "#dcfce7" }}>
            <CheckCircle size={28} style={{ color: "#16a34a" }} />
          </div>
          <h2 className="text-xl font-black mb-2" style={{ color: "var(--color-text)" }}>¡Demo agendada!</h2>
          <p className="text-sm mb-2" style={{ color: "var(--color-text-muted)" }}>
            Recibimos tu solicitud para el <strong>{selectedDate}</strong> a las <strong>{selectedSlot}</strong>.
          </p>
          <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
            Nos pondremos en contacto para confirmar.
          </p>
          <button
            onClick={() => { setSuccess(false); setForm({ cedula:"",nombre:"",email:"",telefono:"",nota:"" }); setSelectedDate(""); setSelectedSlot(""); lastLookedUp.current = ""; }}
            className="btn-primary mt-5 text-sm"
          >
            Agendar otra cita
          </button>
        </motion.div>
      </section>
    );
  }

  return (
    <section id="citas" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <span className="badge mb-3">Demo Gratuita</span>
        <h2 className="section-title">Agenda tu demostración</h2>
        <p className="section-subtitle">
          Reserva un espacio y te mostraremos en vivo todo lo que S&amp;B ERP puede hacer por tu empresa.
        </p>
      </motion.div>

      <div className="max-w-3xl mx-auto">
        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
          {/* Left: personal info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="card p-5 space-y-3"
          >
            <h3 className="font-bold text-sm flex items-center gap-2" style={{ color: "var(--color-text)" }}>
              <User size={15} style={{ color: "var(--color-primary)" }} /> Información de contacto
            </h3>

            {/* Cédula */}
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: "var(--color-text)" }}>
                Número de cédula
              </label>
              <div className="relative">
                <input
                  value={form.cedula}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "").slice(0, 12);
                    setField("cedula", val);
                    setField("nombre", "");
                    lastLookedUp.current = "";
                  }}
                  placeholder="207720184"
                  className="input-field text-sm py-2"
                  maxLength={12}
                />
                {lookingUp && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Loader2 size={14} className="animate-spin" style={{ color: "var(--color-primary)" }} />
                  </div>
                )}
              </div>
            </div>

            {/* Nombre (solo lectura, autocomplete API) */}
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: "var(--color-text)" }}>
                Nombre completo o empresa
              </label>
              <input
                value={form.nombre}
                readOnly
                placeholder="Se completa automáticamente con la cédula"
                className="input-field text-sm py-2"
                style={{ background: "var(--color-surface-2)", cursor: "default" }}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-medium mb-1 flex items-center gap-1" style={{ color: "var(--color-text)" }}>
                <Mail size={11} /> Correo electrónico
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setField("email", e.target.value)}
                placeholder="correo@empresa.com"
                className="input-field text-sm py-2"
                required
              />
            </div>

            {/* Teléfono */}
            <div>
              <label className="block text-xs font-medium mb-1 flex items-center gap-1" style={{ color: "var(--color-text)" }}>
                <Phone size={11} /> Teléfono
              </label>
              <input
                type="tel"
                value={form.telefono}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "").slice(0, 8);
                  setField("telefono", val);
                }}
                placeholder="87457877"
                className="input-field text-sm py-2"
                maxLength={8}
              />
            </div>

            {/* Nota */}
            <div>
              <label className="block text-xs font-medium mb-1 flex items-center gap-1" style={{ color: "var(--color-text)" }}>
                <FileText size={11} /> Nota adicional
              </label>
              <textarea
                value={form.nota}
                onChange={(e) => setField("nota", e.target.value)}
                placeholder="¿Algún requerimiento especial?"
                rows={2}
                className="input-field text-sm resize-none"
                maxLength={400}
              />
            </div>
          </motion.div>

          {/* Right: date & time */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="card p-5 space-y-3"
          >
            <h3 className="font-bold text-sm flex items-center gap-2" style={{ color: "var(--color-text)" }}>
              <Calendar size={15} style={{ color: "var(--color-primary)" }} /> Fecha y horario
            </h3>

            <CalendarPicker selected={selectedDate} onSelect={setSelectedDate} />

            {selectedDate && (
              <div>
                <p className="text-xs font-medium mb-2 flex items-center gap-1" style={{ color: "var(--color-text)" }}>
                  <Clock size={12} style={{ color: "var(--color-primary)" }} />
                  {new Date(selectedDate+"T12:00:00").toLocaleDateString("es-CR",{weekday:"long",day:"numeric",month:"long"})}
                </p>
                {loadingSlots ? (
                  <div className="flex justify-center py-4">
                    <Loader2 size={20} className="animate-spin" style={{ color: "var(--color-primary)" }} />
                  </div>
                ) : slots.length === 0 ? (
                  <p className="text-xs text-center py-3" style={{ color: "var(--color-text-muted)" }}>
                    No hay horarios disponibles para esta fecha
                  </p>
                ) : (
                  <div className="grid grid-cols-4 gap-1.5">
                    {slots.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSelectedSlot(s)}
                        className="py-1.5 rounded-lg text-xs font-medium border transition-all hover:scale-[1.03]"
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

            {selectedDate && selectedSlot && (
              <div className="rounded-lg p-2.5 text-xs" style={{ background: "var(--color-surface-2)" }}>
                <p className="font-semibold mb-1" style={{ color: "var(--color-text)" }}>Resumen:</p>
                <p style={{ color: "var(--color-text-muted)" }}>
                  📅 {new Date(selectedDate+"T12:00:00").toLocaleDateString("es-CR",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}
                </p>
                <p style={{ color: "var(--color-text-muted)" }}>🕐 {selectedSlot} (hora Costa Rica)</p>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full justify-center text-sm py-2"
            >
              {submitting ? <Loader2 size={16} className="animate-spin" /> : <Calendar size={15} />}
              {submitting ? "Agendando..." : "Confirmar cita"}
            </button>

            <p className="text-xs text-center" style={{ color: "var(--color-text-muted)" }}>
              Recibirás confirmación por correo. Lunes a viernes, 8:00–16:00 CR.
            </p>
          </motion.div>
        </form>
      </div>
    </section>
  );
}
