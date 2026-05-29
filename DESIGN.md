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

| Role            | Token                | Value                        | Notes                                  |
| --------------- | -------------------- | ---------------------------- | -------------------------------------- |
| Background      | `--background`       | `oklch(0.14 0.008 60)`       | warm near-black                        |
| Foreground      | `--foreground`       | `oklch(0.94 0.015 80)`       | bone, never white                      |
| Muted           | `--muted-foreground` | `oklch(0.58 0.010 75)`       | marginalia, numbers, dates             |
| Border hairline | `--border`           | `oklch(0.94 0.015 80 / 12%)` | dividers only                          |
| Accent          | `--accent`           | `oklch(0.68 0.20 35)`        | vermillion, link hover + active toggle |
| Focus ring      | `--ring`             | `oklch(0.68 0.20 35 / 70%)`  | accent at lower alpha                  |

### Light

| Role            | Token                | Value                        | Notes                                 |
| --------------- | -------------------- | ---------------------------- | ------------------------------------- |
| Background      | `--background`       | `oklch(0.97 0.008 85)`       | paper                                 |
| Foreground      | `--foreground`       | `oklch(0.18 0.010 60)`       | ink                                   |
| Muted           | `--muted-foreground` | `oklch(0.50 0.010 75)`       | marginalia                            |
| Border hairline | `--border`           | `oklch(0.18 0.010 60 / 14%)` | dividers only                         |
| Accent          | `--accent`           | `oklch(0.55 0.21 32)`        | vermillion, slightly darker for paper |
| Focus ring      | `--ring`             | `oklch(0.55 0.21 32 / 70%)`  | accent at lower alpha                 |

### Color usage rules

- Body text is `--foreground`.
- Marginalia (`01`, `02`, `/* labels */` text) is `--muted-foreground`. The
  trailing slot of a section label (`2026 →`) is the exception and uses
  `--accent`, because it tags the section as live in the current year.
- Links are `--foreground` at rest, gain underline + `--accent` on hover/focus.
- The active item in PT/EN and DARK/LIGHT toggles is `--foreground`; inactive
  is `--muted-foreground`. The accent does NOT carry the active state.

The accent appears in exactly these surfaces:

1. `::selection` background.
2. Focus ring on links and buttons.
3. The `.underline-sweep` bar under a project name on hover / focus / tap.
4. The `→` arrow at the end of a project row on hover / focus / tap.
5. The trailing slot of a section label (`2026 →`).
6. The leading `→` markers on the WORK section's "Currently" / "Previously"
   rows (always-on; they signal the row, like a bullet would).
7. The `.scroll-progress` hairline at the top edge of the viewport.
8. The number (`01`...`05`) on the **active project row** — the row whose
   vertical center is closest to the viewport center. Migrates as you scroll;
   on mobile this replaces the hover affordance.

Separators (`·`) and section-label text stay muted. Numbers stay muted
unless their row is the active one.

## Typography

One typeface: **Geist Mono** (already loaded). All hierarchy comes from scale,
weight, and tracking. No serif, no display sans, no second font.

| Role                                  | Size                          | Weight | Tracking  | Leading |
| ------------------------------------- | ----------------------------- | ------ | --------- | ------- |
| Wordmark                              | `clamp(4rem, 14vw, 11rem)`    | 800    | `-0.06em` | `0.82`  |
| Identity sentence                     | `clamp(1rem, 1.6vw, 1.35rem)` | 400    | normal    | `1.55`  |
| Project name                          | `1rem`                        | 600    | normal    | `1.4`   |
| Project description                   | `0.875rem`                    | 400    | normal    | `1.5`   |
| Section label `/* ... */`             | `0.7rem` UPPERCASE            | 500    | `+0.24em` | `1.4`   |
| Marginalia (numbers, dates, comments) | `0.7rem`                      | 400    | `+0.06em` | `1.4`   |
| Meta bar                              | `0.65rem` UPPERCASE           | 500    | `+0.28em` | `1.4`   |

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

| Region                                   | Top space                | Bottom space              |
| ---------------------------------------- | ------------------------ | ------------------------- |
| Meta bar                                 | `1rem`                   | `clamp(4rem, 12vh, 8rem)` |
| Wordmark block                           | 0                        | `clamp(2rem, 5vh, 3rem)`  |
| Identity sentence                        | 0                        | `clamp(4rem, 10vh, 6rem)` |
| Section (Open source / Work / Elsewhere) | `clamp(2rem, 5vh, 3rem)` | `clamp(3rem, 7vh, 4rem)`  |

Marginalia appears only where it adds meaning, such as `2026 →` in a section
label. The wordmark has no side comments.

## Components

