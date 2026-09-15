# Git workflow

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
