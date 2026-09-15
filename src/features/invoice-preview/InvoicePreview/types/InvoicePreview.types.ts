import type { InvoiceTemplate } from '../../../../types/invoiceTemplate'
import type { InvoiceData } from '../../types'

export interface InvoicePreviewProps {
  template: InvoiceTemplate
  invoice: InvoiceData
}
