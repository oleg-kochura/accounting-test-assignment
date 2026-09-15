import { formatMoney } from '../../../lib/amount'
import type { CalculatedLine } from '../calculateInvoice'

export interface InvoiceLineItemsProps {
  lines: CalculatedLine[]
}

function Th({
  children,
  width,
  align,
}: {
  children: string
  width: string
  align?: 'right'
}) {
  return (
    <th
      style={{ width }}
      className={`border-b border-(--secondary) pb-2 ${align === 'right' ? 'text-right' : 'text-left'}`}
    >
      <span className="text-xs font-semibold tracking-widest text-(--secondary) uppercase">
        {children}
      </span>
    </th>
  )
}

export function InvoiceLineItems({ lines }: InvoiceLineItemsProps) {
  return (
    <table className="w-full border-collapse">
      <thead>
        <tr>
          <Th width="26%">Item</Th>
          <Th width="auto">Description</Th>
          <Th width="12%" align="right">
            Rate
          </Th>
          <Th width="16%" align="right">
            Total
          </Th>
        </tr>
      </thead>
      <tbody>
        {lines.map((line) => (
          <tr key={line.id}>
            <td className="border-b border-border py-3 align-top">
              {line.item}
            </td>
            <td className="border-b border-border py-3 align-top text-muted-text">
              {line.description}
            </td>
            <td className="border-b border-border py-3 text-right align-top font-mono tabular-nums">
              {formatMoney(line.rate)}
            </td>
            <td className="border-b border-border py-3 text-right align-top font-mono tabular-nums">
              {formatMoney(line.total)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
