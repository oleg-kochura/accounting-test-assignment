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

## Setup & commands

```bash
npm install          # install dependencies
npm run dev           # start dev server (http://localhost:5173)
npm run build         # type-check (tsc -b) + production build to dist/
npm run preview        # preview the production build
npm run lint           # ESLint
npm run lint:fix        # ESLint with autofix
npm run format          # Prettier --write
npm run format:check     # Prettier --check (no writes)
```

Before finishing any task, run `npm run lint`, `npm run format:check`, and
`npm run build`. All three must pass cleanly.

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

- Default branch: `main`.
- Commit messages: short, imperative summary line (e.g. "Add X", not
  "Added X" or "Adds X"); body only if the change needs explaining.
- Do not commit or push unless the user explicitly asks — prepare the
  change and let them review first, unless told otherwise for the session.
- Never commit `.env`, secrets, or `node_modules/` (already gitignored).

## Notes for agents

- The repository is a private GitHub repo:
  `oleg-kochura/accounting-test-assignment`.
- Node.js: developed against Node 22.x.
- Tailwind v4 has no config file by default — don't create
  `tailwind.config.js` unless you actually need custom theme values; add
  `@theme` blocks in `src/index.css` instead if so.
