# DESIGN

Design system for the single-page Othavio Quiliao site.
Companion to [PRODUCT.md](./PRODUCT.md). Tokens live in
`app/globals.css`; this file documents intent and usage.

## Color

Strategy: **Restrained**. Tinted neutrals plus one accent used in ≤2 places.
Typography carries expression; color does not compete.

Color space: OKLCH. Never `#000` or `#fff`. Every neutral is tinted toward a
warm hue (chroma 0.008–0.015) so dark mode reads as warm near-black, not
cold graphite.

### Dark (default)

| Role | Token | Value | Notes |
|---|---|---|---|
| Background | `--background` | `oklch(0.14 0.008 60)` | warm near-black |
| Foreground | `--foreground` | `oklch(0.94 0.015 80)` | bone, never white |
| Muted | `--muted-foreground` | `oklch(0.52 0.010 75)` | marginalia, numbers, dates |
| Border hairline | `--border` | `oklch(0.94 0.015 80 / 12%)` | dividers only |
| Accent | `--accent` | `oklch(0.68 0.20 35)` | vermillion, link hover + active toggle |
| Focus ring | `--ring` | `oklch(0.68 0.20 35 / 70%)` | accent at lower alpha |

### Light

| Role | Token | Value | Notes |
|---|---|---|---|
| Background | `--background` | `oklch(0.97 0.008 85)` | paper |
| Foreground | `--foreground` | `oklch(0.18 0.010 60)` | ink |
| Muted | `--muted-foreground` | `oklch(0.50 0.010 75)` | marginalia |
| Border hairline | `--border` | `oklch(0.18 0.010 60 / 14%)` | dividers only |
| Accent | `--accent` | `oklch(0.55 0.21 32)` | vermillion, slightly darker for paper |
| Focus ring | `--ring` | `oklch(0.55 0.21 32 / 70%)` | accent at lower alpha |

### Color usage rules

- Body text is `--foreground`.
- Marginalia (`01`, `02`, `2026`, `/* labels */`, footer) is `--muted-foreground`.
- Links are `--foreground` at rest, gain underline + `--accent` on hover/focus.
- The active item in PT/EN and DARK/LIGHT toggles is `--foreground`; inactive
  is `--muted-foreground`. The accent does NOT carry the active state.
- The accent appears in: link hover/focus underline, active focus ring, and
  the `→` arrow on a hovered project row. Nowhere else.

## Typography

One typeface: **Geist Mono** (already loaded). All hierarchy comes from scale,
weight, and tracking. No serif, no display sans, no second font.

| Role | Size | Weight | Tracking | Leading |
|---|---|---|---|---|
| Wordmark | `clamp(4rem, 14vw, 11rem)` | 800 | `-0.06em` | `0.82` |
| Identity sentence | `clamp(1rem, 1.6vw, 1.35rem)` | 400 | normal | `1.55` |
| Project name | `1rem` | 600 | normal | `1.4` |
| Project description | `0.875rem` | 400 | normal | `1.5` |
| Section label `/* ... */` | `0.7rem` UPPERCASE | 500 | `+0.24em` | `1.4` |
| Marginalia (numbers, dates, comments) | `0.7rem` | 400 | `+0.06em` | `1.4` |
| Meta bar / footer | `0.65rem` UPPERCASE | 500 | `+0.28em` | `1.4` |

### Typography rules

- Body line length capped at 65ch.
- No em-dashes (`—` or `--`). Use commas, colons, periods.
- No gradient text, no `background-clip: text`, no text-shadow.
- The wordmark sets in two lines (`OTHAVIO` / `QUILIAO`), never one. The line
  break is structural, not responsive.

## Layout and spacing

Grid: single column, max-width `min(72rem, 92vw)`, horizontal padding
`clamp(1.25rem, 4vw, 2.5rem)`.

Vertical rhythm uses a `--space` scale tied to type. Sections are separated by
hairline rules (`border-top: 1px solid var(--border)`) with `padding-block`
varying by section weight — not equal everywhere.

