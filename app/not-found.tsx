"use client"

import Link from "next/link"

import { useLang } from "@/components/lang-provider"
import { content } from "@/lib/content"

export default function NotFound() {
  const { lang } = useLang()
  const copy = content[lang]
  return (
    <main className="mx-auto flex min-h-svh w-full max-w-[min(72rem,92vw)] flex-col justify-center gap-4 px-[clamp(1.25rem,4vw,2.5rem)] py-6">
      <p className="text-[0.7rem] tracking-[0.24em] text-muted-foreground uppercase">
        {copy.notFound}
      </p>
      <Link
        href="/"
        className="group inline-flex min-h-11 w-fit items-center gap-3 text-foreground"
      >
        <span className="decoration-accent decoration-2 underline-offset-4 group-hover:underline group-focus-visible:underline">
          {copy.notFoundLink}
        </span>
        <span
          aria-hidden
          className="text-muted-foreground transition-[transform,color] duration-200 ease-out group-hover:translate-x-1 group-hover:text-accent group-focus-visible:translate-x-1 group-focus-visible:text-accent"
        >
          →
        </span>
      </Link>
    </main>
  )
}
