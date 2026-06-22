// Profile README hero — full-width animated SVG banner. The wordmark reveals on
// load (rise + ease-out-expo, second line delayed) and a coral rule draws across
// the full width. Geist Mono is subset-embedded so it renders identically through
// GitHub's image proxy. Consumed by othavi0/README (img width=100%).

export const runtime = "edge"

const W = 1200
const H = 300
const BG = "#21252b"
const INK = "#d7dae0"
const ACCENT = "#e06c75" // single warm accent (vermillion-equivalent in One Dark)

async function geistMonoTTF(weight: number, text: string): Promise<ArrayBuffer> {
  const url = `https://fonts.googleapis.com/css2?family=Geist+Mono:wght@${weight}&text=${encodeURIComponent(text)}`
  // Old UA forces Google Fonts to serve TTF (for the data-URI embed).
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
  for (let i = 0; i < bytes.length; i += chunk) {
    bin += String.fromCharCode(...bytes.subarray(i, i + chunk))
  }
  return btoa(bin)
}

export async function GET() {
  const font = toBase64(await geistMonoTTF(800, "OTHAVIOQUILIAO"))

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" fill="none" role="img" aria-label="OTHAVIO QUILIAO">
<style>
@font-face{font-family:'GM';font-weight:800;src:url(data:font/ttf;base64,${font}) format('truetype')}
.wm{font-family:'GM',ui-monospace,monospace;font-weight:800;letter-spacing:-0.06em;fill:${INK}}
.l1{animation:rise 1s cubic-bezier(.16,1,.3,1) both}
.l2{animation:rise 1s cubic-bezier(.16,1,.3,1) .14s both}
.rule{transform-box:fill-box;transform-origin:left center;animation:draw .9s cubic-bezier(.16,1,.3,1) .5s both}
@keyframes rise{from{opacity:0;transform:translateY(26px)}to{opacity:1;transform:translateY(0)}}
@keyframes draw{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@media(prefers-reduced-motion:reduce){.l1,.l2{animation:none;opacity:1}.rule{animation:none;transform:scaleX(1)}}
</style>
<rect width="${W}" height="${H}" fill="${BG}"/>
<text class="wm l1" x="60" y="116" font-size="128">OTHAVIO</text>
<text class="wm l2" x="60" y="222" font-size="128">QUILIAO</text>
<rect class="rule" x="64" y="262" width="${W - 128}" height="5" fill="${ACCENT}"/>
</svg>`

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800",
    },
  })
}
