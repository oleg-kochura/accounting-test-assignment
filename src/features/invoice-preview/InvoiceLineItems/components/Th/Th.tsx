export interface ThProps {
  children: string
  width: string
  align?: 'right'
}

export function Th({ children, width, align }: ThProps) {
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