| Region | Top space | Bottom space |
|---|---|---|
| Meta bar | `1rem` | `clamp(4rem, 12vh, 8rem)` |
| Wordmark block | 0 | `clamp(2rem, 5vh, 3rem)` |
| Identity sentence | 0 | `clamp(4rem, 10vh, 6rem)` |
| Section (Open source / Work / Elsewhere) | `clamp(2rem, 5vh, 3rem)` | `clamp(3rem, 7vh, 4rem)` |
| Footer | `clamp(3rem, 8vh, 5rem)` | `2rem` |

Marginalia (`/* curitiba, br */`, `/* est. 2023 */`, `2026 →`) sits aligned
right inside the same row as its anchor, never floated absolute.

## Components

Each is a single small file under `components/`. No prop explosion.

### `MetaBar` (client)

Top row, `0.65rem` UPPERCASE.

```
※ othavio.com       PT · EN     DARK · LIGHT    d toggles theme
```

- Left: site mark (`※ othavio.com`).
- Middle-right: PT/EN toggle. Active token = `--foreground`. Separator `·`
  = `--muted-foreground`.
- Right: DARK/LIGHT toggle. Same pattern.
- Far right: hint `d toggles theme`, in `--muted-foreground`.
- Collapses on narrow screens to two rows, keeping the same hierarchy.

### `Wordmark` (server)

`<h1>` rendered as two `<span>` lines with marginalia on the right of each
line on `md+`, below the wordmark on mobile.

### `ProjectRow` (server)

Row layout: `[number] [name + description stacked] [arrow]`. `display: grid`
with `grid-template-columns: 3rem 1fr auto`. Anchor wraps the whole row.

Hover: name underline appears in `--accent`; arrow translates `4px` right and
gains `--accent`. 200ms `cubic-bezier(0.22, 1, 0.36, 1)` (ease-out-quart).

### `SectionLabel` (server)

`<h2>` styled as `/* OPEN SOURCE */`. Includes an optional right slot for a
marginalia value (`2026 →`).

### `SiteFooter` (server)

Single line: `© 2026 · built in neovim · deployed on vercel`.

### `LangProvider` (client)

React context exposing `{ lang, setLang }`. Reads `navigator.language` on
mount, falls back to `en`, persists to `localStorage` under `lang`. SSR
renders `en`; the provider corrects on hydration without flash because the
copy is text-only (no layout shift).

## Motion

- Load: wordmark fades+lifts `4px` over 600ms ease-out-quart. Content blocks
  below stagger by 80ms each over 800ms total.
- Project row arrow: 200ms slide + color on hover.
- Toggles: no animation; instantaneous swap.
- All motion is suppressed under `prefers-reduced-motion: reduce`.

## Focus and accessibility

- Every interactive element gets a visible focus ring: `2px solid var(--ring)`
  with `outline-offset: 2px`.
- Contrast: foreground/background pairs verified ≥ 7:1; muted/background ≥ 4.5:1.
- The PT/EN and DARK/LIGHT toggles are `<button>` pairs grouped under
  `role="group"` with `aria-label`. They are NOT links.
- The wordmark is the page's single `<h1>`. Section labels are `<h2>`.

## Banned in this project

Repeated from PRODUCT.md for enforcement at the design layer:

- Cards, box shadows, backdrop-blur, glassmorphism.
- ASCII art, decorative grids, vignettes, rotated containers.
- Gradient text, text-shadow, glow effects.
- Em-dashes in copy.
- Lucide icons used decoratively. The only icon-like glyph is the `→` arrow,
  which is a real Unicode character, not an SVG.
- A second font family.

## File map

- `app/globals.css` — token declarations + base resets.
- `app/layout.tsx` — fonts, providers, metadata.
- `app/page.tsx` — composition of components, content read from `lib/content.ts`.
- `app/not-found.tsx` — single line in the same system.
- `app/icon.svg` — `※` glyph for favicon.
- `app/opengraph-image.tsx` — OG image, same typography.
- `components/meta-bar.tsx`, `wordmark.tsx`, `project-row.tsx`,
  `section-label.tsx`, `site-footer.tsx`, `lang-provider.tsx`,
  `theme-provider.tsx`.
- `lib/content.ts` — `{ pt, en }` strings for all bilingual copy.
- `lib/projects.ts` — 5-item array with bilingual descriptions.
- `lib/utils.ts` — `cn()`. Unchanged.
