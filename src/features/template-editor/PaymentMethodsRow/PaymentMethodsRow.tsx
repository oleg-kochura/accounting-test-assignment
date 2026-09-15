import CardIcon from 'assets/icons/card.svg?react'

export function PaymentMethodsRow() {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border px-3.5 py-3">
      <CardIcon className="h-[18px] w-[18px] flex-none text-muted-text" />
      <div className="min-w-0 flex-1">
        <strong className="block font-medium">Accept payment methods</strong>
        <span className="text-sm text-muted-text">
          Choose which methods appear on invoices from this template
        </span>
      </div>
      <a
        href="#"
        onClick={(e) => e.preventDefault()}
        className="cursor-pointer font-medium text-fg underline decoration-border-strong underline-offset-3 hover:decoration-fg"
      >
        Manage
      </a>
    </div>
  )
}
