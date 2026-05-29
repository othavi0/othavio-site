# Portfolio redesign — design spec

Date: 2026-05-28
Author: Othavio Quiliao (with Amp)
Status: APPROVED, ready for implementation plan

## Summary

Replace the current placeholder template (`app/page.tsx` with ASCII field,
rotated grid, card-shell, amber glow, "[your name]" copy) with a single-page
editorial-brutalist site for Othavio Quiliao. Bilingual PT/EN, dark-first,
monospace typography in extreme scale and weight contrast, zero card chrome,
five open-source projects, work + contact links. No blog, no extra routes.

Companion documents:

- [`PRODUCT.md`](../../../PRODUCT.md) — register, users, voice, anti-references.
- [`DESIGN.md`](../../../DESIGN.md) — tokens, type, components, file map.

This spec is the consolidated implementation contract.

## Goals

- Ship a portfolio that demonstrates craft through restraint.
- Centralise all copy in two files (`lib/content.ts`, `lib/projects.ts`) so
  bilingual switching is a runtime swap of strings.
- Keep the existing stack (Next 16 App Router, React 19, TS, Bun, Tailwind 4,
  next-themes). Add zero new dependencies.

## Non-goals

- Blog, writing, changelog. The author does not publish; the site does not
  pretend to.
- Multi-route navigation. There is `/` and `/not-found`. That is all.
- Animations beyond load reveal, link hover, and arrow slide on project rows.
- New shadcn components, new icon system, new design tokens beyond what is
  documented in `DESIGN.md`.

## Architecture

```diagram
╭──────────────────────────────────────────────────────────╮
│ app/layout.tsx                                           │
│   ├── ThemeProvider (next-themes, existing)              │
│   └── LangProvider (new, client, localStorage backed)    │
│                                                          │
│ app/page.tsx (server component, composes:)               │
│   ├── <MetaBar/>           [client — toggles]            │
│   ├── <Wordmark/>          [server]                      │
│   ├── <IdentitySentence/>  [inline in page.tsx]          │
│   ├── <SectionLabel/> + <ProjectRow/> × 5                │
│   ├── <SectionLabel/> + Work block                       │
│   ├── <SectionLabel/> + Elsewhere links                  │
│   └── <SiteFooter/>                                      │
│                                                          │
│ Bilingual content                                        │
│   lib/content.ts   → { pt: {...}, en: {...} }            │
│   lib/projects.ts  → Project[] each with { pt, en }      │
│                                                          │
│ Hooks                                                    │
│   useLang() → { lang, setLang }                          │
│   (consumed only by MetaBar + bilingual text leaves)     │
╰──────────────────────────────────────────────────────────╯
```

Server components handle the static frame. Only leaves that depend on `lang`
become client components: `<MetaBar>`, and small client wrappers that pull
copy from `lib/content.ts` via `useLang()`. The wordmark, layout, dividers,
and footer are static.

### Hydration safety

`LangProvider` initialises with `en` on the server. On mount it reads
`localStorage.lang`, then falls back to `navigator.language.startsWith("pt")
? "pt" : "en"`, and writes back. Because the swap only changes text content
(not structure), there is no CLS. The default render is valid EN.

`ThemeProvider` already does the equivalent for dark/light via `next-themes`
with `suppressHydrationWarning` on `<html>`.

## Content (final, ready to implement)

### Identity sentence

- **EN**: `Fullstack engineer crafting open source tools for developers and the agents they work alongside.`
- **PT**: `Engenheiro fullstack criando ferramentas open source para desenvolvedores e os agentes ao lado deles.`

### Wordmark marginalia

- Right of line 1: `/* curitiba, br */`
- Right of line 2: `/* est. 2023 */`

### Section labels (bilingual)

| Key | EN | PT |
|---|---|---|
| `openSource` | `/* OPEN SOURCE */` | `/* OPEN SOURCE */` |
| `work` | `/* WORK */` | `/* TRABALHO */` |
| `elsewhere` | `/* ELSEWHERE */` | `/* EM OUTROS LUGARES */` |

`/* OPEN SOURCE */` stays English in both languages because it is a term of
art that does not benefit from translation.

