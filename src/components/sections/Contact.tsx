"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { Send, CheckCircle2, ArrowUpRight } from "lucide-react";
import toast from "react-hot-toast";

interface ContactForm {
  nombre: string;
  email: string;
  empresa: string;
  mensaje: string;
}

interface Config {
  whatsapp: string;
  email: string;
  direccion: string;
}

const MAP_URL = "https://maps.app.goo.gl/yHKwWn2ctdU1m1GCA";

export default function Contact() {
  const [config, setConfig] = useState<Config>({
    whatsapp: "+506 87457877",
    email: "sybsolutionscr@gmail.com",
    direccion: "San Ramón, Alajuela, Costa Rica",
  });
  const [sent, setSent] = useState(false);

  useEffect(() => {
    fetch("/api/configuracion")
      .then((r) => r.json())
      // Only sync whatsapp and email from API; location is static
      .then((data) => setConfig((prev) => ({
        ...prev,
        ...(data.whatsapp ? { whatsapp: data.whatsapp } : {}),
        ...(data.email    ? { email:    data.email    } : {}),
      })))
      .catch(() => {});
  }, []);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } =
    useForm<ContactForm>();

  const onInvalid = () => {
    toast.error("Por favor ingrese un correo electrónico válido.");
  };

  const onSubmit = async (data: ContactForm) => {
    const msg = encodeURIComponent(
      `Hola SYB Solutions!\n\nNombre: ${data.nombre}\nEmpresa: ${data.empresa}\nEmail: ${data.email}\n\nMensaje:\n${data.mensaje}`
    );
    const phone = config.whatsapp.replace(/\D/g, "");
    window.open(`https://wa.me/${phone}?text=${msg}`, "_blank");
    toast.success("¡Redirigiendo a WhatsApp!");
    setSent(true);
    reset();
    setTimeout(() => setSent(false), 4000);
  };

  const whatsappNumber = config.whatsapp.replace(/\D/g, "");

  return (
    <section id="contacto" className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto scroll-mt-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-10"
      >
        <span className="badge mb-3">Contacto</span>
        <h2 className="section-title">Hablemos de tu proyecto</h2>
        <p className="section-subtitle">
          Cuéntanos sobre tu empresa y te ayudamos a encontrar la solución ideal.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-5 gap-6 items-stretch">

        {/* Left panel — contact info */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="lg:col-span-2 rounded-2xl overflow-hidden relative flex flex-col justify-between p-7"
          style={{ background: "linear-gradient(145deg, var(--color-primary-dark), var(--color-primary))" }}
        >
          {/* decorative blob */}
          <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full opacity-20 pointer-events-none"
            style={{ background: "var(--color-primary-light)" }} />

          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-6 text-white/60">
              Canales de contacto
            </p>

            <div className="space-y-4">
              {/* WhatsApp */}
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 group"
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(255,255,255,0.15)" }}>
                  {/* WhatsApp brand SVG */}
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.124 1.532 5.856L.057 23.887a.5.5 0 0 0 .608.61l6.174-1.61A11.934 11.934 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 0 1-5.006-1.372l-.36-.214-3.726.972.998-3.632-.234-.374A9.818 9.818 0 0 1 2.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/>
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white/60 leading-none mb-0.5">WhatsApp</p>
                  <p className="text-sm font-bold text-white truncate">{config.whatsapp}</p>
                </div>
                <ArrowUpRight size={14} className="text-white/40 group-hover:text-white transition-colors flex-shrink-0" />
              </a>

              {/* Email */}
              <a
                href={`mailto:${config.email}`}
                className="flex items-center gap-3 group"
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(255,255,255,0.15)" }}>
                  {/* Envelope SVG */}
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2"/>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white/60 leading-none mb-0.5">Correo</p>
                  <p className="text-sm font-bold text-white truncate">{config.email}</p>
                </div>
                <ArrowUpRight size={14} className="text-white/40 group-hover:text-white transition-colors flex-shrink-0" />
              </a>

              {/* Location */}
              <a
                href={MAP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 group"
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(255,255,255,0.15)" }}>
                  {/* Map pin SVG */}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white/60 leading-none mb-0.5">Ubicación</p>
                  <p className="text-sm font-bold text-white">{config.direccion}</p>
                </div>
                <ArrowUpRight size={14} className="text-white/40 group-hover:text-white transition-colors flex-shrink-0" />
              </a>
            </div>
          </div>

          {/* Bottom note */}
          <p className="text-xs text-white/40 mt-8 leading-relaxed">
            Tiempo de respuesta promedio: menos de 2 horas en días hábiles.
          </p>
        </motion.div>

        {/* Right — form */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.08 }}
          className="lg:col-span-3 card p-6"
        >
          {sent ? (
            <div className="h-full flex flex-col items-center justify-center py-10 text-center">
              <CheckCircle2 size={44} className="mb-3" style={{ color: "#22c55e" }} />
              <h3 className="text-lg font-bold mb-1" style={{ color: "var(--color-text)" }}>¡Mensaje enviado!</h3>
              <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>Te contactaremos muy pronto.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: "var(--color-text-muted)" }}>
                    Nombre
                  </label>
                  <input
                    {...register("nombre", { required: "Requerido" })}
                    className="input-field text-sm py-2"
                    placeholder="Tu nombre"
                  />
                  {errors.nombre && (
                    <p className="text-xs mt-1 text-red-500">{errors.nombre.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: "var(--color-text-muted)" }}>
                    Empresa
                  </label>
                  <input
                    {...register("empresa")}
                    className="input-field text-sm py-2"
                    placeholder="Tu empresa"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: "var(--color-text-muted)" }}>
                  Correo electrónico
                </label>
                <input
                  {...register("email", {
                    required: "El correo es obligatorio",
                    pattern: {
                      value: /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/,
                      message: "Ingrese un correo electrónico válido",
                    },
                  })}
                  className="input-field text-sm py-2"
                  placeholder="tu@empresa.com"
                  type="email"
                  style={errors.email ? { borderColor: "#ef4444", boxShadow: "0 0 0 3px #ef444420" } : {}}
                />
                {errors.email && (
                  <p className="text-xs mt-1 font-medium text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: "var(--color-text-muted)" }}>
                  Mensaje
                </label>
                <textarea
                  {...register("mensaje", { required: "Requerido" })}
                  className="input-field text-sm py-2 resize-none"
                  rows={4}
                  placeholder="Cuéntanos sobre tu proyecto..."
                />
                {errors.mensaje && (
                  <p className="text-xs mt-1 text-red-500">{errors.mensaje.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full justify-center text-sm py-2.5"
              >
                <Send size={14} />
                {isSubmitting ? "Enviando..." : "Enviar por WhatsApp"}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
