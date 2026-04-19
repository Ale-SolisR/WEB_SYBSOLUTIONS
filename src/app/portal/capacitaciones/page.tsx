"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { BookOpen, Search, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VideoCard from "@/components/VideoCard";
import type { Video } from "@/types";
import { motion } from "framer-motion";

const MODULES = [
  "Todos",
  "POS",
  "Inventario",
  "Ventas",
  "Tesorería",
  "Compras",
  "Cuentas por Cobrar",
  "Cuentas por Pagar",
  "Contabilidad",
  "Reportes",
  "Vendedores",
];

export default function CapacitacionesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [module, setModule] = useState("Todos");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login?callbackUrl=/portal/capacitaciones");
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/videos")
      .then((r) => r.json())
      .then((data) => setVideos(data.filter((v: Video) => v.Activo)))
      .catch(() => setVideos([]))
      .finally(() => setLoading(false));
  }, [status]);

  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--color-bg)" }}>
        <Loader2 size={36} className="animate-spin" style={{ color: "var(--color-primary)" }} />
      </div>
    );
  }

  const filtered = videos.filter((v) => {
    const q = search.toLowerCase();
    const matchSearch = !q || v.Titulo.toLowerCase().includes(q) || v.Descripcion?.toLowerCase().includes(q);
    const matchModule = module === "Todos" || v.Categoria === module;
    return matchSearch && matchModule;
  });

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20 pb-16" style={{ background: "var(--color-bg)" }}>

        {/* Hero strip */}
        <div className="border-b" style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex items-center gap-2 mb-1">
                <BookOpen size={16} style={{ color: "var(--color-primary)" }} />
                <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--color-primary)" }}>
                  Portal de capacitaciones
                </span>
              </div>
              <h1 className="text-2xl font-black mb-0.5" style={{ color: "var(--color-text)" }}>
                Bienvenido, {session?.user?.name?.split(" ")[0]}
              </h1>
              <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                Explora los módulos y aprende a sacarle el máximo provecho al sistema.
              </p>
            </motion.div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

          {/* Search */}
          <div className="relative mb-5">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--color-text-muted)" }} />
            <input
              type="text"
              placeholder="Buscar capacitación..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-9 text-sm py-2 max-w-md"
            />
          </div>

          {/* Module pills */}
          <div className="flex gap-2 flex-wrap mb-8">
            {MODULES.map((m) => (
              <button
                key={m}
                onClick={() => setModule(m)}
                className="text-xs font-semibold px-3 py-1.5 rounded-full border transition-all"
                style={
                  module === m
                    ? {
                        background: "var(--color-primary)",
                        borderColor: "var(--color-primary)",
                        color: "#fff",
                      }
                    : {
                        background: "transparent",
                        borderColor: "var(--color-border)",
                        color: "var(--color-text-muted)",
                      }
                }
              >
                {m}
              </button>
            ))}
          </div>

          {/* Grid */}
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 size={36} className="animate-spin" style={{ color: "var(--color-primary)" }} />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20" style={{ color: "var(--color-text-muted)" }}>
              <BookOpen size={40} className="mx-auto mb-3 opacity-25" />
              <p className="font-medium">Sin resultados</p>
              <p className="text-sm mt-1 opacity-70">Prueba con otro módulo o término de búsqueda.</p>
            </div>
          ) : (
            <motion.div
              key={module + search}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
            >
              {filtered.map((video, i) => (
                <motion.div
                  key={video.Id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <VideoCard video={video} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
