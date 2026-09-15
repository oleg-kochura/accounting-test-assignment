import { create } from 'zustand'
import {
  DEFAULT_TEMPLATE,
  type BrandingSettings,
  type EditorTab,
  type InvoiceTemplate,
} from '../types/invoiceTemplate'

export interface InvoiceTemplateState {
  saved: InvoiceTemplate
  draft: InvoiceTemplate
  activeTab: EditorTab
  setName: (name: string) => void
  updateBranding: (patch: Partial<BrandingSettings>) => void
  setActiveTab: (tab: EditorTab) => void
  save: () => void
  cancel: () => void
}

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
  setActiveTab: (tab) => set({ activeTab: tab }),
  save: () => set((state) => ({ saved: state.draft })),
  cancel: () => set((state) => ({ draft: state.saved })),
}))

export const selectIsDirty = (state: InvoiceTemplateState): boolean => {
  const { draft, saved } = state
  return (
    draft.name !== saved.name ||
    draft.branding.primaryColor !== saved.branding.primaryColor ||
    draft.branding.secondaryColor !== saved.branding.secondaryColor ||
    draft.branding.showLogo !== saved.branding.showLogo ||
    draft.branding.logo !== saved.branding.logo
  )
}

export const selectIsValid = (state: InvoiceTemplateState): boolean =>
  state.draft.name.trim().length > 0
