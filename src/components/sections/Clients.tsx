"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { Cliente } from "@/types";

export default function Clients() {
  const [clients, setClients] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/clientes")
      .then((r) => r.json())
      .then((data) => setClients(data.filter((c: Cliente) => c.Activo)))
      .catch(() => setClients([]))
      .finally(() => setLoading(false));
  }, []);

  if (!loading && clients.length === 0) return null;

  // Repeat enough times so the track always fills the viewport, then duplicate for seamless loop
  const minRepeat = Math.max(1, Math.ceil(10 / (clients.length || 1)));
  const baseItems = clients.length > 0
    ? Array.from({ length: minRepeat }, () => clients).flat()
    : [];
  const items = [...baseItems, ...baseItems];

  return (
    <section id="clientes" className="py-16 scroll-mt-24" style={{ background: "var(--color-surface-2)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <span className="badge mb-3">Clientes</span>
          <h2 className="section-title">Empresas que confían en nosotros</h2>
          <p className="section-subtitle">
            Organizaciones que han transformado su operación con nuestras soluciones.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="w-36 h-20 rounded-2xl animate-pulse" style={{ background: "var(--color-border)" }} />
            ))}
          </div>
        ) : (
          <div className="relative overflow-hidden">
            {/* fade edges */}
            <div className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
              style={{ background: "linear-gradient(to right, var(--color-surface-2), transparent)" }} />
            <div className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
              style={{ background: "linear-gradient(to left, var(--color-surface-2), transparent)" }} />

            <div
              ref={trackRef}
              className="flex gap-5 animate-marquee"
              style={{ width: "max-content" }}
            >
              {items.map((client, i) => (
                <div
                  key={`${client.Id}-${i}`}
                  className="flex-shrink-0 card px-6 py-4 flex flex-col items-center justify-center gap-3 w-44"
                  style={{ minHeight: "100px" }}
                >
                  {client.LogoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={client.LogoUrl}
                      alt={client.Nombre}
                      className="w-28 h-12 object-contain"
                    />
                  ) : (
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-black text-white"
                      style={{ background: "var(--color-primary)" }}
                    >
                      {client.Nombre.charAt(0)}
                    </div>
                  )}
                  <p className="text-xs font-semibold text-center leading-tight" style={{ color: "var(--color-text-muted)" }}>
                    {client.Nombre}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
