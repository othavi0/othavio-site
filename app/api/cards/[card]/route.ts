// Hidden GitHub stats cards renderer (One Dark Pro).
// Serves SVG cards for the othavi0 profile README using a self-hosted GitHub
// token, so it never hits the rate-limited public github-readme-stats instance.
//
//   /api/_gh/stats           -> overview card (stars, commits, PRs, issues, rank)
//   /api/_gh/langs           -> most-used languages donut
//   /api/_gh/pin?repo=<name> -> single repo card
//
// Requires env GH_README_TOKEN (a GitHub PAT with read access to public data).

import type { NextRequest } from "next/server"

export const runtime = "edge"

const USER = "othavi0"
const EXCLUDE_REPOS = new Set(["emach-dashboard", "emach-ecommerce"])

// One Dark Pro palette
const C = {
  bg: "#282c34",
  title: "#61afef",
  text: "#abb2bf",
  muted: "#5c6370",
  accent: "#c678dd",
  amber: "#e5c07b",
  red: "#e06c75",
  border: "#3e4451",
  ring: "#61afef",
}
const FONT = "'Segoe UI', Ubuntu, Helvetica, Arial, sans-serif"

const esc = (s: unknown) =>
  String(s).replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  )

const fmt = (n: number) =>
  n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1).replace(/\.0$/, "")}k` : String(n)

async function gh<T = Record<string, unknown>>(
  query: string,
  variables: Record<string, unknown>,
): Promise<T> {
  const token = process.env.GH_README_TOKEN
  if (!token) throw new Error("GH_README_TOKEN not set on the server")
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `bearer ${token}`,
      "User-Agent": "othavio-site-gh-cards",
    },
    body: JSON.stringify({ query, variables }),
  })
  const json = await res.json()
  if (json.message) throw new Error(json.message) // auth errors (e.g. "Bad credentials")
  if (json.errors?.length) throw new Error(json.errors[0]?.message ?? "GraphQL error")
  if (!json.data) throw new Error(`empty response (HTTP ${res.status})`)
  return json.data as T
}

// faithful-ish port of github-readme-stats' rank algorithm
function calcRank(s: {
  commits: number
  prs: number
  issues: number
  reviews: number
  stars: number
  followers: number
}) {
  const exp = (x: number) => 1 - 2 ** -x
  const ln = (x: number) => x / (1 + x)
  const W = { c: 2, p: 3, i: 1, r: 1, s: 4, f: 1 }
  const M = { c: 1000, p: 50, i: 25, r: 2, s: 50, f: 10 }
  const total = W.c + W.p + W.i + W.r + W.s + W.f
  const rank =
    1 -
    (W.c * exp(s.commits / M.c) +
      W.p * exp(s.prs / M.p) +
      W.i * exp(s.issues / M.i) +
      W.r * exp(s.reviews / M.r) +
      W.s * ln(s.stars / M.s) +
      W.f * ln(s.followers / M.f)) /
      total
  const TH = [1, 12.5, 25, 37.5, 50, 62.5, 75, 87.5, 100]
  const LV = ["S", "A+", "A", "A-", "B+", "B", "B-", "C+", "C"]
  const pct = rank * 100
  const idx = TH.findIndex((t) => pct <= t)
  return { level: LV[idx === -1 ? LV.length - 1 : idx], percentile: pct }
}

const svgWrap = (w: number, h: number, body: string) =>
  `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" fill="none" xmlns="http://www.w3.org/2000/svg" role="img">` +
  `<style>text{font-family:${FONT};} .t{fill:${C.title};font-weight:600;} .lbl{fill:${C.text};font-size:14px;} .val{fill:${C.amber};font-size:14px;font-weight:600;} .mut{fill:${C.muted};font-size:11px;}</style>` +
  `<rect x="0.5" y="0.5" width="${w - 1}" height="${h - 1}" rx="10" fill="${C.bg}" stroke="${C.border}"/>` +
  body +
  `</svg>`

