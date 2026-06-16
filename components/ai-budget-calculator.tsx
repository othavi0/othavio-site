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
                className="text-[0.7rem] font-medium tracking-[0.24em] text-muted-foreground uppercase"
              >
                Vendedores
              </label>
              <output
                htmlFor="ai-budget-seats"
                className="text-3xl leading-none font-extrabold tracking-[-0.04em]"
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
                    seats === preset
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-[0.7rem] font-medium tracking-[0.24em] text-muted-foreground uppercase">
              Plano do time
            </p>
            <div
              className="grid grid-cols-2 border border-border"
              role="group"
              aria-label="Plano do time"
            >
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
                  <span className="block font-semibold">
                    {PLAN_LABEL[option]}
                  </span>
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
        <span className="font-semibold text-foreground">
          {formatUsd(totalCost)}/mes
        </span>
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
      <p className="text-[clamp(2.25rem,12vw,4.5rem)] leading-none font-extrabold tracking-[-0.04em]">
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
      <div
        className="flex flex-wrap gap-2"
        role="tablist"
        aria-label="Visao do grafico"
      >
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
            <div
              key={item.key}
              className="flex min-w-0 flex-1 flex-col items-center justify-end gap-3 self-stretch"
            >
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
              <span
                className={cn(
                  "text-center text-xs",
                  item.active ? "text-foreground" : "text-muted-foreground"
                )}
              >
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
            <dd className="text-muted-foreground">
              Barato, com anuncios, limite menor.
            </dd>
            <dd className="font-semibold text-accent">$8</dd>
          </div>
          <div className="grid gap-2 py-4 sm:grid-cols-[4rem_1fr_auto]">
            <dt className="font-semibold">Plus</dt>
            <dd className="text-muted-foreground">
              Melhor para uso diario e sem anuncios.
            </dd>
            <dd className="font-semibold text-accent">$20</dd>
          </div>
        </dl>
      </section>
      <section>
        <h2 className="font-semibold">Onde o Max 20x entra</h2>
        <p className="mt-4 text-sm leading-6 text-muted-foreground">
          Esse plano cobre dias longos de desenvolvimento: refatorar o CRM,
          levar partes do e-commerce para tools internas, criar ferramentas para
          o time e integrar tudo com o sistema da producao. Com API por token,
          esse tipo de uso passa de $200 rapido e muda todo mes; a assinatura
          deixa o custo previsivel.
        </p>
        <p className="mt-4 border-y border-border py-4 text-sm text-foreground">
          ~<span className="font-semibold text-accent">$15.000</span> de API em
          8 meses vs ~<span className="font-semibold text-accent">$800</span> de
          assinatura no mesmo tempo.
        </p>
      </section>
    </div>
  )
}
