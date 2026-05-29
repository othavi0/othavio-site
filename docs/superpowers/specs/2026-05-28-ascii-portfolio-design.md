# ASCII Portfolio Design

## Goal

Create a dark, minimal developer portfolio template that uses real ASCII art as the hero, shadcn components as the structural system, and a small custom ASCII animation layer for distinctiveness.

## Direction

- Base visual: Figlet ASCII hero inside a refined shadcn `Card` shell.
- Primary audience: developers, technical peers, and recruiters who value craft.
- Content: placeholder name, senior developer headline, short subcopy, GitHub, LinkedIn, and X links.
- Motion: ASCII intro via `react-ascii-text`, shell reveal, parallax ASCII residue, subtle hover/focus feedback, and reduced-motion fallbacks.
- Avoid: fake frontmatter, profile.yml labels, neon hacker aesthetics, heavy horizontal lines, gradient text, generic card grids, and UI that looks AI-generated.

## Implementation Notes

- Keep `app/page.tsx` as a server component.
- Put browser-driven ASCII animation in small client components.
- Use `react-ascii-text` for the real Figlet hero.
- Create a custom deterministic ASCII field helper and a client parallax component built on top of it.
- Use shadcn `Card` composition and the existing `buttonVariants` helper for semantic links.
