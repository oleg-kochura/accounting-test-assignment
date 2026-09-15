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

// Intentionally empty. Reserved for the Content tab; fields are added
// together with the tab's form, not in advance.
type ContentSettings = Record<never, never>

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
  content: {},
}
