import { ImageResponse } from "next/og";
import { store } from "@/shared/products";
import { listActiveProducts } from "@/lib/products";

export const alt = `${store.brand} — Premium Digital Products`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Reads the live catalogue count, so it can't be prerendered at build time.
export const dynamic = "force-dynamic";

export default async function OpengraphImage() {
  // A share preview shouldn't 500 because the database blinked — fall back
  // to a count-free caption.
  const toolsLabel = await listActiveProducts()
    .then((p) => `${p.length} tools`)
    .catch(() => "Digital tools");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background: "#121110",
          color: "#ede7dc",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 24,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#857c6e",
          }}
        >
          <div style={{ width: 14, height: 14, background: "#c9922e" }} />
          {store.brand}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 96,
            fontWeight: 800,
            letterSpacing: "-0.045em",
            lineHeight: 1.02,
          }}
        >
          <span>Made once.</span>
          <span style={{ color: "#c9922e" }}>Yours forever.</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
          <div style={{ fontSize: 30, color: "#a29888", maxWidth: 820 }}>
            {store.blurb}
          </div>
          <div style={{ width: "100%", height: 1, background: "#2c2823" }} />
          <div
            style={{
              display: "flex",
              gap: 28,
              fontSize: 21,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "#857c6e",
            }}
          >
            <span>{toolsLabel}</span>
            <span style={{ color: "#2c2823" }}>/</span>
            <span>Stripe checkout</span>
            <span style={{ color: "#2c2823" }}>/</span>
            <span>Instant download</span>
            <span style={{ color: "#2c2823" }}>/</span>
            <span>14-day refund</span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
