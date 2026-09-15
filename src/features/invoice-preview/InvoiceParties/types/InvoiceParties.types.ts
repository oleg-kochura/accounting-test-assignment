import type { InvoiceParty } from '../../types'

export interface InvoicePartiesProps {
  seller: InvoiceParty
  billedTo: InvoiceParty
}
