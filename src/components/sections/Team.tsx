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

const COLORS = ["var(--color-primary)", "#8b5cf6", "#06b6d4", "#10b981"];

function MemberCard({ member, index }: { member: Miembro; index: number }) {
  const [imgError, setImgError] = useState(false);
  const color = COLORS[index % COLORS.length];
  const initials = member.Nombre.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();
  const showImage = member.FotoUrl && !imgError;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="card p-8 text-center group"
    >
      {/* Avatar with ring */}
      <div className="relative mx-auto w-24 h-24 mb-5">
        <div
          className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-110"
          style={{ background: `${color}22`, border: `2px solid ${color}` }}
        />
        {showImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={member.FotoUrl}
            alt={member.Nombre}
            onError={() => setImgError(true)}
            className="w-24 h-24 rounded-full object-cover shadow-xl relative z-10"
          />
        ) : (
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center text-2xl font-black text-white shadow-xl relative z-10"
            style={{ background: `linear-gradient(135deg, ${color}, ${color}99)` }}
          >
            {initials}
          </div>
        )}
      </div>

      <h3 className="text-xl font-bold mb-1" style={{ color: "var(--color-text)" }}>
        {member.Nombre}
      </h3>
      <p className="text-xs font-semibold mb-4 uppercase tracking-wide" style={{ color }}>
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
          className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl transition-all hover:scale-105"
          style={{ background: "#0A66C2", color: "#fff" }}
        >
          <Linkedin size={13} /> Ver perfil
        </a>
      )}
    </motion.div>
  );
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

  return (
    <section id="nosotros" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <span className="badge mb-3">Nuestro Equipo</span>
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
          {team.map((member, i) => (
            <MemberCard key={member.Id} member={member} index={i} />
          ))}
        </div>
      )}
    </section>
  );
}
