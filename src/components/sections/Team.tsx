"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Linkedin, Loader2, Users } from "lucide-react";

interface Miembro {
  Id: number;
  Nombre: string;
  Cargo: string;
  Descripcion: string;
  FotoUrl: string;
  LinkedIn: string;
  Activo: boolean;
  Orden: number;
}

export default function Team() {
  const [team, setTeam] = useState<Miembro[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/equipo")
      .then((r) => r.json())
      .then((data) => setTeam(Array.isArray(data) ? data.filter((m: Miembro) => m.Activo) : []))
      .catch(() => setTeam([]))
      .finally(() => setLoading(false));
  }, []);

  const COLORS = ["var(--color-primary)", "#8b5cf6", "#06b6d4", "#10b981"];

  return (
    <section id="nosotros" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <span className="badge mb-4">Nuestro Equipo</span>
        <h2 className="section-title">Los ingenieros detrás de S&amp;B</h2>
        <p className="section-subtitle">
          Co-fundadores apasionados por la tecnología, comprometidos con la excelencia.
        </p>
      </motion.div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 size={36} className="animate-spin" style={{ color: "var(--color-primary)" }} />
        </div>
      ) : team.length === 0 ? (
        <div className="text-center py-20" style={{ color: "var(--color-text-muted)" }}>
          <Users size={40} className="mx-auto mb-3 opacity-30" />
          <p>Sin miembros del equipo configurados.</p>
        </div>
      ) : (
        <div className={`grid gap-8 max-w-4xl mx-auto ${team.length === 1 ? "" : "md:grid-cols-2"}`}>
          {team.map((member, i) => {
            const color = COLORS[i % COLORS.length];
            const initials = member.Nombre.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();
            return (
              <motion.div
                key={member.Id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="card p-8 text-center"
              >
                {/* Avatar */}
                <div className="relative mx-auto w-24 h-24 mb-4">
                  {member.FotoUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={member.FotoUrl}
                      alt={member.Nombre}
                      className="w-24 h-24 rounded-full object-cover shadow-xl"
                    />
                  ) : (
                    <div
                      className="w-24 h-24 rounded-full flex items-center justify-center text-2xl font-black text-white shadow-xl"
                      style={{ background: `linear-gradient(135deg, ${color}, ${color}99)` }}
                    >
                      {initials}
                    </div>
                  )}
                </div>

                <h3 className="text-xl font-bold mb-1" style={{ color: "var(--color-text)" }}>
                  {member.Nombre}
                </h3>
                <p className="text-xs font-medium mb-4 leading-snug" style={{ color }}>
                  {member.Cargo}
                </p>
                {member.Descripcion && (
                  <p className="text-sm leading-relaxed mb-6 text-left" style={{ color: "var(--color-text-muted)" }}>
                    {member.Descripcion}
                  </p>
                )}
                {member.LinkedIn && (
                  <a
                    href={member.LinkedIn}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-xl border transition-opacity hover:opacity-70"
                    style={{ borderColor: color, color }}
                  >
                    <Linkedin size={13} /> LinkedIn
                  </a>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </section>
  );
}
