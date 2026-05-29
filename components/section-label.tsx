import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

type SectionLabelProps = {
  children: ReactNode
  trailing?: ReactNode
  className?: string
}

export function SectionLabel({ children, trailing, className }: SectionLabelProps) {
  return (
    <h2
      className={cn(
        "flex items-baseline justify-between gap-4 text-[0.7rem] font-medium tracking-[0.24em] text-muted-foreground uppercase",
        className
      )}
    >
      <span>{children}</span>
      {trailing ? (
        <span aria-hidden className="text-accent">
          {trailing}
        </span>
      ) : null}
    </h2>
  )
}
