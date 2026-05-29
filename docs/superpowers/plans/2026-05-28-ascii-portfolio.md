# ASCII Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the approved ASCII-first portfolio template.

**Architecture:** `app/page.tsx` remains a server component and composes shadcn UI with small client-only animation islands. Pure deterministic ASCII mark generation lives in `lib/ascii-field.ts` with Bun tests, while browser animation lives in `components/ascii/*`.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript 6, Bun, Tailwind 4, shadcn/base UI, `react-ascii-text`.

---

### Task 1: Deterministic ASCII field helper

**Files:**
- Create: `lib/ascii-field.test.ts`
- Create: `lib/ascii-field.ts`

- [ ] Write Bun tests for stable output, varied symbols, and bounded coordinates.
- [ ] Run `bun test lib/ascii-field.test.ts` and verify the missing module failure.
- [ ] Implement `generateAsciiMarks` and rerun the test.

### Task 2: Client animation components

**Files:**
- Create: `components/ascii/ascii-wordmark.tsx`
- Create: `components/ascii/ascii-field.tsx`

- [ ] Build a client `AsciiWordmark` around `react-ascii-text` with reduced-motion pausing.
- [ ] Build a client `AsciiField` from the tested helper using transform-only parallax.

### Task 3: Portfolio page and styling

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/globals.css`

- [ ] Replace the starter page with the shadcn Card-based portfolio shell.
- [ ] Add scoped keyframes and motion fallbacks in `app/globals.css`.
- [ ] Run `bun run typecheck`, `bun run lint`, and a production build.
