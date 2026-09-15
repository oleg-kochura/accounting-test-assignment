import type { InputHTMLAttributes } from 'react'

export interface TextFieldProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'className' | 'id'
> {
  id: string
  label: string
  hint?: string
  error?: string
}