Each is a single small file under `components/`. No prop explosion.

### `MetaBar` (client)

Top row, `0.65rem` UPPERCASE.

```
EN · PT     DARK · LIGHT
```

- Right-aligned EN/PT toggle. Active token = `--foreground`. Separator `·`
  = `--muted-foreground`.
- Right: DARK/LIGHT toggle. Same pattern.
- Collapses on narrow screens to two rows, keeping the same hierarchy.

### `Wordmark` (server)

`<h1>` rendered as two `<span>` lines. No marginalia beside the wordmark.

### `ProjectRow` (server)

Row layout: `[number] [name + description stacked] [arrow]`. `display: grid`
with `grid-template-columns: 3rem 1fr auto`. Anchor wraps the whole row and
carries `data-active-row` so the scroll orchestrator can flag it as "active"
(see Motion below).

Interaction states (`:hover`, `:focus-visible`, `:active`/tap all fire the
same effect, so touch devices get the same affordance):

- A 2px `--accent` bar sweeps left to right under the name (`scaleX 0→1`,
  240ms ease-out-quart, `.underline-sweep` utility) — replaces the previous
  instant `text-decoration: underline`.
- The description text lifts from `--muted-foreground` to `--foreground`
  (200ms ease-out).
- The arrow translates `6px` right and gains `--accent` (220ms ease-out-quart).

When the row is the **active** one (closest to viewport center), the number
(`.row-number`) transitions from `--muted-foreground` to `--accent` over
280ms ease-out-quart. The underline / arrow / description stay in their rest
state — the number alone marks "current" so it doesn't compete with hover.

### `SectionLabel` (server)

`<h2>` styled as `/* OPEN SOURCE */`. Includes an optional right slot for a
marginalia value (`2026 →`).

### `LangProvider` (client)

React context exposing `{ lang, setLang }`. Defaults to `en`, then reads any
previous explicit user choice from `localStorage` under `lang`. Browser locale
does not override the default. SSR renders `en`.

## Motion

- Load: the wordmark's two lines reveal via `clip-path: inset(0 0 100% 0 → 0)`
  plus an 8px lift, 880ms ease-out-expo, second line delayed 140ms. Content
  blocks below stagger by 80ms over 760ms ease-out-expo (`reveal-up` utility).
- Project row: see `ProjectRow` above.
- Theme switch: `body` transitions `background-color` and `color` over 220ms
  ease-out-quart, so dark↔light swaps cross-fade instead of flashing.
- Toggles: no animation on the toggle UI itself; the active label swaps
  instantly. Only the page colors animate.
- Scroll: `<ScrollOrchestrator />` is the page's single scroll subscription.
  From one rAF loop plus one `IntersectionObserver` it:
  - Publishes `--scroll-y` (px) and `--scroll-progress` (0..1) on `<html>`.
  - Drives the wordmark parallax: `transform: translate3d(0, calc(var(--scroll-y)
    * -0.08), 0)` on the `<h1>` via `.parallax-wordmark`. 8% is deliberate;
    anything more reads as marketing scroll-jacking.
  - Drives the top-edge `.scroll-progress` hairline via `transform: scaleX(...)`.
  - Tags the `data-active-row` element whose vertical center is closest to the
    viewport center with `data-active="true"`, lighting its number in accent
    (see `ProjectRow`). Updates every animation frame the user scrolls; one
    DOM attribute swap per change, no layout thrash.
  - Reveals every `[data-reveal]` element on first intersect (`rootMargin: 0px
    0px -12% 0px`), adding `data-in-view="true"`; CSS transitions
    `opacity 0→1` and `translateY 14px→0` over 700ms ease-out-expo, with
    per-element stagger via `--reveal-delay` (60ms per project row). The
    observer unsubscribes after first hit; reveal is one-shot.
- All motion is suppressed under `prefers-reduced-motion: reduce`, including
  the wordmark clip-path, `reveal-up`, the underline sweep, the body color
  transition, and the wordmark parallax. The scroll-progress hairline keeps
  tracking (it's an indicator that responds to user input, not decorative
  motion).

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
  `section-label.tsx`, `lang-provider.tsx`, `theme-provider.tsx`.
- `components/console-signature.tsx` — inline `<head>` script, prints three
  `/* */` lines to the devtools console for visiting developers; no UI.
- `components/scroll-orchestrator.tsx` — publishes `--scroll-y` and
  `--scroll-progress` on `<html>` and renders the top-edge accent hairline.
- `lib/content.ts` — `{ pt, en }` strings for all bilingual copy.
- `lib/projects.ts` — 5-item array with bilingual descriptions.
- `lib/utils.ts` — `cn()`. Unchanged.
