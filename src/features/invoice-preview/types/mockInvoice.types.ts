export interface InvoiceParty {
  name: string
  addressLines: string[]
  phone: string
}

interface InvoiceTax {
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
