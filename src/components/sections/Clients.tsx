"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { Cliente } from "@/types";

export default function Clients() {
  const [clients, setClients] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/clientes")
      .then((r) => r.json())
      .then((data) => setClients(data.filter((c: Cliente) => c.Activo)))
      .catch(() => setClients([]))
      .finally(() => setLoading(false));
  }, []);

  if (!loading && clients.length === 0) return null;

  return (
    <section
      id="clientes"
      className="py-24"
      style={{ background: "var(--color-surface-2)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="badge mb-4">Clientes</span>
          <h2 className="section-title">Empresas que confían en nosotros</h2>
          <p className="section-subtitle">
            Organizaciones que han transformado su operación con nuestras soluciones.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center gap-4 flex-wrap">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="w-36 h-20 rounded-2xl animate-pulse"
                style={{ background: "var(--color-border)" }}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-6 justify-center items-center">
            {clients.map((client, i) => (
              <motion.div
                key={client.Id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="card px-10 py-6 flex flex-col items-center gap-4 hover:scale-105 transition-transform cursor-default min-w-[180px]"
              >
                {client.LogoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={client.LogoUrl}
                    alt={client.Nombre}
                    className="w-40 h-16 object-contain"
                    style={{ filter: "var(--logo-filter, none)" }}
                  />
                ) : (
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center text-xl font-black"
                    style={{ background: "var(--color-primary)", color: "#fff" }}
                  >
                    {client.Nombre.charAt(0)}
                  </div>
                )}
                <p className="text-xs font-semibold text-center" style={{ color: "var(--color-text-muted)" }}>
                  {client.Nombre}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
