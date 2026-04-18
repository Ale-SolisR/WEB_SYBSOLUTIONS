"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import type { Theme } from "@/types";

interface ThemeContextValue {
  theme: Theme;
  setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "blue",
  setTheme: () => {},
});

/** Auto-detects seasonal theme based on current date */
function detectSeasonalTheme(): Theme | null {
  const now = new Date();
  const month = now.getMonth() + 1; // 1-12
  const day = now.getDate();
  if (month === 12) return "christmas";
  if (month === 2 && day <= 14) return "valentine";
  return null;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("blue");

  useEffect(() => {
    const saved = localStorage.getItem("syb-theme") as Theme | null;
    const seasonal = detectSeasonalTheme();
    const initial = saved || seasonal || "blue";
    setThemeState(initial);
    document.documentElement.setAttribute("data-theme", initial);
  }, []);

  const setTheme = (t: Theme) => {
    setThemeState(t);
    localStorage.setItem("syb-theme", t);
    document.documentElement.setAttribute("data-theme", t);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
