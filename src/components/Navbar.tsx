"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Menu, X, ChevronDown, LogOut, User, Shield, BookOpen } from "lucide-react";
import ThemeSelector from "./ThemeSelector";

const NAV_LINKS = [
  { href: "/#servicios",  label: "Servicios" },
  { href: "/#productos",  label: "Productos" },
  { href: "/#nosotros",   label: "Nosotros" },
  { href: "/#clientes",   label: "Clientes" },
  { href: "/#contacto",   label: "Contacto" },
];

export default function Navbar() {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isAdmin = (session?.user as any)?.role === "admin";

  return (
    <header
      className="fixed top-0 inset-x-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "var(--color-surface)" : "transparent",
        borderBottom: scrolled ? "1px solid var(--color-border)" : "none",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        boxShadow: scrolled ? "0 4px 24px rgba(0,0,0,0.08)" : "none",
      }}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center group">
          <Image
            src="/images/LogoLargo.PNG"
            alt="SYB Solutions"
            width={160}
            height={48}
            className="h-10 w-auto object-contain transition-transform group-hover:scale-105"
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="navbar-link">
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <ThemeSelector />

          {session ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all hover:scale-105"
                style={{ background: "var(--color-primary)", color: "#fff" }}
              >
                {isAdmin ? <Shield size={15} /> : <User size={15} />}
                <span className="hidden sm:inline max-w-24 truncate">
                  {session.user?.name?.split(" ")[0]}
                </span>
                <ChevronDown size={14} />
              </button>

              {userMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                  <div
                    className="absolute right-0 top-12 z-50 w-52 rounded-2xl shadow-2xl border p-2"
                    style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
                  >
                    <div className="px-3 py-2 mb-1 border-b" style={{ borderColor: "var(--color-border)" }}>
                      <p className="text-xs font-semibold" style={{ color: "var(--color-text)" }}>{session.user?.name}</p>
                      <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>{session.user?.email}</p>
                    </div>
                    <Link
                      href="/portal/capacitaciones"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm hover:opacity-80 transition-opacity"
                      style={{ color: "var(--color-text)" }}
                    >
                      <BookOpen size={15} /> Capacitaciones
                    </Link>
                    {isAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm hover:opacity-80 transition-opacity"
                        style={{ color: "var(--color-primary)" }}
                      >
                        <Shield size={15} /> Panel Admin
                      </Link>
                    )}
                    <button
                      onClick={() => { setUserMenuOpen(false); signOut({ callbackUrl: "/" }); }}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm w-full text-left hover:opacity-80 transition-opacity mt-1"
                      style={{ color: "#ef4444" }}
                    >
                      <LogOut size={15} /> Cerrar sesión
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link href="/login" className="btn-primary text-sm py-2 px-4">
              Iniciar sesión
            </Link>
          )}

          {/* Mobile burger */}
          <button
            className="lg:hidden p-2 rounded-xl transition-colors"
            style={{ color: "var(--color-text)" }}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menú"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="lg:hidden border-t px-4 py-4 space-y-1"
          style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-3 rounded-xl text-sm font-medium transition-colors hover:opacity-80"
              style={{ color: "var(--color-text)" }}
            >
              {link.label}
            </Link>
          ))}
          {session && (
            <>
              <Link href="/portal/capacitaciones" onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium"
                style={{ color: "var(--color-primary)" }}>
                <BookOpen size={15} /> Capacitaciones
              </Link>
              {isAdmin && (
                <Link href="/admin" onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium"
                  style={{ color: "var(--color-primary)" }}>
                  <Shield size={15} /> Panel Admin
                </Link>
              )}
            </>
          )}
        </div>
      )}
    </header>
  );
}
