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
      <header className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-[0.65rem] font-medium tracking-[0.28em] text-muted-foreground uppercase">
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
        <p className="text-[0.7rem] tracking-[0.24em] text-muted-foreground uppercase">
          VENDAS + DEV
        </p>
        <h1 className="mt-4 max-w-[12ch] text-[clamp(3rem,15vw,6rem)] leading-[0.9] font-extrabold tracking-[-0.04em] text-balance">
          Quanto investir em IA
        </h1>
        <p className="mt-6 max-w-[62ch] text-[clamp(1rem,1.6vw,1.25rem)] leading-[1.65] text-pretty text-foreground">
          Duas frentes separadas: o time de vendas e o dev. Ajuste o tamanho do
          time, escolha o plano e compare os cenarios mensais em dolar.
        </p>
      </section>

      <AiBudgetCalculator />
    </main>
  )
}
