"use client";

import { useTheme } from "@/contexts/ThemeContext";

// Pre-computed values to avoid hydration mismatch

const SNOWFLAKES = [
  { left: "3%",  delay: 0,   dur: 8,  size: 18, char: "❄", opacity: 0.75 },
  { left: "8%",  delay: 1.5, dur: 11, size: 11, char: "❅", opacity: 0.5  },
  { left: "14%", delay: 3,   dur: 9,  size: 22, char: "❆", opacity: 0.65 },
  { left: "21%", delay: 0.5, dur: 14, size: 10, char: "❄", opacity: 0.4  },
  { left: "28%", delay: 4,   dur: 8,  size: 16, char: "✦", opacity: 0.55 },
  { left: "35%", delay: 2,   dur: 12, size: 13, char: "❅", opacity: 0.7  },
  { left: "42%", delay: 5.5, dur: 10, size: 20, char: "❄", opacity: 0.6  },
  { left: "50%", delay: 1,   dur: 13, size: 12, char: "❆", opacity: 0.45 },
  { left: "57%", delay: 3.5, dur: 8,  size: 24, char: "❄", opacity: 0.5  },
  { left: "64%", delay: 0,   dur: 11, size: 14, char: "✦", opacity: 0.7  },
  { left: "71%", delay: 2.5, dur: 9,  size: 16, char: "❅", opacity: 0.4  },
  { left: "78%", delay: 4.5, dur: 13, size: 10, char: "❄", opacity: 0.6  },
  { left: "85%", delay: 1.5, dur: 10, size: 19, char: "❆", opacity: 0.5  },
  { left: "91%", delay: 3,   dur: 8,  size: 14, char: "❄", opacity: 0.7  },
  { left: "96%", delay: 5,   dur: 12, size: 16, char: "❅", opacity: 0.4  },
  { left: "18%", delay: 6,   dur: 9,  size: 12, char: "✦", opacity: 0.6  },
  { left: "55%", delay: 2.8, dur: 10, size: 20, char: "❆", opacity: 0.55 },
  { left: "74%", delay: 0.8, dur: 15, size: 11, char: "❄", opacity: 0.5  },
];

const LIGHTS = [
  "#ef4444","#22c55e","#facc15","#ef4444","#3b82f6","#22c55e",
  "#facc15","#ef4444","#22c55e","#3b82f6","#facc15","#ef4444",
  "#22c55e","#3b82f6","#facc15","#22c55e","#ef4444","#3b82f6",
];

const HEARTS = [
  { left: "4%",  delay: 0,   dur: 7,  size: 20, char: "❤", color: "#be185d" },
  { left: "11%", delay: 2,   dur: 10, size: 14, char: "♥", color: "#f43f5e" },
  { left: "19%", delay: 4,   dur: 8,  size: 24, char: "❤", color: "#db2777" },
  { left: "27%", delay: 1,   dur: 12, size: 12, char: "♥", color: "#be185d" },
  { left: "34%", delay: 3,   dur: 9,  size: 18, char: "❣", color: "#f43f5e" },
  { left: "41%", delay: 5,   dur: 7,  size: 16, char: "❤", color: "#db2777" },
  { left: "49%", delay: 0.5, dur: 11, size: 22, char: "♥", color: "#be185d" },
  { left: "56%", delay: 2.5, dur: 8,  size: 14, char: "❤", color: "#f43f5e" },
  { left: "63%", delay: 4.5, dur: 10, size: 18, char: "♥", color: "#db2777" },
  { left: "70%", delay: 1.5, dur: 9,  size: 12, char: "❣", color: "#be185d" },
  { left: "77%", delay: 3.5, dur: 12, size: 20, char: "❤", color: "#f43f5e" },
  { left: "84%", delay: 0,   dur: 7,  size: 16, char: "♥", color: "#db2777" },
  { left: "91%", delay: 2,   dur: 11, size: 24, char: "❤", color: "#be185d" },
  { left: "96%", delay: 5.5, dur: 9,  size: 14, char: "♥", color: "#f43f5e" },
];

const EASTER_ITEMS = [
  { left: "4%",  top: "22%", delay: 0,   dur: 4,   size: 28, char: "🥚", anim: "floatBounce" },
  { left: "11%", top: "58%", delay: 1,   dur: 5,   size: 24, char: "🌸", anim: "sway"         },
  { left: "18%", top: "30%", delay: 2,   dur: 3.5, size: 22, char: "🦋", anim: "driftButterfly"},
  { left: "26%", top: "70%", delay: 0.5, dur: 4.5, size: 30, char: "🐣", anim: "floatBounce" },
  { left: "34%", top: "15%", delay: 3,   dur: 4,   size: 20, char: "🌷", anim: "sway"         },
  { left: "42%", top: "52%", delay: 1.5, dur: 5,   size: 26, char: "🥚", anim: "floatBounce" },
  { left: "50%", top: "25%", delay: 2.5, dur: 3,   size: 18, char: "🌼", anim: "twinklePulse" },
  { left: "58%", top: "65%", delay: 0,   dur: 4,   size: 24, char: "🦋", anim: "driftButterfly"},
  { left: "66%", top: "38%", delay: 1,   dur: 5,   size: 28, char: "🥚", anim: "floatBounce" },
  { left: "74%", top: "55%", delay: 3.5, dur: 4,   size: 22, char: "🌸", anim: "sway"         },
  { left: "81%", top: "20%", delay: 2,   dur: 3.5, size: 20, char: "🐰", anim: "floatBounce" },
  { left: "88%", top: "68%", delay: 1.5, dur: 4.5, size: 24, char: "🌷", anim: "twinklePulse" },
  { left: "94%", top: "42%", delay: 0.5, dur: 5,   size: 26, char: "🥚", anim: "floatBounce" },
];

