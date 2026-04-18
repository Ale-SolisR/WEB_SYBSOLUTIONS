"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { BookOpen, Search, Filter, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VideoCard from "@/components/VideoCard";
import type { Video } from "@/types";
import { motion } from "framer-motion";

export default function CapacitacionesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todos");

  // Redirect unauthenticated users
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
        <Loader2 size={40} className="animate-spin" style={{ color: "var(--color-primary)" }} />
      </div>
    );
  }

  const categories = ["Todos", ...Array.from(new Set(videos.map((v) => v.Categoria).filter(Boolean)))];
  const filtered = videos.filter((v) => {
    const matchSearch = v.Titulo.toLowerCase().includes(search.toLowerCase()) ||
      v.Descripcion?.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "Todos" || v.Categoria === category;
    return matchSearch && matchCat;
  });

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" style={{ background: "var(--color-bg)" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "var(--color-primary)" }}>
              <BookOpen size={20} color="#fff" />
            </div>
            <div>
              <h1 className="text-3xl font-black" style={{ color: "var(--color-text)" }}>Capacitaciones</h1>
              <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                Hola, {session?.user?.name?.split(" ")[0]} 👋 — Explora nuestro contenido de formación
              </p>
            </div>
          </div>
        </motion.div>

        {/* Search + filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--color-text-muted)" }} />
            <input
              type="text"
              placeholder="Buscar capacitación..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <div className="relative">
            <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--color-text-muted)" }} />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="input-field pl-10 pr-8 appearance-none min-w-40"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 size={40} className="animate-spin" style={{ color: "var(--color-primary)" }} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20" style={{ color: "var(--color-text-muted)" }}>
            <BookOpen size={48} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">No se encontraron videos</p>
            <p className="text-sm mt-1">Intenta con otro término de búsqueda</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filtered.map((video, i) => (
              <motion.div
                key={video.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
              >
                <VideoCard video={video} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>
      <Footer />
    </>
  );
}
