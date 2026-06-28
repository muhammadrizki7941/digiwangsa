import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

/** Branded 1200x630 OG card: gold-on-dark with eyebrow, title, and meta. */
export function ogCard({
  eyebrow,
  title,
  meta,
}: {
  eyebrow: string;
  title: string;
  meta: string;
}): ImageResponse {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 70,
          background:
            "radial-gradient(circle at 75% 18%, rgba(212,175,55,0.22), rgba(11,10,8,0) 55%), #0b0a08",
          position: "relative",
        }}
      >
        {/* frame */}
        <div
          style={{
            position: "absolute",
            inset: 28,
            border: "1px solid rgba(201,162,75,0.35)",
            borderRadius: 24,
          }}
        />

        {/* brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: 999,
              background: "#d4af37",
            }}
          />
          <span
            style={{
              color: "#f5f1e6",
              fontSize: 30,
              fontWeight: 700,
              letterSpacing: 1,
            }}
          >
            Digiwangsa
          </span>
        </div>

        {/* main */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <span
            style={{
              color: "#c9a24b",
              fontSize: 24,
              letterSpacing: 6,
              textTransform: "uppercase",
            }}
          >
            {eyebrow}
          </span>
          <div
            style={{
              display: "flex",
              color: "#f5f1e6",
              fontSize: 64,
              fontWeight: 700,
              lineHeight: 1.1,
              maxWidth: 1000,
            }}
          >
            {title}
          </div>
        </div>

        {/* footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ color: "#a89e86", fontSize: 26 }}>{meta}</span>
          <span
            style={{
              color: "#c9a24b",
              fontSize: 22,
              letterSpacing: 4,
              textTransform: "uppercase",
            }}
          >
            digiwangsa.com
          </span>
        </div>
      </div>
    ),
    { ...OG_SIZE }
  );
}
