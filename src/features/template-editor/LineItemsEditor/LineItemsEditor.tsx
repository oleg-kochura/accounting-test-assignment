import { Button } from '../../../components/ui/Button'
import { TextField } from '../../../components/ui/TextField'
import { isValidAmount, sanitizeAmountInput } from '../../../lib/amount'
import { useInvoiceTemplateStore } from '../../../store/useInvoiceTemplateStore'
import type { LineItemCardProps } from './types'

const AMOUNT_ERROR = 'Enter a non-negative number.'

function LineItemCard({ line, removable }: LineItemCardProps) {
  const updateLineItem = useInvoiceTemplateStore((s) => s.updateLineItem)
  const removeLineItem = useInvoiceTemplateStore((s) => s.removeLineItem)

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border p-4">
      <TextField
        id={`item-${line.id}`}
        label="Item"
        placeholder="e.g. Web development"
        autoComplete="off"
        spellCheck={false}
        value={line.item}
        onChange={(e) => updateLineItem(line.id, { item: e.target.value })}
      />
      <TextField
        id={`description-${line.id}`}
        label="Description"
        placeholder="What was delivered"
        autoComplete="off"
        spellCheck={false}
        value={line.description}
        onChange={(e) =>
          updateLineItem(line.id, { description: e.target.value })
        }
      />
      <div className="grid grid-cols-2 gap-2.5">
        <TextField
          id={`qty-${line.id}`}
          label="Qty"
          type="text"
          inputMode="decimal"
          autoComplete="off"
          spellCheck={false}
          value={line.quantity}
          onChange={(e) =>
            updateLineItem(line.id, {
              quantity: sanitizeAmountInput(e.target.value),
            })
          }
          error={isValidAmount(line.quantity) ? '' : AMOUNT_ERROR}
        />
        <TextField
          id={`rate-${line.id}`}
          label="Rate"
          type="text"
          inputMode="decimal"
          autoComplete="off"
          spellCheck={false}
          value={line.rate}
          onChange={(e) =>
            updateLineItem(line.id, {
              rate: sanitizeAmountInput(e.target.value),
            })
          }
          hint="Price per unit"
          error={isValidAmount(line.rate) ? '' : AMOUNT_ERROR}
        />
      </div>
      <div className="flex justify-end">
        <Button
          variant="ghost"
          size="sm"
          disabled={!removable}
          onClick={() => removeLineItem(line.id)}
        >
          Remove
        </Button>
      </div>
    </div>
  )
}

export function LineItemsEditor() {
  const lineItems = useInvoiceTemplateStore((s) => s.draft.content.lineItems)
  const addLineItem = useInvoiceTemplateStore((s) => s.addLineItem)
  const removable = lineItems.length > 1

  return (
    <div className="flex flex-col gap-2">
      <div className="flex min-h-7 items-center justify-between gap-3">
        <h3 className="text-base font-semibold">Line items</h3>
        <Button variant="secondary" size="sm" onClick={addLineItem}>
          Add item
        </Button>
      </div>
      <div className="flex flex-col gap-3">
        {lineItems.map((line) => (
          <LineItemCard key={line.id} line={line} removable={removable} />
        ))}
      </div>
    </div>
  )
}
