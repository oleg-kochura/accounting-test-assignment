# Content Tab Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the "Coming soon" placeholder on the Content tab with an
editable list of invoice line items plus a Discount field, and make the
preview compute Subtotal / taxes / Total / Balance due from them.

**Architecture:** `ContentSettings` (line items + discount, numeric fields
kept as raw strings) joins the existing `saved`/`draft` snapshots in
`useInvoiceTemplateStore`; four new store actions are the only writers. A
pure module `calculateInvoice.ts` parses, validates, computes and formats
money; `InvoicePreview` calls it once per render and feeds the existing
presentational leaves. `LineItemsEditor` (new) and `ContentTab` (rewritten)
read the store through narrow selectors, mirroring `GeneralTab`.

**Tech Stack:** React 19, TypeScript, Tailwind CSS v4, Zustand 5,
`radix-ui` (already used by `Tabs`/`Toggle`). No test framework — the user
explicitly declined one; verification per task is
`npm run typecheck && npm run lint`, and the final task runs the full CI
set plus the spec's manual checklist.

**Spec:** `docs/superpowers/specs/2026-09-15-content-tab-design.md`
(functional spec — data model, formulas, store, components, checklist).
`docs/design/invoice-template-customizer-final.html` (working prototype
with the Content tab — visual source of truth for markup/spacing; its
inline JS mirrors the spec's `calculateInvoice`). The base customizer
spec `docs/superpowers/specs/2026-09-14-invoice-template-customizer-design.md`
describes everything already in place.

## Global Constraints

- Component folder convention: `Name/Name.tsx` + `Name/index.ts` barrel
  with a named re-export; no default exports; consumers import from the
  folder (`import { LineItemsEditor } from '../LineItemsEditor'`).
- Prettier: no semicolons, single quotes, trailing commas, 80-char width.
  Never hand-format — run `npm run format` on touched files.
- Store actions live in the store, not in components. No `any`.
- Tailwind utilities in JSX only; no new CSS files; design tokens already
  exist as `@theme` values in `src/index.css` (`border-border`,
  `text-muted-text`, `rounded-lg`, `gap-2.5`, `text-md`, etc.).
- Preview table keeps exactly four columns: Item / Description / Rate /
  Total. No Qty column.
- Every money value in the preview goes through `formatMoney` →
  `$1,000.00` style.
- Numeric drafts (`quantity`, `rate`, `discount`) are `string`s in state.
- Copy (verbatim from the spec/prototype): tab heading "Invoice content";
  group heading "Line items"; buttons "Add item", "Remove"; labels "Item",
  "Description", "Qty", "Rate", "Discount"; placeholders "e.g. Web
  development", "What was delivered", "0.00"; hints "Price per unit",
  "Applied before tax."; errors "Enter a non-negative number." (Qty/Rate),
  "Enter a non-negative amount." (Discount).
- Commits: Conventional Commits, lowercase summary, no trailing period.
  Husky hooks run lint-staged / commitlint / typecheck+knip — never
  bypass with `--no-verify`. Do not push or open the PR until Task 6 and
  only when the user has asked for it.
- Work on branch `feat/content-tab` off an up-to-date `main`.

---

### Task 1: Branch and commit the updated design prototype

**Files:**

- Commit (already in the working tree, not yet committed):
  `docs/design/invoice-template-customizer-final.html` (modified),
  `docs/superpowers/plans/2026-09-15-content-tab.md` (this plan, untracked)

**Interfaces:**

- Consumes: nothing.
- Produces: branch `feat/content-tab` with the prototype update as its
  first commit, so later tasks can reference the prototype from git.

- [ ] **Step 1: Confirm the starting state**

Run: `git status --short && git log --oneline -1`
Expected: exactly two lines — ` M docs/design/invoice-template-customizer-final.html`
and `?? docs/superpowers/plans/2026-09-15-content-tab.md` — and HEAD at
`62e682b docs: add content tab design spec (#8)` (or a later `main`
commit). If other files are modified, stop and ask.

- [ ] **Step 2: Create the branch**

Run: `git checkout -b feat/content-tab`

- [ ] **Step 3: Commit the prototype**

```bash
git add docs/design/invoice-template-customizer-final.html docs/superpowers/plans/2026-09-15-content-tab.md
git commit -m "docs: add content tab prototype and implementation plan"
```

Expected: lint-staged runs Prettier on the file (it may reformat
nothing), commitlint accepts the message.

---

### Task 2: Data model — `LineItemDraft`, `ContentSettings`, defaults

**Files:**

- Modify: `src/types/invoiceTemplate.ts`

**Interfaces:**

- Consumes: nothing new.
- Produces (used by Tasks 3–5):
  - `export interface LineItemDraft { id: string; item: string; description: string; quantity: string; rate: string }`
  - `export interface ContentSettings { lineItems: LineItemDraft[]; discount: string }`
  - `DEFAULT_TEMPLATE.content` populated with one line
    (`id: 'default-line'`, Web development, qty `'1'`, rate `'1000'`) and
    `discount: '0'`.

- [ ] **Step 1: Replace the empty `ContentSettings`**

Edit `src/types/invoiceTemplate.ts` so it reads:

```ts
export type LogoSource = {
  name: string
  size: number
  dataUrl: string
} | null

export interface BrandingSettings {
  primaryColor: string
  secondaryColor: string
  showLogo: boolean
  logo: LogoSource
}

export interface LineItemDraft {
  id: string
  item: string
  description: string
  // Numeric fields are kept as the raw input text so a controlled input
  // can hold '' or '1.' while the user types; parsing happens in
  // calculateInvoice.ts.
  quantity: string
  rate: string
}

export interface ContentSettings {
  lineItems: LineItemDraft[]
  discount: string
}

export interface InvoiceTemplate {
  name: string
  branding: BrandingSettings
  content: ContentSettings
}

export type EditorTab = 'general' | 'content'

export const DEFAULT_TEMPLATE: InvoiceTemplate = {
  name: 'Standard Template',
  branding: {
    primaryColor: '#2c3dd8',
    secondaryColor: '#475569',
    showLogo: true,
    logo: null,
  },
  content: {
    lineItems: [
      {
        // Fixed id (not randomUUID) so saved and draft start identical.
        id: 'default-line',
        item: 'Web development',
        description: 'Website development with content and SEO optimization',
        quantity: '1',
        rate: '1000',
      },
    ],
    discount: '0',
  },
}
```

- [ ] **Step 2: Type-check and lint**

Run: `npm run typecheck && npm run lint`
Expected: both pass. (`ContentSettings` is now exported but only used
inside this file until Task 3 — knip is not run in this task, so that is
fine.)

- [ ] **Step 3: Commit**

```bash
git add src/types/invoiceTemplate.ts
git commit -m "feat: add line items and discount to template content model"
```

---

### Task 3: Calculation module, mock data, computed preview

**Files:**

- Create: `src/features/invoice-preview/calculateInvoice.ts`
- Modify: `src/features/invoice-preview/mockInvoice.ts`
- Modify: `src/features/invoice-preview/InvoiceLineItems/InvoiceLineItems.tsx`
- Modify: `src/features/invoice-preview/InvoiceTotals/InvoiceTotals.tsx`
- Modify: `src/features/invoice-preview/InvoicePreview/InvoicePreview.tsx`

**Interfaces:**

- Consumes: `ContentSettings`, `LineItemDraft` (Task 2).
- Produces (used by Tasks 4–5):
  - `parseAmount(raw: string): number` — lenient, `''`/invalid/negative → `0`.
  - `isValidAmount(raw: string): boolean` — strict, used by validation.
  - `formatMoney(value: number): string` — `$1,000.00`.
  - `calculateInvoice(content: ContentSettings, invoice: InvoiceData): CalculatedInvoice`.
  - `CalculatedLine`, `CalculatedTax`, `CalculatedInvoice` types.
  - `InvoiceData` no longer has `lineItems`, `subtotal`, `discount`,
    `total`, `balanceDue`; `taxes: { label: string; rate: number }[]`;
    `paymentMade: number`.

- [ ] **Step 1: Slim down the mock document**

Replace the whole of `src/features/invoice-preview/mockInvoice.ts` with:

```ts
export interface InvoiceParty {
  name: string
  addressLines: string[]
  phone: string
}

export interface InvoiceTax {
  label: string
  rate: number
}

// Fixed document data. Amounts (line items, discount, totals) are not
// here: they come from the template's content settings and are computed
// in calculateInvoice.ts.
export interface InvoiceData {
  invoiceNumber: string
  dateOfIssue: string
  dueDate: string
  seller: InvoiceParty
  billedTo: InvoiceParty
  taxes: InvoiceTax[]
  paymentMade: number
  termsAndConditions: string
  statement: string
}

export const MOCK_INVOICE: InvoiceData = {
  invoiceNumber: '346D3D40-0001',
  dateOfIssue: 'September 3, 2024',
  dueDate: 'September 3, 2024',
  seller: {
    name: 'BIGCAPITAL, INC',
    addressLines: [
      '131 Continental Dr Suite 305 Newark,',
      'Dr Suite 305',
      'Newark, Delaware 19131',
      'United State',
    ],
    phone: '+1 762-339-5634',
  },
  billedTo: {
    name: 'Bigcapital Technology, Inc.',
    addressLines: [
      '131 Continental Dr,',
      'Suite 305,',
      'Newark, Delaware 19713,',
      'United States,',
    ],
    phone: '+1 762-339-5634',
  },
  taxes: [
    { label: 'Sample Tax1 (4.70%)', rate: 0.047 },
    { label: 'Sample Tax2 (7.00%)', rate: 0.07 },
  ],
  paymentMade: 100,
  termsAndConditions:
    'All services provided are non-refundable. For any disputes, please contact us within 7 days of receiving this invoice.',
  statement:
    'Thank you for your business. We look forward to working with you again!',
}
```

- [ ] **Step 2: Create the calculation module**

Create `src/features/invoice-preview/calculateInvoice.ts`:

```ts
import type { ContentSettings } from '../../types/invoiceTemplate'
import type { InvoiceData } from './mockInvoice'

export interface CalculatedLine {
  id: string
  item: string
  description: string
  rate: number
  total: number
}

export interface CalculatedTax {
  label: string
  amount: number
}

export interface CalculatedInvoice {
  lines: CalculatedLine[]
  subtotal: number
  discount: number
  taxes: CalculatedTax[]
  total: number
  paymentMade: number
  balanceDue: number
}

const MONEY = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

const round2 = (value: number): number => Math.round(value * 100) / 100

// Lenient: the preview must always render while the user is mid-edit.
// '', 'abc', '-5' and 'Infinity' all become 0. Strictness lives in
// isValidAmount, which gates Save.
export function parseAmount(raw: string): number {
  const n = Number(raw.trim())
  return Number.isFinite(n) && n > 0 ? n : 0
}

export function isValidAmount(raw: string): boolean {
  const value = raw.trim()
  if (value === '') return false
  const n = Number(value)
  return Number.isFinite(n) && n >= 0
}

export function formatMoney(value: number): string {
  return MONEY.format(value)
}

export function calculateInvoice(
  content: ContentSettings,
  invoice: InvoiceData,
): CalculatedInvoice {
  const lines = content.lineItems.map((line) => {
    const rate = parseAmount(line.rate)
    return {
      id: line.id,
      item: line.item,
      description: line.description,
      rate,
      total: round2(parseAmount(line.quantity) * rate),
    }
  })
  const subtotal = round2(lines.reduce((sum, line) => sum + line.total, 0))
  const discount = parseAmount(content.discount)
  const taxBase = round2(subtotal - discount)
  const taxes = invoice.taxes.map((tax) => ({
    label: tax.label,
    amount: round2(taxBase * tax.rate),
  }))
  const total = round2(
    taxBase + taxes.reduce((sum, tax) => sum + tax.amount, 0),
  )
  return {
    lines,
    subtotal,
    discount,
    taxes,
    total,
    paymentMade: invoice.paymentMade,
    balanceDue: round2(total - invoice.paymentMade),
  }
}
```

- [ ] **Step 3: Render computed lines in the table**

Replace `src/features/invoice-preview/InvoiceLineItems/InvoiceLineItems.tsx`
with (only the props type, the `key`, and the two money cells change;
columns/widths stay as they are):

```tsx
import { formatMoney, type CalculatedLine } from '../calculateInvoice'

export interface InvoiceLineItemsProps {
  lines: CalculatedLine[]
}

function Th({
  children,
  width,
  align,
}: {
  children: string
  width: string
  align?: 'right'
}) {
  return (
    <th
      style={{ width }}
      className={`border-b border-(--secondary) pb-2 ${align === 'right' ? 'text-right' : 'text-left'}`}
    >
      <span className="text-xs font-semibold tracking-widest text-(--secondary) uppercase">
        {children}
      </span>
    </th>
  )
}

export function InvoiceLineItems({ lines }: InvoiceLineItemsProps) {
  return (
    <table className="w-full border-collapse">
      <thead>
        <tr>
          <Th width="26%">Item</Th>
          <Th width="auto">Description</Th>
          <Th width="12%" align="right">
            Rate
          </Th>
          <Th width="16%" align="right">
            Total
          </Th>
        </tr>
      </thead>
      <tbody>
        {lines.map((line) => (
          <tr key={line.id}>
            <td className="border-b border-border py-3 align-top">
              {line.item}
            </td>
            <td className="border-b border-border py-3 align-top text-muted-text">
              {line.description}
            </td>
            <td className="border-b border-border py-3 text-right align-top font-mono tabular-nums">
              {formatMoney(line.rate)}
            </td>
            <td className="border-b border-border py-3 text-right align-top font-mono tabular-nums">
              {formatMoney(line.total)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
```

- [ ] **Step 4: Decouple `InvoiceTotals` from the mock's tax type**

In `src/features/invoice-preview/InvoiceTotals/InvoiceTotals.tsx` replace
the import and the `taxes` prop type. The top of the file becomes:

```tsx
export interface InvoiceTotalsTax {
  label: string
  amount: string
}

export interface InvoiceTotalsProps {
  subtotal: string
  discount: string
  taxes: InvoiceTotalsTax[]
  total: string
  paymentMade: string
  balanceDue: string
}
```

(Delete the line `import type { InvoiceTax } from '../mockInvoice'`.
`Row` and the `InvoiceTotals` body are unchanged — it already renders
whatever strings it receives.)

- [ ] **Step 5: Compute in `InvoicePreview` and pass formatted values down**

Replace `src/features/invoice-preview/InvoicePreview/InvoicePreview.tsx`
with:

```tsx
import type { CSSProperties } from 'react'
import type { InvoiceTemplate } from '../../../types/invoiceTemplate'
import type { InvoiceData } from '../mockInvoice'
import { calculateInvoice, formatMoney } from '../calculateInvoice'
import { InvoiceHeader } from '../InvoiceHeader'
import { InvoiceMeta } from '../InvoiceMeta'
import { InvoiceParties } from '../InvoiceParties'
import { InvoiceLineItems } from '../InvoiceLineItems'
import { InvoiceTotals } from '../InvoiceTotals'
import { InvoiceFooterText } from '../InvoiceFooterText'

export interface InvoicePreviewProps {
  template: InvoiceTemplate
  invoice: InvoiceData
}

export function InvoicePreview({ template, invoice }: InvoicePreviewProps) {
  const style = {
    '--primary': template.branding.primaryColor,
    '--secondary': template.branding.secondaryColor,
  } as CSSProperties

  // Cheap (a handful of rows), so recomputed on every render rather than
  // memoised.
  const calc = calculateInvoice(template.content, invoice)

  return (
    <article
      aria-label="Invoice preview"
      style={style}
      className="w-full overflow-hidden rounded-xs border border-border bg-surface text-md leading-relaxed shadow-md"
    >
      <div aria-hidden="true" className="h-1.5 bg-(--primary)" />
      <div className="flex flex-col gap-9 px-13 pt-11 pb-13">
        <InvoiceHeader
          showLogo={template.branding.showLogo}
          logo={template.branding.logo}
        />
        <InvoiceMeta
          invoiceNumber={invoice.invoiceNumber}
          dateOfIssue={invoice.dateOfIssue}
          dueDate={invoice.dueDate}
        />
        <InvoiceParties seller={invoice.seller} billedTo={invoice.billedTo} />
        <InvoiceLineItems lines={calc.lines} />
        <InvoiceTotals
          subtotal={formatMoney(calc.subtotal)}
          discount={formatMoney(calc.discount)}
          taxes={calc.taxes.map((tax) => ({
            label: tax.label,
            amount: formatMoney(tax.amount),
          }))}
          total={formatMoney(calc.total)}
          paymentMade={formatMoney(calc.paymentMade)}
          balanceDue={formatMoney(calc.balanceDue)}
        />
        <InvoiceFooterText
          termsAndConditions={invoice.termsAndConditions}
          statement={invoice.statement}
        />
      </div>
    </article>
  )
}
```

- [ ] **Step 6: Format, type-check, lint, knip**

Run: `npm run format && npm run typecheck && npm run lint && npm run knip`
Expected: all pass. If knip reports an unused export (e.g.
`InvoiceTotalsTax`, `CalculatedTax`, `parseAmount` — each is only used
inside its own file), drop the `export` keyword from that declaration;
do not add a knip ignore.

- [ ] **Step 7: Verify in the browser**

Run: `npm run dev`, open http://localhost:5173.
Expected preview values with the defaults: Rate `$1,000.00`, Total
`$1,000.00`, Subtotal `$1,000.00`, Discount `$0.00`, Sample Tax1 (4.70%)
`$47.00`, Sample Tax2 (7.00%) `$70.00`, Total `$1,117.00`, Payment made
`$100.00`, Balance due `$1,017.00`. Table still has four columns. Stop
the dev server afterwards.

- [ ] **Step 8: Commit**

```bash
git add src/features/invoice-preview
git commit -m "feat: compute invoice totals from template content"
```

---

### Task 4: Store actions and selectors for content

**Files:**

- Modify: `src/store/useInvoiceTemplateStore.ts`

**Interfaces:**

- Consumes: `LineItemDraft`, `ContentSettings` (Task 2); `isValidAmount`
  (Task 3).
- Produces (used by Task 5):
  - `addLineItem: () => void`
  - `updateLineItem: (id: string, patch: Partial<Omit<LineItemDraft, 'id'>>) => void`
  - `removeLineItem: (id: string) => void` — no-op when one line remains.
  - `setDiscount: (discount: string) => void`
  - `selectIsDirty` now compares whole snapshots; `selectIsValid` now
    also checks content amounts.

- [ ] **Step 1: Rewrite the store file**

Replace `src/store/useInvoiceTemplateStore.ts` with:

```ts
import { create } from 'zustand'
import { isValidAmount } from '../features/invoice-preview/calculateInvoice'
import {
  DEFAULT_TEMPLATE,
  type BrandingSettings,
  type ContentSettings,
  type EditorTab,
  type InvoiceTemplate,
  type LineItemDraft,
} from '../types/invoiceTemplate'

export interface InvoiceTemplateState {
  saved: InvoiceTemplate
  draft: InvoiceTemplate
  activeTab: EditorTab
  setName: (name: string) => void
  updateBranding: (patch: Partial<BrandingSettings>) => void
  addLineItem: () => void
  updateLineItem: (
    id: string,
    patch: Partial<Omit<LineItemDraft, 'id'>>,
  ) => void
  removeLineItem: (id: string) => void
  setDiscount: (discount: string) => void
  setActiveTab: (tab: EditorTab) => void
  save: () => void
  cancel: () => void
}

const patchContent = (
  draft: InvoiceTemplate,
  patch: Partial<ContentSettings>,
): InvoiceTemplate => ({
  ...draft,
  content: { ...draft.content, ...patch },
})

// saved and draft start out as the same reference; every update below
// replaces (never mutates) the object it touches, so the shared identity
// at init time is harmless.
export const useInvoiceTemplateStore = create<InvoiceTemplateState>((set) => ({
  saved: DEFAULT_TEMPLATE,
  draft: DEFAULT_TEMPLATE,
  activeTab: 'general',
  setName: (name) => set((state) => ({ draft: { ...state.draft, name } })),
  updateBranding: (patch) =>
    set((state) => ({
      draft: {
        ...state.draft,
        branding: { ...state.draft.branding, ...patch },
      },
    })),
  addLineItem: () =>
    set((state) => ({
      draft: patchContent(state.draft, {
        lineItems: [
          ...state.draft.content.lineItems,
          {
            id: crypto.randomUUID(),
            item: '',
            description: '',
            quantity: '1',
            rate: '',
          },
        ],
      }),
    })),
  updateLineItem: (id, patch) =>
    set((state) => ({
      draft: patchContent(state.draft, {
        lineItems: state.draft.content.lineItems.map((line) =>
          line.id === id ? { ...line, ...patch } : line,
        ),
      }),
    })),
  removeLineItem: (id) =>
    set((state) => {
      const { lineItems } = state.draft.content
      // The invoice always keeps at least one line; the UI also disables
      // the button in this case.
      if (lineItems.length <= 1) return state
      return {
        draft: patchContent(state.draft, {
          lineItems: lineItems.filter((line) => line.id !== id),
        }),
      }
    }),
  setDiscount: (discount) =>
    set((state) => ({ draft: patchContent(state.draft, { discount }) })),
  setActiveTab: (tab) => set({ activeTab: tab }),
  save: () => set((state) => ({ saved: state.draft })),
  cancel: () => set((state) => ({ draft: state.saved })),
}))

// The template is small and the logo data URL compares as a string, so a
// JSON round-trip is cheaper to maintain than a hand-written field list.
export const selectIsDirty = (state: InvoiceTemplateState): boolean =>
  JSON.stringify(state.draft) !== JSON.stringify(state.saved)

export const selectIsValid = (state: InvoiceTemplateState): boolean => {
  const { name, content } = state.draft
  return (
    name.trim().length > 0 &&
    isValidAmount(content.discount) &&
    content.lineItems.every(
      (line) => isValidAmount(line.quantity) && isValidAmount(line.rate),
    )
  )
}
```

- [ ] **Step 2: Format, type-check, lint**

Run: `npm run format && npm run typecheck && npm run lint`
Expected: all pass. (`react-hooks`/`react-refresh` rules do not apply to
this file; if ESLint complains about `crypto`, it is a globals config
issue — `crypto.randomUUID` is a browser global available in every
target of this Vite app, so use `globalThis.crypto.randomUUID()` rather
than disabling the rule.)

- [ ] **Step 3: Sanity-check the existing screen**

Run: `npm run dev`. On the General tab: edit the template name → footer
shows Unsaved and Save enables; Cancel reverts; Save clears Unsaved.
Nothing else should have changed. Stop the dev server.

- [ ] **Step 4: Commit**

```bash
git add src/store/useInvoiceTemplateStore.ts
git commit -m "feat: add line item and discount actions to template store"
```

---

### Task 5: `LineItemsEditor`, real `ContentTab`, drop the "Soon" badge

**Files:**

- Create: `src/features/template-editor/LineItemsEditor/LineItemsEditor.tsx`
- Create: `src/features/template-editor/LineItemsEditor/index.ts`
- Modify: `src/features/template-editor/ContentTab/ContentTab.tsx`
- Modify: `src/features/template-editor/EditorSidebar/EditorSidebar.tsx`

**Interfaces:**

- Consumes: store actions/selectors (Task 4), `isValidAmount` (Task 3),
  `LineItemDraft` (Task 2), existing `TextField` (`id`, `label`, `hint`,
  `error`, plus native input props) and `Button`
  (`variant: 'primary' | 'secondary' | 'ghost'`, `size: 'md' | 'sm'`).
- Produces: `export function LineItemsEditor()` (no props);
  `ContentTab` renders the full form.

- [ ] **Step 1: Create `LineItemsEditor`**

`src/features/template-editor/LineItemsEditor/LineItemsEditor.tsx`:

```tsx
import { Button } from '../../../components/ui/Button'
import { TextField } from '../../../components/ui/TextField'
import { isValidAmount } from '../../invoice-preview/calculateInvoice'
import { useInvoiceTemplateStore } from '../../../store/useInvoiceTemplateStore'
import type { LineItemDraft } from '../../../types/invoiceTemplate'

const AMOUNT_ERROR = 'Enter a non-negative number.'

interface LineItemCardProps {
  line: LineItemDraft
  removable: boolean
}

function LineItemCard({ line, removable }: LineItemCardProps) {
  const updateLineItem = useInvoiceTemplateStore((s) => s.updateLineItem)
  const removeLineItem = useInvoiceTemplateStore((s) => s.removeLineItem)

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border p-4">
      <TextField
        id={`item-${line.id}`}
        label="Item"
        placeholder="e.g. Web development"
        autoComplete="off"
        spellCheck={false}
        value={line.item}
        onChange={(e) => updateLineItem(line.id, { item: e.target.value })}
      />
      <TextField
        id={`description-${line.id}`}
        label="Description"
        placeholder="What was delivered"
        autoComplete="off"
        spellCheck={false}
        value={line.description}
        onChange={(e) =>
          updateLineItem(line.id, { description: e.target.value })
        }
      />
      <div className="grid grid-cols-2 gap-2.5">
        <TextField
          id={`qty-${line.id}`}
          label="Qty"
          inputMode="decimal"
          autoComplete="off"
          spellCheck={false}
          value={line.quantity}
          onChange={(e) =>
            updateLineItem(line.id, { quantity: e.target.value })
          }
          error={isValidAmount(line.quantity) ? '' : AMOUNT_ERROR}
        />
        <TextField
          id={`rate-${line.id}`}
          label="Rate"
          inputMode="decimal"
          autoComplete="off"
          spellCheck={false}
          value={line.rate}
          onChange={(e) => updateLineItem(line.id, { rate: e.target.value })}
          hint="Price per unit"
          error={isValidAmount(line.rate) ? '' : AMOUNT_ERROR}
        />
      </div>
      <div className="flex justify-end">
        <Button
          variant="ghost"
          size="sm"
          disabled={!removable}
          onClick={() => removeLineItem(line.id)}
        >
          Remove
        </Button>
      </div>
    </div>
  )
}

export function LineItemsEditor() {
  const lineItems = useInvoiceTemplateStore((s) => s.draft.content.lineItems)
  const addLineItem = useInvoiceTemplateStore((s) => s.addLineItem)
  const removable = lineItems.length > 1

  return (
    <div className="flex flex-col gap-2">
      <div className="flex min-h-7 items-center justify-between gap-3">
        <h3 className="text-base font-semibold">Line items</h3>
        <Button variant="secondary" size="sm" onClick={addLineItem}>
          Add item
        </Button>
      </div>
      <div className="flex flex-col gap-3">
        {lineItems.map((line) => (
          <LineItemCard key={line.id} line={line} removable={removable} />
        ))}
      </div>
    </div>
  )
}
```

`src/features/template-editor/LineItemsEditor/index.ts`:

```ts
export { LineItemsEditor } from './LineItemsEditor'
```

- [ ] **Step 2: Rewrite `ContentTab`**

Replace `src/features/template-editor/ContentTab/ContentTab.tsx` with:

```tsx
import { TextField } from '../../../components/ui/TextField'
import { isValidAmount } from '../../invoice-preview/calculateInvoice'
import { useInvoiceTemplateStore } from '../../../store/useInvoiceTemplateStore'
import { LineItemsEditor } from '../LineItemsEditor'

export function ContentTab() {
  const discount = useInvoiceTemplateStore((s) => s.draft.content.discount)
  const setDiscount = useInvoiceTemplateStore((s) => s.setDiscount)

  return (
    <div className="px-4 pt-4 pb-6 lg:px-7 lg:pt-5">
      <h2 className="mb-4 text-xl leading-normal font-semibold tracking-snug">
        Invoice content
      </h2>
      <div className="flex flex-col gap-5">
        <LineItemsEditor />
        <TextField
          id="discount"
          label="Discount"
          inputMode="decimal"
          placeholder="0.00"
          autoComplete="off"
          spellCheck={false}
          value={discount}
          onChange={(e) => setDiscount(e.target.value)}
          hint="Applied before tax."
          error={isValidAmount(discount) ? '' : 'Enter a non-negative amount.'}
        />
      </div>
    </div>
  )
}
```

(`ContentTab/index.ts` already exports `ContentTab`; leave it.)

- [ ] **Step 3: Remove the badge from the Content tab item**

In `src/features/template-editor/EditorSidebar/EditorSidebar.tsx`, in
`TAB_ITEMS`, delete the single line `badge: 'Soon',` from the
`id: 'content'` entry. Nothing else in the file changes; the `badge`
prop on `TabItem` stays (it is a primitive's optional feature).

- [ ] **Step 4: Format, type-check, lint, knip**

Run: `npm run format && npm run typecheck && npm run lint && npm run knip`
Expected: all pass.

- [ ] **Step 5: Verify the tab in the browser**

Run: `npm run dev`, open the Content tab.

- Heading "Invoice content"; "Line items" with an "Add item" button on
  the right; one card pre-filled (Web development / Website development
  with content and SEO optimization / Qty 1 / Rate 1000); "Remove" on it
  is disabled; Discount field shows `0`.
- Change Rate to `250` → preview line Total `$250.00`, Subtotal
  `$250.00`, taxes `$11.75` / `$17.50`, Total `$279.25`, Balance due
  `$179.25`.
- Set Qty `3` → line Total `$750.00`.
- "Add item" → a second card (Qty 1, Rate empty with error), preview gets
  a second row with `$0.00`; Save is disabled until Rate is filled;
  "Remove" is now enabled on both cards; removing one disables it again.
- Discount `100` with the default line → taxes `$42.30` / `$63.00`, Total
  `$1,005.30`, Balance due `$905.30`.
- Type `abc` in Qty → error text under the field, Save disabled, preview
  treats it as 0. Fix it → error gone, Save enabled.
- Footer shows Unsaved after any edit; Cancel reverts lines and discount;
  Save clears Unsaved; switching to General and back keeps unsaved edits.
- No `Soon` badge on the tab.

Stop the dev server.

- [ ] **Step 6: Commit**

```bash
git add src/features/template-editor
git commit -m "feat: add line items and discount form to content tab"
```

---

### Task 6: Docs, full verification, hand-off

**Files:**

- Modify: `AGENTS.md` (Project structure block)

**Interfaces:**

- Consumes: everything above.
- Produces: green CI checks locally; branch ready to push.

- [ ] **Step 1: Update the project structure in `AGENTS.md`**

In the `## Project structure` code block:

- Under `features/template-editor/`, change the `ContentTab/` line to
  `    ContentTab/                   # line items + discount form` and add
  `    LineItemsEditor/              # list of line cards, add/remove`
  directly after it.
- Under `features/invoice-preview/`, add
  `    calculateInvoice.ts           # parse/validate/compute/format money`
  directly above the `mockInvoice.ts` line, and change the `mockInvoice.ts`
  comment to `# fixed document data (no amounts)`.

Keep the column alignment of the surrounding comments (comments start at
column 35).

- [ ] **Step 2: Run the full CI set**

Run: `npm run lint && npm run format:check && npm run typecheck && npm run knip && npm run build`
Expected: every command exits 0. Fix anything that fails before moving on
(run `npm run format` for Prettier complaints).

- [ ] **Step 3: Run the spec's manual checklist end to end**

Run `npm run dev` and walk through
`docs/superpowers/specs/2026-09-15-content-tab-design.md` → "Testing"
items 1–8 (item 9 is Step 2 above). Also re-check the base checklist's
General-tab items 1, 4 and 6 to confirm nothing regressed (colors, logo,
Save/Cancel). Stop the dev server.

- [ ] **Step 4: Commit**

```bash
git add AGENTS.md
git commit -m "docs: describe content tab modules in agents guide"
```

- [ ] **Step 5: Hand off**

Report to the user: branch `feat/content-tab`, list of commits
(`git log --oneline main..HEAD`), the checklist results, and ask whether
to push and open the PR. Do not push without being asked. When asked:

```bash
git push -u origin feat/content-tab
gh pr create --title "feat: add content tab with line items and discount" --body "Replaces the Content tab placeholder with an editable list of line items (Item, Description, Qty, Rate) and a Discount amount. The preview now computes line totals, Subtotal, taxes, Total and Balance due from those values and formats every amount as USD; the table keeps the reference's four columns. Spec: docs/superpowers/specs/2026-09-15-content-tab-design.md. No automated tests by decision — verified with the spec's manual checklist.

🤖 Generated with [Claude Code](https://claude.com/claude-code)"
```
