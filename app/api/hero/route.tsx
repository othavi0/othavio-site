// Profile README hero — animated SVG banner. A centered "OTHAVIO" wordmark
// reveals on load (rise + ease-out-expo); a coral wave flows along the bottom
// edge of the card. Geist Mono is subset-embedded so it renders identically
// through GitHub's image proxy. Consumed by othavi0/README (img width=100%).

export const runtime = "edge"

const W = 1200
const H = 300
const BG = "#21252b"
const INK = "#d7dae0"
const ACCENT = "#e06c75" // single warm accent (vermillion-equivalent in One Dark)

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

// sine wave filled down to the bottom, drawn from x=0..width
function wavePath(width: number, baseY: number, amp: number, period: number, bottom: number): string {
  let d = `M 0 ${(baseY - amp * Math.sin(0)).toFixed(1)}`
  for (let x = 16; x <= width; x += 16) {
    const y = baseY - amp * Math.sin((x / period) * Math.PI * 2)
    d += ` L ${x} ${y.toFixed(1)}`
  }
  return `${d} L ${width} ${bottom} L 0 ${bottom} Z`
}

export async function GET() {
  const font = toBase64(await geistMonoTTF(800, "OTHAVIO"))
  const textLen = 720
  const x = (W - textLen) / 2
  const period = 400
  const wave = wavePath(W + period * 2, 248, 15, period, H) // wider than viewBox so the drift is seamless

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" fill="none" role="img" aria-label="OTHAVIO">
<style>
@font-face{font-family:'GM';font-weight:800;src:url(data:font/ttf;base64,${font}) format('truetype')}
.wm{font-family:'GM',ui-monospace,monospace;font-weight:800;fill:${INK}}
.l1{animation:rise 1s cubic-bezier(.16,1,.3,1) both}
.wave{animation:drift 9s linear infinite}
@keyframes rise{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
@keyframes drift{from{transform:translateX(0)}to{transform:translateX(-${period}px)}}
@media(prefers-reduced-motion:reduce){.l1{animation:none;opacity:1}.wave{animation:none}}
</style>
<rect width="${W}" height="${H}" fill="${BG}"/>
<path class="wave" d="${wave}" fill="${ACCENT}" opacity="0.92"/>
<text class="wm l1" x="${x}" y="158" font-size="190" textLength="${textLen}" lengthAdjust="spacingAndGlyphs">OTHAVIO</text>
</svg>`

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800",
    },
  })
}
