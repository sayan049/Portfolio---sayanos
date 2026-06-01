import { useState } from 'react'
import { Sidebar } from './Sidebar'
import { FileGrid } from './FileGrid'

export type FinderCategory = 'Recents' | 'Applications' | 'Desktop' | 'Documents' | 'Downloads'

export function Finder() {
  const [activeCategory, setActiveCategory] = useState<FinderCategory>('Applications')

  return (
    <div className="flex w-full h-full bg-[#1A1A21] text-white/90">
      <Sidebar activeCategory={activeCategory} onSelect={setActiveCategory} />
      <div className="flex-1 overflow-y-auto bg-white/5 border-l border-white/5">
        <FileGrid category={activeCategory} />
      </div>
    </div>
  )
}
