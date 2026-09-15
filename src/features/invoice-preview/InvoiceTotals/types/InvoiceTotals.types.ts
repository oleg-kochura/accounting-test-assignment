interface InvoiceTotalsTax {
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
