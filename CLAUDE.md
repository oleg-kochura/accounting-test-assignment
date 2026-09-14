# CLAUDE.md

Project instructions for Claude Code. The full agent guide (stack, commands,
code style, conventions) lives in AGENTS.md and applies here too:

@AGENTS.md

## Claude Code specifics

- Allowed commands (lint/build/format/dev, read-only git) are pre-approved
  in `.claude/settings.json` so routine checks don't need confirmation.
  Commits and pushes are intentionally left out of that list — always ask,
  or wait to be asked, before running them.
- After any code change, run `npm run lint`, `npm run format:check`, and
  `npm run build` before reporting the task done.
