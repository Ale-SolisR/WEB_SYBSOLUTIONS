import Image from "next/image";
import Link from "next/link";
import { Mail, Phone, MapPin, ExternalLink } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="border-t mt-20"
      style={{ background: "var(--color-surface-2)", borderColor: "var(--color-border)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Image
              src="/images/LogoLargo.PNG"
              alt="SYB Solutions"
              width={180}
              height={54}
              className="h-12 w-auto object-contain mb-4"
            />
            <p className="text-sm leading-relaxed mb-6 max-w-xs" style={{ color: "var(--color-text-muted)" }}>
              Transformamos empresas con tecnología de punta. ERP, CRM, desarrollo web e infraestructura TI para impulsar tu crecimiento.
            </p>
            <div className="flex gap-3">
              {["linkedin", "facebook", "instagram"].map((net) => (
                <a
                  key={net}
                  href="#"
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold transition-all hover:scale-110"
                  style={{ background: "var(--color-primary)", color: "#fff" }}
                  aria-label={net}
                >
                  {net[0].toUpperCase()}
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
                { href: "/#productos", label: "Productos" },
                { href: "/#nosotros",  label: "Nosotros" },
                { href: "/#clientes",  label: "Clientes" },
                { href: "/#contacto",  label: "Contacto" },
                { href: "/login",      label: "Portal" },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm hover:opacity-80 transition-opacity flex items-center gap-1"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    <ExternalLink size={12} /> {l.label}
                  </Link>
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
                <span>San José, Costa Rica</span>
              </li>
            </ul>
          </div>
        </div>

        <div
          className="border-t mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderColor: "var(--color-border)" }}
        >
          <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
            © {year} SYB Solutions. Todos los derechos reservados.
          </p>
          <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
            Hecho con ❤️ en Costa Rica
          </p>
        </div>
      </div>
    </footer>
  );
}
