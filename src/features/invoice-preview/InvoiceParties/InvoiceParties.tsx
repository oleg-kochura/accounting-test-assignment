import type { InvoicePartiesProps } from './types'

export function InvoiceParties({ seller, billedTo }: InvoicePartiesProps) {
  return (
    <div className="grid grid-cols-2 gap-8">
      <div>
        <strong className="mb-0.5 block font-semibold">{seller.name}</strong>
        {seller.addressLines.map((line) => (
          <span key={line}>
            {line}
            <br />
          </span>
        ))}
        <span className="font-mono tabular-nums">{seller.phone}</span>
      </div>
      <div>
        <span className="mb-1 block text-xs font-semibold tracking-widest text-(--secondary) uppercase">
          Billed to
        </span>
        {billedTo.name}
        <br />
        {billedTo.addressLines.map((line) => (
          <span key={line}>
            {line}
            <br />
          </span>
        ))}
        <span className="font-mono tabular-nums">{billedTo.phone}</span>
      </div>
    </div>
  )
}
