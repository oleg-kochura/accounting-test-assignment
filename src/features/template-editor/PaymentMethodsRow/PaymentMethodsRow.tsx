export function PaymentMethodsRow() {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border px-3.5 py-3">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-[18px] w-[18px] flex-none text-muted-text"
        aria-hidden="true"
      >
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <path d="M2 10h20" />
      </svg>
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
