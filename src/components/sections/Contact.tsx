"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { MessageCircle, Mail, MapPin, Send, CheckCircle2, ArrowUpRight } from "lucide-react";
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
      .then((data) => setConfig((prev) => ({ ...prev, ...data })))
      .catch(() => {});
  }, []);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } =
    useForm<ContactForm>();

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
    <section id="contacto" className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto scroll-mt-24">
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
                  <MessageCircle size={16} color="#fff" />
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
                  <Mail size={16} color="#fff" />
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
                  <MapPin size={16} color="#fff" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white/60 leading-none mb-0.5">Ubicación</p>
                  <p className="text-sm font-bold text-white">
                    {config.direccion || "San Ramón, Alajuela, Costa Rica"}
                  </p>
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
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                    required: "Requerido",
                    pattern: { value: /^\S+@\S+$/i, message: "Email inválido" },
                  })}
                  className="input-field text-sm py-2"
                  placeholder="tu@empresa.com"
                  type="email"
                />
                {errors.email && (
                  <p className="text-xs mt-1 text-red-500">{errors.email.message}</p>
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
