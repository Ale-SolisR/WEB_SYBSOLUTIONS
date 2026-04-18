"use client";

import { useState } from "react";
import { Play, X, Clock } from "lucide-react";
import Image from "next/image";
import type { Video } from "@/types";
import { getYoutubeThumbnail, getYoutubeEmbedUrl } from "@/lib/youtube";

interface VideoCardProps {
  video: Video;
}

export default function VideoCard({ video }: VideoCardProps) {
  const [playing, setPlaying] = useState(false);
  const thumbnail = getYoutubeThumbnail(video.YoutubeId);
  const embedUrl = getYoutubeEmbedUrl(video.YoutubeId);

  return (
    <>
      <div className="card overflow-hidden group cursor-pointer" onClick={() => setPlaying(true)}>
        {/* Thumbnail */}
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={thumbnail}
            alt={video.Titulo}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${video.YoutubeId}/hqdefault.jpg`;
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.3)" }}>
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-transform group-hover:scale-110"
              style={{ background: "var(--color-primary)" }}
            >
              <Play size={24} fill="#fff" color="#fff" className="ml-1" />
            </div>
          </div>
          {video.Categoria && (
            <div className="absolute top-3 left-3">
              <span className="badge text-xs">{video.Categoria}</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-5">
          <h3 className="font-bold text-base mb-1 line-clamp-2" style={{ color: "var(--color-text)" }}>
            {video.Titulo}
          </h3>
          {video.Descripcion && (
            <p className="text-sm line-clamp-2" style={{ color: "var(--color-text-muted)" }}>
              {video.Descripcion}
            </p>
          )}
        </div>
      </div>

      {/* Modal player */}
      {playing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
          onClick={() => setPlaying(false)}
        >
          <div className="relative w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setPlaying(false)}
              className="absolute -top-12 right-0 text-white hover:opacity-70 transition-opacity"
            >
              <X size={28} />
            </button>
            <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl">
              <iframe
                src={`${embedUrl}&autoplay=1`}
                title={video.Titulo}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
            <div className="mt-4 text-center">
              <h3 className="text-white font-bold text-lg">{video.Titulo}</h3>
              {video.Descripcion && (
                <p className="text-gray-300 text-sm mt-1">{video.Descripcion}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
