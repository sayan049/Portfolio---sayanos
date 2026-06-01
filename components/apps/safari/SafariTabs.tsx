// import { useOSStore } from '@/stores/os.store'
// import { X } from 'lucide-react'

// export function SafariTabs() {
//   const tabs = useOSStore(s => s.safariTabs)
//   const activeTabId = useOSStore(s => s.activeSafariTabId)
//   const setActiveTab = useOSStore(s => s.setActiveSafariTab)
//   const closeTab = useOSStore(s => s.closeSafariTab)

//   return (
//     <div className="flex items-end px-2 pt-2 gap-1 bg-[#202028] border-b border-white/5 overflow-x-auto no-scrollbar">
//       {tabs.map((tab) => {
//         const isActive = tab.id === activeTabId
//         return (
//           <div
//             key={tab.id}
//             onClick={() => setActiveTab(tab.id)}
//             className={`
//               group relative flex items-center min-w-[140px] max-w-[200px] h-8 px-3 rounded-t-md cursor-pointer select-none
//               transition-colors border-t border-x border-transparent
//               ${isActive ? 'bg-[#141418] border-white/10' : 'hover:bg-white/5'}
//             `}
//           >
//             {/* Favicon placeholder */}
//             <div className="w-4 h-4 bg-white/20 rounded-sm mr-2 flex-shrink-0" />
//             <span className={`text-xs truncate flex-1 ${isActive ? 'text-white/90' : 'text-white/50'}`}>
//               {tab.title || 'New Tab'}
//             </span>
//             <button 
//               onClick={(e) => {
//                 e.stopPropagation()
//                 closeTab(tab.id)
//               }}
//               className={`p-0.5 rounded hover:bg-white/10 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}
//             >
//               <X size={12} className={isActive ? 'text-white/70' : 'text-white/50'} />
//             </button>
//           </div>
//         )
//       })}
//     </div>
//   )
// }
import { useOSStore } from '@/stores/os.store'
import { X } from 'lucide-react'

export function SafariTabs() {
  const tabs = useOSStore(s => s.safariTabs)
  const activeSafariTabId = useOSStore(s => s.activeSafariTabId)
  const setActiveSafariTab = useOSStore(s => s.setActiveSafariTab)
  const closeSafariTab = useOSStore(s => s.closeSafariTab)

  return (
    <div className="flex items-end px-2 pt-2 gap-1 bg-[#202028] border-b border-white/5 overflow-x-auto no-scrollbar min-h-[36px]">
      {tabs.map(tab => {
        const isActive = tab.id === activeSafariTabId
        return (
          <div
            key={tab.id}
            onClick={() => setActiveSafariTab(tab.id)}
            className={[
              'group relative flex items-center min-w-[140px] max-w-[220px] h-8 px-3',
              'rounded-t-md cursor-pointer select-none transition-colors border-t border-x',
              isActive
                ? 'bg-[#141418] border-white/10 text-white/90'
                : 'border-transparent hover:bg-white/5 text-white/50',
            ].join(' ')}
          >
            {/* Loading dot / favicon placeholder */}
            <div className={[
              'w-3 h-3 rounded-full mr-2 flex-shrink-0 transition-colors',
              tab.isLoading ? 'bg-[#4FC3F7] animate-pulse' : 'bg-white/20',
            ].join(' ')} />

            <span className="text-xs truncate flex-1">
              {tab.title || 'New Tab'}
            </span>

            <button
              onClick={e => { e.stopPropagation(); closeSafariTab(tab.id) }}
              className={[
                'ml-1 p-0.5 rounded hover:bg-white/10 flex-shrink-0 transition-opacity',
                isActive ? 'opacity-60' : 'opacity-0 group-hover:opacity-50',
              ].join(' ')}
            >
              <X size={11} />
            </button>
          </div>
        )
      })}
    </div>
  )
}