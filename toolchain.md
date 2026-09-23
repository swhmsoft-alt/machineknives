# Toolchain Rules — UTF-8 File I/O on zh-CN Windows

## The problem we hit

Every time a file gets written through PowerShell on zh-CN Windows (PowerShell
default `>` / `>>` / `Out-File` / `Set-Content` without `-Encoding utf8`),
characters outside GBK's repertoire get silently downgraded to `?` (0x3F) or
faked as a similar-looking CJK glyph. UTF-8 source `✓ 3D CAD + FEA` becomes
`鉁?3D CAD + FEA` on disk. The page then renders `鉁?3D CAD + FEA` in the
browser.

We lost three days to this on the `services/` and `industries/` pages because
the old `check-unicode.mjs` only flagged a hand-curated list of GBK fallback
code points — every new corruption (鉁, 鉂, 鈿, 揊, 路, …) needed a manual
rule addition.

The structural fix lives in two places:

1. `scripts/check-unicode.mjs` now flags **any** CJK Unified Ideograph
   (U+3400–U+4DBF, U+4E00–U+9FFF, U+F900–U+FAFF) inside the English-content
   directories. Future fallback code points are caught automatically.
2. This document + `.clinerules` + `.husky/pre-commit` + the `precommit` npm
   script **prevent new corruptions from being committed in the first place**.

## Hard rules (apply to every file write in this repo)

### 1. Allowed write paths

Pick exactly one of these:

- **Cline `editor` tool** — preferred. Writes UTF-8 directly, never touches
  PowerShell. Use for all `.astro`, `.ts`, `.md`, `.json`, `.yaml`, `.css`
  edits.
- **Node.js** `fs.writeFileSync(path, data, 'utf8')` — for any script that
  generates content (e.g., `scripts/postbuild.js`). Pipe through Node, never
  through the shell's redirection operator.
- **VS Code** with `"files.encoding": "utf8"` in user settings — for human
  edits outside Cline. Verify with `View → Command Palette → "Reopen with
  Encoding" → UTF-8` if in doubt.

### 2. Forbidden write paths (zh-CN Windows)

These silently corrupt UTF-8 to GBK and will produce mojibake in production:

- PowerShell `>` redirection: `echo "✓ text" > file.md`
- PowerShell `>>` append: `echo "more" >> file.md`
- `Out-File -FilePath file.md` (no `-Encoding utf8`)
- `Set-Content file.md 'text'` (no `-Encoding utf8`)
- `Add-Content file.md 'text'`
- `cmd /c "... > file"` (cmd's `>` also routes through PowerShell on
  zh-CN Windows when invoked from the Cline shell)
- `tee` (any variant) without explicit UTF-8

If you must use a shell for writes, force encoding explicitly:

```powershell
[System.IO.File]::WriteAllText('file.md', $content, [System.Text.UTF8Encoding]::new($false))
```

…or just don't use a shell. The Cline `editor` tool is faster anyway.

### 3. Post-write verification

After any file edit that contains non-ASCII characters, run:

```bash
node scripts/check-unicode.mjs
```

It must print `✓ Unicode check passed`. If it prints `✗ Unicode check FAILED`,
fix the file before moving on — do not write more files on top of corruption.

### 4. Pre-commit / pre-build

- `npm run check` (and therefore CI) runs `check-unicode.mjs` last. Any
  mojibake fails the build.
- Local pre-commit hook at `.husky/pre-commit` runs the same script. Enable
  once with: `git config core.hooksPath .husky`
- Manual fallback: `npm run precommit` runs the same checks.

## Where mojibake can legitimately appear

The check deliberately **excludes** these paths because they are intended to
contain Chinese content:

| Path | Reason |
|---|---|
| `src/prompts/**` | Chinese-language prompt templates for the bed-knife generator |
| `src/data/query-acquisition/**` | KPI docs and templates authored in zh-CN |
| `src/data/_templates/query-acquisition/**` | Schema / taxonomy templates |
| `src/data/monitor/**` | Chinese monitoring / frequency-tracker docs |
| `src/data/topics.ts` | Chinese topic vocabulary |
| `src/lib/schema.ts` | Chinese comments in the schema validator |
| `CUSTOM.md`, `AGENTS.md`, `docs/**` | Project-level Chinese documentation |
| `scripts/check-unicode.mjs`, `scripts/fix-unicode.mjs` | The CJK codepoints in the regexes are intentional |

If you ever add a new legitimate-Chinese directory under `src/`, append it
to the `TARGET_DIRS` exclusion list in `scripts/check-unicode.mjs` (the
exclusion is implicit — only `src/data/product`, `src/data/post`,
`src/data/glossary`, `src/pages` are scanned).

## Quick triage when CI flags mojibake

1. Run `node scripts/fix-unicode.mjs` — applies the rule table
   idempotently. If this fully clears the lint, commit.
2. If the lint still fails, run `node scripts/check-unicode.mjs` to see the
   offending code points. The codepoints in the output are the GBK fallback
   characters (e.g., `U+9261` for the `✓` fallback).
3. Add a new rule to the RULES table in `scripts/fix-unicode.mjs`:
   ```javascript
   ["<mojibake>", "<correct>"],
   ```
   Keep the rule **context-anchored** (longer = safer) when possible, so it
   cannot eat a legitimate occurrence of the same bytes elsewhere.
4. Re-run `node scripts/fix-unicode.mjs` and `node scripts/check-unicode.mjs`
   to confirm 0 findings.
5. Commit both the source file and the new rule together.

If the mojibake involves a missing digit (e.g., `4— weeks` where the original
was `4–6 weeks`), **do not guess** the missing digit. Mark the position
`[MISSING SPEC: lead-time upper bound]` and ask the user for the correct
value. Production data must never be silently invented.