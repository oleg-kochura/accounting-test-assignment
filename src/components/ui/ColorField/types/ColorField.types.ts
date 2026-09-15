export interface ColorFieldProps {
  id: string
  label: string
  hint: string
  errorHint: string
  value: string
  onChange: (hex: string) => void
}
