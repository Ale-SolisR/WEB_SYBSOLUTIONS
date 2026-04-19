"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff, Lock, Mail, ArrowLeft, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/portal/capacitaciones";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        email: email.trim(),
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Credenciales incorrectas. Verifica tu email y contraseña.");
      } else {
        toast.success("¡Bienvenido!");
        window.location.href = callbackUrl;
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: "var(--color-bg)" }}
    >
      {/* Background gradient */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-3xl opacity-10" style={{ background: "var(--color-primary)" }} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-3xl opacity-10" style={{ background: "var(--color-accent)" }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm"
      >
        {/* Back link */}
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs mb-5 hover:opacity-70 transition-opacity" style={{ color: "var(--color-text-muted)" }}>
          <ArrowLeft size={14} /> Volver al inicio
        </Link>

        <div className="card p-6">
          {/* Logo */}
          <div className="text-center mb-6">
            <Image
              src="/images/LogoLargo.PNG"
              alt="S&B Solutions"
              width={180}
              height={55}
              className="h-12 w-auto object-contain mx-auto mb-3"
            />
            <h1 className="text-lg font-bold" style={{ color: "var(--color-text)" }}>
              Iniciar sesión
            </h1>
            <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>
              Accede al portal de capacitaciones
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Username / Email */}
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: "var(--color-text)" }}>
                Usuario o correo
              </label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--color-text-muted)" }} />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="username"
                  placeholder="usuario o correo"
                  className="input-field pl-9 text-sm py-2"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: "var(--color-text)" }}>
                Contraseña
              </label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--color-text-muted)" }} />
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="input-field pl-9 pr-9 text-sm py-2"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center mt-1 text-sm py-2"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Lock size={14} />}
              {loading ? "Verificando..." : "Ingresar"}
            </button>
          </form>

          <div className="mt-4 pt-4 border-t text-center text-xs" style={{ borderColor: "var(--color-border)", color: "var(--color-text-muted)" }}>
            ¿Problemas para ingresar?{" "}
            <a href="mailto:sybsolutionscr@gmail.com" className="hover:opacity-80" style={{ color: "var(--color-primary)" }}>
              Contacta al administrador
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--color-bg)" }}>
        <Loader2 size={36} className="animate-spin" style={{ color: "var(--color-primary)" }} />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
