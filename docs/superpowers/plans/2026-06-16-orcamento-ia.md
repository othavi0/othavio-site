# Orcamento IA Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a new `/orcamento-ia` route that turns `investimento-ia.html` into a mobile-first editorial AI budget calculator.

**Architecture:** The route is a server component that owns page metadata and static composition. A focused client component owns calculator state, control events, animated values, and chart rendering. Shared CSS changes stay limited to small calculator utilities that reuse existing theme tokens.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript 6, Bun, Tailwind CSS 4, existing `Geist Mono` tokens, `next-themes`.

## Global Constraints

- `CLAUDE.md` is the canonical project guide.
- Read version-matched Next.js docs in `node_modules/next/dist/docs/` before writing Next-specific code.
- Do not commit without explicit approval.
- Do not add new font families.
- Do not use gradient text, decorative shadows, glassmorphism, or large rounded card shells.
- Reuse tokens from `app/globals.css`.
- Mobile is the default layout.
- No horizontal overflow at 320px width.
- Interactive controls must have at least 44px touch target height.
- All motion must respect `prefers-reduced-motion`.
- Verify with `bun run typecheck`, `bun run lint`, and a real browser visual check.

---

## File Structure

- Create `app/orcamento-ia/page.tsx`: route metadata and server-rendered shell.
- Create `components/ai-budget-calculator.tsx`: client component for calculator state, controls, readout, chart, and details.
- Modify `app/globals.css`: add focused range-input and calculator motion utilities only if Tailwind classes are not enough.

### Task 1: Add the `/orcamento-ia` Route Shell

**Files:**
- Create: `app/orcamento-ia/page.tsx`

**Interfaces:**
- Consumes: `AiBudgetCalculator` from `@/components/ai-budget-calculator`.
- Produces: A public Next.js route at `/orcamento-ia`.

- [ ] **Step 1: Create route file with metadata and shell**

```tsx
import type { Metadata } from "next"
import Link from "next/link"

import { AiBudgetCalculator } from "@/components/ai-budget-calculator"

export const metadata: Metadata = {
  title: "Orcamento IA",
  description:
    "Calculadora mobile-first para estimar o investimento mensal em ferramentas de IA para vendas e desenvolvimento.",
  alternates: {
    canonical: "/orcamento-ia",
  },
}

export default function OrcamentoIaPage() {
  return (
    <main className="mx-auto flex min-h-svh w-full max-w-[min(72rem,92vw)] flex-col px-[clamp(1.25rem,4vw,2.5rem)] py-6">
      <header className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-[0.65rem] font-medium uppercase tracking-[0.28em] text-muted-foreground">
        <span>ORCAMENTO IA</span>
        <div className="flex items-center gap-3">
          <span>JUN 2026</span>
          <Link
            href="/"
            className="inline-flex min-h-11 items-center text-foreground transition-colors hover:text-accent focus-visible:text-accent"
          >
            VOLTAR
          </Link>
        </div>
      </header>

      <section className="mt-[clamp(4rem,12vh,7rem)]">
        <p className="text-[0.7rem] uppercase tracking-[0.24em] text-muted-foreground">
          VENDAS + DEV
        </p>
        <h1 className="mt-4 max-w-[12ch] text-balance text-[clamp(3rem,15vw,6rem)] font-extrabold leading-[0.9] tracking-[-0.04em]">
          Quanto investir em IA
        </h1>
        <p className="mt-6 max-w-[62ch] text-pretty text-[clamp(1rem,1.6vw,1.25rem)] leading-[1.65] text-foreground">
          Duas frentes separadas: o time de vendas e o dev. Ajuste o tamanho do
          time, escolha o plano e compare os cenarios mensais em dolar.
        </p>
      </section>

      <AiBudgetCalculator />
    </main>
  )
}
```

- [ ] **Step 2: Run typecheck and confirm expected failure**

Run: `bun run typecheck`

Expected: FAIL because `@/components/ai-budget-calculator` does not exist yet.

### Task 2: Implement the Calculator Component

**Files:**
- Create: `components/ai-budget-calculator.tsx`

**Interfaces:**
- Produces: `export function AiBudgetCalculator(): React.ReactElement`.
- Internal state:
  - `seats: number`, default `10`, min `1`, max `30`.
  - `plan: "go" | "plus"`, default `"go"`.
  - `view: "plan" | "size" | "fronts"`, default `"plan"`.

- [ ] **Step 1: Create the client component**

