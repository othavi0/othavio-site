# Codex adapter

`CLAUDE.md` is the canonical project guide. Read it before editing code or docs:

```bash
rtk sed -n '1,260p' CLAUDE.md
```

If a task depends on global workflow, tooling, communication style, or safety
rules, also read `/home/othavio/.claude/CLAUDE.md`.

## Global setup adapted for Amp

- Respond in Portuguese by default. Keep identifiers, commands, package names,
  and literal errors in English.
- Be rigorous: investigate root cause before patching; if using a workaround,
  say so explicitly. Prefer "não sei" / "não testei" over guessing.
- For non-trivial work, explore first, outline the approach briefly, then
  implement. Skip the plan only for obvious typos, renames, or tiny diffs.
- Parallelize independent reads/searches when useful, but do not run destructive
  or mutating shell commands in parallel with file edits.
- Ask only when ambiguity changes the outcome. Use 1-2 focused questions with
  clear options; otherwise choose from project conventions and continue.
- Surface relevant adjacent findings briefly, without expanding scope unless the
  user asks.
- Never commit, push, force-push, delete data, kill processes, or change shared
  config irreversibly without explicit approval.
- Before claiming work is complete, run the narrowest meaningful verification
  and report what was actually checked. For UI changes, do not call it complete
  without a real browser/visual check.
- Use Conventional Commit style in Portuguese when drafting commit messages;
  keep the subject under 50 characters.

## Next.js rule

This is NOT the Next.js you know. The project uses Next.js 16, whose APIs,
conventions, and file structure may differ from older training data. Before
writing Next-specific code, read the relevant guide in
`node_modules/next/dist/docs/` and heed deprecation notices.
