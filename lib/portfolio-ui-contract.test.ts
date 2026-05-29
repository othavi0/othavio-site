import { describe, expect, test } from "bun:test"
import { readFile } from "node:fs/promises"

import { content } from "./content"

describe("portfolio UI contract", () => {
  test("uses a specific terminal-agent identity across page metadata", async () => {
    const layout = await readFile("app/layout.tsx", "utf8")
    const ogImage = await readFile("app/opengraph-image.tsx", "utf8")

    expect(content.en.identity).toBe(
      "Builds terminal-native tools for developers coordinating AI agents, from Waybar telemetry to Rust token-saving CLIs."
    )
    expect(content.pt.identity).toBe(
      "Cria ferramentas de terminal para devs que coordenam agentes de IA, de telemetria no Waybar a CLIs em Rust que economizam tokens."
    )
    expect(layout).toContain(
      "Terminal-native tools for developers coordinating AI agents"
    )
    expect(ogImage).toContain(
      "Terminal-native tools for developers coordinating AI agents"
    )
    expect(layout).not.toContain("crafting open source tools")
    expect(ogImage).not.toContain("crafting open source tools")
  })

  test("keeps dark muted text contrast above the documented threshold", async () => {
    const globals = await readFile("app/globals.css", "utf8")
    const design = await readFile("DESIGN.md", "utf8")

    expect(globals).toContain("--muted-foreground: oklch(0.58 0.010 75);")
    expect(design).toContain("`oklch(0.58 0.010 75)`")
  })

  test("keeps meta bar controls visually compact but touch-safe", async () => {
    const metaBar = await readFile("components/meta-bar.tsx", "utf8")

    expect(metaBar).toContain("min-h-11")
    expect(metaBar).toContain("min-w-11")
  })

  test("reflects the public LinkedIn work history", () => {
    expect(content.en.workCurrently).toBe(
      "Full Stack Developer at Profills and Noctua Core."
    )
    expect(content.pt.workCurrently).toBe(
      "Desenvolvedor full stack na Profills e Noctua Core."
    )
    expect(content.en.workPreviously).toBe("Himarte Net  ·  InfinityBase")
    expect(content.pt.workPreviously).toBe("Himarte Net  ·  InfinityBase")
  })

  test("does not render wordmark marginalia", async () => {
    const page = await readFile("app/page.tsx", "utf8")
    const contentSource = await readFile("lib/content.ts", "utf8")

    expect(page).not.toContain("marginalia")
    expect(contentSource).not.toContain("marginCity")
    expect(contentSource).not.toContain("marginEst")
    expect(JSON.stringify(content)).not.toContain("/* curitiba, br */")
    expect(JSON.stringify(content)).not.toContain("/* est. 2023 */")
  })

  test("keeps the top bar focused on controls instead of site branding", async () => {
    const metaBar = await readFile("components/meta-bar.tsx", "utf8")

    expect(metaBar).not.toContain("※ othavio.com")
  })

  test("keeps the top bar free of explanatory theme hints", async () => {
    const metaBar = await readFile("components/meta-bar.tsx", "utf8")

    expect(metaBar).not.toContain("themeHint")
    expect(JSON.stringify(content)).not.toContain("press d")
    expect(JSON.stringify(content)).not.toContain("aperte d")
  })

  test("does not render the footer meta line or its divider", async () => {
    const page = await readFile("app/page.tsx", "utf8")

    expect(page).not.toContain("SiteFooter")
    expect(JSON.stringify(content)).not.toContain("built in neovim")
    expect(JSON.stringify(content)).not.toContain("deployed on vercel")
    expect(JSON.stringify(content)).not.toContain("feito no neovim")
    expect(JSON.stringify(content)).not.toContain("em produção na vercel")
  })

  test("defaults to English instead of deriving language from the browser locale", async () => {
    const langProvider = await readFile("components/lang-provider.tsx", "utf8")

    expect(langProvider).not.toContain("navigator.language")
    expect(langProvider).toContain('React.useState<Lang>("en")')
  })

  test("keeps the document language in sync with the selected locale", async () => {
    const langProvider = await readFile("components/lang-provider.tsx", "utf8")

    expect(langProvider).toContain("document.documentElement.lang = lang")
  })

  test("hardens text-heavy grids against narrow and long translated content", async () => {
    const page = await readFile("app/page.tsx", "utf8")
    const projectRow = await readFile("components/project-row.tsx", "utf8")

    expect(page).toContain("grid-cols-1")
    expect(page).toContain("overflow-wrap:anywhere")
    expect(projectRow).toContain("min-w-0")
    expect(projectRow).toContain("overflow-wrap:anywhere")
  })

  test("keeps secondary navigation links touch-safe", async () => {
    const page = await readFile("app/page.tsx", "utf8")
    const notFound = await readFile("app/not-found.tsx", "utf8")

    expect(page).toContain("min-h-11")
    expect(notFound).toContain("min-h-11")
  })
})