### Open source projects (5)

Final list confirmed by user. Each row carries a `role` tag rendered as
marginalia between the number and the name: `author` for own work,
`contributor` for upstream contributions.

| # | Repo | Role | URL | EN | PT |
|---|---|---|---|---|---|
| 01 | `agent-bar` | author | `https://github.com/othavioquiliao/agent-bar` | `Waybar integration and TUI to track Claude Code usage in real time.` | `Integração com Waybar e TUI para acompanhar o uso do Claude Code em tempo real.` |
| 02 | `herdr` | contributor | `https://github.com/ogulcancelik/herdr` | `Terminal workspace manager to herd your AI coding agents.` | `Gerenciador de workspace no terminal para conduzir seus agentes de programação.` |
| 03 | `mission-control` | contributor | `https://github.com/builderz-labs/mission-control` | `Open-source dashboard to orchestrate AI agent fleets.` | `Dashboard open-source para orquestrar frotas de agentes de IA.` |
| 04 | `rtk` | contributor | `https://github.com/rtk-ai/rtk` | `Rust CLI proxy that cuts 60 to 90 percent of LLM tokens on common dev commands.` | `Proxy CLI em Rust que corta de 60 a 90 por cento dos tokens de LLM em comandos comuns.` |
| 05 | `svelte-animations` | contributor | `https://github.com/SikandarJODD/svelte-animations` | `Svelte Magic UI and Aceternity components built with Tailwind and Framer Motion.` | `Componentes Svelte Magic UI e Aceternity feitos com Tailwind e Framer Motion.` |

The `author` row links to Othavio's repo. `contributor` rows link to the
upstream repo (canonical source) and the role tag makes the contribution
relationship explicit. No em-dashes in descriptions.

### Work block

- **Currently** (EN/PT): `Noctua Core, building developer tooling.` /
  `Noctua Core, construindo ferramentas para desenvolvedores.`
- **Previously** (both): `Himarte Net  ·  InfinityBase`

### Elsewhere links

Shown as full URLs, no rewriting. **No email** by user decision.

- `github.com/othavioquiliao`
- `linkedin.com/in/othavioquiliao`
- `x.com/NoctuaCore`

### Footer

`© 2026 · built in neovim · deployed on vercel`

## Component contracts

### `<MetaBar />`

```ts
// no props
// reads useLang(), useTheme()
// renders three groups: brand mark | lang toggle | theme toggle + hint
```

Keyboard:

- `Tab` reaches each button.
- The existing `d` hotkey (owned by `theme-provider.tsx`) is preserved.

### `<Wordmark />`

```ts
type Props = {
  lines: [string, string]      // ["OTHAVIO", "QUILIAO"]
  marginalia?: [string, string] // ["/* curitiba, br */", "/* est. 2023 */"]
}
```

### `<ProjectRow />`

```ts
type Props = {
  number: string      // "01"
  name: string        // "agent-bar-usage"
  description: string // resolved by parent against current lang
  href: string        // full URL
}
```

Renders as `<a>` wrapping a grid: `3rem | 1fr | auto`. Arrow `→` is a span,
not an SVG.

### `<SectionLabel />`

```ts
type Props = {
  children: ReactNode     // "/* OPEN SOURCE */"
  trailing?: ReactNode    // optional marginalia, e.g. "2026 →"
}
```

### `<SiteFooter />`

No props.

### `<LangProvider />`

```ts
type Lang = "en" | "pt"
type Ctx = { lang: Lang; setLang: (l: Lang) => void }
```

Exposes `useLang()`. Uses `useSyncExternalStore` if possible to avoid
hydration mismatches; otherwise a `useEffect`-based init with the EN default
on first paint.

## Token migration in `app/globals.css`

Strip the existing palette (amber + olive + emerald), keep only the names the
shadcn convention expects so existing imports keep typechecking, but
re-point them to the new values:

