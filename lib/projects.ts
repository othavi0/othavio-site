import type { Lang } from "./content"

export type Role = "author" | "contributor"

export type Project = {
  number: string
  name: string
  role: Role
  href: string
  description: Record<Lang, string>
}

export const projects: Project[] = [
  {
    number: "01",
    name: "agent-bar",
    role: "author",
    href: "https://github.com/othavioquiliao/agent-bar",
    description: {
      en: "Waybar integration and TUI to track Claude Code usage in real time.",
      pt: "Integração com Waybar e TUI para acompanhar o uso do Claude Code em tempo real.",
    },
  },
  {
    number: "02",
    name: "herdr",
    role: "contributor",
    href: "https://github.com/ogulcancelik/herdr",
    description: {
      en: "Terminal workspace manager to herd your AI coding agents.",
      pt: "Gerenciador de workspace no terminal para conduzir seus agentes de programação.",
    },
  },
  {
    number: "03",
    name: "mission-control",
    role: "contributor",
    href: "https://github.com/builderz-labs/mission-control",
    description: {
      en: "Open-source dashboard to orchestrate AI agent fleets.",
      pt: "Dashboard open-source para orquestrar frotas de agentes de IA.",
    },
  },
  {
    number: "04",
    name: "rtk",
    role: "contributor",
    href: "https://github.com/rtk-ai/rtk",
    description: {
      en: "Rust CLI proxy that cuts 60 to 90 percent of LLM tokens on common dev commands.",
      pt: "Proxy CLI em Rust que corta de 60 a 90 por cento dos tokens de LLM em comandos comuns.",
    },
  },
  {
    number: "05",
    name: "svelte-animations",
    role: "contributor",
    href: "https://github.com/SikandarJODD/svelte-animations",
    description: {
      en: "Svelte Magic UI and Aceternity components built with Tailwind and Framer Motion.",
      pt: "Componentes Svelte Magic UI e Aceternity feitos com Tailwind e Framer Motion.",
    },
  },
]

export const elsewhere = [
  { label: "github.com/othavioquiliao", href: "https://github.com/othavioquiliao" },
  { label: "linkedin.com/in/othavioquiliao", href: "https://www.linkedin.com/in/othavioquiliao/" },
  { label: "x.com/NoctuaCore", href: "https://x.com/NoctuaCore" },
] as const
