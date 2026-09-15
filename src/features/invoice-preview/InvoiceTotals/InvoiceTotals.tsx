import { Row } from './components/Row'

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

export function InvoiceTotals({
  subtotal,
  discount,
  taxes,
  total,
  paymentMade,
  balanceDue,
}: InvoiceTotalsProps) {
  return (
    <div className="ml-auto flex w-[300px] flex-col">
      <Row label="Subtotal" value={subtotal} />
      <Row label="Discount" value={discount} />
      {taxes.map((tax) => (
        <Row key={tax.label} label={tax.label} value={tax.amount} />
      ))}
      <Row label="Total" value={total} strong />
      <Row label="Payment made" value={paymentMade} />
      <Row label="Balance due" value={balanceDue} strong />
    </div>
  )
}
