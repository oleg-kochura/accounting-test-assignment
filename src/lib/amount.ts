// Generic helpers for money/decimal-amount input fields: parsing,
// validating, formatting and sanitizing raw text as the user types it.
// Kept outside features/ so both the template store (validation) and the
// invoice preview (formatting/calculation) can depend on it without
// depending on each other.

const MONEY = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

export const round2 = (value: number): number => Math.round(value * 100) / 100

// Lenient: callers that must always render something (the invoice preview)
// use this while the user is mid-edit. '', 'abc', '-5' and 'Infinity' all
// become 0. Strictness lives in isValidAmount, which gates Save.
export function parseAmount(raw: string): number {
  const n = Number(raw.trim())
  return Number.isFinite(n) && n > 0 ? n : 0
}

// Strict: gates Save/dirty validation. Empty, non-numeric or negative text
// is invalid.
export function isValidAmount(raw: string): boolean {
  const value = raw.trim()
  if (value === '') return false
  const n = Number(value)
  return Number.isFinite(n) && n >= 0
}

export function formatMoney(value: number): string {
  return MONEY.format(value)
}

// Strips a keystroke or paste down to plain-decimal characters only
// (digits and at most one '.'), so quantity/rate/discount fields can never
// hold letters, a minus sign, or scientific notation like '1e5' — only the
// shape isValidAmount and parseAmount expect. Applied in each field's
// onChange before the value reaches the store.
export function sanitizeAmountInput(raw: string): string {
  let seenDot = false
  let result = ''
  for (const char of raw) {
    if (char >= '0' && char <= '9') {
      result += char
    } else if (char === '.' && !seenDot) {
      seenDot = true
      result += char
    }
  }
  return result
}
