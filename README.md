# accounting-test-assignment

Test assignment for an accounting position.

## Stack

- React 19 + TypeScript
- Vite
- Zustand (state management)
- Tailwind CSS v4
- ESLint + Prettier
- Husky + lint-staged + commitlint (git hooks)
- Knip (unused files / exports / dependencies)
- GitHub Actions CI

## Getting started

```bash
npm install   # also installs git hooks via husky
npm run dev
```

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — type-check and build for production
- `npm run preview` — preview the production build
- `npm run lint` — run ESLint
- `npm run lint:fix` — run ESLint with autofix
- `npm run format` — format the codebase with Prettier
- `npm run format:check` — check formatting without writing
- `npm run typecheck` — TypeScript type check (`tsc -b`)
- `npm run knip` — find unused files, exports and dependencies

## Git hooks

- **pre-commit** — `lint-staged`: ESLint `--fix` + Prettier on staged files
- **commit-msg** — `commitlint` enforces [Conventional Commits](https://www.conventionalcommits.org/)
  (`feat: ...`, `fix: ...`, `chore: ...`, …)
- **pre-push** — `npm run typecheck && npm run knip`

## CI

`.github/workflows/ci.yml` runs on pushes to `main` and on pull requests.
Static checks run in parallel; the build only runs once all of them pass:

```
Lint ─┐
Format ─┤
Typecheck ─┼─▶ Build
Knip ─┘
```

All five jobs are required status checks on `main`.
