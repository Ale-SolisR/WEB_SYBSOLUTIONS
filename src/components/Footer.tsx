import Image from "next/image";
import Link from "next/link";
import { Mail, Phone, MapPin, ExternalLink } from "lucide-react";

const MAP_URL = "https://maps.app.goo.gl/yHKwWn2ctdU1m1GCA";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t mt-20" style={{ background: "var(--color-surface-2)", borderColor: "var(--color-border)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Image
              src="/images/LogoLargo.PNG"
              alt="S&B Solutions"
              width={360}
              height={108}
              className="h-24 w-auto object-contain mb-5"
            />
            <p className="text-sm leading-relaxed mb-6 max-w-xs" style={{ color: "var(--color-text-muted)" }}>
              Transformamos empresas con tecnología de punta. ERP, CRM, desarrollo web e infraestructura TI para impulsar tu crecimiento.
            </p>
            <div className="flex gap-3">
              {[
                { label: "LinkedIn", char: "in" },
                { label: "Facebook", char: "f" },
                { label: "Instagram", char: "ig" },
              ].map((net) => (
                <a key={net.label} href="#" aria-label={net.label}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold transition-all hover:scale-110"
                  style={{ background: "var(--color-primary)", color: "#fff" }}>
                  {net.char}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wide" style={{ color: "var(--color-text)" }}>
              Navegación
            </h3>
            <ul className="space-y-2">
              {[
                { href: "/#servicios", label: "Servicios" },
                { href: "/#productos",  label: "Productos" },
                { href: "/#nosotros",   label: "Nosotros" },
                { href: "/#clientes",   label: "Clientes" },
                { href: "/#citas",      label: "Agendar Demo" },
                { href: "/#contacto",   label: "Contacto" },
                { href: "/login",       label: "Portal" },
                { href: "https://sybsolutions.netlify.app/login", label: "S&B ERP", external: true },
              ].map((l) => (
                <li key={l.href}>
                  {"external" in l && l.external ? (
                    <a href={l.href} target="_blank" rel="noopener noreferrer"
                      className="text-sm hover:opacity-80 flex items-center gap-1"
                      style={{ color: "var(--color-primary)" }}>
                      <ExternalLink size={12} /> {l.label}
                    </a>
                  ) : (
                    <Link href={l.href} className="text-sm hover:opacity-80 flex items-center gap-1"
                      style={{ color: "var(--color-text-muted)" }}>
                      <ExternalLink size={12} /> {l.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wide" style={{ color: "var(--color-text)" }}>
              Contacto
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm" style={{ color: "var(--color-text-muted)" }}>
                <Phone size={15} className="mt-0.5 flex-shrink-0" style={{ color: "var(--color-primary)" }} />
                <a href="https://wa.me/50687457877" className="hover:opacity-80">+506 87457877</a>
              </li>
              <li className="flex items-start gap-2 text-sm" style={{ color: "var(--color-text-muted)" }}>
                <Mail size={15} className="mt-0.5 flex-shrink-0" style={{ color: "var(--color-primary)" }} />
                <a href="mailto:sybsolutionscr@gmail.com" className="hover:opacity-80">sybsolutionscr@gmail.com</a>
              </li>
              <li className="flex items-start gap-2 text-sm" style={{ color: "var(--color-text-muted)" }}>
                <MapPin size={15} className="mt-0.5 flex-shrink-0" style={{ color: "var(--color-primary)" }} />
                <a href={MAP_URL} target="_blank" rel="noopener noreferrer" className="hover:opacity-80 hover:underline">
                  San José, Costa Rica
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderColor: "var(--color-border)" }}>
          <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
            © {year} S&amp;B Solutions. Todos los derechos reservados.
          </p>
          <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
            Hecho con ❤️ en Costa Rica
          </p>
        </div>
      </div>
    </footer>
  );
}
