# Terminal Q Icon And SEO Design

## Goal

Make the portfolio easier to recognize in browser tabs and search surfaces for
`Othavio`, `Othavio Quiliao`, and `Quiliao`.

## Icon

Use the approved Terminal Q direction: a compact geometric Q with a warm
near-black background, bone stroke, and orange accent tail. The mark should stay
legible at 16px and 32px, matching the terminal-native visual language already
used by the site.

## Metadata

Keep `Othavio Quiliao` as the primary title and author. Expand metadata with:

- Search aliases through `keywords`.
- Canonical URL through `alternates.canonical`.
- `authors`, `creator`, and `publisher` set to Othavio Quiliao.
- Open Graph and Twitter metadata using the existing generated OG image.
- JSON-LD `Person` data with `alternateName` values for `Othavio` and
  `Quiliao`, same-as links, job title, and project description.

## Crawlability

Add generated `robots.ts` and `sitemap.ts` route files under `app/`, pointing to
`https://othavio.com` and allowing normal indexing.

## Verification

Run the focused Bun test, typecheck, build, and a real browser check for favicon
and generated metadata. Do not commit unless the user explicitly asks.
