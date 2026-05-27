# othavio-site

This is the canonical project guide for Claude Code. `AGENTS.md` is only the
Codex adapter and should point back here instead of becoming a second source of
truth.

## Project

- Next.js 16 App Router with React 19 and TypeScript 6.
- Bun is the package manager.
- UI uses Tailwind 4, shadcn v4 conventions, Base UI primitives, CVA variants,
  `lucide-react` icons, and `next-themes`.
- Shared class composition goes through `cn()` from `lib/utils.ts`.

## Commands

```bash
bun run dev
bun run build
bun run lint
bun run typecheck
bun run format
```

For docs-only changes, `git diff --check` is enough verification unless the diff
touches generated or formatted code.

## Next.js 16 rule

This is NOT the Next.js you know. APIs, conventions, and file structure may
differ from older training data. Before writing Next-specific code, read the
relevant guide in `node_modules/next/dist/docs/` and follow deprecation notices.

Useful starting points:

- App Router: `node_modules/next/dist/docs/01-app/index.md`
- App guides: `node_modules/next/dist/docs/01-app/02-guides/`
- Architecture: `node_modules/next/dist/docs/03-architecture/`

## Local conventions

- Keep `app/layout.tsx` as the root for fonts, global CSS, and
  `ThemeProvider`.
- `components/theme-provider.tsx` is a client component and owns the `d` hotkey
  for dark-mode toggling.
- Reuse existing `components/ui/*` patterns before adding a new component style.
- Prefer `lucide-react` icons when an icon exists.
- Keep Tailwind theme tokens in `app/globals.css`; avoid hard-coded one-off
  colors unless the component needs a specific local exception.

## Safety

- Do not commit, push, force-push, delete data, or kill processes without
  explicit approval.
- For UI changes, do not call the work complete without a real browser or visual
  check. Typecheck passing is not visual verification.
