import type { ContentSettings } from '../../types/invoiceTemplate'
import type { InvoiceData } from './mockInvoice'

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

const MONEY = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

const round2 = (value: number): number => Math.round(value * 100) / 100

// Lenient: the preview must always render while the user is mid-edit.
// '', 'abc', '-5' and 'Infinity' all become 0. Strictness lives in
// isValidAmount, which gates Save.
function parseAmount(raw: string): number {
  const n = Number(raw.trim())
  return Number.isFinite(n) && n > 0 ? n : 0
}

export function isValidAmount(raw: string): boolean {
  const value = raw.trim()
  if (value === '') return false
  const n = Number(value)
  return Number.isFinite(n) && n >= 0
}

export function formatMoney(value: number): string {
  return MONEY.format(value)
}

export function calculateInvoice(
  content: ContentSettings,
  invoice: InvoiceData,
): CalculatedInvoice {
  const lines = content.lineItems.map((line) => {
    const rate = parseAmount(line.rate)
    return {
      id: line.id,
      item: line.item,
      description: line.description,
      rate,
      total: round2(parseAmount(line.quantity) * rate),
    }
  })
  const subtotal = round2(lines.reduce((sum, line) => sum + line.total, 0))
  const discount = parseAmount(content.discount)
  const taxBase = round2(subtotal - discount)
  const taxes = invoice.taxes.map((tax) => ({
    label: tax.label,
    amount: round2(taxBase * tax.rate),
  }))
  const total = round2(
    taxBase + taxes.reduce((sum, tax) => sum + tax.amount, 0),
  )
  return {
    lines,
    subtotal,
    discount,
    taxes,
    total,
    paymentMade: invoice.paymentMade,
    balanceDue: round2(total - invoice.paymentMade),
  }
}
