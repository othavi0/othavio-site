// Profile README hero — animated SVG banner. A centered "OTHAVIO" wordmark on a
// One Dark card whose bottom edge is a flowing wave that dissolves into
// transparency (the page shows through), with a coral line riding the wave. The
// wave sits just under the words as a transition. Geist Mono is subset-embedded.
// Consumed by othavi0/README (img width=100%).

export const runtime = "edge"

const W = 1200
const H = 184
const BG = "#21252b"
const INK = "#d7dae0"
const PERIOD = 380
const BASEY = 168
const AMP = 12

async function geistMonoTTF(weight: number, text: string): Promise<ArrayBuffer> {
  const url = `https://fonts.googleapis.com/css2?family=Geist+Mono:wght@${weight}&text=${encodeURIComponent(text)}`
  const css = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0)" },
  }).then((r) => r.text())
  const src = css.match(/src:\s*url\((https:\/\/[^)]+)\)/)?.[1]
  if (!src) throw new Error("Geist Mono not found")
  return fetch(src).then((r) => r.arrayBuffer())
}

function toBase64(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf)
  let bin = ""
  const chunk = 0x8000
  for (let i = 0; i < bytes.length; i += chunk) bin += String.fromCharCode(...bytes.subarray(i, i + chunk))
  return btoa(bin)
}

const X0 = -PERIOD
const X1 = W + PERIOD * 2

function waveEdge(): string {
  let d = ""
  for (let x = X1; x >= X0; x -= 12) {
    const y = BASEY - AMP * Math.sin((x / PERIOD) * Math.PI * 2)
    d += `${d ? " L" : "M"} ${x} ${y.toFixed(1)}`
  }
  return d
}

export async function GET() {
  const font = toBase64(await geistMonoTTF(800, "OTHAVIO"))
  const edge = waveEdge()
  const textLen = 700
  const tx = (W - textLen) / 2
  // card: straight top, wavy bottom (then transparent below)
  const card = `M ${X0} 0 L ${X1} 0 L ${X1} ${BASEY} ${edge.replace(/^M/, "L")} Z`

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" fill="none" role="img" aria-label="OTHAVIO">
<style>
@font-face{font-family:'GM';font-weight:800;src:url(data:font/ttf;base64,${font}) format('truetype')}
.wm{font-family:'GM',ui-monospace,monospace;font-weight:800;fill:${INK}}
.l1{animation:rise 1s cubic-bezier(.16,1,.3,1) both}
.wave{animation:drift 9s linear infinite}
@keyframes rise{from{opacity:0;transform:translateY(26px)}to{opacity:1;transform:translateY(0)}}
@keyframes drift{from{transform:translateX(0)}to{transform:translateX(-${PERIOD}px)}}
@media(prefers-reduced-motion:reduce){.l1{animation:none;opacity:1}.wave{animation:none}}
</style>
<g class="wave">
<path d="${card}" fill="${BG}"/>
</g>
<text class="wm l1" x="${tx}" y="148" font-size="178" textLength="${textLen}" lengthAdjust="spacingAndGlyphs">OTHAVIO</text>
</svg>`

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800",
    },
  })
}
