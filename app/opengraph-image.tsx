import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "SmartProIA — Señales Crypto con IA";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#030712",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, -apple-system, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Grid lines */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(6,182,212,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.04) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        {/* Glow top */}
        <div
          style={{
            position: "absolute",
            top: -120,
            left: "50%",
            transform: "translateX(-50%)",
            width: 900,
            height: 600,
            background:
              "radial-gradient(ellipse, rgba(6,182,212,0.18) 0%, transparent 65%)",
          }}
        />
        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            padding: "0 80px",
          }}
        >
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", marginBottom: 20 }}>
            <span
              style={{
                fontSize: 52,
                fontWeight: 900,
                color: "#ffffff",
                letterSpacing: "-2px",
              }}
            >
              SmartPro
            </span>
            <span
              style={{
                fontSize: 52,
                fontWeight: 900,
                color: "#06b6d4",
                letterSpacing: "-2px",
              }}
            >
              IA
            </span>
          </div>

          {/* Badge */}
          <div
            style={{
              background: "rgba(6,182,212,0.08)",
              border: "1px solid rgba(6,182,212,0.25)",
              borderRadius: 100,
              padding: "8px 22px",
              color: "#06b6d4",
              fontSize: 15,
              fontWeight: 600,
              marginBottom: 36,
              display: "flex",
              alignItems: "center",
            }}
          >
            🇨🇱 Bot activo · Análisis autónomo 24/7
          </div>

          {/* Headline */}
          <div
            style={{
              fontSize: 60,
              fontWeight: 900,
              color: "#ffffff",
              textAlign: "center",
              lineHeight: 1.1,
              letterSpacing: "-2px",
              marginBottom: 8,
              display: "flex",
            }}
          >
            Señales Crypto con IA
          </div>
          <div
            style={{
              fontSize: 60,
              fontWeight: 900,
              color: "#06b6d4",
              textAlign: "center",
              lineHeight: 1.1,
              letterSpacing: "-2px",
              marginBottom: 40,
              display: "flex",
            }}
          >
            Cada mañana a las 6AM
          </div>

          {/* Signal pills */}
          <div style={{ display: "flex", gap: 14 }}>
            {[
              { text: "🟢 GO", bg: "rgba(20,83,45,0.5)", border: "rgba(34,197,94,0.35)", color: "#4ade80" },
              { text: "🟡 CAUTION", bg: "rgba(66,32,6,0.5)", border: "rgba(234,179,8,0.35)", color: "#facc15" },
              { text: "🔴 NO-GO", bg: "rgba(69,10,10,0.5)", border: "rgba(239,68,68,0.35)", color: "#f87171" },
            ].map((s) => (
              <div
                key={s.text}
                style={{
                  background: s.bg,
                  border: `1px solid ${s.border}`,
                  borderRadius: 12,
                  padding: "14px 28px",
                  color: s.color,
                  fontSize: 22,
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {s.text}
              </div>
            ))}
          </div>

          {/* URL */}
          <div
            style={{
              color: "#334155",
              fontSize: 20,
              marginTop: 44,
              display: "flex",
            }}
          >
            smartproia.com
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
