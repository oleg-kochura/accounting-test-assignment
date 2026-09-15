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
