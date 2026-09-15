# AGENTS.md

Instructions for AI coding agents (Claude Code, Cursor, Codex, etc.) working
in this repository. Human contributors can use `README.md` instead.

## Project overview

`accounting-test-assignment` — a React + TypeScript single-page app.

**Stack**

- React 19, TypeScript
- Vite 8 (build tool / dev server)
- Zustand 5 (state management)
- Tailwind CSS v4 (via `@tailwindcss/vite`, no `tailwind.config.js`)
- ESLint (flat config) + Prettier
- Husky + lint-staged + commitlint (git hooks), Knip, GitHub Actions CI

## Setup & commands

```bash
npm install          # install dependencies (+ git hooks via husky)
npm run dev           # start dev server (http://localhost:5173)
npm run build         # type-check (tsc -b) + production build to dist/
npm run preview        # preview the production build
npm run lint           # ESLint
npm run lint:fix        # ESLint with autofix
npm run format          # Prettier --write
npm run format:check     # Prettier --check (no writes)
npm run typecheck        # tsc -b
npm run knip             # unused files / exports / dependencies
```

Before finishing any task, run `npm run lint`, `npm run format:check`,
`npm run typecheck`, `npm run knip`, and `npm run build`. All must pass
cleanly — CI (`.github/workflows/ci.yml`) runs exactly these checks.

If knip flags something you legitimately need (e.g. a dependency used only
via a config file it can't see), add it to a `knip.json` with a comment
explaining why, rather than deleting it or ignoring the failure.

There is currently no test suite. If you add one, wire it into these
commands and update this file.

## Project conventions

- Architecture, folder structure, code style (including types
  organization), and React performance guidelines: see
  [`docs/conventions/architecture.md`](docs/conventions/architecture.md).
- Git workflow (branching, commits, PRs, hooks): see
  [`docs/conventions/git-workflow.md`](docs/conventions/git-workflow.md).

## Notes for agents

- The repository is a public GitHub repo:
  `oleg-kochura/accounting-test-assignment`. Don't commit anything that
  shouldn't be public (credentials, personal data, real accounting data).
- Node.js: developed against Node 22.x.
