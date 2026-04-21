"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff, Lock, Mail, ArrowLeft, Loader2, AlertTriangle, Send, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/portal/capacitaciones";
  const razon = searchParams.get("razon");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sessionConflict, setSessionConflict] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [helpEmail, setHelpEmail] = useState("");
  const [helpMsg, setHelpMsg] = useState("");
  const [helpSending, setHelpSending] = useState(false);
  const [helpSent, setHelpSent] = useState(false);

  const doSignIn = async (forceNew = false) => {
    setLoading(true);
    setSessionConflict(false);
    try {
      const result = await signIn("credentials", {
        email: email.trim(),
        password,
        forceNew: forceNew ? "true" : "false",
        redirect: false,
      });

      if (result?.error) {
        // Detect SESSION_CONFLICT — may come as the error message or encoded in URL
        const isConflict =
          result.error === "SESSION_CONFLICT" ||
          (result.url && result.url.includes("SESSION_CONFLICT"));

        if (isConflict) {
          setSessionConflict(true);
          return;
        }
        toast.error("Credenciales incorrectas. Verifica tu email y contraseña.");
      } else {
        toast.success("¡Bienvenido!");
        window.location.href = callbackUrl;
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await doSignIn(false);
  };

  const handleForceLogin = async () => {
    await doSignIn(true);
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

          {/* Session replaced notice */}
          {razon === "sesion_reemplazada" && (
            <div className="mb-4 p-3 rounded-xl text-xs flex items-start gap-2"
              style={{ background: "#fef3c7", color: "#92400e", border: "1px solid #fde68a" }}>
              <AlertTriangle size={14} className="mt-0.5 flex-shrink-0" />
              Tu sesión fue cerrada porque iniciaste sesión en otro dispositivo.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Email */}
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

          {/* Session conflict modal */}
          <AnimatePresence>
            {sessionConflict && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="mt-4 p-4 rounded-xl border"
                style={{ background: "var(--color-surface-2)", borderColor: "var(--color-border)" }}
              >
                <div className="flex items-start gap-2 mb-3">
                  <AlertTriangle size={15} className="mt-0.5 flex-shrink-0" style={{ color: "#f59e0b" }} />
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>
                      Sesión activa detectada
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>
                      Ya tienes una sesión abierta en otro dispositivo o navegador. ¿Deseas cerrarla y continuar aquí?
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSessionConflict(false)}
                    className="flex-1 btn-outline text-xs py-2"
                    disabled={loading}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleForceLogin}
                    disabled={loading}
                    className="flex-1 btn-primary text-xs py-2"
                  >
                    {loading ? <Loader2 size={12} className="animate-spin" /> : null}
                    {loading ? "Abriendo..." : "Sí, abrir aquí"}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-4 pt-4 border-t text-xs" style={{ borderColor: "var(--color-border)", color: "var(--color-text-muted)" }}>
            <button
              type="button"
              onClick={() => { setHelpOpen(!helpOpen); setHelpSent(false); setHelpMsg(""); setHelpEmail(""); }}
              className="w-full flex items-center justify-center gap-1.5 hover:opacity-80 transition-opacity"
              style={{ color: "var(--color-text-muted)" }}
            >
              ¿Problemas para ingresar?{" "}
              <span style={{ color: "var(--color-primary)", fontWeight: 600 }}>Contacta al administrador</span>
              <ChevronDown size={12} style={{ color: "var(--color-primary)", transform: helpOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }} />
            </button>

            <AnimatePresence>
              {helpOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  style={{ overflow: "hidden" }}
                >
                  {helpSent ? (
                    <div className="mt-3 p-3 rounded-xl text-center text-xs" style={{ background: "#dcfce7", color: "#166534" }}>
                      ✅ Mensaje enviado. Te contactaremos pronto.
                    </div>
                  ) : (
                    <div className="mt-3 space-y-2">
                      <input
                        type="email"
                        value={helpEmail}
                        onChange={(e) => setHelpEmail(e.target.value)}
                        placeholder="Tu correo para responderte"
                        className="input-field text-xs w-full py-2"
                        style={{ fontSize: "12px" }}
                      />
                      <textarea
                        value={helpMsg}
                        onChange={(e) => setHelpMsg(e.target.value)}
                        placeholder="Describe tu problema brevemente..."
                        rows={3}
                        className="input-field text-xs w-full resize-none py-2"
                        style={{ fontSize: "12px" }}
                      />
                      <button
                        type="button"
                        disabled={helpSending || !helpMsg.trim() || !helpEmail.trim()}
                        onClick={async () => {
                          setHelpSending(true);
                          try {
                            await fetch("/api/auth/help", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ correo: helpEmail.trim(), mensaje: helpMsg.trim() }),
                            });
                            setHelpSent(true);
                          } finally {
                            setHelpSending(false);
                          }
                        }}
                        className="btn-primary w-full justify-center text-xs py-2"
                      >
                        {helpSending ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />}
                        {helpSending ? "Enviando..." : "Enviar mensaje"}
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
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
