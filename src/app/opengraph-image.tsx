import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import path from "path";

export const alt = "Digiwangsa — Premium Website & Application Development";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const logo = await readFile(
    path.join(process.cwd(), "public", "asset", "logo-digiwangsa.png")
  );
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(circle at 50% 42%, rgba(212,175,55,0.20), rgba(11,10,8,0) 60%), #0b0a08",
          position: "relative",
        }}
      >
        {/* gold frame */}
        <div
          style={{
            position: "absolute",
            inset: 28,
            border: "1px solid rgba(201,162,75,0.35)",
            borderRadius: 24,
          }}
        />

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} width={720} height={480} alt="Digiwangsa" />

        <div
          style={{
            position: "absolute",
            bottom: 56,
            color: "#c9a24b",
            fontSize: 26,
            letterSpacing: 8,
            textTransform: "uppercase",
          }}
        >
          digiwangsa.com
        </div>
      </div>
    ),
    { ...size }
  );
}
