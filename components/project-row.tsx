type ProjectRowProps = {
  number: string
  name: string
  role: string
  description: string
  href: string
}

export function ProjectRow({ number, name, role, description, href }: ProjectRowProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group grid grid-cols-[2.5rem_1fr_2rem] items-baseline gap-x-4 gap-y-1 border-t border-border py-5 transition-colors sm:grid-cols-[3rem_1fr_2.5rem] sm:py-6"
    >
      <span
        className="text-[0.7rem] text-muted-foreground"
        style={{ letterSpacing: "0.06em" }}
      >
        {number}
      </span>

      <div className="flex flex-col gap-1">
        <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="text-base font-semibold text-foreground decoration-accent decoration-2 underline-offset-4 group-hover:underline group-focus-visible:underline">
            {name}
          </span>
          <span
            aria-hidden
            className="text-[0.7rem] text-muted-foreground"
            style={{ letterSpacing: "0.06em" }}
          >
            /* {role} */
          </span>
        </span>
        <span className="max-w-[60ch] text-sm text-muted-foreground">{description}</span>
      </div>

      <span
        aria-hidden
        className="justify-self-end text-base text-muted-foreground transition-[transform,color] duration-200 ease-out group-hover:translate-x-1 group-hover:text-accent group-focus-visible:translate-x-1 group-focus-visible:text-accent"
      >
        →
      </span>
    </a>
  )
}
