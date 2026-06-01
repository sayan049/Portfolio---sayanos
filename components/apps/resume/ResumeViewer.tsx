'use client'

const RESUME_PATH = '/resume/sayan-patra-resume.pdf'

const DownloadIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    <polyline points="7,10 12,15 17,10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
)

const PrintIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
    <polyline points="6,9 6,2 18,2 18,9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    <rect x="6" y="14" width="12" height="8" stroke="currentColor" strokeWidth="1.8" rx="1" fill="none"/>
  </svg>
)

const ExternalIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    <polyline points="15,3 21,3 21,9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="10" y1="14" x2="21" y2="3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
)

export function ResumeViewer() {
  const handleDownload = () => {
    const a = document.createElement('a')
    a.href = RESUME_PATH
    a.download = 'Sayan-Patra-Resume.pdf'
    a.click()
  }

  const handlePrint = () => {
    const win = window.open(RESUME_PATH, '_blank')
    if (win) win.onload = () => win.print()
  }

  const handleOpenTab = () => {
    window.open(RESUME_PATH, '_blank', 'noopener,noreferrer')
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Toolbar */}
      <div
        style={{
          height: 40, padding: '0 16px',
          borderBottom: '1px solid var(--os-border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexShrink: 0, background: 'rgba(13, 13, 17, 0.5)',
        }}
      >
        <span style={{ fontSize: 13, color: 'var(--os-text-2)' }}>
          Resume — Sayan Patra.pdf
        </span>
        <div style={{ display: 'flex', gap: 4 }}>
          <ToolbarButton icon={<DownloadIcon />} label="Download" onClick={handleDownload} />
          <ToolbarButton icon={<PrintIcon />}    label="Print"    onClick={handlePrint}    />
          <ToolbarButton icon={<ExternalIcon />} label="Open"     onClick={handleOpenTab}  />
        </div>
      </div>

      {/* PDF viewer */}
      <div
        style={{
          flex: 1, overflow: 'hidden',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: '#1a1a20',
        }}
      >
        <iframe
          src={RESUME_PATH}
          title="Resume"
          style={{ width: '100%', height: '100%', border: 'none' }}
        />
      </div>
    </div>
  )
}

function ToolbarButton({
  icon, label, onClick,
}: {
  icon: React.ReactNode; label: string; onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      style={{
        display: 'flex', alignItems: 'center', gap: 5,
        padding: '4px 10px', borderRadius: 5,
        background: 'transparent',
        border: '1px solid var(--os-border)',
        color: 'var(--os-text-3)',
        fontSize: 11, cursor: 'pointer',
        transition: 'all 0.15s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background    = 'var(--os-surface-2)'
        e.currentTarget.style.color         = 'var(--os-text-2)'
        e.currentTarget.style.borderColor   = 'var(--os-border-light)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background    = 'transparent'
        e.currentTarget.style.color         = 'var(--os-text-3)'
        e.currentTarget.style.borderColor   = 'var(--os-border)'
      }}
    >
      {icon}
      {label}
    </button>
  )
}