export interface CalculatedLine {
  id: string
  item: string
  description: string
  rate: number
  total: number
}

interface CalculatedTax {
  label: string
  amount: number
}

export interface CalculatedInvoice {
  lines: CalculatedLine[]
  subtotal: number
  discount: number
  taxes: CalculatedTax[]
  total: number
  paymentMade: number
  balanceDue: number
}
