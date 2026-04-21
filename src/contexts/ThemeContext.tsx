"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import type { Theme } from "@/types";

interface ThemeContextValue {
  theme: Theme;
  setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "blue",
  setTheme: () => {},
});

function detectSeasonalTheme(): Theme | null {
  const now = new Date();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  if (month === 12) return "christmas";
  if (month === 2 && day <= 14) return "valentine";
  return null;
}

function applyTheme(t: Theme, setFn: (t: Theme) => void) {
  setFn(t);
  if (typeof window !== "undefined") {
    localStorage.setItem("syb-theme", t);
    document.documentElement.setAttribute("data-theme", t);
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("blue");
  const themeRef = useRef<Theme>("blue");

  const setTheme = (t: Theme) => {
    themeRef.current = t;
    applyTheme(t, setThemeState);
  };

  useEffect(() => {
    // Apply localStorage cache immediately to prevent flash
    const cached = localStorage.getItem("syb-theme") as Theme | null;
    const initial = cached || detectSeasonalTheme() || "blue";
    themeRef.current = initial;
    applyTheme(initial, setThemeState);

    // Fetch server theme and keep in sync
    const fetchServerTheme = async () => {
      try {
        const res = await fetch("/api/theme");
        const { theme: serverTheme } = await res.json();
        if (serverTheme && serverTheme !== themeRef.current) {
          themeRef.current = serverTheme;
          applyTheme(serverTheme as Theme, setThemeState);
        }
      } catch {
        // Fail silently — keep current theme
      }
    };

    fetchServerTheme();
    const interval = setInterval(fetchServerTheme, 30_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
