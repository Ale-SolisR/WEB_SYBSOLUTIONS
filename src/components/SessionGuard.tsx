"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function SessionGuard() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status !== "authenticated") return;

    const check = async () => {
      try {
        const res = await fetch("/api/auth/check-session");
        const { valid } = await res.json();
        if (!valid) {
          toast.error("Tu sesión fue iniciada en otro dispositivo.", { duration: 4000 });
          await signOut({ redirect: false });
          router.push("/login?razon=sesion_reemplazada");
        }
      } catch {
        // Ignore network errors
      }
    };

    const interval = setInterval(check, 30_000);
    return () => clearInterval(interval);
  }, [status, router]);

  return null;
}
