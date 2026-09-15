import type { ContentSettings } from '../../types/invoiceTemplate'
import type { InvoiceData } from './types'
import type { CalculatedInvoice } from './types/calculateInvoice.types'
import { parseAmount, round2 } from '../../lib/amount'

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
  const taxBase = Math.max(0, round2(subtotal - discount))
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