function Christmas() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[5] overflow-hidden">
      {/* Falling snowflakes */}
      {SNOWFLAKES.map((s, i) => (
        <span
          key={i}
          style={{
            position: "absolute",
            top: "-40px",
            left: s.left,
            fontSize: `${s.size}px`,
            opacity: s.opacity,
            color: "#e0f2fe",
            animation: `snowfall ${s.dur}s ${s.delay}s linear infinite`,
            userSelect: "none",
          }}
        >
          {s.char}
        </span>
      ))}

      {/* Christmas light string across top */}
      <div style={{ position: "absolute", top: "72px", left: 0, right: 0, display: "flex", justifyContent: "space-around", alignItems: "flex-end", padding: "0 16px" }}>
        {/* wire */}
        <div style={{ position: "absolute", top: "4px", left: 0, right: 0, height: "2px", background: "rgba(0,0,0,0.25)" }} />
        {LIGHTS.map((color, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ width: "1px", height: "10px", background: "rgba(0,0,0,0.3)" }} />
            <div
              style={{
                width: "10px",
                height: "14px",
                borderRadius: "50% 50% 50% 50% / 40% 40% 60% 60%",
                background: color,
                boxShadow: `0 0 6px 2px ${color}`,
                animation: `christmasLights ${1 + (i % 4) * 0.4}s ${(i * 0.15) % 1.5}s ease-in-out infinite`,
              }}
            />
          </div>
        ))}
      </div>

      {/* Bottom-corner trees */}
      <span style={{ position: "fixed", bottom: "12px", left: "16px", fontSize: "48px", opacity: 0.35, userSelect: "none" }}>🎄</span>
      <span style={{ position: "fixed", bottom: "12px", right: "16px", fontSize: "48px", opacity: 0.35, userSelect: "none" }}>🎄</span>

      {/* Twinkling star */}
      <span style={{ position: "fixed", top: "78px", left: "50%", transform: "translateX(-50%)", fontSize: "20px", animation: "twinklePulse 1.5s ease-in-out infinite", userSelect: "none" }}>⭐</span>
    </div>
  );
}

function Valentine() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[5] overflow-hidden">
      {/* Floating hearts from bottom */}
      {HEARTS.map((h, i) => (
        <span
          key={i}
          style={{
            position: "absolute",
            bottom: "-40px",
            left: h.left,
            fontSize: `${h.size}px`,
            color: h.color,
            opacity: 0.8,
            animation: `floatUp ${h.dur}s ${h.delay}s ease-in-out infinite`,
            userSelect: "none",
          }}
        >
          {h.char}
        </span>
      ))}

      {/* Corner roses */}
      <span style={{ position: "fixed", top: "80px", left: "12px", fontSize: "40px", opacity: 0.4, animation: "twinklePulse 3s ease-in-out infinite", userSelect: "none" }}>🌹</span>
      <span style={{ position: "fixed", top: "80px", right: "12px", fontSize: "40px", opacity: 0.4, animation: "twinklePulse 3s 1.5s ease-in-out infinite", userSelect: "none" }}>🌹</span>

      {/* Big heart center-top */}
      <span style={{ position: "fixed", top: "78px", left: "50%", transform: "translateX(-50%)", fontSize: "24px", animation: "twinklePulse 2s ease-in-out infinite", color: "#be185d", userSelect: "none" }}>💝</span>
    </div>
  );
}

function Easter() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[5] overflow-hidden">
      {EASTER_ITEMS.map((e, i) => (
        <span
          key={i}
          style={{
            position: "absolute",
            top: e.top,
            left: e.left,
            fontSize: `${e.size}px`,
            opacity: 0.55,
            animation: `${e.anim} ${e.dur}s ${e.delay}s ease-in-out infinite`,
            userSelect: "none",
          }}
        >
          {e.char}
        </span>
      ))}

      {/* Bottom corner bunnies */}
      <span style={{ position: "fixed", bottom: "12px", left: "16px", fontSize: "44px", opacity: 0.4, animation: "floatBounce 3s ease-in-out infinite", userSelect: "none" }}>🐰</span>
      <span style={{ position: "fixed", bottom: "12px", right: "16px", fontSize: "44px", opacity: 0.4, animation: "floatBounce 3s 1.5s ease-in-out infinite", userSelect: "none" }}>🐣</span>
    </div>
  );
}

export default function ThemeDecorations() {
  const { theme } = useTheme();

  if (theme === "christmas") return <Christmas />;
  if (theme === "valentine") return <Valentine />;
  if (theme === "easter")    return <Easter />;
  return null;
}
