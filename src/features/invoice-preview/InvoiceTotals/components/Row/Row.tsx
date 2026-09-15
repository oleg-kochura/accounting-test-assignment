export interface RowProps {
  label: string
  value: string
  strong?: boolean
}

export function Row({ label, value, strong }: RowProps) {
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
