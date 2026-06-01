import { useOSStore } from '@/stores/os.store'
import type { AppId } from '@/lib/constants'
import type { FinderCategory } from './Finder'
import { File, Folder, Link as LinkIcon, Compass, Terminal, Grid, Activity, Clock, Sparkles, Mail, FileText } from 'lucide-react'

interface FileItem {
  id: string
  name: string
  type: 'app' | 'folder' | 'file' | 'link'
  icon: any
  targetApp?: AppId
  targetUrl?: string
}

const FILES_BY_CATEGORY: Record<FinderCategory, FileItem[]> = {
  Applications: [
    { id: 'safari', name: 'Safari', type: 'app', icon: Compass, targetApp: 'safari' },
    { id: 'terminal', name: 'Terminal', type: 'app', icon: Terminal, targetApp: 'terminal' },
    { id: 'projects', name: 'Systems Hub', type: 'app', icon: Grid, targetApp: 'projects' },
    { id: 'monitor', name: 'System Monitor', type: 'app', icon: Activity, targetApp: 'system-monitor' },
    { id: 'timeline', name: 'Timeline', type: 'app', icon: Clock, targetApp: 'timeline' },
    { id: 'ai', name: 'SAYAN-AI', type: 'app', icon: Sparkles, targetApp: 'ai-assistant' },
    { id: 'contact', name: 'Contact Hub', type: 'app', icon: Mail, targetApp: 'contact' },
    { id: 'resume', name: 'Resume', type: 'app', icon: FileText, targetApp: 'resume' },
  ],
  Documents: [
    { id: 'resume-pdf', name: 'Sayan_Patra_Resume.pdf', type: 'app', icon: FileText, targetApp: 'resume' },
    { id: 'cover-letter', name: 'Cover_Letter.txt', type: 'file', icon: File },
  ],
  Desktop: [
    { id: 'github', name: 'GitHub Profile', type: 'link', icon: LinkIcon, targetUrl: 'https://github.com/sayan049' },
    { id: 'linkedin', name: 'LinkedIn', type: 'link', icon: LinkIcon, targetUrl: 'https://linkedin.com/in/sayan-patra-426833193' },
  ],
  Downloads: [
    { id: 'curalink', name: 'Curalink.app', type: 'link', icon: Folder, targetUrl: 'https://curalink-2-0.vercel.app' },
    { id: 'messmate', name: 'Messmate.app', type: 'link', icon: Folder, targetUrl: 'https://messmate.co.in' },
  ],
  Recents: [
    { id: 'resume-pdf', name: 'Sayan_Patra_Resume.pdf', type: 'app', icon: FileText, targetApp: 'resume' },
    { id: 'github', name: 'GitHub Profile', type: 'link', icon: LinkIcon, targetUrl: 'https://github.com/sayan049' },
  ]
}

export function FileGrid({ category }: { category: FinderCategory }) {
  const openApp = useOSStore(s => s.openApp)
  const setSafariUrl = useOSStore(s => s.setSafariUrl)
  const addSafariTab = useOSStore(s => s.addSafariTab)
  
  const files = FILES_BY_CATEGORY[category] || []

  const handleDoubleClick = (file: FileItem) => {
    if (file.type === 'app' && file.targetApp) {
      openApp(file.targetApp)
    } else if (file.type === 'link' && file.targetUrl) {
      setSafariUrl(file.targetUrl)
      addSafariTab(file.targetUrl)
      openApp('safari')
    }
  }

  return (
    <div className="p-6 grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-6 place-items-start">
      {files.map(file => {
        const Icon = file.icon
        return (
          <div
            key={file.id}
            onDoubleClick={() => handleDoubleClick(file)}
            className="flex flex-col items-center gap-2 group cursor-pointer w-20"
          >
            <div className="w-16 h-16 bg-[#2C2C38] rounded-xl flex items-center justify-center border border-white/10 group-hover:bg-[#4FC3F7]/20 group-hover:border-[#4FC3F7]/50 transition-colors shadow-lg">
              <Icon size={32} className="text-[#4FC3F7]" />
            </div>
            <span className="text-xs text-center text-white/80 group-hover:text-white group-hover:bg-[#4FC3F7]/20 px-1 rounded line-clamp-2 leading-tight">
              {file.name}
            </span>
          </div>
        )
      })}
    </div>
  )
}
