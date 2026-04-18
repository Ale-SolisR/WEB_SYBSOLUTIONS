"use client";

import { motion } from "framer-motion";
import { Linkedin, Code2, Server } from "lucide-react";

const TEAM = [
  {
    name: "Luis Alejandro Solís R.",
    role: "Co-Fundador · Software Engineer & Systems Administrator",
    bio: "Ingeniero en Informática Empresarial con más de 2 años liderando infraestructura tecnológica, desarrollo backend y administración de sistemas ERP en entornos productivos. Especialista en .NET Core, C#, APIs REST, SQL Server y Azure DevOps. Ha diseñado e implementado soluciones que automatizan procesos críticos, integrando sistemas ERP con bases de datos de alto rendimiento y desplegando arquitecturas en la nube bajo metodologías ágiles (Scrum/Kanban).",
    skills: [".NET Core", "C#", "SQL Server", "Azure DevOps", "APIs REST"],
    icon: Server,
    color: "var(--color-primary)",
    initials: "LS",
  },
  {
    name: "Josué Barboza S.",
    role: "Co-Fundador · Full Stack Developer & DevOps Engineer",
    bio: "Ingeniero de software especializado en desarrollo web full stack e infraestructura de redes. Experto en diseño e implementación de sistemas escalables, gestión de servidores y redes empresariales (LAN/WAN, UniFi). Con dominio de Java, JavaScript, frameworks modernos y plataformas cloud, garantiza que cada solución sea segura, eficiente y preparada para crecer junto al negocio.",
    skills: ["Java", "JavaScript", "DevOps", "Cloud", "Redes LAN/WAN"],
    icon: Code2,
    color: "#8b5cf6",
    initials: "JB",
  },
];

export default function Team() {
  return (
    <section id="nosotros" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <span className="badge mb-4">Nuestro Equipo</span>
        <h2 className="section-title">Los ingenieros detrás de SYB</h2>
        <p className="section-subtitle">
          Dos co-fundadores apasionados por la tecnología, comprometidos con la excelencia.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {TEAM.map((member, i) => {
          const Icon = member.icon;
          return (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="card p-8 text-center"
            >
              {/* Avatar */}
              <div className="relative mx-auto w-24 h-24 mb-4">
                <div
                  className="w-24 h-24 rounded-full flex items-center justify-center text-2xl font-black text-white shadow-xl"
                  style={{ background: `linear-gradient(135deg, ${member.color}, ${member.color}99)` }}
                >
                  {member.initials}
                </div>
                <div
                  className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center shadow"
                  style={{ background: member.color }}
                >
                  <Icon size={14} color="#fff" />
                </div>
              </div>

              <h3 className="text-xl font-bold mb-1" style={{ color: "var(--color-text)" }}>
                {member.name}
              </h3>
              <p className="text-xs font-medium mb-4 leading-snug" style={{ color: member.color }}>
                {member.role}
              </p>
              <p className="text-sm leading-relaxed mb-6 text-left" style={{ color: "var(--color-text-muted)" }}>
                {member.bio}
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {member.skills.map((s) => (
                  <span
                    key={s}
                    className="text-xs px-2.5 py-1 rounded-lg font-medium"
                    style={{ background: `${member.color}15`, color: member.color }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
