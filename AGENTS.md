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

## Project structure

```
src/
  App.tsx            # root component
  main.tsx           # React entry point
  index.css          # Tailwind entry (`@import 'tailwindcss'`)
  store/              # Zustand stores, one file per store
    useCounterStore.ts
public/               # static assets served as-is
docs/design/           # design specs, tokens, and HTML/CSS prototypes
```

## Code style

- Formatting is enforced by Prettier (`.prettierrc.json`): no semicolons,
  single quotes, trailing commas, 80-char print width. Don't hand-format —
  run `npm run format` instead of manually matching style.
- ESLint (`eslint.config.js`) extends `typescript-eslint` recommended,
  `react-hooks`, and `react-refresh`, with `eslint-config-prettier` to avoid
  conflicts with Prettier. Fix lint warnings rather than disabling rules
  inline unless there's a clear reason (leave a comment if you do).
- Prefer function components with hooks; no class components.
- Style with Tailwind utility classes directly in JSX. Avoid new CSS files
  unless something can't be expressed with utilities.
- State: local component state via `useState`; cross-component/shared state
  via a Zustand store under `src/store/`, named `use<Thing>Store.ts`
  exporting `use<Thing>Store`. Keep store actions inside the store, not
  spread across components.
- TypeScript: avoid `any`; prefer explicit types on store/hook return values
  and component props.

## Git conventions

- Default branch: `main`. It is **protected**: direct pushes are rejected
  (also for admins), history is linear, force-pushes and deletions are
  blocked. All changes go through a pull request whose `checks` CI job is
  green and up to date with `main`. Workflow: create a branch
  (`feat/<short-name>`, `fix/<short-name>`, `chore/<short-name>`) → commit →
  push → `gh pr create` → merge (squash or rebase) once CI passes. No
  approving reviews are required, so the author can merge their own PR.
- Commit messages follow Conventional Commits, enforced by commitlint
  (`@commitlint/config-conventional`): `<type>: <short imperative summary>`
  with lowercase summary, no trailing period. Common types: `feat`, `fix`,
  `chore`, `refactor`, `docs`, `style`, `test`, `ci`, `build`. Body only if
  the change needs explaining. Example: `feat: add invoice list page`.
- Git hooks (husky) run automatically: `pre-commit` → lint-staged (ESLint
  `--fix` + Prettier on staged files), `commit-msg` → commitlint,
  `pre-push` → `npm run typecheck && npm run knip`. Don't bypass them with
  `--no-verify`; fix the underlying issue instead.
- Do not commit or push unless the user explicitly asks — prepare the
  change and let them review first, unless told otherwise for the session.
- Never commit `.env`, secrets, or `node_modules/` (already gitignored).

## Notes for agents

- The repository is a public GitHub repo:
  `oleg-kochura/accounting-test-assignment`. Don't commit anything that
  shouldn't be public (credentials, personal data, real accounting data).
- Node.js: developed against Node 22.x.
- Tailwind v4 has no config file by default — don't create
  `tailwind.config.js` unless you actually need custom theme values; add
  `@theme` blocks in `src/index.css` instead if so.
