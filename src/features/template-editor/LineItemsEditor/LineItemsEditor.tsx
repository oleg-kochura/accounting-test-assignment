import { Button } from 'components/ui/Button'
import { useInvoiceTemplateStore } from 'store/useInvoiceTemplateStore'
import { LineItemCard } from './components/LineItemCard'

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
