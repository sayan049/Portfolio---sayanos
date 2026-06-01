import { Clock, AppWindow, Monitor, FileText, Download } from 'lucide-react'
import type { FinderCategory } from './Finder'

interface SidebarProps {
  activeCategory: FinderCategory
  onSelect: (cat: FinderCategory) => void
}

export function Sidebar({ activeCategory, onSelect }: SidebarProps) {
  const items = [
    { id: 'Recents', icon: Clock },
    { id: 'Applications', icon: AppWindow },
    { id: 'Desktop', icon: Monitor },
    { id: 'Documents', icon: FileText },
    { id: 'Downloads', icon: Download },
  ] as const

  return (
    <div className="w-48 bg-[#1E1E26]/60 backdrop-blur-md pt-4 flex flex-col">
      <div className="px-3 mb-2 text-xs font-semibold text-white/40 uppercase tracking-wider">
        Favorites
      </div>
      <div className="flex flex-col gap-0.5 px-2">
        {items.map(({ id, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onSelect(id as FinderCategory)}
            className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors ${
              activeCategory === id ? 'bg-[#4FC3F7]/20 text-[#4FC3F7]' : 'text-white/70 hover:bg-white/5 hover:text-white/90'
            }`}
          >
            <Icon size={16} className={activeCategory === id ? 'text-[#4FC3F7]' : 'text-[#4FC3F7]/80'} />
            {id}
          </button>
        ))}
      </div>
    </div>
  )
}
