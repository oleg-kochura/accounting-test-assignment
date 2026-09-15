import type { CSSProperties } from 'react'
import type { InvoiceTemplate } from 'types/invoiceTemplate'
import type { InvoiceData } from '../mockInvoice'
import { calculateInvoice } from '../calculateInvoice'
import { formatMoney } from 'lib/amount'
import { InvoiceHeader } from '../InvoiceHeader'
import { InvoiceMeta } from '../InvoiceMeta'
import { InvoiceParties } from '../InvoiceParties'
import { InvoiceLineItems } from '../InvoiceLineItems'
import { InvoiceTotals } from '../InvoiceTotals'
import { InvoiceFooterText } from '../InvoiceFooterText'

export interface InvoicePreviewProps {
  template: InvoiceTemplate
  invoice: InvoiceData
}

export function InvoicePreview({ template, invoice }: InvoicePreviewProps) {
  const style = {
    '--primary': template.branding.primaryColor,
    '--secondary': template.branding.secondaryColor,
  } as CSSProperties

  // Cheap (a handful of rows), so recomputed on every render rather than
  // memoised.
  const calc = calculateInvoice(template.content, invoice)

  return (
    <article
      aria-label="Invoice preview"
      style={style}
      className="w-full overflow-hidden rounded-xs border border-border bg-surface text-md leading-relaxed shadow-md"
    >
      <div aria-hidden="true" className="h-1.5 bg-(--primary)" />
      <div className="flex flex-col gap-9 px-13 pt-11 pb-13">
        <InvoiceHeader
          showLogo={template.branding.showLogo}
          logo={template.branding.logo}
        />
        <InvoiceMeta
          invoiceNumber={invoice.invoiceNumber}
          dateOfIssue={invoice.dateOfIssue}
          dueDate={invoice.dueDate}
        />
        <InvoiceParties seller={invoice.seller} billedTo={invoice.billedTo} />
        <InvoiceLineItems lines={calc.lines} />
        <InvoiceTotals
          subtotal={formatMoney(calc.subtotal)}
          discount={formatMoney(calc.discount)}
          taxes={calc.taxes.map((tax) => ({
            label: tax.label,
            amount: formatMoney(tax.amount),
          }))}
          total={formatMoney(calc.total)}
          paymentMade={formatMoney(calc.paymentMade)}
          balanceDue={formatMoney(calc.balanceDue)}
        />
        <InvoiceFooterText
          termsAndConditions={invoice.termsAndConditions}
          statement={invoice.statement}
        />
      </div>
    </article>
  )
}
