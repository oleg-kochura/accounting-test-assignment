import type { CSSProperties } from 'react'
import type { InvoiceTemplate } from '../../../types/invoiceTemplate'
import type { InvoiceData } from '../mockInvoice'
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
        <InvoiceLineItems items={invoice.lineItems} />
        <InvoiceTotals
          subtotal={invoice.subtotal}
          discount={invoice.discount}
          taxes={invoice.taxes}
          total={invoice.total}
          paymentMade={invoice.paymentMade}
          balanceDue={invoice.balanceDue}
        />
        <InvoiceFooterText
          termsAndConditions={invoice.termsAndConditions}
          statement={invoice.statement}
        />
      </div>
    </article>
  )
}
