import { Tabs, TabsContent, type TabItem } from '../../../components/ui/Tabs'
import { useInvoiceTemplateStore } from '../../../store/useInvoiceTemplateStore'
import type { EditorTab } from '../../../types/invoiceTemplate'
import { GeneralTab } from '../GeneralTab'
import { ContentTab } from '../ContentTab'
import GeneralIcon from '../../../assets/icons/general.svg?react'
import ContentIcon from '../../../assets/icons/content.svg?react'

const TAB_ITEMS: TabItem<EditorTab>[] = [
  {
    id: 'general',
    label: 'General',
    icon: <GeneralIcon className="h-4 w-4 flex-none" />,
  },
  {
    id: 'content',
    label: 'Content',
    icon: <ContentIcon className="h-4 w-4 flex-none" />,
  },
]

export function EditorSidebar() {
  const activeTab = useInvoiceTemplateStore((s) => s.activeTab)
  const setActiveTab = useInvoiceTemplateStore((s) => s.setActiveTab)

  return (
    <div className="flex min-h-0 flex-1 flex-col lg:overflow-y-auto">
      <Tabs
        items={TAB_ITEMS}
        value={activeTab}
        onValueChange={setActiveTab}
        aria-label="Template sections"
      >
        <TabsContent value="general">
          <GeneralTab />
        </TabsContent>
        <TabsContent value="content">
          <ContentTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
