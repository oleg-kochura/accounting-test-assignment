import { TextField } from 'components/ui/TextField'
import { ColorField } from 'components/ui/ColorField'
import { Toggle } from 'components/ui/Toggle'
import { useInvoiceTemplateStore } from 'store/useInvoiceTemplateStore'
import { LogoField } from '../LogoField'
import { PaymentMethodsRow } from '../PaymentMethodsRow'

export function GeneralTab() {
  const name = useInvoiceTemplateStore((s) => s.draft.name)
  const primaryColor = useInvoiceTemplateStore(
    (s) => s.draft.branding.primaryColor,
  )
  const secondaryColor = useInvoiceTemplateStore(
    (s) => s.draft.branding.secondaryColor,
  )
  const showLogo = useInvoiceTemplateStore((s) => s.draft.branding.showLogo)
  const setName = useInvoiceTemplateStore((s) => s.setName)
  const updateBranding = useInvoiceTemplateStore((s) => s.updateBranding)

  const nameInvalid = name.trim().length === 0

  return (
    <div className="px-4 pt-4 pb-6 lg:px-7 lg:pt-5">
      <h2 className="mb-4 text-xl leading-normal font-semibold tracking-snug">
        General branding
      </h2>
      <div className="flex flex-col gap-5">
        <TextField
          id="name"
          label="Template name"
          placeholder="e.g. Standard Template"
          autoComplete="off"
          spellCheck={false}
          value={name}
          onChange={(e) => setName(e.target.value)}
          hint="Shown in the template list. Not printed on the invoice."
          error={
            nameInvalid ? 'Enter a template name to save this template.' : ''
          }
        />

        <div className="flex flex-col gap-2">
          <h3 className="text-base font-semibold">Brand colors</h3>
          <div className="grid grid-cols-1 gap-2.5 lg:grid-cols-2">
            <ColorField
              id="hex-primary"
              label="Primary"
              hint="Title, bar & totals"
              errorHint="Use a 6-digit hex like #2c3dd8"
              value={primaryColor}
              onChange={(hex) => updateBranding({ primaryColor: hex })}
            />
            <ColorField
              id="hex-secondary"
              label="Secondary"
              hint="Labels & dividers"
              errorHint="Use a 6-digit hex like #475569"
              value={secondaryColor}
              onChange={(hex) => updateBranding({ secondaryColor: hex })}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex min-h-7 items-center justify-between gap-3">
            <h3 className="text-base font-semibold">Logo</h3>
            <Toggle
              checked={showLogo}
              onChange={(checked) => updateBranding({ showLogo: checked })}
            >
              Show on invoice
            </Toggle>
          </div>
          <LogoField />
        </div>

        <PaymentMethodsRow />
      </div>
    </div>
  )
}
