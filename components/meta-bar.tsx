"use client"

import * as React from "react"
import { useTheme } from "next-themes"

import { useLang } from "@/components/lang-provider"
import { cn } from "@/lib/utils"

const META_CLASS =
  "text-[0.65rem] font-medium tracking-[0.28em] uppercase text-muted-foreground"

export function MetaBar() {
  const { lang, setLang } = useLang()
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const activeTheme = mounted
    ? resolvedTheme === "dark"
      ? "dark"
      : "light"
    : null

  return (
    <header
      className={cn(
        META_CLASS,
        "flex flex-wrap items-center justify-end gap-x-6 gap-y-2"
      )}
    >
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
        <Toggle
          label="language"
          options={[
            { value: "en", label: "EN" },
            { value: "pt", label: "PT" },
          ]}
          active={lang}
          onSelect={(v) => setLang(v as typeof lang)}
        />
        <Toggle
          label="theme"
          options={[
            { value: "dark", label: "DARK" },
            { value: "light", label: "LIGHT" },
          ]}
          active={activeTheme}
          onSelect={(v) => setTheme(v)}
        />
      </div>
    </header>
  )
}

type ToggleOption = { value: string; label: string }

function Toggle({
  label,
  options,
  active,
  onSelect,
}: {
  label: string
  options: readonly ToggleOption[]
  active: string | null
  onSelect: (value: string) => void
}) {
  return (
    <div role="group" aria-label={label} className="flex items-center gap-2">
      {options.map((option, index) => (
        <span key={option.value} className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onSelect(option.value)}
            aria-pressed={active === option.value}
            className={cn(
              "transition-colors",
              active === option.value
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {option.label}
          </button>
          {index < options.length - 1 ? <span aria-hidden>·</span> : null}
        </span>
      ))}
    </div>
  )
}
