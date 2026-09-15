import type { InvoiceHeaderProps } from './types'

export function InvoiceHeader({ showLogo, logo }: InvoiceHeaderProps) {
  return (
    <header className="flex items-start justify-between gap-6">
      <div className="flex min-h-18 items-center">
        {showLogo ? (
          logo ? (
            <img
              src={logo.dataUrl}
              alt={logo.name}
              className="max-h-18 max-w-[200px] object-contain"
            />
          ) : (
            <div
              aria-label="Placeholder logo"
              className="grid h-18 w-18 place-items-center rounded-md bg-(--primary) font-display text-5xl font-bold tracking-tighter text-surface"
            >
              BC
            </div>
          )
        ) : null}
      </div>
      <div className="text-7xl leading-tight font-bold tracking-tighter text-(--primary)">
        Invoice
      </div>
    </header>
  )
}
