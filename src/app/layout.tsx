import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import SessionProvider from "@/components/SessionProvider";
import ThemeDecorations from "@/components/ThemeDecorations";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "S&B Solutions – Software Empresarial & TI",
  description:
    "S&B Solutions ofrece ERP empresarial, desarrollo web, infraestructura de servidores, redes y servicios de TI para impulsar tu negocio en Costa Rica.",
  icons: {
    icon: "/images/LOGO.png",
    apple: "/images/LOGO.png",
  },
  openGraph: {
    title: "S&B Solutions",
    description: "Software Empresarial & Servicios TI",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" data-theme="blue" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <SessionProvider>
          <ThemeProvider>
            <ThemeDecorations />
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: "var(--color-surface)",
                  color: "var(--color-text)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "12px",
                },
              }}
            />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
