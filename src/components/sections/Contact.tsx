"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { MessageCircle, Mail, MapPin, Send, CheckCircle } from "lucide-react";
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

export default function Contact() {
  const [config, setConfig] = useState<Config>({ whatsapp: "+506 87457877", email: "sybsolutionscr@gmail.com", direccion: "San José, Costa Rica" });
  const [sent, setSent] = useState(false);

  useEffect(() => {
    fetch("/api/configuracion")
      .then((r) => r.json())
      .then((data) => setConfig((prev) => ({ ...prev, ...data })))
      .catch(() => {});
  }, []);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ContactForm>();

  const onSubmit = async (data: ContactForm) => {
    // Open WhatsApp with pre-filled message
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
    <section id="contacto" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <span className="badge mb-4">Contacto</span>
        <h2 className="section-title">Hablemos de tu proyecto</h2>
        <p className="section-subtitle">
          Cuéntanos sobre tu empresa y te ayudamos a encontrar la solución ideal.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-12 items-start">
        {/* Info */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <div className="card p-6">
            <h3 className="font-bold text-lg mb-4" style={{ color: "var(--color-text)" }}>Comunícate con nosotros</h3>
            <div className="space-y-4">
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-2xl transition-all hover:scale-[1.02]"
                style={{ background: "#25D366" + "18", border: "1px solid #25D36630" }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "#25D366" }}>
                  <MessageCircle size={20} color="#fff" />
                </div>
                <div>
                  <p className="font-semibold text-sm" style={{ color: "var(--color-text)" }}>WhatsApp</p>
                  <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>{config.whatsapp}</p>
                </div>
              </a>

              <a
                href={`mailto:${config.email}`}
                className="flex items-center gap-4 p-4 rounded-2xl transition-all hover:scale-[1.02]"
                style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)" }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "var(--color-primary)" }}>
                  <Mail size={20} color="#fff" />
                </div>
                <div>
                  <p className="font-semibold text-sm" style={{ color: "var(--color-text)" }}>Correo electrónico</p>
                  <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>{config.email}</p>
                </div>
              </a>

              <div
                className="flex items-center gap-4 p-4 rounded-2xl"
                style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)" }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "var(--color-accent)" }}>
                  <MapPin size={20} color="#fff" />
                </div>
                <div>
                  <p className="font-semibold text-sm" style={{ color: "var(--color-text)" }}>Ubicación</p>
                  <a
                    href="https://maps.app.goo.gl/yHKwWn2ctdU1m1GCA"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm hover:underline"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    {config.direccion || "San José, Costa Rica"}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="card p-8"
        >
          {sent ? (
            <div className="text-center py-8">
              <CheckCircle size={56} className="mx-auto mb-4" style={{ color: "#22c55e" }} />
              <h3 className="text-xl font-bold mb-2" style={{ color: "var(--color-text)" }}>¡Mensaje enviado!</h3>
              <p style={{ color: "var(--color-text-muted)" }}>Te contactaremos muy pronto.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--color-text)" }}>Nombre *</label>
                  <input
                    {...register("nombre", { required: "Requerido" })}
                    className="input-field"
                    placeholder="Tu nombre"
                  />
                  {errors.nombre && <p className="text-xs mt-1 text-red-500">{errors.nombre.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--color-text)" }}>Empresa</label>
                  <input {...register("empresa")} className="input-field" placeholder="Tu empresa" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--color-text)" }}>Email *</label>
                <input
                  {...register("email", { required: "Requerido", pattern: { value: /^\S+@\S+$/i, message: "Email inválido" } })}
                  className="input-field"
                  placeholder="tu@empresa.com"
                  type="email"
                />
                {errors.email && <p className="text-xs mt-1 text-red-500">{errors.email.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--color-text)" }}>Mensaje *</label>
                <textarea
                  {...register("mensaje", { required: "Requerido" })}
                  className="input-field resize-none"
                  rows={5}
                  placeholder="Cuéntanos sobre tu proyecto..."
                />
                {errors.mensaje && <p className="text-xs mt-1 text-red-500">{errors.mensaje.message}</p>}
              </div>
              <button type="submit" disabled={isSubmitting} className="btn-primary w-full justify-center">
                <Send size={16} /> {isSubmitting ? "Enviando..." : "Enviar por WhatsApp"}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
