# Amp / agent adapter

`CLAUDE.md` is the canonical project guide. This file exists only to adapt that
guide for Amp and other agents; do not let it become a second source of truth.

Before editing code or docs, read:

```bash
rtk sed -n '1,260p' CLAUDE.md
```

If a task depends on the user's global workflow, communication style, tooling, or
safety rules, also read:

```bash
rtk sed -n '1,220p' /home/othavio/.claude/CLAUDE.md
```

## Project stack

- Next.js 16.2 App Router, React 19, TypeScript 6, Bun.
- Tailwind CSS 4 with tokens in `app/globals.css`.
- shadcn v4 / Base UI conventions from `components.json`.
- UI composition should reuse `components/ui/*`, `cn()` from `lib/utils.ts`,
  `lucide-react` icons, and `next-themes`.

## Installed project skills

Project skills live in `.agents/skills/` and are tracked by `skills-lock.json`.
Use them when their trigger matches the task:

- `shadcn` — shadcn components, registries, presets, component docs, and UI
  composition. For component work, run project-aware shadcn commands with Bun,
  e.g. `bunx --bun shadcn@latest info --json` and
  `bunx --bun shadcn@latest docs <component>`.
- `vercel-react-best-practices` — React/Next.js performance, data fetching,
  bundle size, RSC serialization, Suspense, and render optimization.
- `vercel-composition-patterns` — reusable React component APIs, compound
  components, render props, slots, and avoiding boolean-prop proliferation.
- `web-design-guidelines` — UI, UX, accessibility, focus, forms, motion,
  typography, responsive behavior, and dark-mode review.

## Next.js 16 rule

This is NOT the Next.js you know. Before writing Next-specific code, read the
relevant version-matched docs in `node_modules/next/dist/docs/` and follow
deprecation notices. Useful starting points:

- App Router: `node_modules/next/dist/docs/01-app/index.md`
- App guides: `node_modules/next/dist/docs/01-app/02-guides/`
- Architecture: `node_modules/next/dist/docs/03-architecture/`

The official Next.js agent guidance says this file should redirect agents to the
bundled docs instead of relying on training data.
