"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Save, Loader2, Phone, Mail, MapPin, Linkedin, Facebook, Instagram } from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

interface ConfigForm {
  whatsapp: string;
  email: string;
  direccion: string;
  facebook: string;
  linkedin: string;
  instagram: string;
}

export default function AdminConfiguracion() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, reset } = useForm<ConfigForm>();

  useEffect(() => {
    fetch("/api/configuracion")
      .then((r) => r.json())
      .then((data) => { reset(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [reset]);

  const onSubmit = async (data: ConfigForm) => {
    setSaving(true);
    try {
      const res = await fetch("/api/configuracion", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      toast.success("Configuración guardada");
    } catch {
      toast.error("Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  const FIELDS = [
    { key: "whatsapp",  label: "WhatsApp",     icon: Phone,     placeholder: "+506 87457877",            type: "text" },
    { key: "email",     label: "Email",         icon: Mail,      placeholder: "info@empresa.com",         type: "email" },
    { key: "direccion", label: "Dirección",     icon: MapPin,    placeholder: "San José, Costa Rica",     type: "text" },
    { key: "linkedin",  label: "LinkedIn URL",  icon: Linkedin,  placeholder: "https://linkedin.com/...", type: "url" },
    { key: "facebook",  label: "Facebook URL",  icon: Facebook,  placeholder: "https://facebook.com/...", type: "url" },
    { key: "instagram", label: "Instagram URL", icon: Instagram, placeholder: "https://instagram.com/...", type: "url" },
  ] as const;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black" style={{ color: "var(--color-text)" }}>Configuración</h1>
        <p className="mt-1" style={{ color: "var(--color-text-muted)" }}>
          Información de contacto y redes sociales visibles en el sitio web
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 size={36} className="animate-spin" style={{ color: "var(--color-primary)" }} /></div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card p-6 md:p-8 max-w-xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {FIELDS.map(({ key, label, icon: Icon, placeholder, type }) => (
              <div key={key}>
                <label className="flex items-center gap-2 text-sm font-medium mb-1.5" style={{ color: "var(--color-text)" }}>
                  <Icon size={15} style={{ color: "var(--color-primary)" }} /> {label}
                </label>
                <input
                  {...register(key)}
                  type={type}
                  className="input-field"
                  placeholder={placeholder}
                />
              </div>
            ))}
            <button type="submit" disabled={saving} className="btn-primary w-full justify-center mt-2">
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {saving ? "Guardando..." : "Guardar cambios"}
            </button>
          </form>
        </motion.div>
      )}
    </div>
  );
}
