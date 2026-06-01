'use client'

import { useRef } from 'react'
import { useOSStore } from '@/stores/os.store'

export function SettingsApp() {
  const customWallpaper = useOSStore(s => s.customWallpaper)
  const setCustomWallpaper = useOSStore(s => s.setCustomWallpaper)
  const showToast = useOSStore(s => s.showToast)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Limit to 5MB to avoid localStorage quota issues
    if (file.size > 5 * 1024 * 1024) {
      showToast('File too large. Please select an image under 5MB.')
      return
    }

    const reader = new FileReader()
    reader.onload = (ev) => {
      const result = ev.target?.result
      if (typeof result === 'string') {
        try {
          setCustomWallpaper(result)
          showToast('Wallpaper updated successfully!')
        } catch (error) {
          showToast('Failed to save wallpaper. File might be too large.')
          console.error(error)
        }
      }
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="flex flex-col h-full bg-[#1e1e24] text-white overflow-hidden rounded-b-xl">
      <div className="flex-1 overflow-y-auto p-6">
        <h1 className="text-2xl font-bold mb-6 tracking-tight">System Settings</h1>
        
        <div className="bg-[#2a2a35] rounded-xl border border-white/5 p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-lg bg-[#4fc3f7]/10 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4fc3f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold">Desktop Wallpaper</h2>
              <p className="text-sm text-white/50">Personalize your SayanOS background</p>
            </div>
          </div>

          <div className="flex flex-col gap-4 mt-6">
            <div 
              className="relative aspect-video w-full max-w-sm rounded-lg overflow-hidden border border-white/10 bg-black"
              style={{
                backgroundImage: customWallpaper ? `url(${customWallpaper})` : 'url(https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
            
            <div className="flex gap-3 mt-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-[#4fc3f7] hover:bg-[#29b6f6] text-black font-medium text-sm rounded-lg transition-colors shadow-[0_0_15px_rgba(79,195,247,0.3)]"
              >
                Upload Image
              </button>
              
              {customWallpaper && (
                <button
                  onClick={() => {
                    setCustomWallpaper(null)
                    showToast('Wallpaper reset to default.')
                  }}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium text-sm rounded-lg transition-colors"
                >
                  Reset to Default
                </button>
              )}
            </div>
            <p className="text-xs text-white/40 mt-1">Recommended size: 1920x1080 or higher (max 5MB).</p>
          </div>
        </div>

        <div className="bg-[#2a2a35] rounded-xl border border-white/5 p-6 opacity-50">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20V10"/>
                <path d="M18 20V4"/>
                <path d="M6 20v-4"/>
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold">Appearance</h2>
              <p className="text-sm text-white/50">Theme settings coming soon</p>
            </div>
          </div>
        </div>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png, image/jpeg, image/webp"
        style={{ display: 'none' }}
      />
    </div>
  )
}
