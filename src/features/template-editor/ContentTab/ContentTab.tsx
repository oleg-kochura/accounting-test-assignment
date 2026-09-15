import { TextField } from 'components/ui/TextField'
import { isValidAmount, sanitizeAmountInput } from 'lib/amount'
import { useInvoiceTemplateStore } from 'store/useInvoiceTemplateStore'
import { LineItemsEditor } from '../LineItemsEditor'

export function ContentTab() {
  const discount = useInvoiceTemplateStore((s) => s.draft.content.discount)
  const setDiscount = useInvoiceTemplateStore((s) => s.setDiscount)

  return (
    <div className="px-4 pt-4 pb-6 lg:px-7 lg:pt-5">
      <h2 className="mb-4 text-xl leading-normal font-semibold tracking-snug">
        Invoice content
      </h2>
      <div className="flex flex-col gap-5">
        <LineItemsEditor />
        <TextField
          id="discount"
          label="Discount"
          type="text"
          inputMode="decimal"
          placeholder="0.00"
          autoComplete="off"
          spellCheck={false}
          value={discount}
          onChange={(e) => setDiscount(sanitizeAmountInput(e.target.value))}
          hint="Applied before tax."
          error={isValidAmount(discount) ? '' : 'Enter a non-negative amount.'}
        />
      </div>
    </div>
  )
}
