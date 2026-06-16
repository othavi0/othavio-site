# Orcamento IA Design

## Goal

Create a new `/orcamento-ia` route that adapts `investimento-ia.html` into the
current Othavio site system: a mobile-first, editorial calculator for monthly AI
tool budgeting in USD.

## Source Content

The route must preserve the useful behavior and numbers from
`investimento-ia.html`:

- Seller seats: range from 1 to 30, default 10.
- Team plan options:
  - ChatGPT Go: `$8/month` per seller.
  - ChatGPT Plus: `$20/month` per seller.
- Dev cost:
  - Claude Max 20x: fixed `$200/month`.
- Presets: 10, 15, and 20 sellers.
- Chart views:
  - `Go vs Plus`.
  - `Por tamanho`.
  - `Time vs Dev`.
- Detail copy:
  - Go is cheaper, with ads and lower limits.
  - Plus is better for daily use, without ads.
  - Claude Max 20x keeps the monthly dev number fixed.
  - API usage can exceed `$200` and vary month to month.
  - Reference comparison: around `$15,000` API usage in 8 months versus around
    `$800` subscription cost over the same period.

## Design Direction

Use direction A from the visual companion: an editorial tool, not a dashboard.

The page should feel related to the current homepage, using the existing
`Geist Mono` type system, near-black/paper themes, vermillion accent, hairline
dividers, and restrained interaction. It should not copy the old HTML's visual
system, extra fonts, rounded panels, or dashboard-card language.

## Page Structure

1. Top meta row:
   - `ORCAMENTO IA`.
   - `JUN 2026`.
   - A small link back to `/`.

2. Hero:
   - PT-BR heading for the budget calculator.
   - Short copy explaining that the page keeps the sales team budget separate
     from the dev budget.

3. Controls:
   - Range input for seller count.
   - Preset buttons for 10, 15, and 20.
   - Segmented buttons for Go and Plus.
   - Controls must be usable on small screens and keyboard accessible.

4. Readout:
   - One row for `Time de vendas`.
   - One row for `Dev`.
   - The sum appears as a secondary line, not as the dominant metric.

5. Chart:
   - Three tab-like buttons for the views listed in Source Content.
   - Bars should be simple type/hairline visualizations.
   - The chart must update when seats, plan, or view changes.

6. Details:
   - A compact explanation of Go versus Plus.
   - A compact explanation of the Claude Max 20x choice.

## Interaction

- The calculator should live in a focused client component.
- The route page should remain mostly server-rendered composition.
- Numeric team cost may animate briefly when changed.
- Bars may animate on view/value changes.
- All motion must respect `prefers-reduced-motion`.
- Content must remain visible even if animation or JavaScript timing fails.

## Mobile Requirements

- Mobile is the default layout.
- No horizontal overflow at 320px width.
- Interactive controls have at least 44px touch target height.
- Readout, controls, chart, and details stack in a single column on narrow
  screens.
- Text should wrap naturally and avoid oversized display type inside compact
  panels.

## Visual Constraints

- Reuse tokens from `app/globals.css`.
- No new font families.
- No gradient text.
- No decorative shadows.
- No glassmorphism.
- No large rounded card shells.
- No repeated uppercase section eyebrows beyond the top meta treatment.
- Keep copy specific and avoid marketing buzzwords.
- Do not use em dashes.

## Files

Expected implementation files:

- `app/orcamento-ia/page.tsx`: route composition and metadata.
- `components/ai-budget-calculator.tsx`: client calculator state, controls,
  readout, and chart rendering.
- `app/globals.css`: only small shared utility additions if required for range
  inputs or calculator-specific motion.

## Verification

Before completion, run:

- `bun run typecheck`
- `bun run lint`

Also verify the page in a real browser at desktop and mobile widths. The visual
check must confirm:

- `/orcamento-ia` loads.
- Slider, presets, plan selector, and chart tabs work.
- The page has no mobile horizontal overflow.
- Text does not overlap or escape containers.
- Reduced motion is respected by CSS and component behavior.