function errCard(msg: string) {
  return svgWrap(
    420,
    90,
    `<text x="24" y="40" class="t" font-size="15">cards temporarily unavailable</text>` +
      `<text x="24" y="62" class="mut">${esc(msg).slice(0, 70)}</text>`,
  )
}

async function statsCard(): Promise<string> {
  const d = await gh<{
    user: {
      followers: { totalCount: number }
      pullRequests: { totalCount: number }
      issues: { totalCount: number }
      contributionsCollection: {
        totalCommitContributions: number
        restrictedContributionsCount: number
        totalPullRequestReviewContributions: number
      }
      repositories: { nodes: { stargazerCount: number }[] }
    }
  }>(
    `query($login:String!){user(login:$login){
      followers{totalCount}
      pullRequests{totalCount}
      issues{totalCount}
      contributionsCollection{totalCommitContributions restrictedContributionsCount totalPullRequestReviewContributions}
      repositories(first:100,ownerAffiliations:OWNER,isFork:false){nodes{stargazerCount}}
    }}`,
    { login: USER },
  )
  const u = d.user
  const stars = u.repositories.nodes.reduce((a, r) => a + r.stargazerCount, 0)
  const commits =
    u.contributionsCollection.totalCommitContributions +
    u.contributionsCollection.restrictedContributionsCount
  const reviews = u.contributionsCollection.totalPullRequestReviewContributions
  const prs = u.pullRequests.totalCount
  const issues = u.issues.totalCount
  const followers = u.followers.totalCount
  const { level, percentile } = calcRank({ commits, prs, issues, reviews, stars, followers })
  const progress = Math.max(2, 100 - percentile)

  const rows: [string, string][] = [
    ["Total Stars Earned", fmt(stars)],
    ["Commits (2026)", fmt(commits)],
    ["Total PRs", fmt(prs)],
    ["Total Issues", fmt(issues)],
    ["Followers", fmt(followers)],
  ]
  const rowsSvg = rows
    .map(
      ([k, v], i) =>
        `<text x="30" y="${66 + i * 25}" class="lbl">${esc(k)}</text>` +
        `<text x="300" y="${66 + i * 25}" class="val" text-anchor="end">${esc(v)}</text>`,
    )
    .join("")

  const cx = 385
  const cy = 105
  const r = 38
  const circ = 2 * Math.PI * r
  const dash = (circ * progress) / 100
  const ring =
    `<g transform="translate(${cx},${cy})">` +
    `<circle r="${r}" stroke="${C.border}" stroke-width="6" fill="none"/>` +
    `<circle r="${r}" stroke="${C.ring}" stroke-width="6" fill="none" stroke-linecap="round" ` +
    `stroke-dasharray="${dash.toFixed(1)} ${(circ - dash).toFixed(1)}" transform="rotate(-90)"/>` +
    `<text text-anchor="middle" dy="0.35em" class="t" font-size="24">${esc(level)}</text>` +
    `</g>`

  return svgWrap(
    460,
    195,
    `<text x="30" y="35" class="t" font-size="18">${esc(USER)}'s GitHub Stats</text>` +
      `<line x1="30" y1="46" x2="300" y2="46" stroke="${C.border}"/>` +
      rowsSvg +
      ring,
  )
}

