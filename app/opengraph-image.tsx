import { ImageResponse } from "next/og";
import { store } from "@/shared/products";

export const alt = `${store.brand} — Premium Digital Products`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#0a0a0b",
          backgroundImage:
            "radial-gradient(900px 500px at 20% -10%, rgba(124,92,255,0.45), transparent 60%)",
          color: "#f4f4f5",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontSize: 26,
            color: "#a1a1aa",
            marginBottom: 28,
          }}
        >
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 4,
              background: "#7c5cff",
            }}
          />
          {store.brand}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 84,
            fontWeight: 700,
            letterSpacing: "-0.04em",
            lineHeight: 1.05,
            maxWidth: 1000,
          }}
        >
          <span>Premium digital products,</span>
          <span style={{ color: "#7c5cff" }}>delivered instantly.</span>
        </div>
        <div
          style={{
            fontSize: 32,
            color: "#a1a1aa",
            marginTop: 28,
            maxWidth: 760,
          }}
        >
          {store.blurb}
        </div>
      </div>
    ),
    { ...size }
  );
}
