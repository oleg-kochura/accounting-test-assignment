export interface InvoiceFooterTextProps {
  termsAndConditions: string
  statement: string
}

export function InvoiceFooterText({
  termsAndConditions,
  statement,
}: InvoiceFooterTextProps) {
  return (
    <footer className="flex flex-col gap-4.5 border-t border-border pt-6">
      <div>
        <span className="mb-1 block text-xs font-semibold tracking-widest text-(--secondary) uppercase">
          Terms &amp; conditions
        </span>
        <p className="max-w-[64ch]">{termsAndConditions}</p>
      </div>
      <div>
        <span className="mb-1 block text-xs font-semibold tracking-widest text-(--secondary) uppercase">
          Statement
        </span>
        <p className="max-w-[64ch]">{statement}</p>
      </div>
    </footer>
  )
}