```tsx
"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

type Plan = "go" | "plus"
type View = "plan" | "size" | "fronts"

const PRICES = {
  go: 8,
  plus: 20,
  max: 200,
} as const

const SIZE_STEPS = [5, 10, 15, 20, 25, 30] as const

const PLAN_LABEL: Record<Plan, string> = {
  go: "Go",
  plus: "Plus",
}

type BarItem = {
  key: string
  value: number
  label: string
  active: boolean
  tone: "team" | "dev"
}

function formatUsd(value: number) {
  return `$${value.toLocaleString("pt-BR")}`
}

function nearestStep(seats: number) {
  return SIZE_STEPS.reduce((best, step) =>
    Math.abs(step - seats) < Math.abs(best - seats) ? step : best
  )
}

function getBars({
  seats,
  plan,
  view,
}: {
  seats: number
  plan: Plan
  view: View
}): { title: string; max: number; items: BarItem[] } {
  const teamCost = seats * PRICES[plan]

  if (view === "plan") {
    return {
      title: `Custo do time com ${seats} vendedores, por plano`,
      max: seats * PRICES.plus,
      items: [
        {
          key: "go",
          value: seats * PRICES.go,
          label: "Go",
          active: plan === "go",
          tone: "team",
        },
        {
          key: "plus",
          value: seats * PRICES.plus,
          label: "Plus",
          active: plan === "plus",
          tone: "team",
        },
      ],
    }
  }

  if (view === "size") {
    const activeStep = nearestStep(seats)
    return {
      title: `Custo do time no ${PLAN_LABEL[plan]}, por numero de vendedores`,
      max: SIZE_STEPS[SIZE_STEPS.length - 1] * PRICES[plan],
      items: SIZE_STEPS.map((step) => ({
        key: `s${step}`,
        value: step * PRICES[plan],
        label: `${step} vend.`,
        active: step === activeStep,
        tone: "team",
      })),
    }
  }

  return {
    title: "Time de vendas vs Dev, orcamentos separados",
    max: Math.max(teamCost, PRICES.max),
    items: [
      {
        key: "team",
        value: teamCost,
        label: "Time",
        active: true,
        tone: "team",
      },
      {
        key: "dev",
        value: PRICES.max,
        label: "Dev",
        active: true,
        tone: "dev",
      },
    ],
  }
}

export function AiBudgetCalculator() {
  const [seats, setSeats] = React.useState(10)
  const [plan, setPlan] = React.useState<Plan>("go")
  const [view, setView] = React.useState<View>("plan")

  const teamCost = seats * PRICES[plan]
  const totalCost = teamCost + PRICES.max
  const bars = getBars({ seats, plan, view })

  return (
    <section className="mt-[clamp(3rem,8vh,5rem)] border-t border-border pt-[clamp(1.5rem,5vw,3rem)]">
      <div className="grid gap-[clamp(2rem,6vw,4rem)] lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-end justify-between gap-4">
              <label
                htmlFor="ai-budget-seats"
                className="text-[0.7rem] font-medium uppercase tracking-[0.24em] text-muted-foreground"
              >
                Vendedores
              </label>
              <output
                htmlFor="ai-budget-seats"
                className="text-3xl font-extrabold leading-none tracking-[-0.04em]"
              >
                {seats}
              </output>
            </div>
            <input
              id="ai-budget-seats"
              type="range"
              min={1}
              max={30}
              value={seats}
              onChange={(event) => setSeats(Number(event.target.value))}
              className="ai-budget-range"
              aria-label="Numero de vendedores"
            />
            <div className="flex flex-wrap gap-2">
              {[10, 15, 20].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setSeats(preset)}
                  className={cn(
                    "inline-flex min-h-11 items-center border border-border px-4 text-sm transition-colors hover:border-accent hover:text-accent focus-visible:border-accent",
                    seats === preset ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-[0.7rem] font-medium uppercase tracking-[0.24em] text-muted-foreground">
              Plano do time
            </p>
            <div className="grid grid-cols-2 border border-border" role="group" aria-label="Plano do time">
              {(["go", "plus"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  aria-pressed={plan === option}
                  onClick={() => setPlan(option)}
                  className={cn(
                    "min-h-14 px-4 text-left transition-colors first:border-r first:border-border",
                    plan === option
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <span className="block font-semibold">{PLAN_LABEL[option]}</span>
                  <span className="block text-xs opacity-80">
                    {formatUsd(PRICES[option])}/mes
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <BudgetReadout
            seats={seats}
            plan={plan}
            teamCost={teamCost}
            totalCost={totalCost}
          />
          <BudgetChart bars={bars} view={view} onViewChange={setView} />
        </div>
      </div>

      <BudgetDetails />
    </section>
  )
}

function BudgetReadout({
  seats,
  plan,
  teamCost,
  totalCost,
}: {
  seats: number
  plan: Plan
  teamCost: number
  totalCost: number
}) {
  return (
    <div className="border-y border-border">
      <ReadoutRow
        label="Time de vendas"
        description={`${seats} vendedores no ${PLAN_LABEL[plan]}`}
        value={teamCost}
      />
      <ReadoutRow
        label="Dev"
        description="Claude Max 20x, valor fixo"
        value={PRICES.max}
      />
      <p className="border-t border-border py-3 text-right text-sm text-muted-foreground">
        Soma das duas frentes:{" "}
        <span className="font-semibold text-foreground">{formatUsd(totalCost)}/mes</span>
      </p>
    </div>
  )
}

function ReadoutRow({
  label,
  description,
  value,
}: {
  label: string
  description: string
  value: number
}) {
  return (
    <div className="grid gap-3 border-t border-border py-5 first:border-t-0 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
      <div>
        <p className="font-semibold text-foreground">{label}</p>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      <p className="text-[clamp(2.25rem,12vw,4.5rem)] font-extrabold leading-none tracking-[-0.04em]">
        {formatUsd(value)}
        <span className="ml-2 text-sm font-normal tracking-normal text-muted-foreground">
          /mes
        </span>
      </p>
    </div>
  )
}

function BudgetChart({
  bars,
  view,
  onViewChange,
}: {
  bars: ReturnType<typeof getBars>
  view: View
  onViewChange: (view: View) => void
}) {
  const views: Array<{ value: View; label: string }> = [
    { value: "plan", label: "Go vs Plus" },
    { value: "size", label: "Por tamanho" },
    { value: "fronts", label: "Time vs Dev" },
  ]

  return (
    <div className="border-t border-border pt-5">
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Visao do grafico">
        {views.map((item) => (
          <button
            key={item.value}
            type="button"
            role="tab"
            aria-selected={view === item.value}
            onClick={() => onViewChange(item.value)}
            className={cn(
              "min-h-11 border border-border px-3 text-sm transition-colors hover:border-accent hover:text-accent focus-visible:border-accent",
              view === item.value ? "text-foreground" : "text-muted-foreground"
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
      <p className="mt-5 text-sm text-muted-foreground">{bars.title}</p>
      <div className="mt-6 flex h-52 items-end gap-3 sm:gap-5">
        {bars.items.map((item) => {
          const height = `${Math.max(6, (item.value / bars.max) * 100)}%`
          return (
            <div key={item.key} className="flex min-w-0 flex-1 flex-col items-center justify-end gap-3 self-stretch">
              <div className="flex w-full max-w-16 flex-1 items-end">
                <div
                  className={cn(
                    "ai-budget-bar relative w-full border border-border bg-muted-foreground/20",
                    item.active && item.tone === "team" && "bg-accent",
                    item.active && item.tone === "dev" && "bg-foreground"
                  )}
                  style={{ height }}
                >
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-semibold text-foreground">
                    {formatUsd(item.value)}
                  </span>
                </div>
              </div>
              <span className={cn("text-center text-xs", item.active ? "text-foreground" : "text-muted-foreground")}>
                {item.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function BudgetDetails() {
  return (
    <div className="mt-[clamp(3rem,7vh,4rem)] grid gap-8 border-t border-border pt-8 md:grid-cols-2">
      <section>
        <h2 className="font-semibold">Plano pro time</h2>
        <dl className="mt-4 divide-y divide-border border-y border-border text-sm">
          <div className="grid gap-2 py-4 sm:grid-cols-[4rem_1fr_auto]">
            <dt className="font-semibold">Go</dt>
            <dd className="text-muted-foreground">Barato, com anuncios, limite menor.</dd>
            <dd className="font-semibold text-accent">$8</dd>
          </div>
          <div className="grid gap-2 py-4 sm:grid-cols-[4rem_1fr_auto]">
            <dt className="font-semibold">Plus</dt>
            <dd className="text-muted-foreground">Melhor para uso diario e sem anuncios.</dd>
            <dd className="font-semibold text-accent">$20</dd>
          </div>
        </dl>
      </section>
      <section>
        <h2 className="font-semibold">Por que Max 20x</h2>
        <p className="mt-4 text-sm leading-6 text-muted-foreground">
          Plano menor trava no meio do dia. O 20x segura o uso diario. API por
          token passa dos $200 e muda todo mes; a assinatura trava o numero.
        </p>
        <p className="mt-4 border-y border-border py-4 text-sm text-foreground">
          ~<span className="font-semibold text-accent">$15.000</span> de API em
          8 meses vs ~<span className="font-semibold text-accent">$800</span>{" "}
          de assinatura no mesmo tempo.
        </p>
      </section>
    </div>
  )
}
```

