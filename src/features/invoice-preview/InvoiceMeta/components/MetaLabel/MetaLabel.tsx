export interface MetaLabelProps {
  children: string
}

export function MetaLabel({ children }: MetaLabelProps) {
  return (
    <span className="mb-1 block text-xs font-semibold tracking-widest text-(--secondary) uppercase">
      {children}
    </span>
  )
}
