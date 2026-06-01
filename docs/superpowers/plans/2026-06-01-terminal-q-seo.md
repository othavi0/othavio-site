# Terminal Q Icon And SEO Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the tab icon with the approved Terminal Q mark and strengthen metadata for searches around Othavio Quiliao.

**Architecture:** Keep metadata static and server-rendered from `app/layout.tsx`. Share reusable SEO constants from `lib/site-metadata.ts` so layout, sitemap, robots, and tests do not drift. Use Next file-based metadata for the SVG app icon and generated routes for robots/sitemap.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript 6, Bun, file-based Metadata API.

---

### Task 1: Site Metadata Contract

**Files:**

- Create: `lib/site-metadata.ts`
- Modify: `lib/portfolio-ui-contract.test.ts`

- [ ] **Step 1: Add a failing contract test**

```ts
import {
  siteAliases,
  siteDescription,
  sitePersonJsonLd,
  siteUrl,
} from "./site-metadata"

test("publishes aliases for personal search discovery", () => {
  expect(siteAliases).toEqual(["Othavio", "Othavio Quiliao", "Quiliao"])
  expect(siteDescription).toContain("Othavio Quiliao")
  expect(siteUrl).toBe("https://othavio.com")
  expect(sitePersonJsonLd.alternateName).toEqual(["Othavio", "Quiliao"])
})
```

- [ ] **Step 2: Run the focused test and confirm it fails**

Run: `bun test lib/portfolio-ui-contract.test.ts`

Expected: FAIL because `lib/site-metadata.ts` does not exist yet.

- [ ] **Step 3: Create `lib/site-metadata.ts`**

```ts
export const siteUrl = "https://othavio.com"

export const siteName = "Othavio Quiliao"

export const siteAliases = ["Othavio", "Othavio Quiliao", "Quiliao"] as const

export const siteDescription =
  "Othavio Quiliao builds terminal-native tools for developers coordinating AI agents, from Waybar telemetry to Rust token-saving CLIs."

export const sitePersonJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: siteName,
  alternateName: ["Othavio", "Quiliao"],
  url: siteUrl,
  jobTitle: "Full Stack Developer",
  description: siteDescription,
  sameAs: [
    "https://github.com/othavioquiliao",
    "https://www.linkedin.com/in/othavioquiliao/",
    "https://x.com/NoctuaCore",
  ],
  knowsAbout: [
    "AI agents",
    "developer tools",
    "terminal user interfaces",
    "Rust CLI",
    "Next.js",
  ],
} as const
```

- [ ] **Step 4: Re-run the focused test**

Run: `bun test lib/portfolio-ui-contract.test.ts`

Expected: PASS.

### Task 2: Metadata Routes And Layout

**Files:**

- Modify: `app/layout.tsx`
- Create: `app/robots.ts`
- Create: `app/sitemap.ts`

- [ ] **Step 1: Wire layout metadata to the shared constants**

Update `app/layout.tsx` to import `siteAliases`, `siteDescription`, `siteName`,
`sitePersonJsonLd`, and `siteUrl`. Set `metadataBase`, `title`, `description`,
`keywords`, `authors`, `creator`, `publisher`, `alternates.canonical`,
`openGraph`, `twitter`, and `robots.googleBot`.

- [ ] **Step 2: Render JSON-LD in `<head>`**

Render:

```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(sitePersonJsonLd) }}
/>
```

- [ ] **Step 3: Add generated robots route**

```ts
import type { MetadataRoute } from "next"

import { siteUrl } from "@/lib/site-metadata"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  }
}
```

- [ ] **Step 4: Add generated sitemap route**

```ts
import type { MetadataRoute } from "next"

import { siteUrl } from "@/lib/site-metadata"

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      lastModified: new Date("2026-06-01"),
      changeFrequency: "monthly",
      priority: 1,
    },
  ]
}
```

### Task 3: Terminal Q Icon

**Files:**

- Modify: `app/icon.svg`
- Modify: `app/favicon.ico`
- Modify: `.gitignore`

- [ ] **Step 1: Replace `app/icon.svg`**

Use a 32x32 SVG with dark background, bone Q stroke, orange diagonal tail, and
terminal prompt baseline.

- [ ] **Step 2: Generate `app/favicon.ico` from the SVG**

Run: `magick -background none app/icon.svg -define icon:auto-resize=16,32 app/favicon.ico`

Expected: `file app/favicon.ico` reports an ICO with 16x16 and 32x32 entries.

- [ ] **Step 3: Ignore companion scratch files**

Add `.superpowers/` to `.gitignore` so visual-companion drafts stay out of git.

### Task 4: Verification

**Files:**

- No production file changes.

- [ ] **Step 1: Run focused tests**

Run: `bun test lib/portfolio-ui-contract.test.ts`

Expected: PASS.

- [ ] **Step 2: Run typecheck**

Run: `bun run typecheck`

Expected: PASS.

- [ ] **Step 3: Run production build**

Run: `bun run build`

Expected: PASS.

- [ ] **Step 4: Browser check**

Start `bun run dev`, open the site, verify the tab icon renders as Terminal Q,
and inspect that title, description, canonical, robots, OG/Twitter, and JSON-LD
metadata appear in the generated page.
