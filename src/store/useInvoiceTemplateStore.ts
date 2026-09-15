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
            id: globalThis.crypto.randomUUID(),
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