async function langsCard(): Promise<string> {
  const d = await gh<{
    user: {
      repositories: {
        nodes: {
          name: string
          languages: { edges: { size: number; node: { name: string; color: string | null } }[] }
        }[]
      }
    }
  }>(
    `query($login:String!){user(login:$login){
      repositories(first:100,ownerAffiliations:OWNER,isFork:false){nodes{
        name languages(first:10,orderBy:{field:SIZE,direction:DESC}){edges{size node{name color}}}
      }}
    }}`,
    { login: USER },
  )
  const totals = new Map<string, { size: number; color: string }>()
  for (const repo of d.user.repositories.nodes) {
    if (EXCLUDE_REPOS.has(repo.name)) continue
    for (const e of repo.languages.edges) {
      const cur = totals.get(e.node.name) ?? { size: 0, color: e.node.color ?? C.muted }
      cur.size += e.size
      totals.set(e.node.name, cur)
    }
  }
  const sorted = [...totals.entries()].sort((a, b) => b[1].size - a[1].size).slice(0, 8)
  const sum = sorted.reduce((a, [, v]) => a + v.size, 0) || 1

  const cx = 70
  const cy = 95
  const r = 40
  const circ = 2 * Math.PI * r
  let offset = 0
  const arcs = sorted
    .map(([, v]) => {
      const frac = v.size / sum
      const len = circ * frac
      const seg =
        `<circle r="${r}" cx="${cx}" cy="${cy}" fill="none" stroke="${v.color}" stroke-width="14" ` +
        `stroke-dasharray="${len.toFixed(2)} ${(circ - len).toFixed(2)}" stroke-dashoffset="${(-offset).toFixed(2)}" ` +
        `transform="rotate(-90 ${cx} ${cy})"/>`
      offset += len
      return seg
    })
    .join("")

  const legend = sorted
    .map(([name, v], i) => {
      const col = i < 4 ? 150 : 290
      const y = 45 + (i % 4) * 27
      const pct = ((v.size / sum) * 100).toFixed(1)
      return (
        `<circle cx="${col}" cy="${y - 4}" r="5" fill="${v.color}"/>` +
        `<text x="${col + 12}" y="${y}" class="lbl" font-size="12">${esc(name)} ${pct}%</text>`
      )
    })
    .join("")

  return svgWrap(
    440,
    175,
    `<text x="22" y="30" class="t" font-size="16">Most Used Languages</text>` + arcs + legend,
  )
}

async function pinCard(repo: string): Promise<string> {
  const d = await gh<{
    repository: {
      name: string
      description: string | null
      stargazerCount: number
      forkCount: number
      primaryLanguage: { name: string; color: string | null } | null
    } | null
  }>(
    `query($owner:String!,$name:String!){repository(owner:$owner,name:$name){
      name description stargazerCount forkCount primaryLanguage{name color}
    }}`,
    { owner: USER, name: repo },
  )
  const r = d.repository
  if (!r) return errCard(`repo ${repo} not found`)

  // naive word wrap to ~46 chars over 2 lines
  const words = (r.description ?? "").split(/\s+/).filter(Boolean)
  const lines: string[] = []
  let line = ""
  for (const w of words) {
    if ((line + " " + w).trim().length > 46) {
      lines.push(line.trim())
      line = w
      if (lines.length === 2) break
    } else line = `${line} ${w}`
  }
  if (line && lines.length < 2) lines.push(line.trim())
  const descSvg = lines
    .map((l, i) => `<text x="24" y="${64 + i * 18}" class="lbl" font-size="12.5">${esc(l)}</text>`)
    .join("")

  const lang = r.primaryLanguage
  const langSvg = lang
    ? `<circle cx="28" cy="${108}" r="5" fill="${lang.color ?? C.muted}"/>` +
      `<text x="40" y="${112}" class="mut" font-size="12">${esc(lang.name)}</text>`
    : ""
  const meta =
    `<text x="${lang ? 150 : 24}" y="112" class="mut" font-size="12">★ ${fmt(r.stargazerCount)}</text>` +
    `<text x="${lang ? 215 : 90}" y="112" class="mut" font-size="12">⎇ ${fmt(r.forkCount)}</text>`

  return svgWrap(
    400,
    130,
    `<text x="24" y="34" class="t" font-size="15">${esc(r.name)}</text>` + descSvg + langSvg + meta,
  )
}

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ card: string }> },
) {
  const { card } = await ctx.params
  const url = new URL(_req.url)
  let svg: string
  try {
    if (card === "stats") svg = await statsCard()
    else if (card === "langs") svg = await langsCard()
    else if (card === "pin") svg = await pinCard(url.searchParams.get("repo") ?? "")
    else svg = errCard(`unknown card: ${card}`)
  } catch (e) {
    svg = errCard(e instanceof Error ? e.message : "error")
  }
  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=21600, stale-while-revalidate=86400",
    },
  })
}