- [ ] **Step 2: Run typecheck**

Run: `bun run typecheck`

Expected: PASS or actionable TypeScript errors in `components/ai-budget-calculator.tsx`.

### Task 3: Add Focused Calculator CSS

**Files:**
- Modify: `app/globals.css`

**Interfaces:**
- Consumes classes from Task 2: `.ai-budget-range`, `.ai-budget-bar`.
- Produces themed range slider and motion behavior.

- [ ] **Step 1: Add utility CSS inside `@layer utilities`**

```css
    .ai-budget-range {
        width: 100%;
        height: 44px;
        appearance: none;
        background: transparent;
        accent-color: var(--accent);
    }

    .ai-budget-range::-webkit-slider-runnable-track {
        height: 2px;
        background-color: var(--border);
    }

    .ai-budget-range::-webkit-slider-thumb {
        width: 22px;
        height: 22px;
        margin-top: -10px;
        appearance: none;
        border: 2px solid var(--background);
        background-color: var(--accent);
        box-shadow: 0 0 0 1px var(--accent);
    }

    .ai-budget-range::-moz-range-track {
        height: 2px;
        background-color: var(--border);
    }

    .ai-budget-range::-moz-range-thumb {
        width: 22px;
        height: 22px;
        border: 2px solid var(--background);
        border-radius: 0;
        background-color: var(--accent);
        box-shadow: 0 0 0 1px var(--accent);
    }

    .ai-budget-bar {
        transition:
            height 500ms cubic-bezier(0.22, 1, 0.36, 1),
            background-color 220ms cubic-bezier(0.22, 1, 0.36, 1);
    }
```

