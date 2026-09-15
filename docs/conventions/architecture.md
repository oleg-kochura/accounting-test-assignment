# Architecture & code style

Folder structure, code style, and types organization for
`accounting-test-assignment`. See `AGENTS.md` for the project overview
and commands.

## Project structure

```
src/
  App.tsx                         # renders <TemplateCustomizer />
  main.tsx                        # React entry point
  index.css                       # Tailwind entry + design-token @theme block
  types/invoiceTemplate.ts        # InvoiceTemplate data model
  store/useInvoiceTemplateStore.ts
  lib/                            # generic, feature-agnostic helpers
    amount.ts                     # parse/validate/format/sanitize money input
    id.ts                         # id generation (secure-context fallback)
  components/ui/                  # domain-agnostic primitives
    Button/                        # Component.tsx + index.ts + types/
    TextField/
    ColorField/
    Toggle/
    Tabs/
  features/template-editor/
    TemplateCustomizer/           # screen shell: two panels (+ types/)
    EditorSidebar/
    GeneralTab/
    ContentTab/                   # line items + discount form
    LineItemsEditor/              # list of line cards, add/remove (+ types/)
    LogoField/
    PaymentMethodsRow/
    EditorFooter/
  features/invoice-preview/
    InvoicePreview/                # (+ types/)
    InvoiceHeader/                 # (+ types/)
    InvoiceMeta/                   # (+ types/)
    InvoiceParties/                # (+ types/)
    InvoiceLineItems/              # (+ types/)
    InvoiceTotals/                 # (+ types/)
    InvoiceFooterText/             # (+ types/)
    types/                        # feature-local shared types (calculateInvoice/mockInvoice)
    calculateInvoice.ts           # combines line items + tax rates (lib/amount.ts helpers)
    mockInvoice.ts                # fixed document data (no amounts)
public/                           # static assets served as-is
docs/design/                      # design specs, tokens, and HTML/CSS prototypes
docs/conventions/                 # this file and other agent-facing convention docs
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
- Tailwind v4 has no config file by default — don't create
  `tailwind.config.js` unless you actually need custom theme values; add
  `@theme` blocks in `src/index.css` instead if so.
- State: local component state via `useState`; cross-component/shared state
  via a Zustand store under `src/store/`, named `use<Thing>Store.ts`
  exporting `use<Thing>Store`. Keep store actions inside the store, not
  spread across components.
- Components: one folder per component, named after it
  (`ComponentName/ComponentName.tsx` + `ComponentName/index.ts` doing
  `export { ComponentName } from './ComponentName'`). Named exports only
  — no default exports except `App.tsx`. Anything private to a component
  (helpers, sub-parts) stays inside its folder and isn't re-exported from
  the barrel; re-export a props type from the barrel only when another
  module imports it directly.
- TypeScript: avoid `any`; prefer explicit types on store/hook return values
  and component props.
- Types: shared/project-wide types (used across the store and multiple
  features) live in `src/types/<domain>.ts` (e.g. `invoiceTemplate.ts`).
  Types local to one component or feature folder live in a `types/`
  subfolder inside that folder — one file per component,
  `types/<ComponentName>.types.ts`, re-exported via `types/index.ts`
  (mirrors the `Component.tsx` + `index.ts` pattern above). As with
  component barrels, only re-export from `types/index.ts` what's
  imported from outside the folder — don't blanket re-export types
  nothing else consumes.

## React performance guidelines

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
