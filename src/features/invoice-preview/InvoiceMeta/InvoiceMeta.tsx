import type { InvoiceMetaProps } from './types'

function MetaLabel({ children }: { children: string }) {
  return (
    <span className="mb-1 block text-xs font-semibold tracking-widest text-(--secondary) uppercase">
      {children}
    </span>
  )
}

export function InvoiceMeta({
  invoiceNumber,
  dateOfIssue,
  dueDate,
}: InvoiceMetaProps) {
  return (
    <div className="grid grid-cols-3 justify-start gap-8 border-t border-(--secondary) pt-4.5">
      <div>
        <MetaLabel>Invoice number</MetaLabel>
        <span className="font-mono tabular-nums">{invoiceNumber}</span>
      </div>
      <div>
        <MetaLabel>Date of issue</MetaLabel>
        {dateOfIssue}
      </div>
      <div>
        <MetaLabel>Due date</MetaLabel>
        {dueDate}
      </div>
    </div>
  )
}
