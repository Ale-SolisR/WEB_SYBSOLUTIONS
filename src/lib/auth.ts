import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { getPool, sql } from "./db";

async function trackSession(userId: string, forceNew: boolean): Promise<string | null> {
  try {
    const pool = await getPool();
    const existing = await pool.request()
      .input("UserId", sql.NVarChar, userId)
      .query("SELECT SessionToken FROM web.SESIONES WHERE UserId = @UserId AND Activo = 1");

    if (existing.recordset.length > 0 && !forceNew) {
      throw new Error("SESSION_CONFLICT");
    }

    // Invalidate previous sessions
    await pool.request()
      .input("UserId", sql.NVarChar, userId)
      .query("UPDATE web.SESIONES SET Activo = 0 WHERE UserId = @UserId");

    const sessionToken = crypto.randomUUID();
    await pool.request()
      .input("UserId", sql.NVarChar, userId)
      .input("SessionToken", sql.NVarChar, sessionToken)
      .query("INSERT INTO web.SESIONES (UserId, SessionToken) VALUES (@UserId, @SessionToken)");

    return sessionToken;
  } catch (err) {
    if (err instanceof Error && err.message === "SESSION_CONFLICT") throw err;
    // DB not ready yet — allow login without session tracking
    console.warn("Session tracking unavailable:", (err as Error).message);
    return null;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email:    { label: "Usuario",   type: "text" },
        password: { label: "Contraseña", type: "password" },
        forceNew: { label: "",          type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = credentials.email.trim();
        const password = credentials.password;
        const forceNew = credentials.forceNew === "true";

        // ── Admin ────────────────────────────────────────────────────────────
        const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();
        if (email.toLowerCase() === adminEmail) {
          const adminPw   = process.env.ADMIN_PASSWORD;
          const adminHash = process.env.ADMIN_PASSWORD_HASH;
          let isValid = false;
          if (adminHash)  isValid = await bcrypt.compare(password, adminHash);
          else if (adminPw) isValid = password === adminPw;
          if (!isValid) return null;

          const sessionToken = await trackSession("admin", forceNew);
          return { id: "admin", name: "Administrador SYB", email: adminEmail!, role: "admin", sessionToken };
        }

        // ── Regular users ────────────────────────────────────────────────────
        try {
          const pool = await getPool();
          const result = await pool.request()
            .input("email", email)
            .query(`
              SELECT Id, Username, PasswordHash, Nombre, Email, Activo
              FROM core.USUARIO
              WHERE (Email = @email OR Username = @email) AND Activo = 1
            `);

          const user = result.recordset[0];
          if (!user) return null;

          const isValid = await bcrypt.compare(password, user.PasswordHash);
          if (!isValid) return null;

          const userId = String(user.Id);
          const sessionToken = await trackSession(userId, forceNew);

          return {
            id: userId,
            name: user.Nombre || user.Username,
            email: user.Email,
            role: "user",
            sessionToken,
          };
        } catch (err) {
          if (err instanceof Error && err.message === "SESSION_CONFLICT") throw err;
          console.error("Auth DB error:", err);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.sessionToken = (user as any).sessionToken;
        token.userId = (user as any).id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).sessionToken = token.sessionToken;
        (session.user as any).userId = token.userId ?? token.sub;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error:  "/login",
  },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
};
