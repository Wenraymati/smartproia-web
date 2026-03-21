import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "SmartProIA — Bots de WhatsApp con IA para tu negocio";
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
              "linear-gradient(rgba(37,211,102,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(37,211,102,0.04) 1px, transparent 1px)",
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
              "radial-gradient(ellipse, rgba(37,211,102,0.18) 0%, transparent 65%)",
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
                color: "#22c55e",
                letterSpacing: "-2px",
              }}
            >
              IA
            </span>
          </div>

          {/* Badge */}
          <div
            style={{
              background: "rgba(37,211,102,0.08)",
              border: "1px solid rgba(37,211,102,0.25)",
              borderRadius: 100,
              padding: "8px 22px",
              color: "#25D366",
              fontSize: 15,
              fontWeight: 600,
              marginBottom: 36,
              display: "flex",
              alignItems: "center",
            }}
          >
            🇨🇱 Bots activos · Operando desde Chile
          </div>

          {/* Headline */}
          <div
            style={{
              fontSize: 58,
              fontWeight: 900,
              color: "#ffffff",
              textAlign: "center",
              lineHeight: 1.1,
              letterSpacing: "-2px",
              marginBottom: 8,
              display: "flex",
            }}
          >
            Bots de WhatsApp con IA
          </div>
          <div
            style={{
              fontSize: 58,
              fontWeight: 900,
              color: "#25D366",
              textAlign: "center",
              lineHeight: 1.1,
              letterSpacing: "-2px",
              marginBottom: 40,
              display: "flex",
            }}
          >
            para tu negocio
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: 22,
              fontWeight: 500,
              color: "#94a3b8",
              textAlign: "center",
              marginBottom: 44,
              display: "flex",
            }}
          >
            Automatizá atención, calificá leads y cerrá más ventas
          </div>

          {/* URL */}
          <div
            style={{
              color: "#334155",
              fontSize: 20,
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
