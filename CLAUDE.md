# CLAUDE.md

@AGENTS.md

## Claude Code specifics

- Allowed commands (lint/build/format/dev, read-only git) are pre-approved
  in `.claude/settings.json` so routine checks don't need confirmation.
  Commits and pushes are intentionally left out of that list — always ask,
  or wait to be asked, before running them.
