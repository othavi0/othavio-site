"use client"

import * as React from "react"

/**
 * The page's single scroll subscription. Does four jobs from one rAF loop and
 * one IntersectionObserver:
 *
 * 1. Publishes `--scroll-y` (px) and `--scroll-progress` (0..1) on `<html>`,
 *    consumed by the wordmark parallax and the top-edge progress hairline.
 * 2. Picks the element under `[data-active-row]` whose vertical center is
 *    closest to the viewport center, sets `data-active="true"` on it, clears
 *    it from the previous winner. CSS uses the attribute to light the row's
 *    number in `--accent`, giving mobile (no hover) a sense of "now reading".
 * 3. Adds `data-in-view="true"` to every `[data-reveal]` element the first
 *    time it intersects the viewport; CSS transitions opacity + translateY.
 *    One observer for the whole page; unobserve on first hit.
 * 4. Renders the top-edge accent progress hairline; it tracks
 *    `--scroll-progress` via `transform: scaleX(...)`.
 *
 * Everything degrades to "no extra motion" under `prefers-reduced-motion`:
 * the CSS rules in `globals.css` make `[data-reveal]` start visible and
 * cancel the wordmark transform; we keep the row-active highlight because
 * it's a state indicator, not decorative motion.
 */
export function ScrollOrchestrator() {
  React.useEffect(() => {
    const root = document.documentElement
    let raf = 0
    let lastY = -1
    let lastActive: Element | null = null

    const update = () => {
      raf = 0
      const y = window.scrollY
      const viewport = window.innerHeight

      if (y !== lastY) {
        lastY = y
        const max = Math.max(1, root.scrollHeight - viewport)
        const progress = Math.min(1, Math.max(0, y / max))
        root.style.setProperty("--scroll-y", `${y}px`)
        root.style.setProperty("--scroll-progress", progress.toFixed(4))
      }

      const center = viewport * 0.5
      const rows = Array.from(
        document.querySelectorAll<HTMLElement>("[data-active-row]")
      )
      let best: HTMLElement | null = null
      let bestDistance = Infinity
      for (const row of rows) {
        const rect = row.getBoundingClientRect()
        if (rect.bottom < 0 || rect.top > viewport) continue
        const distance = Math.abs(rect.top + rect.height / 2 - center)
        if (distance < bestDistance) {
          bestDistance = distance
          best = row
        }
      }
      if (best !== lastActive) {
        if (lastActive) lastActive.removeAttribute("data-active")
        if (best) best.setAttribute("data-active", "true")
        lastActive = best
      }
    }

    const schedule = () => {
      if (raf) return
      raf = requestAnimationFrame(update)
    }

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.setAttribute("data-in-view", "true")
            revealObserver.unobserve(entry.target)
          }
        })
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0 }
    )
    document
      .querySelectorAll("[data-reveal]")
      .forEach((el) => revealObserver.observe(el))

    update()
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule)
    return () => {
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
      if (raf) cancelAnimationFrame(raf)
      revealObserver.disconnect()
    }
  }, [])

  return <div aria-hidden className="scroll-progress" />
}