- [ ] **Step 2: Extend the existing reduced-motion block**

```css
    .ai-budget-bar {
        transition: none;
    }
```

Add that rule inside the existing `@media (prefers-reduced-motion: reduce)` block.

- [ ] **Step 3: Run lint and typecheck**

Run:

```bash
bun run typecheck
bun run lint
```

Expected: both commands pass.

### Task 4: Browser Verification and Visual Polish

**Files:**
- Modify only if browser check exposes visual defects:
  - `app/orcamento-ia/page.tsx`
  - `components/ai-budget-calculator.tsx`
  - `app/globals.css`

**Interfaces:**
- Consumes the running Next.js route from Tasks 1 to 3.
- Produces verified desktop and mobile behavior.

- [ ] **Step 1: Start the dev server**

Run: `bun run dev`

Expected: Next.js dev server starts and prints a local URL.

- [ ] **Step 2: Open `/orcamento-ia` in a real browser**

Use the local URL from Step 1 and open `/orcamento-ia`.

Expected:

- The route loads without runtime errors.
- Header, hero, controls, readout, chart, and detail sections are visible.

- [ ] **Step 3: Verify interactions**

Exercise these controls:

- Move the seller slider from 10 to 12.
- Click preset `15`.
- Switch from `Go` to `Plus`.
- Click `Por tamanho`.
- Click `Time vs Dev`.

Expected:

- Team cost updates as `seats * plan price`.
- Total updates as `team cost + 200`.
- Active plan state changes.
- Chart title and bars update for each tab.

- [ ] **Step 4: Verify mobile layout**

Check at 390px wide and 320px wide.

Expected:

- No horizontal overflow.
- Text wraps inside the viewport.
- Buttons remain at least 44px tall.
- Readout values do not overlap labels.
- Chart labels remain readable.

- [ ] **Step 5: Verify reduced motion**

Emulate `prefers-reduced-motion: reduce`.

Expected:

- Bars and other calculator animation do not transition.
- All content remains visible and usable.

- [ ] **Step 6: Final verification**

Run:

```bash
bun run typecheck
bun run lint
```

Expected: both commands pass after any polish edits.
