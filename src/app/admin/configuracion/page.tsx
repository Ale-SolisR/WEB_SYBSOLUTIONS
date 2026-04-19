"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Save, Loader2, Phone, Mail, MapPin, Linkedin, Facebook, Instagram } from "lucide-react";
import toast from "react-hot-toast";

interface ConfigForm {
  whatsapp: string;
  email: string;
  direccion: string;
  facebook: string;
  linkedin: string;
  instagram: string;
}

const CONTACT_FIELDS = [
  { key: "whatsapp",  label: "WhatsApp",   icon: Phone,     placeholder: "+506 87457877",        type: "text" },
  { key: "email",     label: "Email",       icon: Mail,      placeholder: "info@empresa.com",     type: "email" },
  { key: "direccion", label: "Dirección",   icon: MapPin,    placeholder: "San José, Costa Rica", type: "text" },
] as const;

const SOCIAL_FIELDS = [
  { key: "linkedin",  label: "LinkedIn",  icon: Linkedin,  placeholder: "https://linkedin.com/...",  type: "url" },
  { key: "facebook",  label: "Facebook",  icon: Facebook,  placeholder: "https://facebook.com/...",  type: "url" },
  { key: "instagram", label: "Instagram", icon: Instagram, placeholder: "https://instagram.com/...", type: "url" },
] as const;

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

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold" style={{ color: "var(--color-text)" }}>Configuración</h1>
        <p className="text-sm mt-0.5" style={{ color: "var(--color-text-muted)" }}>
          Información de contacto y redes sociales del sitio
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 size={28} className="animate-spin" style={{ color: "var(--color-primary)" }} />
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Contact */}
          <div className="card p-5 space-y-4">
            <h2 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>
              Contacto
            </h2>
            {CONTACT_FIELDS.map(({ key, label, icon: Icon, placeholder, type }) => (
              <div key={key}>
                <label className="flex items-center gap-2 text-sm font-medium mb-1.5" style={{ color: "var(--color-text)" }}>
                  <Icon size={13} style={{ color: "var(--color-primary)" }} /> {label}
                </label>
                <input {...register(key)} type={type} className="input-field text-sm" placeholder={placeholder} />
              </div>
            ))}
          </div>

          {/* Social */}
          <div className="card p-5 space-y-4">
            <h2 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>
              Redes Sociales
            </h2>
            {SOCIAL_FIELDS.map(({ key, label, icon: Icon, placeholder, type }) => (
              <div key={key}>
                <label className="flex items-center gap-2 text-sm font-medium mb-1.5" style={{ color: "var(--color-text)" }}>
                  <Icon size={13} style={{ color: "var(--color-primary)" }} /> {label}
                </label>
                <input {...register(key)} type={type} className="input-field text-sm" placeholder={placeholder} />
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
              {saving ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
