'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { listVariants, listItemVariants } from '@/lib/motion'
import { useOSStore } from '@/stores/os.store'

const CONTACT_LINKS = [
  {
    platform: 'Email',
    value:    'sayanpatra017@gmail.com',
    href:     'mailto:sayanpatra017@gmail.com',
    copy:     true,
    color:    'var(--os-cyan)',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.8" fill="none"/>
        <polyline points="2,5 12,13 22,5" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" fill="none"/>
      </svg>
    ),
  },
  {
    platform: 'GitHub',
    value:    'github.com/sayan049',
    href:     'https://github.com/sayan049',
    copy:     false,
    color:    'var(--os-text)',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" fill="currentColor"/>
      </svg>
    ),
  },
  {
    platform: 'LinkedIn',
    value:    'linkedin.com/in/sayan-patra-426833193',
    href:     'https://www.linkedin.com/in/sayan-patra-426833193/',
    copy:     false,
    color:    '#0A66C2',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="2" width="20" height="20" rx="3" stroke="currentColor" strokeWidth="1.8" fill="none"/>
        <line x1="7" y1="10" x2="7" y2="17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        <circle cx="7" cy="7" r="1" fill="currentColor"/>
        <path d="M11 10v7M11 13c0-1.657 1.343-3 3-3s3 1.343 3 3v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    platform: 'Twitter / X',
    value:    '@sayan_codes',
    href:     'https://twitter.com/sayan_codes',
    copy:     false,
    color:    'var(--os-text)',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" fill="currentColor"/>
      </svg>
    ),
  },
]

const CopyIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="1.8" fill="none"/>
    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
)

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <polyline points="20,6 9,17 4,12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const ExternalIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    <polyline points="15,3 21,3 21,9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="10" y1="14" x2="21" y2="3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
)

const inputStyle: React.CSSProperties = {
  background:   'var(--os-surface-2)',
  border:       '1px solid var(--os-border)',
  borderRadius: 7,
  padding:      '9px 14px',
  fontSize:     13,
  color:        'var(--os-text)',
  outline:      'none',
  transition:   'border-color 0.15s',
  fontFamily:   'inherit',
  width:        '100%',
}

