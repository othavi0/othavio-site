import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "Othavio Quiliao"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "oklch(0.14 0.008 60)",
          color: "oklch(0.94 0.015 80)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
        }}
      >
        <div
          style={{
            fontSize: 18,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "oklch(0.52 0.010 75)",
          }}
        >
          ※ othavio.com
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 220,
              fontWeight: 800,
              letterSpacing: "-0.06em",
              lineHeight: 0.82,
            }}
          >
            <span>OTHAVIO</span>
            <span>QUILIAO</span>
          </div>
        </div>

        <div
          style={{
            fontSize: 26,
            maxWidth: 980,
            color: "oklch(0.94 0.015 80)",
            lineHeight: 1.4,
          }}
        >
          Fullstack engineer crafting open source tools for developers and the
          agents they work alongside.
        </div>
      </div>
    ),
    size
  )
}
