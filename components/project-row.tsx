type ProjectRowProps = {
  number: string
  name: string
  role: string
  description: string
  href: string
}

export function ProjectRow({
  number,
  name,
  role,
  description,
  href,
}: ProjectRowProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      data-active-row
      className="group grid grid-cols-[2.5rem_minmax(0,1fr)_2rem] items-baseline gap-x-4 gap-y-1 border-t border-border py-5 transition-colors sm:grid-cols-[3rem_minmax(0,1fr)_2.5rem] sm:py-6"
    >
      <span
        className="row-number text-[0.7rem] text-muted-foreground"
        style={{ letterSpacing: "0.06em" }}
      >
        {number}
      </span>

      <div className="flex min-w-0 flex-col gap-1 [overflow-wrap:anywhere]">
        <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="relative inline-block text-base font-semibold text-foreground">
            {name}
            <span aria-hidden className="underline-sweep" />
          </span>
          <span
            aria-hidden
            className="text-[0.7rem] text-muted-foreground"
            style={{ letterSpacing: "0.06em" }}
          >
            /* {role} */
          </span>
        </span>
        <span className="max-w-[60ch] text-sm text-muted-foreground transition-colors duration-200 ease-out group-hover:text-foreground group-focus-visible:text-foreground group-active:text-foreground">
          {description}
        </span>
      </div>

      <span
        aria-hidden
        className="justify-self-end text-base text-muted-foreground transition-[transform,color] duration-[220ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1.5 group-hover:text-accent group-focus-visible:translate-x-1.5 group-focus-visible:text-accent group-active:translate-x-1.5 group-active:text-accent"
      >
        →
      </span>
    </a>
  )
}
