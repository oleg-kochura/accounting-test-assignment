import type { ReactNode } from 'react'

export interface ToggleProps {
  id?: string
  checked: boolean
  onChange: (checked: boolean) => void
  children: ReactNode
}
