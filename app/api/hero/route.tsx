// Profile README hero banner (PNG) — mirrors the site's wordmark + identity,
// rendered in Geist Mono on the One Dark Pro palette. Consumed by othavi0/README.

import { ImageResponse } from "next/og"

export const runtime = "edge"

const IDENTITY =
  "Builds terminal-native tools for developers coordinating AI agents, from Waybar telemetry to Rust token-saving CLIs."

// One Dark Pro
const BG = "#21252b"
const INK = "#d7dae0"
const BODY = "#abb2bf"
const MUTED = "#5c6370"
const ACCENT = "#e06c75" // single warm accent (vermillion-equivalent in One Dark)

async function loadGeistMono(weight: number, text: string): Promise<ArrayBuffer> {
  const url = `https://fonts.googleapis.com/css2?family=Geist+Mono:wght@${weight}&text=${encodeURIComponent(text)}`
  // Old UA forces Google Fonts to serve TTF (Satori/next/og can't parse woff2).
  const css = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0)" },
  }).then((r) => r.text())
  const src = css.match(/src:\s*url\((https:\/\/[^)]+)\)/)?.[1]
  if (!src) throw new Error(`Geist Mono ${weight} not found`)
  return fetch(src).then((r) => r.arrayBuffer())
}

export async function GET() {
  const [bold, regular] = await Promise.all([
    loadGeistMono(800, "OTHAVIOQUILIAO"),
    loadGeistMono(400, `${IDENTITY} GITHUB.COM/OTHAVI0`),
  ])

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: BG,
          color: BODY,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px 64px",
          fontFamily: "Geist Mono",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 17,
            letterSpacing: "0.28em",
            color: MUTED,
            fontWeight: 400,
          }}
        >
          <span style={{ color: ACCENT, marginRight: 14, fontSize: 19 }}>※</span>
          GITHUB.COM/OTHAVI0
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 112,
            fontWeight: 800,
            letterSpacing: "-0.06em",
            lineHeight: 0.82,
            color: INK,
          }}
        >
          <span>OTHAVIO</span>
          <span>QUILIAO</span>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 22,
            maxWidth: 940,
            color: BODY,
            lineHeight: 1.45,
            fontWeight: 400,
          }}
        >
          {IDENTITY}
        </div>
      </div>
    ),
    {
      width: 1280,
      height: 420,
      fonts: [
        { name: "Geist Mono", data: bold, weight: 800, style: "normal" },
        { name: "Geist Mono", data: regular, weight: 400, style: "normal" },
      ],
      headers: {
        "Cache-Control": "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800",
      },
    },
  )
}
