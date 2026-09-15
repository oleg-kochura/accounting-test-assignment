# Invoice Template Customizer — Design

Date: 2026-09-14
Status: approved design, ready for implementation planning
Reference: `docs/design/image.png`

## Goal

A working frontend demo of an "invoice template settings" screen: the user
edits the template name, brand colors and logo on the left and immediately
sees the resulting invoice on the right. The scenario, feature set and user
flow follow the reference image; the visual design is our own and is
supplied separately, so the implementation must keep styling easy to swap.

## Scope

In scope:

- Split screen: **Customize** panel (left) and **Preview** panel (right).
- Sidebar tabs: **General** (functional) and **Content** (empty placeholder).
- General tab: Template Name, Primary Color, Secondary Color, "Display
  company logo" toggle, logo upload, decorative "Accept payment methods /
  Manage" row.
- Footer: **Cancel** and **Save**.
- Invoice preview rendered from mock document data + template settings.
- Client-side logo upload (file → data URL in state). No backend.

Out of scope:

- Content tab fields (placeholder only; the store reserves a slot for it).
- Persistence across reloads (no localStorage).
- Closing/opening the screen as a modal; the screen is always visible.
- Correct arithmetic in the mock invoice — totals are copied from the
  reference as-is and are not computed.
- Payment methods management ("Manage" is a non-functional link).
- Automated tests (none in the project; verified manually, see checklist).

## Data model

`src/types/invoiceTemplate.ts`

```ts
export type LogoSource = { name: string; dataUrl: string } | null

export interface BrandingSettings {
  primaryColor: string // hex '#rrggbb', default '#2c3dd8'
  secondaryColor: string // hex '#rrggbb', default '#475569'
  showLogo: boolean // default true
  logo: LogoSource // default null → placeholder "BC" in preview
}

// Intentionally empty. Reserved for the Content tab; fields are added
// together with the tab's form, not in advance.
export type ContentSettings = Record<never, never>

export interface InvoiceTemplate {
  name: string // default 'Standard Template'; required, non-empty
  branding: BrandingSettings
  content: ContentSettings // default {}
}

export type EditorTab = 'general' | 'content'

export const DEFAULT_TEMPLATE: InvoiceTemplate
```

Mock document data (`InvoiceData`: number, dates, seller, "Billed To",
line items, totals, terms, statement) lives in
`src/features/invoice-preview/mockInvoice.ts` and mirrors the reference
image verbatim, including its inconsistent figures. It is not part of the
template and is never edited.

## Store

`src/store/useInvoiceTemplateStore.ts` (Zustand, single store).

```ts
interface InvoiceTemplateState {
  saved: InvoiceTemplate // last saved snapshot
  draft: InvoiceTemplate // what the form edits and the preview renders
  activeTab: EditorTab

  setName: (name: string) => void
  updateBranding: (patch: Partial<BrandingSettings>) => void
  setActiveTab: (tab: EditorTab) => void
  save: () => void // saved = draft
  cancel: () => void // draft = saved
}
```

- Both snapshots start from `DEFAULT_TEMPLATE`.
- Derived values are helpers/selectors, not stored state:
  - `isDirty(state)`: `JSON.stringify(draft) !== JSON.stringify(saved)`.
    The object is small; the logo data URL compares as a string. No
    deep-equal library.
  - `isValid(state)`: `draft.name.trim().length > 0`.
- The store is synchronous and side-effect free. File reading happens in
  the `LogoField` component; the store receives a ready `LogoSource`.
- Save confirmation (toast) is local UI state in `EditorFooter`, not in
  the store.
- `updateContent` is added when Content fields exist; no dead actions.
- `useCounterStore` and the scaffold counter UI in `App.tsx` are removed.
- `AGENTS.md` (project structure, code style) is updated to reflect the
  new layout and the component-folder convention.

## Components

### File convention

Every component lives in its own folder named after the component. The
folder contains the component file and an `index.ts` barrel that does a
named re-export:

```
InvoiceTotals/
  InvoiceTotals.tsx     # export function InvoiceTotals(props: InvoiceTotalsProps) { … }
  index.ts              # export { InvoiceTotals } from './InvoiceTotals'
```

- Named exports only, no default exports (except `App.tsx`, which Vite's
  scaffold and `main.tsx` already use).
- Consumers import from the folder: `import { InvoiceTotals } from '../InvoiceTotals'`.
- Anything private to the component (helpers, sub-parts not used
  elsewhere) stays inside the folder and is not re-exported from the
  barrel. Props types are re-exported only when another module needs them.
- Non-component modules (`mockInvoice.ts`, store, types) are plain files.

### Layout