export function Contact() {
  const [formState, setFormState] = useState<'idle' | 'sending' | 'sent'>('idle')
  const [copied, setCopied]       = useState<string | null>(null)
  const showToast                 = useOSStore(s => s.showToast)

  const [form, setForm] = useState({
    name: '', email: '', subject: '', message: '',
  })

  const handleCopy = async (value: string, platform: string) => {
    await navigator.clipboard.writeText(value)
    setCopied(platform)
    showToast(`${platform} copied to clipboard`)
    setTimeout(() => setCopied(null), 2000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormState('sending')
    await new Promise(r => setTimeout(r, 1500))
    setFormState('sent')
    showToast('📡 Message transmitted successfully')
  }

  return (
    <div style={{ height: '100%', overflowY: 'auto', padding: '24px 28px' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 32, fontWeight: 600, color: 'var(--os-text)', marginBottom: 8 }}>
          Let&apos;s Build Something.
        </h2>
        <p style={{ fontSize: 13, color: 'var(--os-text-2)', marginBottom: 4 }}>
          Open to roles, collaborations, and ambitious projects.
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div className="status-dot status-dot-pulse" />
          <span style={{ fontSize: 12, color: 'var(--os-text-3)' }}>
            Currently available · Response within 24h
          </span>
        </div>
      </div>

      {/* Contact links grid */}
      <motion.div
        variants={listVariants}
        initial="hidden"
        animate="visible"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 24 }}
      >
        {CONTACT_LINKS.map(link => (
          <motion.div
            key={link.platform}
            variants={listItemVariants}
            whileHover={{ borderColor: 'var(--os-cyan)', transition: { duration: 0.12 } }}
            style={{
              background:   'var(--os-surface-2)',
              border:       '1px solid var(--os-border)',
              borderRadius: 10,
              padding:      '14px 16px',
              display:      'flex',
              alignItems:   'center',
              gap:          12,
              cursor:       'pointer',
              transition:   'border-color 0.15s',
            }}
            onClick={() => {
              if (link.copy) handleCopy(link.value, link.platform)
              else window.open(link.href, '_blank', 'noopener,noreferrer')
            }}
          >
            {/* Icon box */}
            <div
              style={{
                width: 36, height: 36, borderRadius: 8,
                background: 'var(--os-surface-3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, color: link.color,
              }}
            >
              {link.icon}
            </div>

            {/* Text */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--os-text)', marginBottom: 2 }}>
                {link.platform}
              </div>
              <div style={{
                fontSize: 11, color: 'var(--os-text-3)',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {link.value}
              </div>
            </div>

            {/* Action icon */}
            <div style={{ flexShrink: 0, color: copied === link.platform ? 'var(--os-green)' : 'var(--os-text-3)' }}>
              {link.copy
                ? (copied === link.platform ? <CheckIcon /> : <CopyIcon />)
                : <ExternalIcon />
              }
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Separator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <div style={{ flex: 1, height: 1, background: 'var(--os-border)' }} />
        <span style={{ fontSize: 11, color: 'var(--os-text-3)', whiteSpace: 'nowrap' }}>
          Or send a direct message
        </span>
        <div style={{ flex: 1, height: 1, background: 'var(--os-border)' }} />
      </div>

      {/* Form or success */}
      {formState === 'sent' ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          style={{
            background: 'var(--os-surface-2)', border: '1px solid var(--os-border)',
            borderRadius: 10, padding: '32px 24px', textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 32, marginBottom: 12 }}>📡</div>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--os-text)', marginBottom: 8 }}>
            Message transmitted successfully.
          </h3>
          <p style={{ fontSize: 13, color: 'var(--os-text-3)' }}>
            Sayan will respond within 24 hours.
          </p>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <input
                placeholder="Your name"
                value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                required
                style={inputStyle}
                onFocus={e => { e.target.style.borderColor = 'var(--os-border-light)' }}
                onBlur={e => { e.target.style.borderColor = 'var(--os-border)' }}
              />
              <input
                placeholder="your@email.com"
                type="email"
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                required
                style={inputStyle}
                onFocus={e => { e.target.style.borderColor = 'var(--os-border-light)' }}
                onBlur={e => { e.target.style.borderColor = 'var(--os-border)' }}
              />
            </div>
            <input
              placeholder="What's this about?"
              value={form.subject}
              onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}
              required
              style={inputStyle}
              onFocus={e => { e.target.style.borderColor = 'var(--os-border-light)' }}
              onBlur={e => { e.target.style.borderColor = 'var(--os-border)' }}
            />
            <textarea
              placeholder="Tell me about the project or role..."
              value={form.message}
              onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
              required
              rows={4}
              style={{ ...inputStyle, minHeight: 100, resize: 'vertical' }}
              onFocus={e => { e.target.style.borderColor = 'var(--os-border-light)' }}
              onBlur={e => { e.target.style.borderColor = 'var(--os-border)' }}
            />
            <button
              type="submit"
              disabled={formState === 'sending'}
              style={{
                width: '100%', padding: '11px 20px',
                borderRadius: 7, border: 'none',
                background: 'var(--os-cyan)', color: 'var(--os-bg)',
                fontSize: 13, fontWeight: 600,
                cursor: formState === 'sending' ? 'wait' : 'pointer',
                opacity: formState === 'sending' ? 0.7 : 1,
                transition: 'all 0.15s',
              }}
            >
              {formState === 'sending' ? 'Transmitting...' : 'Send Message →'}
            </button>
          </div>
        </form>
      )}

      <div style={{ marginTop: 20, textAlign: 'center' }}>
        <span style={{ fontSize: 12, color: 'var(--os-text-3)' }}>
          Prefer a direct line?{' '}
          <span style={{ color: 'var(--os-cyan)' }}>sayanpatra017@gmail.com</span>
        </span>
      </div>
    </div>
  )
}