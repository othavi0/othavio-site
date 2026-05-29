"use client"

import { useLang } from "@/components/lang-provider"
import { MetaBar } from "@/components/meta-bar"
import { ProjectRow } from "@/components/project-row"
import { SectionLabel } from "@/components/section-label"
import { Wordmark } from "@/components/wordmark"
import { content } from "@/lib/content"
import { elsewhere, projects } from "@/lib/projects"

export default function HomePage() {
  const { lang } = useLang()
  const copy = content[lang]
  const roleLabel: Record<"author" | "contributor", string> = {
    author: copy.roleAuthor,
    contributor: copy.roleContributor,
  }

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-[min(72rem,92vw)] flex-col px-[clamp(1.25rem,4vw,2.5rem)] py-6">
      <MetaBar />

      <div className="mt-[clamp(4rem,12vh,8rem)]">
        <Wordmark lines={["OTHAVIO", "QUILIAO"]} />
      </div>

      <p
        className="reveal-up mt-[clamp(2rem,5vh,3rem)] max-w-[65ch] text-foreground"
        style={{
          animationDelay: "120ms",
          fontSize: "clamp(1rem, 1.6vw, 1.35rem)",
          lineHeight: 1.55,
        }}
      >
        {copy.identity}
      </p>

      <section
        className="reveal-up mt-[clamp(4rem,10vh,6rem)]"
        style={{ animationDelay: "200ms" }}
      >
        <SectionLabel trailing="2026">{copy.sectionOpenSource}</SectionLabel>
        <div className="mt-6">
          {projects.map((p) => (
            <ProjectRow
              key={p.name}
              number={p.number}
              name={p.name}
              role={roleLabel[p.role]}
              description={p.description[lang]}
              href={p.href}
            />
          ))}
        </div>
      </section>

      <section
        className="reveal-up mt-[clamp(3rem,7vh,4rem)]"
        style={{ animationDelay: "280ms" }}
      >
        <SectionLabel>{copy.sectionWork}</SectionLabel>
        <dl className="mt-6 grid grid-cols-1 gap-x-4 gap-y-2 text-sm sm:grid-cols-[minmax(7rem,9rem)_minmax(0,1fr)] sm:gap-y-3">
          <dt className="text-muted-foreground">{copy.workCurrentlyLabel}</dt>
          <dd className="min-w-0 [overflow-wrap:anywhere] text-foreground">
            → {copy.workCurrently}
          </dd>
          <dt className="text-muted-foreground">{copy.workPreviouslyLabel}</dt>
          <dd className="min-w-0 [overflow-wrap:anywhere] text-foreground">
            → {copy.workPreviously}
          </dd>
        </dl>
      </section>

      <section
        className="reveal-up mt-[clamp(3rem,7vh,4rem)]"
        style={{ animationDelay: "360ms" }}
      >
        <SectionLabel>{copy.sectionElsewhere}</SectionLabel>
        <ul className="mt-6 flex flex-col gap-3 text-sm">
          {elsewhere.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex min-h-11 max-w-full items-center gap-3 text-foreground"
              >
                <span className="min-w-0 [overflow-wrap:anywhere] decoration-accent decoration-2 underline-offset-4 group-hover:underline group-focus-visible:underline">
                  {link.label}
                </span>
                <span
                  aria-hidden
                  className="text-muted-foreground transition-[transform,color] duration-200 ease-out group-hover:translate-x-1 group-hover:text-accent group-focus-visible:translate-x-1 group-focus-visible:text-accent"
                >
                  →
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
