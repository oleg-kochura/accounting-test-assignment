import type { InvoiceTax } from '../mockInvoice'

export interface InvoiceTotalsProps {
  subtotal: string
  discount: string
  taxes: InvoiceTax[]
  total: string
  paymentMade: string
  balanceDue: string
}

function Row({
  label,
  value,
  strong,
}: {
  label: string
  value: string
  strong?: boolean
}) {
  return (
    <div
      className={
        strong
          ? 'mt-1 flex justify-between gap-4 border-t border-(--secondary) py-2.5 font-bold text-(--primary)'
          : 'flex justify-between gap-4 py-1.5'
      }
    >
      <span>{label}</span>
      <span className="font-mono tabular-nums">{value}</span>
    </div>
  )
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
