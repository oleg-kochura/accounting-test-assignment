import type { ReactNode } from 'react'

export interface TabItem<T extends string> {
  id: T
  label: string
  icon: ReactNode
  badge?: string
}

export interface TabsProps<T extends string> {
  items: TabItem<T>[]
  value: T
  onValueChange: (id: T) => void
  'aria-label': string
  children: ReactNode
}
