import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { getPool } from "./db";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Usuario", type: "text" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = credentials.email.trim();
        const password = credentials.password;

        // Check admin credentials first (stored securely in env vars)
        const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();
        if (email.toLowerCase() === adminEmail) {
          const adminPw = process.env.ADMIN_PASSWORD;
          const adminHash = process.env.ADMIN_PASSWORD_HASH;
          let isValid = false;
          // Support both plaintext (dev) and bcrypt hash (production)
          if (adminHash) {
            isValid = await bcrypt.compare(password, adminHash);
          } else if (adminPw) {
            isValid = password === adminPw;
          }
          if (isValid) {
            return { id: "admin", name: "Administrador SYB", email: adminEmail!, role: "admin" };
          }
          return null;
        }

        // Check regular users in SQL Server
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

          return {
            id: String(user.Id),
            name: user.Nombre || user.Username,
            email: user.Email,
            role: "user",
          };
        } catch (err) {
          console.error("Auth DB error:", err);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = (user as any).role;
      return token;
    },
    async session({ session, token }) {
      if (session.user) (session.user as any).role = token.role;
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
};
