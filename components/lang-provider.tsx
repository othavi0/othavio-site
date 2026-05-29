"use client"

import * as React from "react"

import type { Lang } from "@/lib/content"

type LangContextValue = {
  lang: Lang
  setLang: (lang: Lang) => void
}

const LangContext = React.createContext<LangContextValue | null>(null)

const STORAGE_KEY = "lang"

function detectInitial(): Lang {
  if (typeof window === "undefined") return "en"
  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (stored === "en" || stored === "pt") return stored
  return "en"
}

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = React.useState<Lang>("en")

  React.useEffect(() => {
    setLangState(detectInitial())
  }, [])

  const setLang = React.useCallback((next: Lang) => {
    setLangState(next)
    try {
      window.localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // ignore storage errors (private mode, etc.)
    }
  }, [])

  const value = React.useMemo(() => ({ lang, setLang }), [lang, setLang])

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

export function useLang(): LangContextValue {
  const ctx = React.useContext(LangContext)
  if (!ctx) {
    throw new Error("useLang must be used inside <LangProvider>")
  }
  return ctx
}