- `--background`, `--foreground`, `--card`, `--popover`, `--primary`,
  `--secondary`, `--muted`, `--accent`, `--destructive`, `--border`,
  `--input`, `--ring`, `--radius`, `--sidebar-*` → new restrained values
  per [`DESIGN.md`](../../../DESIGN.md). `--card` and `--popover` collapse to
  `--background` (we use neither in the new UI but keep them defined so
  shadcn primitives don't break if reintroduced later).
- Remove `.portfolio-grid`, `.portfolio-vignette`, `.portfolio-shell`,
  `.portfolio-reveal`, `.portfolio-link`, and the keyframes for
  `portfolio-shell-in` / `portfolio-content-in`.
- Add a single load-reveal keyframe used by `<Wordmark />` and the content
  blocks, gated on `prefers-reduced-motion: no-preference`.
- Set `--radius` to `0` (we never round in this design).

## Files

| Action | Path | Notes |
|---|---|---|
| REWRITE | `app/page.tsx` | Compose components, no inline JSX zoo. |
| REWRITE | `app/layout.tsx` | Add `<LangProvider>`, set `metadata`. |
| REWRITE | `app/globals.css` | Tokens + base + one keyframe. |
| NEW | `app/not-found.tsx` | `/* not found */ — try /` single line. |
| NEW | `app/icon.svg` | `※` glyph, 32×32, currentColor. |
| NEW | `app/opengraph-image.tsx` | Static, satori-rendered wordmark + tagline. |
| NEW | `components/meta-bar.tsx` | client |
| NEW | `components/wordmark.tsx` | server |
| NEW | `components/project-row.tsx` | server |
| NEW | `components/section-label.tsx` | server |
| NEW | `components/site-footer.tsx` | server |
| NEW | `components/lang-provider.tsx` | client |
| KEEP | `components/theme-provider.tsx` | unchanged |
| DELETE | `components/ascii/ascii-field.tsx` | |
| DELETE | `components/ascii/ascii-wordmark.tsx` | |
| DELETE | `components/ascii/` (empty) | |
| DELETE | `components/ui/card.tsx` | unused after rewrite |
| EVAL | `components/ui/button.tsx` | delete if no consumer remains |
| NEW | `lib/content.ts` | `{ pt, en }` strings. |
| NEW | `lib/projects.ts` | typed `Project[]`. |
| KEEP | `lib/utils.ts` | unchanged |

## Metadata

```ts
// app/layout.tsx
export const metadata: Metadata = {
  metadataBase: new URL("https://othavio.com"),
  title: "Othavio Quiliao",
  description:
    "Fullstack engineer crafting open source tools for developers and the agents they work alongside.",
  openGraph: {
    title: "Othavio Quiliao",
    description:
      "Fullstack engineer crafting open source tools for developers and the agents they work alongside.",
    url: "/",
    siteName: "othavio.com",
    locale: "en_US",
    type: "website",
  },
  twitter: { card: "summary_large_image", creator: "@NoctuaCore" },
}
```

## Validation

Per `CLAUDE.md` § Commands and § Safety:

1. `bun run typecheck` — zero errors.
2. `bun run lint` — zero errors, zero warnings introduced.
3. `bun run build` — succeeds, no Next 16 deprecation warnings reintroduced.
4. Visual check, real browser:
   - Dark theme + EN, light theme + EN, dark + PT, light + PT.
   - Mobile (375 px), tablet (768 px), desktop (1280 px), wide (1920 px).
   - Keyboard tab order reaches every interactive element with visible focus.
   - `prefers-reduced-motion: reduce` suppresses the load reveal and arrow slide.
   - Hover state on each project row, on each toggle, on each Elsewhere link.
5. Lighthouse a11y ≥ 95 on the home page. Performance ≥ 95 (static page,
   easy).
6. View-source check: SSR HTML contains the EN identity sentence and section
   labels without flashing on hydration.

## Open questions

None blocking. All content, projects, domain (`othavio.com`), deploy target
(Vercel), and the no-email decision are confirmed.

## Out-of-scope follow-ups (not part of this spec)

- Writing / blog system (`/notes` or `/log`).
- A `/uses` page.
- Per-project case-study pages.
- Analytics integration.
- View transitions API for cross-route animation.

These wait until the author has matter to publish or a reason to add them.
