import { useOSStore } from '@/stores/os.store'
import { SafariToolbar } from './SafariToolbar'
import { SafariTabs } from './SafariTabs'
import { SafariBrowser } from './SafariBrowser'
import { NewTabPage } from './NewTabPage'

export function Safari() {
  const safariUrl = useOSStore(s => s.safariUrl)
  
  return (
    <div className="flex flex-col w-full h-full bg-[#1A1A21]">
      <SafariTabs />
      <SafariToolbar />
      <div className="flex-1 relative w-full h-full overflow-hidden bg-white">
        {!safariUrl ? <NewTabPage /> : <SafariBrowser />}
      </div>
    </div>
  )
}
