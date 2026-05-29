"use client"

import { useLang } from "@/components/lang-provider"
import { content } from "@/lib/content"

export function SiteFooter() {
  const { lang } = useLang()
  return (
    <footer
      className="border-t border-border pt-8 pb-8 text-[0.65rem] font-medium tracking-[0.28em] text-muted-foreground uppercase"
    >
      {content[lang].footer}
    </footer>
  )
}
