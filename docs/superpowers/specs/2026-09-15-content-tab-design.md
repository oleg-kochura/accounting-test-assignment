# Invoice Template Customizer — Content Tab

Date: 2026-09-15
Status: approved design, ready for implementation planning
Builds on: `docs/superpowers/specs/2026-09-14-invoice-template-customizer-design.md`
(the base customizer, shipped in PR #6/#7). Where this document and the
base spec disagree about the Content tab, line items or totals, this
document wins.

## Goal

Replace the "Coming soon" placeholder on the **Content** tab with a form
that edits the invoice's line items and discount. The preview computes
Subtotal, taxes, Total and Balance due from those values instead of
showing the hard-coded, mutually inconsistent figures of the reference.

## Scope

In scope:

- Content tab: editable list of line items (Item, Description, Qty, Rate)
  with add/remove, and a Discount amount.
- Computed totals in the preview: line Total = Qty × Rate; Subtotal,
  taxes, Total, Balance due derived from the lines, discount, the fixed
  tax rates and the fixed "Payment made" amount.
- Consistent currency formatting for every money value in the preview.
- Validation of numeric inputs; Save disabled while any is invalid.
- Line items and discount participate in the existing draft/saved,
  Cancel/Save and "Unsaved" logic exactly like the General tab fields.

Out of scope:

- Editing Terms & Conditions, Statement, parties, dates, invoice number,
  tax rates or "Payment made" — they stay hard-coded in `MOCK_INVOICE`.
- Percentage discounts, per-line taxes, multiple currencies.
- A visible Qty column in the preview (the reference table has only
  Item / Description / Rate / Total and keeps that layout).
- Automated tests. The project has none and the user chose not to add a
  test framework for this feature; verification is the manual checklist.
- Persistence, reordering of lines, drag-and-drop.

## Data model

`src/types/invoiceTemplate.ts` — `ContentSettings` stops being empty:

```ts
export interface LineItemDraft {
  id: string // crypto.randomUUID(); React key and removal handle
  item: string
  description: string
  quantity: string // raw input text, parsed at calculation time
  rate: string // unit price, raw input text
}

export interface ContentSettings {
  lineItems: LineItemDraft[]
  discount: string // absolute amount, raw input text
}
```

Numeric fields are stored as **strings**, not numbers, so a controlled
input can hold intermediate states (`''`, `1.`, `0.`) without the value
being rewritten under the user's cursor. Parsing happens in one place
(`calculateInvoice`, below) and validation in one place (`selectIsValid`).

`DEFAULT_TEMPLATE.content`:

```ts
content: {
  lineItems: [
    {
      id: 'default-line', // fixed id so saved/draft start identical
      item: 'Web development',
      description: 'Website development with content and SEO optimization',
      quantity: '1',
      rate: '1000',
    },
  ],
  discount: '0',
}
```

`src/features/invoice-preview/mockInvoice.ts` — `InvoiceData` loses
`lineItems`, `subtotal`, `discount`, `total` and `balanceDue`; `InvoiceTax`
becomes `{ label: string; rate: number }` (`0.047`, `0.07`) and
`paymentMade` becomes `number` (`100`). `InvoiceLineItem` is removed
together with `lineItems`. Everything else (number, dates, seller,
billedTo, `termsAndConditions`, `statement`) is unchanged.

## Calculation

`src/features/invoice-preview/calculateInvoice.ts` — a pure module with
no React or store imports:

```ts
export interface CalculatedLine {
  id: string
  item: string
  description: string
  rate: number
  total: number
}

export interface CalculatedInvoice {
  lines: CalculatedLine[]
  subtotal: number
  discount: number
  taxes: { label: string; amount: number }[]
  total: number
  paymentMade: number
  balanceDue: number
}

export function parseAmount(raw: string): number // '' | invalid → 0
export function calculateInvoice(
  content: ContentSettings,
  invoice: InvoiceData,
): CalculatedInvoice
export function formatMoney(value: number): string // '$1,000.00'
```

Formulas (all rounded to cents with `Math.round(x * 100) / 100` after each
step so displayed rows add up):

```
line.total  = quantity × rate
subtotal    = Σ line.total
taxBase     = subtotal − discount
tax[i]      = taxBase × invoice.taxes[i].rate
total       = taxBase + Σ tax[i]
balanceDue  = total − invoice.paymentMade
```

`parseAmount` is `Number(raw.trim())` with `NaN`/`Infinity` mapped to `0`;
negative values are also clamped to `0`. It is deliberately lenient: the
preview always renders something sensible while the user is typing, and
the strict rule lives in validation (Save is blocked, not the preview).

`formatMoney` uses `new Intl.NumberFormat('en-US', { style: 'currency',
currency: 'USD' })` created once at module level. Every money cell in the
preview — line Rate and Total, Subtotal, Discount, taxes, Total, Payment
made, Balance due — goes through it, replacing the reference's mix of
`$1000.00` and `630.00`.

With the defaults above the preview shows: Rate $1,000.00, Total
$1,000.00, Subtotal $1,000.00, Discount $0.00, Sample Tax1 (4.70%) $47.00,
Sample Tax2 (7.00%) $70.00, Total $1,117.00, Payment made $100.00, Balance
due $1,017.00.

## Store

`src/store/useInvoiceTemplateStore.ts` gains:

```ts
addLineItem: () => void
updateLineItem: (id: string, patch: Partial<Omit<LineItemDraft, 'id'>>) => void
removeLineItem: (id: string) => void
setDiscount: (discount: string) => void
```

- `addLineItem` appends `{ id: crypto.randomUUID(), item: '', description:
'', quantity: '1', rate: '' }`.
- `updateLineItem` replaces the matching line object (never mutates).
- `removeLineItem` is a no-op when only one line remains; the UI also
  disables the button in that state.
- All four replace `draft.content` (and `draft`) with new objects, as
  `updateBranding` does.
- `selectIsDirty` becomes `JSON.stringify(draft) !== JSON.stringify(saved)`.
  The hand-written field comparison does not scale to an array of lines;
  the object is small and the logo data URL compares as a string. `saved`
  and `draft` start as the same reference, so the initial state is clean.
- `selectIsValid` becomes: template name non-empty **and**
  `isValidAmount(discount)` **and** every line satisfies
  `isValidAmount(quantity) && isValidAmount(rate)`, where
  `isValidAmount(raw)` is `raw.trim() !== '' && Number.isFinite(n) && n >= 0`
  for `n = Number(raw.trim())`. `isValidAmount` lives next to
  `parseAmount` in `calculateInvoice.ts` so parsing rules stay in one file.
- No `updateContent` blanket patch — the four specific actions above are
  the only writers, matching the "keep actions in the store, no dead
  actions" rule.

## Components

### Changed

- `EditorSidebar` — the Content tab item drops `badge: 'Soon'`.
- `ContentTab` — replaces the placeholder. Structure mirrors `GeneralTab`:
  outer `div.px-4 pt-4 pb-6 lg:px-7 lg:pt-5`, `h2` "Invoice content",
  then a `flex flex-col gap-5` column holding `LineItemsEditor` and the
  Discount field. Discount is a `TextField` (`id="discount"`,
  `inputMode="decimal"`, hint "Applied before tax.", error "Enter a
  non-negative amount." when invalid) wired to `setDiscount`.
- `InvoicePreview` — calls `calculateInvoice(template.content, invoice)`
  once per render and passes formatted strings down; the leaf components
  stay presentational.
- `InvoiceLineItems` — props become `lines: CalculatedLine[]`; rows keyed
  by `line.id`; Rate and Total cells render `formatMoney(...)`. Columns
  and widths are unchanged (Item / Description / Rate / Total).
- `InvoiceTotals` — prop types unchanged (strings); `taxes` is now
  `{ label, amount: string }[]` supplied by `InvoicePreview` after
  formatting. No layout change.
- `TemplateCustomizer` — unchanged apart from whatever type adjustments
  the mock changes require.

### New

`src/features/template-editor/LineItemsEditor/` (`LineItemsEditor.tsx` +
`index.ts`):

- Reads `draft.content.lineItems` and the four line actions from the
  store; no props.
- Header row: `h3` "Line items" on the left, `Button variant="secondary"
size="sm"` "Add item" on the right (same header pattern as the Logo
  section in `GeneralTab`).
- One card per line (`rounded-lg border border-border p-4 flex flex-col
gap-3`), containing:
  - `TextField` Item (`id={`item-${id}`}`, placeholder "e.g. Web
    development").
  - `TextField` Description (`id={`description-${id}`}`, placeholder
    "What was delivered").
  - A `grid grid-cols-2 gap-2.5` row with `TextField` Qty
    (`inputMode="decimal"`) and `TextField` Rate (`inputMode="decimal"`,
    hint "Price per unit"). Invalid values show the error "Enter a
    non-negative number." under the field (`TextField`'s existing `error`
    prop).
  - A `Button variant="ghost" size="sm"` "Remove" aligned right, disabled
    (with `aria-disabled`) when it is the only line.
- Card list is `flex flex-col gap-3`. Cards are keyed by `line.id`.
- Empty Item/Description are allowed: they render as empty cells in the
  preview and do not block Save (only numeric fields validate).

No new UI primitives are needed; `TextField`, `Button` and the existing
layout classes cover the form.

### Layout after the change

```
src/
  features/template-editor/
    ContentTab/                   # line items + discount form
    LineItemsEditor/              # list of line cards, add/remove
  features/invoice-preview/
    calculateInvoice.ts           # parse/validate/compute/format helpers
    mockInvoice.ts                # fixed document data (no amounts)
```

All other folders are as listed in the base spec.

## Data flow

```
ContentTab / LineItemsEditor ──add/update/removeLineItem, setDiscount──▶ store.draft.content
store.draft ──▶ TemplateCustomizer ──▶ InvoicePreview ──calculateInvoice──▶ leaves
```

`LineItemsEditor` subscribes to `s.draft.content.lineItems` (one
selector; the list re-renders on any line edit, which is fine for a
handful of rows). The Discount field subscribes to
`s.draft.content.discount`.

## Error handling

- Numeric inputs: validated by `isValidAmount`; error text under the
  field, Save disabled via `selectIsValid`. The preview keeps rendering
  using `parseAmount`'s lenient fallback (`0`).
- `removeLineItem` on the last line: ignored by the store and prevented
  by the disabled button.
- No network, no file IO, no thrown errors expected.

## Testing

No automated tests (user decision). Manual checklist, in addition to the
base spec's checklist:

1. Content tab shows one pre-filled line (Web development, qty 1, rate 1000) and Discount 0; preview totals read $1,000.00 / $47.00 / $70.00 /
   $1,117.00 / $100.00 / $1,017.00.
2. Changing Rate to 250 updates the line Total to $250.00 and every row
   below it; Subtotal, taxes, Total and Balance due stay consistent
   (rows add up).
3. Qty 3 × Rate 250 → line Total $750.00.
4. "Add item" appends an empty card; filling it in adds a second row to
   the preview table; "Remove" on it deletes the row. "Remove" on the
   only remaining line is disabled.
5. Discount 100 reduces the tax base: taxes and Total drop accordingly;
   Discount row shows $100.00.
6. Typing `abc` or `-5` in Qty, Rate or Discount shows an inline error,
   disables Save, and the preview treats the value as 0; fixing the value
   clears the error and re-enables Save.
7. Edits on Content mark the template Unsaved; Cancel restores the saved
   lines and discount; Save clears Unsaved. Switching to General and back
   keeps unsaved Content edits.
8. The `Soon` badge is gone from the Content tab.
9. `npm run lint`, `npm run format:check`, `npm run typecheck`,
   `npm run knip`, `npm run build` pass.

## Documentation

- `AGENTS.md`: update the `src/` tree (add `LineItemsEditor/`,
  `calculateInvoice.ts`; describe `ContentTab/` as the line items form).
- The base spec is left as-is; this document supersedes its Content-tab
  statements.