```
src/
  App.tsx                         # renders <TemplateCustomizer />
  types/invoiceTemplate.ts
  store/useInvoiceTemplateStore.ts
  components/ui/                  # domain-agnostic primitives
    Button/
    TextField/
    ColorField/                   # color swatch + hex text input
    Toggle/
    Tabs/                         # vertical tab list
  features/template-editor/
    TemplateCustomizer/           # screen shell: two panels + footer; reads store
    EditorSidebar/                # Tabs bound to activeTab
    GeneralTab/                   # General Branding form
    ContentTab/                   # empty placeholder
    LogoField/                    # toggle + file input/drop zone + remove
    PaymentMethodsRow/            # decorative row with "Manage" link
    EditorFooter/                 # Cancel / Save, dirty/valid logic, toast
  features/invoice-preview/
    InvoicePreview/               # paper root; sets --primary/--secondary
    InvoiceHeader/                # "Invoice" title + logo / placeholder
    InvoiceMeta/                  # invoice number, issue date, due date
    InvoiceParties/               # seller block + "Billed To"
    InvoiceLineItems/             # Item / Description / Rate / Total table
    InvoiceTotals/                # Subtotal … Balance Due
    InvoiceFooterText/            # Terms & Conditions, Statement
    mockInvoice.ts
```

Each folder above follows the convention: `<Name>/<Name>.tsx` +
`<Name>/index.ts`.

### Data flow

```
GeneralTab ──setName / updateBranding──▶ store.draft ──▶ InvoicePreview
EditorFooter ──save / cancel──────────▶ store (draft ⇄ saved)
```

- Form components and the preview wrapper subscribe with narrow selectors
  (e.g. `useInvoiceTemplateStore((s) => s.draft.branding)`) so a keystroke
  does not re-render the whole screen.
- `InvoicePreview` is presentational: it receives
  `template: InvoiceTemplate` and `invoice: InvoiceData` as props.
  `TemplateCustomizer` reads the store and passes them down.

### Color application (option A)

`InvoicePreview` sets CSS custom properties on the paper root:

```tsx
<div style={{ '--primary': branding.primaryColor, '--secondary': branding.secondaryColor }}>
```

Children use Tailwind arbitrary-value utilities (`text-(--primary)`,
`bg-(--primary)`, `border-(--secondary)`, …). This is the single hook the
external visual design needs to keep.

| Color     | Applied to                                                                                                                            |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| primary   | top accent bar of the paper, "Invoice" title, logo placeholder background, Total, Balance Due                                         |
| secondary | field labels (Invoice number, Date of Issue, Due Date, Billed To, Terms & Conditions, Statement), table column headers, divider lines |

Default secondary differs from primary so the effect of each field is
visible on first load.

### Logo behaviour

| `showLogo` | `logo` | Preview corner                             |
| ---------- | ------ | ------------------------------------------ |
| false      | any    | empty                                      |
| true       | null   | placeholder square "BC" on `--primary`     |
| true       | set    | `<img src={logo.dataUrl} alt={logo.name}>` |

`LogoField`:

- `<input type="file" accept="image/png,image/jpeg,image/svg+xml,image/webp">`
  plus drag-and-drop onto the logo preview area.
- Max size 10 MB. Reads the file with `FileReader.readAsDataURL` and calls
  `updateBranding({ logo: { name, dataUrl } })`.
- Rejected file (wrong type or too large): error text under the field,
  state unchanged.
- "Remove" clears the logo: `updateBranding({ logo: null })`.
- The file input and drop zone stay enabled regardless of `showLogo`.

### ColorField

- Swatch is a native `<input type="color">`; next to it a text input with
  the hex value.
- Text input accepts `^#[0-9a-fA-F]{6}$`; only a valid value reaches the
  store (normalised to lowercase). An invalid value keeps the field in an
  error state and leaves the store untouched.

### Footer

- **Save**: enabled when `isDirty && isValid`. Calls `save()`, then shows
  a short confirmation ("Template saved") for ~2.5 s. Nothing closes.
- **Cancel**: enabled when `isDirty`. Calls `cancel()`; the form and
  preview revert to `saved`.
- Empty template name: Save disabled and a hint under the field.

### Tabs

- `General` renders `GeneralTab`; `Content` renders `ContentTab` — an
  empty placeholder area (short "Coming soon" copy is acceptable).
- Switching tabs does not touch `draft`.

### Responsive

Below ~1024 px the two panels stack vertically (form first, preview
below). No separate mobile design.

## Error handling

The only runtime failure sources are the logo file (type, size, read
error) and hex parsing; both are handled inline as described above.
There are no network calls.

## Testing

No automated test suite. Manual checklist before the task is considered
done:

1. Typing a template name updates nothing in the preview; clearing it
   disables Save and shows a hint.
2. Changing primary color recolors the accent bar, title, placeholder logo
   and Total/Balance Due; changing secondary recolors labels, column
   headers and dividers.
3. Typing an invalid hex shows an error and does not change the preview;
   a valid hex applies immediately.
4. Toggle off hides the logo corner; toggle on with no file shows the "BC"
   placeholder; uploading a PNG shows it; Remove returns the placeholder.
5. Uploading a 15 MB file or a PDF shows an error and keeps the previous
   logo.
6. Save/Cancel are disabled when nothing changed; after edits Cancel
   restores the saved state; Save keeps the edits, shows the confirmation
   and disables both buttons again.
7. Content tab shows the placeholder; switching back keeps unsaved edits.
8. `npm run lint`, `npm run format:check`, `npm run typecheck`,
   `npm run knip`, `npm run build` pass.
