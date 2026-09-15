# Frontend architecture & code style

Conventions for how the React app under `src/` is structured and styled.
See `AGENTS.md` for setup, commands, and git workflow.

## Folder layout

```
src/
  types/           # data model types (e.g. InvoiceTemplate)
  store/           # Zustand stores, one file per store
  lib/             # generic, feature-agnostic helpers
  components/ui/   # domain-agnostic primitives (Button, TextField, ...)
  features/        # one directory per feature, each owning its screens
    template-editor/   # sidebar + tabs for building a template
    invoice-preview/    # renders the live invoice preview
public/            # static assets served as-is
docs/design/       # design specs, tokens, and HTML/CSS prototypes
```

Within a feature directory, each screen/part gets its own component
folder (see **Components** below) — browse the directory itself for the
current list rather than duplicating it here.

## Conventions

### Components

- One component per file, one folder per component, named after it
  (`ComponentName/ComponentName.tsx` + `ComponentName/index.ts` doing
  `export { ComponentName } from './ComponentName'`).
- Named exports only — no default exports except `App.tsx`.
- Anything private to a component (helpers, sub-parts) stays inside its
  folder and isn't re-exported from the barrel; re-export a props type
  from the barrel only when another module imports it directly.
- A component's own child components live in a `components/` subfolder
  inside its folder (`ParentComponent/components/ChildComponent/`). If a
  child component ends up used somewhere else too, move it out of that
  `components/` subfolder into a shared location instead: `components/ui/`
  if it's a primitive, otherwise the top level of the owning feature.
- Prefer function components with hooks; no class components.

### Imports

- Absolute imports are available for every top-level `src/` folder as bare
  specifiers — `assets/*`, `components/*`, `features/*`, `lib/*`, `store/*`,
  `types/*` — plus a catch-all `src/*`. Configured in `vite.config.ts`
  (`resolve.alias`) and mirrored in `tsconfig.app.json`
  (`compilerOptions.paths`); keep the two in sync, including when adding a
  new top-level `src/` folder.
- Use an alias for anything crossing into another top-level `src/` folder
  or another feature. Keep relative imports (`./`, `../`) for sibling files
  within the same feature or component folder.

### Styling

- Style with Tailwind utility classes directly in JSX. Avoid new CSS
  files unless something can't be expressed with utilities.

## Performance guidelines

- When writing, reviewing, or refactoring React code under `src/`, apply
  the `vercel-react-best-practices` guidelines vendored at
  `.claude/skills/vercel-react-best-practices/` (see `SKILL.md` for the
  rule index, `rules/*.md` for individual rules, `AGENTS.md` for the full
  compiled guide). In Claude Code, invoke it as a Skill; other agents
  should just read the files directly.
- This project is a Vite SPA, not Next.js, so skip the Next.js/RSC-only
  rules (`server-*` App Router/server-action/RSC rules,
  `bundle-dynamic-imports` via `next/dynamic`, `rendering-hydration-*`,
  etc.). Focus on what applies to a client-only React app: bundle size,
  re-render, rendering, and JS performance categories.
