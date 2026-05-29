import { describe, expect, test } from "bun:test"
import { readFile } from "node:fs/promises"

import { content } from "./content"

describe("portfolio UI contract", () => {
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
})
