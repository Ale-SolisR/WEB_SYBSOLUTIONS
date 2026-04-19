"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard, Video, Users2, Settings, LogOut,
  ChevronLeft, ChevronRight, Shield, Menu, X,
  Palette, Layers, Calendar, Bot, ExternalLink,
} from "lucide-react";
import { Loader2 } from "lucide-react";

const NAV = [
  { href: "/admin",               icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/secciones",     icon: Layers,          label: "Secciones" },
  { href: "/admin/videos",        icon: Video,           label: "Videos" },
  { href: "/admin/clientes",      icon: Users2,          label: "Clientes" },
  { href: "/admin/temas",         icon: Palette,         label: "Temas" },
  { href: "/admin/citas",         icon: Calendar,        label: "Citas" },
  { href: "/admin/chatbot",       icon: Bot,             label: "Chatbot" },
  { href: "/admin/configuracion", icon: Settings,        label: "Configuración" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") { router.push("/login"); return; }
    if (status === "authenticated" && (session?.user as any)?.role !== "admin") {
      router.push("/portal/capacitaciones");
    }
  }, [status, session, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--color-bg)" }}>
        <Loader2 size={32} className="animate-spin" style={{ color: "var(--color-primary)" }} />
      </div>
    );
  }

  if ((session?.user as any)?.role !== "admin") return null;

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="px-4 py-5 flex items-center gap-3" style={{ borderBottom: "1px solid var(--color-border)" }}>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: "var(--color-primary)" }}
        >
          <Shield size={15} color="#fff" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-sm font-semibold leading-none truncate" style={{ color: "var(--color-text)" }}>
              Panel Admin
            </p>
            <p className="text-xs mt-0.5 truncate" style={{ color: "var(--color-text-muted)" }}>
              S&amp;B Solutions
            </p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all"
              style={active ? {
                background: "color-mix(in srgb, var(--color-primary) 10%, transparent)",
                color: "var(--color-primary)",
              } : {
                color: "var(--color-text-muted)",
              }}
            >
              <Icon
                size={16}
                style={{ color: active ? "var(--color-primary)" : "var(--color-text-muted)", flexShrink: 0 }}
              />
              {!collapsed && <span className="truncate">{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User footer */}
      <div className="px-3 py-4" style={{ borderTop: "1px solid var(--color-border)" }}>
        {!collapsed && (
          <div className="px-3 py-2 mb-2 rounded-lg" style={{ background: "var(--color-surface-2)" }}>
            <p className="text-xs font-semibold truncate" style={{ color: "var(--color-text)" }}>
              {session?.user?.name}
            </p>
            <p className="text-xs truncate mt-0.5" style={{ color: "var(--color-text-muted)" }}>
              {session?.user?.email}
            </p>
          </div>
        )}
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm w-full transition-opacity hover:opacity-70"
          style={{ color: "#ef4444" }}
        >
          <LogOut size={15} style={{ flexShrink: 0 }} />
          {!collapsed && "Cerrar sesión"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen" style={{ background: "var(--color-bg)" }}>
      {/* Desktop sidebar */}
      <aside
        className={`hidden md:flex flex-col relative border-r transition-all duration-300 ${collapsed ? "w-[60px]" : "w-56"}`}
        style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
      >
        <SidebarContent />
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-[72px] w-6 h-6 rounded-full border shadow-sm items-center justify-center z-10 hidden md:flex"
          style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
        >
          {collapsed
            ? <ChevronRight size={11} style={{ color: "var(--color-primary)" }} />
            : <ChevronLeft size={11} style={{ color: "var(--color-primary)" }} />}
        </button>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/40 md:hidden" onClick={() => setMobileOpen(false)} />
          <aside
            className="fixed inset-y-0 left-0 z-50 w-56 md:hidden flex flex-col"
            style={{ background: "var(--color-surface)", borderRight: `1px solid var(--color-border)` }}
          >
            <SidebarContent />
          </aside>
        </>
      )}

      {/* Main */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <div
          className="sticky top-0 z-20 flex items-center gap-3 px-4 md:px-6 h-14 border-b"
          style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
        >
          <button
            className="md:hidden p-1.5 rounded-lg"
            onClick={() => setMobileOpen(true)}
            style={{ color: "var(--color-text-muted)" }}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          <Image
            src="/images/LogoLargo.PNG"
            alt="S&B Solutions"
            width={160}
            height={48}
            className="h-9 w-auto object-contain"
          />
          <div className="ml-auto">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-opacity hover:opacity-70"
              style={{ color: "var(--color-text-muted)", borderColor: "var(--color-border)" }}
            >
              <ExternalLink size={12} /> Ver sitio
            </Link>
          </div>
        </div>

        <div className="flex-1 p-4 md:p-6 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
